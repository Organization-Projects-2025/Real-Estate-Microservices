import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

import 'pages/home_page.dart';
import 'pages/login_page.dart';
import 'pages/signup_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const App01());
}

class App01 extends StatelessWidget {
  const App01({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Tamalak Real Estate',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF121212),
        colorSchemeSeed: const Color(0xFF703BF7),
        useMaterial3: true,
      ),
      // Start directly on the homepage — no forced login
      initialRoute: '/home',
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case '/login':
            return MaterialPageRoute(builder: (_) => const LoginPage());
          case '/signup':
            return MaterialPageRoute(builder: (_) => const SignupPage());
          case '/home':
          default:
            return MaterialPageRoute(builder: (_) => const HomePage());
        }
      },
    );
  }
}
