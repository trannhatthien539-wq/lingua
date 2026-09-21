package com.lingua.studyhub;

import android.content.Context;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Plugin cục bộ `LinguaWidget`: nhận nội dung từ JS và ghi vào SharedPreferences để widget
 * màn hình chính đọc được (widget không chạy được JS, và không đọc được localStorage).
 *
 * Được đăng ký trong MainActivity: `registerPlugin(LinguaWidgetPlugin.class);`
 * (workflow `.github/workflows/build-apk.yml` tự thêm dòng đó khi build APK).
 */
@CapacitorPlugin(name = "LinguaWidget")
public class LinguaWidgetPlugin extends Plugin {

    @PluginMethod
    public void save(PluginCall call) {
        Context context = getContext();
        // Số liệu mục tiêu ngày để widget vẽ thanh tiến độ (0 = ẩn thanh).
        Integer progressMax = call.getInt("progressMax", 0);
        Integer progressValue = call.getInt("progressValue", 0);
        context.getSharedPreferences(LinguaWidgetProvider.PREFS, Context.MODE_PRIVATE)
                .edit()
                .putString("title", call.getString("title", "Lingua · hôm nay"))
                .putString("primary", call.getString("primary", ""))
                .putString("secondary", call.getString("secondary", ""))
                .putString("tertiary", call.getString("tertiary", ""))
                .putString("footer", call.getString("footer", ""))
                .putInt("progressMax", progressMax == null ? 0 : progressMax)
                .putInt("progressValue", progressValue == null ? 0 : progressValue)
                .apply();

        try {
            LinguaWidgetProvider.refreshAll(context);
        } catch (Exception ignored) {
            // Chưa có widget nào trên màn hình thì không cần làm gì.
        }
        call.resolve(new JSObject());
    }

    /** Trả về nội dung đang hiển thị trên widget (dùng để kiểm tra trong app). */
    @PluginMethod
    public void read(PluginCall call) {
        Context context = getContext();
        android.content.SharedPreferences prefs = context.getSharedPreferences(LinguaWidgetProvider.PREFS, Context.MODE_PRIVATE);
        JSObject result = new JSObject();
        result.put("primary", prefs.getString("primary", ""));
        result.put("secondary", prefs.getString("secondary", ""));
        result.put("tertiary", prefs.getString("tertiary", ""));
        result.put("footer", prefs.getString("footer", ""));
        result.put("progressMax", prefs.getInt("progressMax", 0));
        result.put("progressValue", prefs.getInt("progressValue", 0));
        call.resolve(result);
    }
}
