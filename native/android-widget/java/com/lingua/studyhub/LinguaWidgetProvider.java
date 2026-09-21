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
import android.view.View;
import android.widget.RemoteViews;

/**
 * Widget màn hình chính: hiện số thẻ đến hạn, chủ điểm ngữ pháp tiếp theo, chuỗi ngày học và
 * tiến độ mục tiêu trong ngày.
 *
 * Nội dung do phần JS đẩy sang qua plugin {@link LinguaWidgetPlugin} (SharedPreferences
 * `lingua_widget`) vì widget không chạy được JS và không đọc được localStorage.
 * Widget tự vẽ lại mỗi 30 phút theo `updatePeriodMillis` và ngay khi app ghi số liệu mới.
 *
 * Bốn nút đều mở app bằng deep link (xem src/services/appLinks.js):
 * Ôn ngay → `…://practice`, Ngữ pháp → `…://tab/grammar`,
 * Thi thử VSTEP → `…://tab/vstep`, Tiến độ → `…://tab/progress`.
 */
public class LinguaWidgetProvider extends AppWidgetProvider {

    public static final String PREFS = "lingua_widget";
    private static final String SCHEME = "com.lingua.studyhub";

    private static final String KEY_TITLE = "title";
    private static final String KEY_PRIMARY = "primary";
    private static final String KEY_SECONDARY = "secondary";
    private static final String KEY_TERTIARY = "tertiary";
    private static final String KEY_FOOTER = "footer";
    private static final String KEY_PROGRESS_MAX = "progressMax";
    private static final String KEY_PROGRESS_VALUE = "progressValue";

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

        // Thanh tiến độ mục tiêu ngày: chỉ hiện khi app đã gửi số liệu mục tiêu.
        int progressMax = prefs.getInt(KEY_PROGRESS_MAX, 0);
        int progressValue = Math.max(0, Math.min(prefs.getInt(KEY_PROGRESS_VALUE, 0), progressMax));
        if (progressMax > 0) {
            views.setViewVisibility(R.id.lingua_widget_progress, View.VISIBLE);
            views.setProgressBar(R.id.lingua_widget_progress, progressMax, progressValue, false);
        } else {
            views.setViewVisibility(R.id.lingua_widget_progress, View.GONE);
        }

        // Chạm vào thân widget = mở tab Từ vựng; các nút mở đúng việc cần làm.
        views.setOnClickPendingIntent(R.id.lingua_widget_root, openTab(context, "vocabulary", 101));
        views.setOnClickPendingIntent(R.id.lingua_widget_button_practice, openTab(context, "practice", 102));
        views.setOnClickPendingIntent(R.id.lingua_widget_button_grammar, openTab(context, "grammar", 103));
        views.setOnClickPendingIntent(R.id.lingua_widget_button_vstep, openTab(context, "vstep", 104));
        views.setOnClickPendingIntent(R.id.lingua_widget_button_progress, openTab(context, "progress", 105));

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    /** Làm mới mọi widget đang có trên màn hình (gọi sau khi JS ghi số liệu). */
    public static void refreshAll(Context context) {
        try {
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
            int[] ids = appWidgetManager.getAppWidgetIds(new ComponentName(context, LinguaWidgetProvider.class));
            for (int id : ids) {
                updateWidget(context, appWidgetManager, id);
            }
        } catch (Exception ignored) {
            // Chưa có widget nào trên màn hình thì không cần làm gì.
        }
    }

    /**
     * PendingIntent mở app bằng deep link `com.lingua.studyhub://<target>`.
     * `practice` được App hiểu là "vào thẳng phiên ôn thẻ đến hạn".
     */
    private static PendingIntent openTab(Context context, String target, int requestCode) {
        String url = "practice".equals(target)
                ? SCHEME + "://practice"
                : SCHEME + "://tab/" + target;

        Intent intent = new Intent(context, MainActivity.class);
        intent.setAction(Intent.ACTION_VIEW);
        intent.setData(Uri.parse(url));
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
