package com.muggy8.lorcardmaker

import android.os.Bundle
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val appView: WebView = findViewById(R.id.webview)
        appView.loadUrl("https://muggy8.github.io/lor-card-maker/")

        appView.settings.javaScriptEnabled = true
        appView.settings.allowFileAccess = true
        appView.settings.displayZoomControls = false
        appView.settings.javaScriptCanOpenWindowsAutomatically = true

    }
}