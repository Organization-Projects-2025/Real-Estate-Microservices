import 'package:flutter/material.dart';

import '../services/api_service.dart';
import 'about_us_page.dart';
import 'agent_page.dart';
import 'buy_page.dart';
import 'contact_page.dart';
import 'find_agent_page.dart';
import 'homepage_page.dart';
import 'login_page.dart';
import 'properties_page.dart';
import 'rent_page.dart';
import 'reviews_page.dart';
import 'sell_page.dart';

// ── Constants ────────────────────────────────────────────────────────────────
const Color kPurple = Color(0xFF703BF7);
const Color kBg = Color(0xFF121212);
const Color kCard = Color(0xFF1A1A1A);
const Color kDrawerBg = Color(0xFF0D0D0D);

// ── Nav items ────────────────────────────────────────────────────────────────
class _NavItem {
  final String label;
  final IconData icon;
  const _NavItem(this.label, this.icon);
}

const List<_NavItem> _navItems = [
  _NavItem('Home', Icons.home_outlined),
  _NavItem('Properties', Icons.apartment_outlined),
  _NavItem('Buy', Icons.sell_outlined),
  _NavItem('Rent', Icons.key_outlined),
  _NavItem('Sell', Icons.add_home_outlined),
  _NavItem('Find Agent', Icons.search_outlined),
  _NavItem('Agent Profile', Icons.person_outlined),
  _NavItem('About Us', Icons.info_outlined),
  _NavItem('Reviews', Icons.star_outline),
  _NavItem('Contact', Icons.mail_outline),
];

// ── HomePage shell ───────────────────────────────────────────────────────────
class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  // Rebuild when auth state changes (login / logout)
  void _onAuthChanged() => setState(() {});

  Widget _buildPage(int index) {
    switch (index) {
      case 0:
        return HomepagePage(onAuthChanged: _onAuthChanged);
      case 1:
        return const PropertiesPage();
      case 2:
        return const BuyPage();
      case 3:
        return const RentPage();
      case 4:
        return SellPage(onAuthChanged: _onAuthChanged);
      case 5:
        return const FindAgentPage();
      case 6:
        return const AgentPage();
      case 7:
        return const AboutUsPage();
      case 8:
        return const ReviewsPage();
      case 9:
        return const ContactPage();
      default:
        return HomepagePage(onAuthChanged: _onAuthChanged);
    }
  }

  // Initials from name
  String get _initials {
    final user = ApiService.currentUser;
    if (user == null) return '';
    final first = (user['firstName'] as String? ?? '');
    final last = (user['lastName'] as String? ?? '');
    final f = first.isNotEmpty ? first[0].toUpperCase() : '';
    final l = last.isNotEmpty ? last[0].toUpperCase() : '';
    return '$f$l'.isNotEmpty ? '$f$l' : 'U';
  }

  String get _displayName {
    final user = ApiService.currentUser;
    if (user == null) return '';
    final first = user['firstName'] as String? ?? '';
    final last = user['lastName'] as String? ?? '';
    return '$first $last'.trim();
  }

  String get _userEmail => ApiService.currentUser?['email'] as String? ?? '';

  void _navigateTo(int index) {
    setState(() => _selectedIndex = index);
    Navigator.pop(context); // close drawer
  }

  void _logout() {
    ApiService.clearAuth();
    setState(() {});
  }

  void _goToLogin() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => LoginPage(onAuthChanged: _onAuthChanged),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final loggedIn = ApiService.isLoggedIn;

    return Scaffold(
      backgroundColor: kBg,

      // ── AppBar ─────────────────────────────────────────────────────────────
      appBar: AppBar(
        backgroundColor: kDrawerBg,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        title: Row(
          children: [
            Container(
              width: 30,
              height: 30,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [kPurple, Color(0xFF9D6FFF)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.home, color: Colors.white, size: 17),
            ),
            const SizedBox(width: 10),
            const Text(
              'Tamalak',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 20,
                letterSpacing: 0.5,
              ),
            ),
          ],
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(height: 1, color: Colors.white10),
        ),

        // ── Right side: Login button OR CircleAvatar ───────────────────────
        actions: [
          if (!loggedIn)
            Padding(
              padding: const EdgeInsets.only(right: 12),
              child: TextButton(
                onPressed: _goToLogin,
                style: TextButton.styleFrom(
                  backgroundColor: kPurple,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
                child: const Text(
                  'Sign In',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                ),
              ),
            )
          else
            Padding(
              padding: const EdgeInsets.only(right: 12),
              child: GestureDetector(
                onTap: () => _showUserMenu(context),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CircleAvatar(
                      radius: 17,
                      backgroundColor: kPurple,
                      child: Text(
                        _initials,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                    const SizedBox(width: 7),
                    ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 90),
                      child: Text(
                        _displayName,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    const SizedBox(width: 2),
                    const Icon(
                      Icons.keyboard_arrow_down,
                      color: Colors.white54,
                      size: 16,
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),

      // ── Drawer ─────────────────────────────────────────────────────────────
      drawer: Drawer(
        backgroundColor: kDrawerBg,
        child: Column(
          children: [
            // Header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(20, 52, 20, 24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [kPurple.withValues(alpha: 0.3), kDrawerBg],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
              child: loggedIn
                  ? Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        CircleAvatar(
                          radius: 30,
                          backgroundColor: kPurple,
                          child: Text(
                            _initials,
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 20,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          _displayName,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        if (_userEmail.isNotEmpty) ...[
                          const SizedBox(height: 2),
                          Text(
                            _userEmail,
                            style: const TextStyle(
                              color: Colors.white54,
                              fontSize: 12,
                            ),
                          ),
                        ],
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: kPurple.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: kPurple.withValues(alpha: 0.4),
                            ),
                          ),
                          child: Text(
                            (ApiService.currentUser?['role'] as String? ??
                                    'user')
                                .toUpperCase(),
                            style: const TextStyle(
                              color: kPurple,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    )
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        CircleAvatar(
                          radius: 30,
                          backgroundColor: Colors.white12,
                          child: const Icon(
                            Icons.person,
                            color: Colors.white54,
                            size: 30,
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'Guest',
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        GestureDetector(
                          onTap: () {
                            Navigator.pop(context);
                            _goToLogin();
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 14,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: kPurple,
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Text(
                              'Sign In',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
            ),

            Container(height: 1, color: Colors.white10),

            // Nav items
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(vertical: 8),
                itemCount: _navItems.length,
                itemBuilder: (context, i) {
                  final item = _navItems[i];
                  final isActive = _selectedIndex == i;
                  return Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () => _navigateTo(i),
                      child: Container(
                        margin: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 2,
                        ),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 12,
                        ),
                        decoration: BoxDecoration(
                          color: isActive
                              ? kPurple.withValues(alpha: 0.15)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                          border: isActive
                              ? Border.all(
                                  color: kPurple.withValues(alpha: 0.4),
                                )
                              : null,
                        ),
                        child: Row(
                          children: [
                            Icon(
                              item.icon,
                              color: isActive ? kPurple : Colors.white54,
                              size: 20,
                            ),
                            const SizedBox(width: 14),
                            Text(
                              item.label,
                              style: TextStyle(
                                color: isActive ? Colors.white : Colors.white70,
                                fontWeight: isActive
                                    ? FontWeight.bold
                                    : FontWeight.normal,
                                fontSize: 15,
                              ),
                            ),
                            if (isActive) ...[
                              const Spacer(),
                              Container(
                                width: 6,
                                height: 6,
                                decoration: const BoxDecoration(
                                  color: kPurple,
                                  shape: BoxShape.circle,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            Container(height: 1, color: Colors.white10),

            // Logout or Sign In at bottom
            if (loggedIn)
              ListTile(
                leading: const Icon(Icons.logout, color: Colors.redAccent),
                title: const Text(
                  'Sign Out',
                  style: TextStyle(color: Colors.redAccent, fontSize: 15),
                ),
                onTap: () {
                  Navigator.pop(context);
                  _logout();
                },
              )
            else
              ListTile(
                leading: const Icon(Icons.login, color: kPurple),
                title: const Text(
                  'Sign In',
                  style: TextStyle(color: kPurple, fontSize: 15),
                ),
                onTap: () {
                  Navigator.pop(context);
                  _goToLogin();
                },
              ),
            const SizedBox(height: 8),
          ],
        ),
      ),

      // ── Body ───────────────────────────────────────────────────────────────
      body: _buildPage(_selectedIndex),

      // ── Bottom nav bar ─────────────────────────────────────────────────────
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: kDrawerBg,
          border: Border(top: BorderSide(color: Colors.white10)),
        ),
        child: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: List.generate(_navItems.length, (i) {
              final item = _navItems[i];
              final isActive = _selectedIndex == i;
              return GestureDetector(
                onTap: () => setState(() => _selectedIndex = i),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 10,
                  ),
                  decoration: BoxDecoration(
                    border: Border(
                      top: BorderSide(
                        color: isActive ? kPurple : Colors.transparent,
                        width: 2,
                      ),
                    ),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        item.icon,
                        size: 20,
                        color: isActive ? kPurple : Colors.white38,
                      ),
                      const SizedBox(height: 3),
                      Text(
                        item.label,
                        style: TextStyle(
                          fontSize: 10,
                          color: isActive ? kPurple : Colors.white38,
                          fontWeight: isActive
                              ? FontWeight.bold
                              : FontWeight.normal,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }

  // ── User popup menu ────────────────────────────────────────────────────────
  void _showUserMenu(BuildContext context) {
    final RenderBox overlay =
        Navigator.of(context).overlay!.context.findRenderObject() as RenderBox;

    showMenu<String>(
      context: context,
      position: RelativeRect.fromLTRB(
        overlay.size.width - 220,
        kToolbarHeight + 8,
        12,
        0,
      ),
      color: kCard,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      items: [
        PopupMenuItem(
          enabled: false,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: kPurple,
                    child: Text(
                      _initials,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _displayName,
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          _userEmail,
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 12,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              const Divider(color: Colors.white12),
            ],
          ),
        ),
        const PopupMenuItem(
          value: 'logout',
          child: Row(
            children: [
              Icon(Icons.logout, color: Colors.redAccent, size: 18),
              SizedBox(width: 10),
              Text('Sign Out', style: TextStyle(color: Colors.redAccent)),
            ],
          ),
        ),
      ],
    ).then((value) {
      if (value == 'logout') _logout();
    });
  }
}
