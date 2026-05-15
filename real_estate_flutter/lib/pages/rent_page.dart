import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../widgets/api_property_card.dart';

class RentPage extends StatefulWidget {
  const RentPage({super.key});
  @override
  State<RentPage> createState() => _RentPageState();
}

class _RentPageState extends State<RentPage> {
  static const Color kPurple = Color(0xFF703BF7);
  static const Color kBg = Color(0xFF121212);

  final TextEditingController searchc = TextEditingController();
  List<dynamic> all = [];
  bool loading = true;
  String searchTerm = '';
  int page = 0;
  static const int perPage = 5;

  List<dynamic> get filtered {
    final q = searchTerm.toLowerCase();
    if (q.isEmpty) return all;
    return all.where((p) {
      final title = (p['title'] ?? '').toString().toLowerCase();
      final city = ((p['address'] ?? {})['city'] ?? '')
          .toString()
          .toLowerCase();
      return title.contains(q) || city.contains(q);
    }).toList();
  }

  List<dynamic> get pageItems {
    final start = page * perPage;
    final end = (start + perPage).clamp(0, filtered.length);
    return filtered.sublist(start, end);
  }

  int get totalPages => (filtered.length / perPage).ceil().clamp(1, 999);

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => loading = true);
    try {
      final data = await ApiService.getPropertiesByType('rent');
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
                          TextSpan(text: 'Find Your Perfect '),
                          TextSpan(
                            text: 'Rental Home',
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
                            onChanged: (v) => setState(() {
                              searchTerm = v;
                              page = 0;
                            }),
                            decoration: InputDecoration(
                              hintText: 'Search rentals…',
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
                      'No rental properties found.',
                      style: TextStyle(color: Colors.white54),
                    ),
                  )
                : RefreshIndicator(
                    onRefresh: _load,
                    color: kPurple,
                    child: ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: pageItems.length + 2,
                      itemBuilder: (ctx, i) {
                        if (i == 0)
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 14),
                            child: Text(
                              'Properties for Rent (${filtered.length})',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          );
                        if (i == pageItems.length + 1)
                          return _Pagination(
                            current: page,
                            total: totalPages,
                            onPrev: page > 0
                                ? () => setState(() => page--)
                                : null,
                            onNext: page < totalPages - 1
                                ? () => setState(() => page++)
                                : null,
                          );
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 14),
                          child: ApiPropertyCard(property: pageItems[i - 1]),
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

class _Pagination extends StatelessWidget {
  final int current, total;
  final VoidCallback? onPrev, onNext;
  const _Pagination({
    required this.current,
    required this.total,
    this.onPrev,
    this.onNext,
  });

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 16),
    child: Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        IconButton(
          onPressed: onPrev,
          icon: const Icon(Icons.arrow_back_ios, size: 18),
          color: onPrev != null ? Colors.white : Colors.white24,
        ),
        Text(
          '${current + 1} / $total',
          style: const TextStyle(color: Colors.white70),
        ),
        IconButton(
          onPressed: onNext,
          icon: const Icon(Icons.arrow_forward_ios, size: 18),
          color: onNext != null ? Colors.white : Colors.white24,
        ),
      ],
    ),
  );
}
