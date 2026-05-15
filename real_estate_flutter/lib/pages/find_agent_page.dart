import 'package:flutter/material.dart';

import '../services/firebase_service.dart';
import '../widgets/ui_blocks.dart';

class FindAgentPage extends StatefulWidget {
  const FindAgentPage({super.key});

  @override
  State<FindAgentPage> createState() => _FindAgentPageState();
}

class _FindAgentPageState extends State<FindAgentPage> {
  static const Color kPurple = Color(0xFF703BF7);
  static const Color kBg = Color(0xFF121212);
  static const Color kCard = Color(0xFF1A1A1A);
  static const Color kInput = Color(0xFF252525);

  final TextEditingController searchc = TextEditingController();
  String searchTerm = '';
  bool loading = true;
  List<Map<String, dynamic>> agents = [];

  List<Map<String, dynamic>> get filtered {
    final q = searchTerm.toLowerCase();
    return agents.where((agent) {
      final name = (agent['name'] ?? '').toString().toLowerCase();
      final role = (agent['role'] ?? '').toString().toLowerCase();
      return q.isEmpty || name.contains(q) || role.contains(q);
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
      final data = await FirebaseService.getAgents();
      if (!mounted) return;
      setState(() {
        agents = data;
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
      body: RefreshIndicator(
        onRefresh: _load,
        color: kPurple,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                color: kBg,
                padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
                child: Column(
                  children: [
                    const Text(
                      'Find a Real Estate Agent',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Connect with experienced agents in your area',
                      style: TextStyle(color: Colors.white54, fontSize: 14),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 20),
                    Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: kCard,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        children: [
                          TextField(
                            controller: searchc,
                            style: const TextStyle(color: Colors.white),
                            onChanged: (v) => setState(() => searchTerm = v),
                            decoration: InputDecoration(
                              hintText: 'Search by name or role…',
                              hintStyle: const TextStyle(color: Colors.white38),
                              filled: true,
                              fillColor: kInput,
                              prefixIcon: const Icon(
                                Icons.search,
                                color: Colors.white38,
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide.none,
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: const BorderSide(
                                  color: kPurple,
                                  width: 2,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 14),
                          SizedBox(
                            width: double.infinity,
                            height: 46,
                            child: ElevatedButton(
                              onPressed: () => setState(() {}),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: kPurple,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: const Text(
                                'Find Agents',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 4,
                ),
                child: Text(
                  loading
                      ? 'Loading agents from Firestore...'
                      : 'Showing ${filtered.length} of ${agents.length} agents',
                  style: const TextStyle(color: Colors.white38, fontSize: 12),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: loading
                    ? const Padding(
                        padding: EdgeInsets.all(40),
                        child: Center(
                          child: CircularProgressIndicator(color: kPurple),
                        ),
                      )
                    : filtered.isEmpty
                    ? const Center(
                        child: Padding(
                          padding: EdgeInsets.all(32),
                          child: Text(
                            'No agents found matching your criteria.',
                            style: TextStyle(color: Colors.white54),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      )
                    : Column(
                        children: filtered
                            .map(
                              (agent) => Padding(
                                padding: const EdgeInsets.only(bottom: 12),
                                child: AgentCard(item: agent),
                              ),
                            )
                            .toList(),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
