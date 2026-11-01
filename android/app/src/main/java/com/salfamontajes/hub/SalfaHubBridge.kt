package com.salfamontajes.hub

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.webkit.JavascriptInterface
import android.widget.Toast

class SalfaHubBridge(private val activity: MainActivity) {

    @JavascriptInterface
    fun openPortal(url: String, title: String, portalId: String) {
        activity.runOnUiThread {
            activity.openPortalInApp(url, title, portalId)
        }
    }

    @JavascriptInterface
    fun closePortal() {
        activity.runOnUiThread {
            activity.closePortalToHub()
        }
    }

    @JavascriptInterface
    fun switchPortal(portalId: String) {
        activity.runOnUiThread {
            val portal = PortalManager.findById(portalId)
            if (portal != null) {
                val url = PortalManager.resolvePortalUrl(portal)
                activity.openPortalInApp(url, portal.nombre, portal.id)
            }
        }
    }

    @JavascriptInterface
    fun vibrate(durationMs: Long) {
        try {
            val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = activity.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                vibratorManager?.defaultVibrator
            } else {
                @Suppress("DEPRECATION")
                activity.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
            }

            vibrator?.let {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    it.vibrate(VibrationEffect.createOneShot(durationMs.coerceIn(5, 500), VibrationEffect.DEFAULT_AMPLITUDE))
                } else {
                    @Suppress("DEPRECATION")
                    it.vibrate(durationMs.coerceIn(5, 500))
                }
            }
        } catch (_: Exception) {}
    }

    @JavascriptInterface
    fun showToast(message: String) {
        activity.runOnUiThread {
            Toast.makeText(activity, message, Toast.LENGTH_SHORT).show()
        }
    }

    @JavascriptInterface
    fun isAndroidHubApp(): Boolean = true

    @JavascriptInterface
    fun getHubAppVersion(): String = "1.0.0-hub"
}
