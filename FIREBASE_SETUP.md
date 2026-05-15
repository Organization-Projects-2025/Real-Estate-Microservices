# Firebase Setup Guide for Real Estate Flutter App

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter project name: `real-estate-app`
4. Accept the terms and create the project
5. Wait for the project to be created

## Step 2: Register Your App

### For Web:
1. In Firebase Console, click the web icon `</>`
2. Enter app nickname: `Real Estate Web`
3. Check "Also set up Firebase Hosting"
4. Click "Register app"
5. Copy the Firebase config object

### For Android:
1. Click the Android icon
2. Enter package name: `com.example.real_estate_flutter`
3. Enter app nickname: `Real Estate Android`
4. Download `google-services.json`
5. Place it in `android/app/` directory

### For iOS:
1. Click the iOS icon
2. Enter bundle ID: `com.example.realEstateFlutter`
3. Enter app nickname: `Real Estate iOS`
4. Download `GoogleService-Info.plist`
5. Add it to Xcode project

## Step 3: Update Firebase Configuration

1. Open `lib/firebase_options.dart`
2. Replace the placeholder values with your Firebase credentials:
   - `YOUR_PROJECT_ID` - Your Firebase project ID
   - `YOUR_WEB_API_KEY` - Web API key from Firebase Console
   - `YOUR_ANDROID_API_KEY` - Android API key
   - `YOUR_IOS_API_KEY` - iOS API key
   - `YOUR_AUTH_DOMAIN` - Your auth domain
   - `YOUR_STORAGE_BUCKET` - Your storage bucket
   - `YOUR_MESSAGING_SENDER_ID` - Messaging sender ID
   - `YOUR_MEASUREMENT_ID` - Measurement ID (for web)

You can find these values in Firebase Console:
- Project Settings → General tab

## Step 4: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** provider
4. Enable **Google** provider (optional)

## Step 5: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create Database**
3. Start in **Test Mode** (for development)
4. Choose a location close to you
5. Click **Create**

### Create Collections:

**users** collection:
```
{
  uid: string (document ID)
  email: string
  name: string
  phone: string
  profileImage: string (URL)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**properties** collection:
```
{
  id: string (document ID)
  title: string
  description: string
  price: number
  location: string
  type: string (buy/rent/sell)
  images: array of strings (URLs)
  agentId: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Step 6: Set Up Storage

1. In Firebase Console, go to **Storage**
2. Click **Get Started**
3. Start in **Test Mode**
4. Choose a location
5. Click **Done**

## Step 7: Update Dependencies

Run the following command to get the latest packages:

```bash
flutter pub get
```

## Step 8: Run the App

### For Web:
```bash
flutter run -d chrome
```

### For Android:
```bash
flutter run -d android
```

### For iOS:
```bash
flutter run -d ios
```

## Step 9: Test Firebase Connection

The app will now:
- Initialize Firebase on startup
- Connect to your Firebase project
- Allow users to sign up and log in
- Store user data in Firestore
- Upload and manage property images in Storage

## Firestore Security Rules (Test Mode)

For development, you can use these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /properties/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Storage Security Rules (Test Mode)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Using Firebase Service in Your App

The `FirebaseService` class provides easy methods to interact with Firebase:

```dart
import 'package:real_estate_flutter/services/firebase_service.dart';

// Sign up
await FirebaseService.signUp('user@example.com', 'password');

// Sign in
await FirebaseService.signIn('user@example.com', 'password');

// Save user data
await FirebaseService.saveUserData(uid, {
  'name': 'John Doe',
  'email': 'john@example.com',
});

// Get properties
FirebaseService.getProperties().listen((snapshot) {
  // Handle properties
});

// Upload image
String? imageUrl = await FirebaseService.uploadImage(imagePath, 'property_1.jpg');
```

## Troubleshooting

### "Firebase app not initialized"
- Make sure `Firebase.initializeApp()` is called in `main()` before `runApp()`

### "Permission denied" errors
- Check your Firestore and Storage security rules
- Make sure you're authenticated before writing data

### "API key not valid"
- Verify your Firebase credentials in `firebase_options.dart`
- Check that the API keys are enabled in Firebase Console

### Web app not connecting
- Make sure you've added your domain to Firebase Console under Authentication → Settings
- For localhost, it should be automatically allowed

## Next Steps

1. Update the login and signup pages to use `FirebaseService`
2. Integrate Firebase authentication with your existing API service
3. Migrate property data to Firestore
4. Set up proper security rules for production
5. Add Firebase Analytics for tracking user behavior
