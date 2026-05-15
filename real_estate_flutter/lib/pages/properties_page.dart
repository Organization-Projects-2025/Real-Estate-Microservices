import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../widgets/api_property_card.dart';

class PropertiesPage extends StatefulWidget {
  const PropertiesPage({super.key});

  @override
  State<PropertiesPage> createState() => _PropertiesPageState();
}

class _PropertiesPageState extends State<PropertiesPage> {
  static const Color kPurple = Color(0xFF703BF7);
  static const Color kBg = Color(0xFF121212);

  final TextEditingController searchc = TextEditingController();
  List<dynamic> all = [];
  bool loading = true;
  String searchTerm = '';

  List<dynamic> get filtered {
    if (searchTerm.trim().isEmpty) return all;
    final q = searchTerm.toLowerCase();
    return all.where((p) {
      final title = (p['title'] ?? '').toString().toLowerCase();
      final city = ((p['address'] ?? {})['city'] ?? '')
          .toString()
          .toLowerCase();
      final type = (p['subType'] ?? '').toString().toLowerCase();
      return title.contains(q) || city.contains(q) || type.contains(q);
    }).toList();
  }

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => loading = true);
    try {
      final data = await ApiService.getProperties();
      if (mounted)
        setState(() {
          all = data;
          loading = false;
        });
    } catch (_) {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  void dispose() {
    searchc.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBg,
      body: Column(
        children: [
          // Hero + search
          Stack(
            children: [
              SizedBox(
                height: 200,
                width: double.infinity,
                child: Image.network(
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) =>
                      Container(height: 200, color: const Color(0xFF1A1A1A)),
                ),
              ),
              Container(
                height: 200,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      const Color(0xFF121212).withValues(alpha: 0.9),
                      kPurple.withValues(alpha: 0.5),
                      const Color(0xFF121212).withValues(alpha: 0.9),
                    ],
                  ),
                ),
              ),
              Positioned(
                left: 20,
                right: 20,
                top: 36,
                child: Column(
                  children: [
                    RichText(
                      textAlign: TextAlign.center,
                      text: const TextSpan(
                        style: TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                        children: [
                          TextSpan(text: 'Discover Your '),
                          TextSpan(
                            text: 'Dream Home',
                            style: TextStyle(color: kPurple),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: searchc,
                            style: const TextStyle(color: Colors.black87),
                            onChanged: (v) => setState(() => searchTerm = v),
                            decoration: InputDecoration(
                              hintText: 'Search properties…',
                              hintStyle: const TextStyle(color: Colors.black45),
                              filled: true,
                              fillColor: Colors.white,
                              prefixIcon: const Icon(
                                Icons.search,
                                color: Colors.black45,
                              ),
                              border: const OutlineInputBorder(
                                borderRadius: BorderRadius.horizontal(
                                  left: Radius.circular(30),
                                ),
                                borderSide: BorderSide.none,
                              ),
                              contentPadding: const EdgeInsets.symmetric(
                                vertical: 14,
                              ),
                            ),
                          ),
                        ),
                        Container(
                          height: 50,
                          decoration: const BoxDecoration(
                            color: kPurple,
                            borderRadius: BorderRadius.horizontal(
                              right: Radius.circular(30),
                            ),
                          ),
                          child: const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 16),
                            child: Icon(Icons.search, color: Colors.white),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),

          Expanded(
            child: loading
                ? const Center(child: CircularProgressIndicator(color: kPurple))
                : filtered.isEmpty
                ? const Center(
                    child: Text(
                      'No properties found.',
                      style: TextStyle(color: Colors.white54),
                    ),
                  )
                : RefreshIndicator(
                    onRefresh: _load,
                    color: kPurple,
                    child: ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: filtered.length + 1,
                      itemBuilder: (ctx, i) {
                        if (i == 0)
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 14),
                            child: Text(
                              'Browse Properties (${filtered.length})',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          );
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 14),
                          child: ApiPropertyCard(property: filtered[i - 1]),
                        );
                      },
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}
