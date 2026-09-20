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
        context.getSharedPreferences(LinguaWidgetProvider.PREFS, Context.MODE_PRIVATE)
                .edit()
                .putString("title", call.getString("title", "Lingua · hôm nay"))
                .putString("primary", call.getString("primary", ""))
                .putString("secondary", call.getString("secondary", ""))
                .putString("tertiary", call.getString("tertiary", ""))
                .putString("footer", call.getString("footer", ""))
                .apply();

        try {
            LinguaWidgetProvider.refreshAll(context);
        } catch (Exception ignored) {
            // Chưa có widget nào trên màn hình thì không cần làm gì.
        }
        call.resolve(new JSObject());
    }
}
