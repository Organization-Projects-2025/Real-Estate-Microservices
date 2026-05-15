# Firebase Setup for Real Estate Flutter App

## ✅ What's Already Done

1. ✅ Firebase dependencies added to `pubspec.yaml`
2. ✅ Firebase initialized in `main.dart`
3. ✅ `firebase_options.dart` created
4. ✅ `firebase_service.dart` created with all methods
5. ✅ Login and signup pages updated to use Firebase

## 📋 Quick Setup (10 minutes)

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click **"Create a project"**
3. Project name: `real-estate-flutter`
4. Click **Create project**
5. Wait for it to initialize

### Step 2: Register Web App
1. In Firebase Console, click the **web icon** `</>`
2. App nickname: `Real Estate Web`
3. Check **"Also set up Firebase Hosting"** (optional)
4. Click **Register app**
5. You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "real-estate-flutter.firebaseapp.com",
  projectId: "real-estate-flutter",
  storageBucket: "real-estate-flutter.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456",
  measurementId: "G-XXXXXXXXXX"
};
```

### Step 3: Update `firebase_options.dart`

Copy your values from Firebase Console and update the `web` section:

```dart
static const FirebaseOptions web = FirebaseOptions(
  apiKey: 'AIzaSyD...',  // from firebaseConfig.apiKey
  appId: '1:123456789:web:abc123def456',  // from firebaseConfig.appId
  messagingSenderId: '123456789',  // from firebaseConfig.messagingSenderId
  projectId: 'real-estate-flutter',  // from firebaseConfig.projectId
  authDomain: 'real-estate-flutter.firebaseapp.com',  // from firebaseConfig.authDomain
  storageBucket: 'real-estate-flutter.appspot.com',  // from firebaseConfig.storageBucket
  measurementId: 'G-XXXXXXXXXX',  // from firebaseConfig.measurementId
);
```

### Step 4: Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password**
4. Click **Enable**

### Step 5: Create Firestore Database
1. Go to **Firestore Database**
2. Click **Create Database**
3. Start in **Test Mode** (for development)
4. Choose location closest to you
5. Click **Create**

### Step 6: Set Firestore Security Rules

Go to **Firestore → Rules** and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Anyone can read properties
    match /properties/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Anyone can read agents
    match /agents/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Anyone can read reviews
    match /reviews/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Click **Publish**

### Step 7: Set Storage Security Rules

Go to **Storage → Rules** and paste:

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

Click **Publish**

## 🚀 Using Firebase in Your App

### Import the service:
```dart
import 'package:real_estate_flutter/services/firebase_service.dart';
```

### Sign Up:
```dart
final userCredential = await FirebaseService.signUp(email, password);
if (userCredential != null) {
  await FirebaseService.saveUser(
    userCredential.user!.uid,
    email: email,
    firstName: firstName,
    lastName: lastName,
  );
}
```

### Sign In:
```dart
final userCredential = await FirebaseService.signIn(email, password);
if (userCredential != null) {
  // Login successful
}
```

### Get Properties:
```dart
final properties = await FirebaseService.getProperties();
```

### Get Properties by Type:
```dart
final buyProperties = await FirebaseService.getPropertiesByType('buy');
final rentProperties = await FirebaseService.getPropertiesByType('rent');
```

### Watch Properties (Real-time):
```dart
FirebaseService.watchProperties().listen((snapshot) {
  final properties = snapshot.docs.map((doc) => doc.data()).toList();
  // Update UI with real-time data
});
```

### Save Property:
```dart
await FirebaseService.saveProperty(
  title: 'Beautiful House',
  location: 'Downtown',
  type: 'Villa',
  listingType: 'buy',
  image: 'https://...',
  price: 500000,
  beds: 4,
  baths: 3,
  sqft: 3200,
  featured: true,
);
```

### Get Agents:
```dart
final agents = await FirebaseService.getAgents();
```

### Get Reviews by Agent:
```dart
final reviews = await FirebaseService.getReviewsByAgent(agentId);
```

### Save Review:
```dart
await FirebaseService.saveReview(
  name: 'John Doe',
  rating: 5,
  text: 'Great agent!',
  agentId: agentId,
  userId: userId,
);
```

### Upload Image:
```dart
final imageUrl = await FirebaseService.uploadImage(filePath, 'property_1.jpg');
```

## 📝 Update Your Pages

### buy_page.dart, rent_page.dart, sell_page.dart:
```dart
import 'package:real_estate_flutter/services/firebase_service.dart';

@override
void initState() {
  super.initState();
  _loadProperties();
}

Future<void> _loadProperties() async {
  final properties = await FirebaseService.getPropertiesByType('buy');
  setState(() {
    this.properties = properties;
  });
}
```

### agent_page.dart:
```dart
Future<void> _loadAgents() async {
  final agents = await FirebaseService.getAgents();
  setState(() {
    this.agents = agents;
  });
}
```

### reviews_page.dart:
```dart
Future<void> _loadReviews() async {
  final reviews = await FirebaseService.getReviews();
  setState(() {
    this.reviews = reviews;
  });
}
```

## ✅ Test It

1. Run the app: `flutter run -d chrome`
2. Try signing up with an email
3. Check Firebase Console → Firestore to see your user created
4. Try creating a property
5. Check if it appears in the `properties` collection

## 📚 Available Methods in FirebaseService

```dart
// Auth
FirebaseService.signUp(email, password)
FirebaseService.signIn(email, password)
FirebaseService.signOut()
FirebaseService.getCurrentUser()
FirebaseService.authStateChanges()

// Users
FirebaseService.saveUser(uid, email, firstName, lastName, phone, profileImage)
FirebaseService.getUserData(uid)
FirebaseService.updateUserData(uid, data)

// Properties
FirebaseService.saveProperty(title, location, type, listingType, image, price, beds, baths, sqft, featured, description, agentId)
FirebaseService.getProperties()
FirebaseService.getPropertiesByType(listingType)  // 'buy', 'rent', 'sell'
FirebaseService.updateProperty(propertyId, data)
FirebaseService.deleteProperty(propertyId)
FirebaseService.watchProperties()  // Real-time

// Agents
FirebaseService.saveAgent(name, email, phone, image, role, rating, deals)
FirebaseService.getAgents()
FirebaseService.watchAgents()  // Real-time

// Reviews
FirebaseService.saveReview(name, rating, text, date, agentId, userId)
FirebaseService.getReviews()
FirebaseService.getReviewsByAgent(agentId)
FirebaseService.watchReviews()  // Real-time

// Storage
FirebaseService.uploadImage(filePath, fileName)
FirebaseService.deleteImage(imageUrl)
```

## 🆘 Troubleshooting

**"Firebase app not initialized"**
- Make sure you updated `firebase_options.dart` with your credentials
- Make sure `Firebase.initializeApp()` is called in `main()`

**"Permission denied" errors**
- Check your Firestore security rules
- Make sure you're authenticated

**"API key not valid"**
- Double-check your credentials in `firebase_options.dart`
- Check that the API keys are enabled in Firebase Console

**Web app not connecting**
- Add your domain to Firebase Console → Authentication → Settings
- For localhost, it should work automatically

## 🎉 You're Done!

Your Flutter app is now connected to Firebase. No more localhost errors!
