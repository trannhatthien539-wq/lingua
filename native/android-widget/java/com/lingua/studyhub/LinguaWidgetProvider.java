package com.lingua.studyhub;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.widget.RemoteViews;

/**
 * Widget màn hình chính: hiện số thẻ đến hạn, chủ điểm ngữ pháp tiếp theo và chuỗi ngày học.
 *
 * Nội dung do phần JS đẩy sang qua plugin {@link LinguaWidgetPlugin} (SharedPreferences
 * `lingua_widget`). Widget tự cập nhật mỗi 30 phút theo `updatePeriodMillis`, và được làm mới
 * ngay mỗi khi app ghi số liệu mới. Hai nút mở thẳng tab Từ vựng / Ngữ pháp bằng deep link.
 */
public class LinguaWidgetProvider extends AppWidgetProvider {

    public static final String PREFS = "lingua_widget";
    private static final String SCHEME = "com.lingua.studyhub";

    private static final String KEY_TITLE = "title";
    private static final String KEY_PRIMARY = "primary";
    private static final String KEY_SECONDARY = "secondary";
    private static final String KEY_TERTIARY = "tertiary";
    private static final String KEY_FOOTER = "footer";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);
        }
    }

    /** Vẽ lại một widget theo dữ liệu mới nhất trong SharedPreferences. */
    static void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.lingua_widget);

        views.setTextViewText(R.id.lingua_widget_title, prefs.getString(KEY_TITLE, context.getString(R.string.lingua_widget_title)));
        views.setTextViewText(R.id.lingua_widget_primary, prefs.getString(KEY_PRIMARY, context.getString(R.string.lingua_widget_hint)));
        views.setTextViewText(R.id.lingua_widget_secondary, prefs.getString(KEY_SECONDARY, ""));
        views.setTextViewText(R.id.lingua_widget_tertiary, prefs.getString(KEY_TERTIARY, ""));
        views.setTextViewText(R.id.lingua_widget_footer, prefs.getString(KEY_FOOTER, ""));

        views.setOnClickPendingIntent(R.id.lingua_widget_root, openTab(context, "vocabulary", 101));
        views.setOnClickPendingIntent(R.id.lingua_widget_button_vocab, openTab(context, "vocabulary", 102));
        views.setOnClickPendingIntent(R.id.lingua_widget_button_grammar, openTab(context, "grammar", 103));

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    /** Làm mới mọi widget đang có trên màn hình (gọi sau khi JS ghi số liệu). */
    public static void refreshAll(Context context) {
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        int[] ids = appWidgetManager.getAppWidgetIds(new ComponentName(context, LinguaWidgetProvider.class));
        for (int id : ids) {
            updateWidget(context, appWidgetManager, id);
        }
    }

    /** PendingIntent mở app vào đúng tab bằng deep link `com.lingua.studyhub://tab/<tab>`. */
    private static PendingIntent openTab(Context context, String tab, int requestCode) {
        Intent intent = new Intent(context, MainActivity.class);
        intent.setAction(Intent.ACTION_VIEW);
        intent.setData(Uri.parse(SCHEME + "://tab/" + tab));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK
                | Intent.FLAG_ACTIVITY_CLEAR_TOP
                | Intent.FLAG_ACTIVITY_SINGLE_TOP);

        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        return PendingIntent.getActivity(context, requestCode, intent, flags);
    }
}
