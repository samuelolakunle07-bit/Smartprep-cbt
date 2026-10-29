package com.smartprep.cbt

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView

/**
 * SmartPrep CBT - Native Android Activity Container
 * Copyright © 2026 Olakunle Olalekan. All rights reserved.
 * Prepare Smart. Practise More. Pass with Confidence.
 */
class MainActivity : ComponentActivity() {

    private var webView: WebView? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Handle Android hardware/gesture back button within CBT navigation
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView?.canGoBack() == true) {
                    webView?.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })

        setContent {
            SmartPrepAppContainer()
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Composable
    fun SmartPrepAppContainer() {
        AndroidView(
            modifier = Modifier.fillMaxSize(),
            factory = { context ->
                WebView(context).apply {
                    webView = this
                    webViewClient = WebViewClient()
                    settings.apply {
                        javaScriptEnabled = true
                        domStorageEnabled = true
                        databaseEnabled = true
                        cacheMode = WebSettings.LOAD_DEFAULT
                        allowFileAccess = true
                        useWideViewPort = true
                        loadWithOverviewMode = true
                    }
                    // Load local assets or deployed SmartPrep CBT server
                    loadUrl("https://ais-dev-a3jdlh5dxdmgnxuapr5cjm-155707602577.europe-west1.run.app")
                }
            }
        )
    }
}
