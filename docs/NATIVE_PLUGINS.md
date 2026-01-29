# Native Plugins for CallShield

This document covers the native Capacitor plugins and custom implementations needed for the caller ID functionality.

## Overview

CallShield requires deep native integration for:
1. **Call Detection** - Detect incoming calls and display caller ID
2. **Call Blocking** - Block spam calls automatically
3. **Background Processing** - Run call detection in background
4. **Push Notifications** - Alert users about blocked calls

## Required Plugins

### Official Capacitor Plugins (Already Installed)

| Plugin | Purpose |
|--------|---------|
| `@capacitor/app` | App lifecycle events |
| `@capacitor/network` | Network status monitoring |
| `@capacitor/local-notifications` | Blocked call alerts |
| `@capacitor/push-notifications` | Server-sent notifications |
| `@capacitor/preferences` | Local storage |
| `@capacitor/status-bar` | Status bar styling |
| `@capacitor/haptics` | Vibration feedback |
| `@capawesome/capacitor-background-task` | Background processing |

### Custom Plugin Needed: Call Detection

There's no official Capacitor plugin for call detection. We need to create a custom plugin.

## Android Implementation

### Required Permissions

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Call detection -->
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.READ_CALL_LOG" />
<uses-permission android:name="android.permission.ANSWER_PHONE_CALLS" />

<!-- Call blocking (Android 7+) -->
<uses-permission android:name="android.permission.CALL_SCREENING" />

<!-- Overlay for caller ID popup -->
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />

<!-- Foreground service for background detection -->
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_PHONE_CALL" />

<!-- Contacts for caller identification -->
<uses-permission android:name="android.permission.READ_CONTACTS" />
```

### Call Screening Service (Android 7+)

Create `android/app/src/main/java/.../CallScreeningService.java`:

```java
package za.co.callshield.app;

import android.telecom.Call;
import android.telecom.CallScreeningService;
import android.telecom.Connection;

public class CallShieldScreeningService extends CallScreeningService {
    @Override
    public void onScreenCall(Call.Details callDetails) {
        String phoneNumber = callDetails.getHandle().getSchemeSpecificPart();

        // Check against local database
        boolean isSpam = checkIfSpam(phoneNumber);

        CallResponse.Builder response = new CallResponse.Builder();

        if (isSpam) {
            response.setDisallowCall(true)
                   .setRejectCall(true)
                   .setSkipCallLog(false)
                   .setSkipNotification(false);
        }

        respondToCall(callDetails, response.build());
    }

    private boolean checkIfSpam(String phoneNumber) {
        // TODO: Implement database lookup
        return false;
    }
}
```

Register in `AndroidManifest.xml`:

```xml
<service
    android:name=".CallShieldScreeningService"
    android:permission="android.permission.BIND_SCREENING_SERVICE">
    <intent-filter>
        <action android:name="android.telecom.CallScreeningService" />
    </intent-filter>
</service>
```

### PhoneStateListener (Fallback for older Android)

For Android versions before 7.0, use `PhoneStateListener`:

```java
TelephonyManager telephonyManager = (TelephonyManager)
    getSystemService(Context.TELEPHONY_SERVICE);

PhoneStateListener listener = new PhoneStateListener() {
    @Override
    public void onCallStateChanged(int state, String phoneNumber) {
        switch (state) {
            case TelephonyManager.CALL_STATE_RINGING:
                // Incoming call detected
                handleIncomingCall(phoneNumber);
                break;
            case TelephonyManager.CALL_STATE_IDLE:
                // Call ended
                handleCallEnded();
                break;
        }
    }
};

telephonyManager.listen(listener, PhoneStateListener.LISTEN_CALL_STATE);
```

## iOS Implementation

### Required Entitlements

Add to your app capabilities:
- **Call Directory Extension** - For caller ID and blocking

### Info.plist Entries

```xml
<key>NSContactsUsageDescription</key>
<string>CallShield needs access to contacts to identify callers.</string>

<key>NSUserActivityTypes</key>
<array>
    <string>INStartCallIntent</string>
</array>
```

### Call Directory Extension

Create a new "Call Directory Extension" target in Xcode.

`CallDirectoryHandler.swift`:

```swift
import CallKit

class CallDirectoryHandler: CXCallDirectoryProvider {

    override func beginRequest(with context: CXCallDirectoryExtensionContext) {
        // Add blocked numbers
        addBlockedPhoneNumbers(to: context)

        // Add identification entries
        addIdentificationPhoneNumbers(to: context)

        context.completeRequest()
    }

    private func addBlockedPhoneNumbers(to context: CXCallDirectoryExtensionContext) {
        // Fetch from shared UserDefaults/AppGroup database
        let blockedNumbers = fetchBlockedNumbers()

        for number in blockedNumbers {
            context.addBlockingEntry(withNextSequentialPhoneNumber: number)
        }
    }

    private func addIdentificationPhoneNumbers(to context: CXCallDirectoryExtensionContext) {
        // Fetch from offline database
        let identifiedNumbers = fetchIdentifiedNumbers()

        for entry in identifiedNumbers {
            context.addIdentificationEntry(
                withNextSequentialPhoneNumber: entry.number,
                label: entry.label
            )
        }
    }
}
```

### Refresh Extension from App

```swift
import CallKit

func refreshCallDirectory() {
    CXCallDirectoryManager.sharedInstance.reloadExtension(
        withIdentifier: "za.co.callshield.app.CallDirectoryExtension"
    ) { error in
        if let error = error {
            print("Failed to reload: \(error)")
        }
    }
}
```

## Creating Custom Capacitor Plugin

### Plugin Structure

```
plugins/
└── capacitor-call-detection/
    ├── package.json
    ├── src/
    │   ├── index.ts
    │   ├── definitions.ts
    │   └── web.ts
    ├── android/
    │   └── src/main/java/.../
    └── ios/
        └── Plugin/
```

### TypeScript Definitions

`definitions.ts`:

```typescript
export interface CallDetectionPlugin {
  // Check if call detection is supported
  isSupported(): Promise<{ supported: boolean }>;

  // Request necessary permissions
  requestPermissions(): Promise<{ granted: boolean }>;

  // Start listening for incoming calls
  startListening(): Promise<void>;

  // Stop listening
  stopListening(): Promise<void>;

  // Add listener for incoming calls
  addListener(
    eventName: 'incomingCall',
    listenerFunc: (data: IncomingCallEvent) => void
  ): Promise<PluginListenerHandle>;

  // Add listener for call ended
  addListener(
    eventName: 'callEnded',
    listenerFunc: (data: CallEndedEvent) => void
  ): Promise<PluginListenerHandle>;
}

export interface IncomingCallEvent {
  phoneNumber: string;
  timestamp: number;
}

export interface CallEndedEvent {
  phoneNumber: string;
  duration: number;
  timestamp: number;
}
```

## Database Sync for Native

The offline database (Dexie/IndexedDB) runs in the WebView. For native call detection:

### Android
- Use SQLite or Room database
- Sync with IndexedDB on app foreground
- Store blocked numbers natively for CallScreeningService

### iOS
- Use App Groups shared container
- Store data in UserDefaults or CoreData
- Call Directory Extension reads from shared container

## Recommended Community Plugins

While building custom plugins, consider these community alternatives:

1. **capacitor-callkit-voip** - iOS VoIP/CallKit integration
2. **capacitor-phone-state** - Basic phone state detection
3. **@nickclaw/capacitor-telephony** - Telephony info

## Implementation Priority

1. **Phase 1**: Basic call history access (read-only)
2. **Phase 2**: Incoming call detection with overlay
3. **Phase 3**: Call blocking (Android CallScreeningService)
4. **Phase 4**: iOS Call Directory Extension
5. **Phase 5**: Background processing optimization

## Testing

### Android
- Use Android Emulator with extended controls for simulating calls
- Test on real device for CallScreeningService

### iOS
- Call Directory Extensions require real device testing
- Use Xcode's Console for debugging extension logs

## Resources

- [Android CallScreeningService](https://developer.android.com/reference/android/telecom/CallScreeningService)
- [iOS CallKit](https://developer.apple.com/documentation/callkit)
- [Capacitor Plugin Development](https://capacitorjs.com/docs/plugins/creating-plugins)