import React, { useState } from 'react';
import { Smartphone, Download, Copy, Check, X, FileCode, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface Props {
  onClose: () => void;
}

export const AndroidExportModal: React.FC<Props> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<string>('MainActivity.kt');
  const [copied, setCopied] = useState(false);

  const fileContents: Record<string, string> = {
    'MainActivity.kt': `package com.smartprep.cbt

import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
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
                        }
                        loadUrl("https://ais-dev-a3jdlh5dxdmgnxuapr5cjm-155707602577.europe-west1.run.app")
                    }
                }
            )
        }
    }
}`,
    'AndroidManifest.xml': `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.smartprep.cbt">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@android:style/Theme.Material.Light.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
    'build.gradle.kts': `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.smartprep.cbt"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.smartprep.cbt"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "2.5.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.activity:activity-compose:1.10.0")
    implementation(platform("androidx.compose:compose-bom:2024.12.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
}`,
    'build_commands.sh': `# Build Release APK
./gradlew assembleRelease

# Build Google Play AAB Bundle
./gradlew bundleRelease`,
  };

  const copyCode = () => {
    navigator.clipboard.writeText(fileContents[selectedFile] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" /> Android Native Project Exporter
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                SmartPrep CBT Android Packaging
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-slate-800 text-xs sm:text-sm">
          {/* Quick Option 1: PWA Direct WebAPK Install */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-emerald-900 text-sm">
                Instant Android Installation (No Android Studio Needed)
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Install SmartPrep CBT directly to your Android Home screen and App drawer with 1 click.
              </p>
            </div>
            <PWAInstallButton />
          </div>

          {/* Option 2: Android Studio Project Code */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Android Studio / Gradle Kotlin Project Files
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              These files are physically generated under the <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">/android</code> directory in this codebase.
            </p>

            {/* File Switcher Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
              {Object.keys(fileContents).map((fileName) => (
                <button
                  key={fileName}
                  onClick={() => setSelectedFile(fileName)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    selectedFile === fileName
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  {fileName}
                </button>
              ))}
            </div>

            {/* Code Box */}
            <div className="relative mt-3">
              <pre className="p-4 bg-slate-950 text-slate-200 rounded-2xl font-mono text-xs overflow-x-auto max-h-72 leading-relaxed">
                {fileContents[selectedFile]}
              </pre>
              <button
                onClick={copyCode}
                className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow-xs transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            SmartPrep CBT v2.5.0 • Copyright © 2026 Olakunle Olalekan
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
