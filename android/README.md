# SmartPrep CBT - Native Android Build & Packaging Guide

**Application Name:** SmartPrep CBT  
**Tagline:** Prepare Smart. Practise More. Pass with Confidence.  
**Copyright:** Copyright © 2026 Olakunle Olalekan. All rights reserved.  
**Target:** Android 7.0+ (API level 24 to 35)

---

## 1. Quick Installation Directly on Android (Recommended)
You do not need to install Android Studio just to practise! SmartPrep CBT is configured with **PWA / WebAPK technology**:
1. Open the app link in **Google Chrome** on your Android phone.
2. Tap the **three dots menu (⋮)** in Chrome and tap **Install App** or **Add to Home Screen**.
3. Android creates a standalone native application icon in your app drawer with full offline access.

---

## 2. Compiling the Signed APK & AAB in Android Studio

If you wish to compile an offline `.apk` or Google Play `.aab` (Android App Bundle):

### Prerequisites:
- Android Studio Ladybug / Koala or newer
- JDK 17
- Android SDK 35

### Steps:
1. Open Android Studio, click **File → Open**, and select the `/android` directory.
2. Wait for Gradle Sync to complete.
3. To generate a debug APK:
   ```bash
   ./gradlew assembleDebug
   ```
   Output: `app/build/outputs/apk/debug/app-debug.apk`

4. To generate a release APK:
   ```bash
   ./gradlew assembleRelease
   ```
   Output: `app/build/outputs/apk/release/app-release.apk`

5. To generate an Android App Bundle (AAB) for Google Play:
   ```bash
   ./gradlew bundleRelease
   ```
   Output: `app/build/outputs/bundle/release/app-release.aab`
