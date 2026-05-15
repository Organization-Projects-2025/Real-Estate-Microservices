import 'package:flutter/material.dart';
import '../services/api_service.dart';

class SellPage extends StatefulWidget {
  final VoidCallback? onAuthChanged;
  const SellPage({super.key, this.onAuthChanged});

  @override
  State<SellPage> createState() => _SellPageState();
}

class _SellPageState extends State<SellPage> {
  static const Color kPurple = Color(0xFF703BF7);
  static const Color kBg = Color(0xFF121212);
  static const Color kInput = Color(0xFF1A1A1A);

  int step = 0;
  static const List<String> steps = [
    'Basic Info',
    'Address & Area',
    'Price',
    'Features',
  ];

  // Step 0
  final TextEditingController titlec = TextEditingController();
  final TextEditingController descc = TextEditingController();
  String listingType = 'sale';
  String propertyType = 'residential';
  String subType = 'apartment';

  // Step 1
  final TextEditingController streetc = TextEditingController();
  final TextEditingController cityc = TextEditingController();
  final TextEditingController statec = TextEditingController();
  final TextEditingController countryc = TextEditingController();
  final TextEditingController sqftc = TextEditingController();
  final TextEditingController sqmc = TextEditingController();

  // Step 2
  final TextEditingController pricec = TextEditingController();
  String status = 'active';

  // Step 3
  final TextEditingController bedsc = TextEditingController();
  final TextEditingController bathsc = TextEditingController();
  final TextEditingController garagec = TextEditingController();
  String furnished = 'none';
  bool pool = false, yard = false, pets = false;
  bool wifi = false, security = false, ac = false;
  bool internet = false, electricity = false, water = false, gas = false;

  bool submitting = false;
  bool submitted = false;
  String submitError = '';

  @override
  void dispose() {
    for (final c in [
      titlec,
      descc,
      streetc,
      cityc,
      statec,
      countryc,
      sqftc,
      sqmc,
      pricec,
      bedsc,
      bathsc,
      garagec,
    ]) {
      c.dispose();
    }
    super.dispose();
  }

  InputDecoration _dec(String hint) => InputDecoration(
    hintText: hint,
    hintStyle: const TextStyle(color: Colors.white38),
    filled: true,
    fillColor: kInput,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: BorderSide.none,
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: const BorderSide(color: kPurple, width: 2),
    ),
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
  );

  Future<void> _submit() async {
    if (!ApiService.isLoggedIn) {
      setState(() => submitError = 'You must be logged in to list a property.');
      return;
    }

    setState(() {
      submitting = true;
      submitError = '';
    });

    final payload = {
      'title': titlec.text.trim(),
      'description': descc.text.trim(),
      'listingType': listingType,
      'propertyType': propertyType,
      'subType': subType,
      'address': {
        'street': streetc.text.trim(),
        'city': cityc.text.trim(),
        'state': statec.text.trim(),
        'country': countryc.text.trim(),
      },
      'area': {
        'sqft': int.tryParse(sqftc.text) ?? 0,
        'sqm': int.tryParse(sqmc.text) ?? 0,
      },
      'price': int.tryParse(pricec.text) ?? 0,
      'media': <String>[], // image upload not available in web demo
      'status': status,
      'user': ApiService.currentUser?['_id'] ?? '',
      'features': {
        'bedrooms': int.tryParse(bedsc.text) ?? 0,
        'bathrooms': int.tryParse(bathsc.text) ?? 0,
        'garage': int.tryParse(garagec.text) ?? 0,
        'pool': pool,
        'yard': yard,
        'pets': pets,
        'furnished': furnished,
        'airConditioning': ac,
        'internet': internet,
        'electricity': electricity,
        'water': water,
        'gas': gas,
        'wifi': wifi,
        'security': security,
      },
    };

    try {
      final result = await ApiService.createProperty(payload);
      if (!mounted) return;
      if (result['status'] == 'success' || result['data'] != null) {
        setState(() {
          submitted = true;
          submitting = false;
        });
      } else {
        setState(() {
          submitError =
              result['message'] as String? ?? 'Failed to create property';
          submitting = false;
        });
      }
    } catch (e) {
      if (mounted)
        setState(() {
          submitError = 'Could not connect to server.';
          submitting = false;
        });
    }
  }

  Widget _buildStep() {
    switch (step) {
      case 0:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: titlec,
              style: const TextStyle(color: Colors.white),
              decoration: _dec('Listing Title'),
            ),
            const SizedBox(height: 14),
            TextField(
              controller: descc,
              style: const TextStyle(color: Colors.white),
              maxLines: 4,
              decoration: _dec('Detailed Description'),
            ),
            const SizedBox(height: 14),
            _DropdownField(
              label: 'Listing Type',
              value: listingType,
              items: const {'sale': 'Sale', 'rent': 'Rent'},
              onChanged: (v) => setState(() => listingType = v!),
            ),
            const SizedBox(height: 14),
            _DropdownField(
              label: 'Property Type',
              value: propertyType,
              items: const {
                'residential': 'Residential',
                'commercial': 'Commercial',
              },
              onChanged: (v) => setState(() => propertyType = v!),
            ),
            const SizedBox(height: 14),
            _DropdownField(
              label: 'Sub-Type',
              value: subType,
              items: const {
                'apartment': 'Apartment',
                'villa': 'Villa',
                'house': 'House',
                'condo': 'Condo',
                'townhouse': 'Townhouse',
              },
              onChanged: (v) => setState(() => subType = v!),
            ),
          ],
        );

      case 1:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: streetc,
              style: const TextStyle(color: Colors.white),
              decoration: _dec('Street Address'),
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: cityc,
                    style: const TextStyle(color: Colors.white),
                    decoration: _dec('City'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: statec,
                    style: const TextStyle(color: Colors.white),
                    decoration: _dec('State'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            TextField(
              controller: countryc,
              style: const TextStyle(color: Colors.white),
              decoration: _dec('Country'),
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: sqftc,
                    style: const TextStyle(color: Colors.white),
                    keyboardType: TextInputType.number,
                    decoration: _dec('Area (sqft)'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: sqmc,
                    style: const TextStyle(color: Colors.white),
                    keyboardType: TextInputType.number,
                    decoration: _dec('Area (sqm)'),
                  ),
                ),
              ],
            ),
          ],
        );

      case 2:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Media note
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: kPurple.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: kPurple.withValues(alpha: 0.3)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.info_outline, color: kPurple, size: 18),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Image upload requires Appwrite storage. Property will be created without images.',
                      style: TextStyle(color: Colors.white60, fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),
            TextField(
              controller: pricec,
              style: const TextStyle(color: Colors.white),
              keyboardType: TextInputType.number,
              decoration: _dec('Listing Price (\$)'),
            ),
            const SizedBox(height: 14),
            _DropdownField(
              label: 'Status',
              value: status,
              items: const {'active': 'Active', 'sold': 'Sold'},
              onChanged: (v) => setState(() => status = v!),
            ),
          ],
        );

      case 3:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: bedsc,
                    style: const TextStyle(color: Colors.white),
                    keyboardType: TextInputType.number,
                    decoration: _dec('Bedrooms'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: bathsc,
                    style: const TextStyle(color: Colors.white),
                    keyboardType: TextInputType.number,
                    decoration: _dec('Bathrooms'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: garagec,
                    style: const TextStyle(color: Colors.white),
                    keyboardType: TextInputType.number,
                    decoration: _dec('Garage Spaces'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _DropdownField(
                    label: 'Furnished',
                    value: furnished,
                    items: const {
                      'fully': 'Fully Furnished',
                      'partly': 'Partly Furnished',
                      'none': 'Unfurnished',
                    },
                    onChanged: (v) => setState(() => furnished = v!),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Text(
              'Amenities & Features',
              style: TextStyle(
                color: Colors.white70,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                _CheckChip(
                  label: 'Pool',
                  value: pool,
                  onChanged: (v) => setState(() => pool = v),
                ),
                _CheckChip(
                  label: 'Yard',
                  value: yard,
                  onChanged: (v) => setState(() => yard = v),
                ),
                _CheckChip(
                  label: 'Pets',
                  value: pets,
                  onChanged: (v) => setState(() => pets = v),
                ),
                _CheckChip(
                  label: 'WiFi',
                  value: wifi,
                  onChanged: (v) => setState(() => wifi = v),
                ),
                _CheckChip(
                  label: 'Security',
                  value: security,
                  onChanged: (v) => setState(() => security = v),
                ),
                _CheckChip(
                  label: 'A/C',
                  value: ac,
                  onChanged: (v) => setState(() => ac = v),
                ),
                _CheckChip(
                  label: 'Internet',
                  value: internet,
                  onChanged: (v) => setState(() => internet = v),
                ),
                _CheckChip(
                  label: 'Electricity',
                  value: electricity,
                  onChanged: (v) => setState(() => electricity = v),
                ),
                _CheckChip(
                  label: 'Water',
                  value: water,
                  onChanged: (v) => setState(() => water = v),
                ),
                _CheckChip(
                  label: 'Gas',
                  value: gas,
                  onChanged: (v) => setState(() => gas = v),
                ),
              ],
            ),
          ],
        );

      default:
        return const SizedBox.shrink();
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!ApiService.isLoggedIn) {
      return Scaffold(
        backgroundColor: kBg,
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.lock_outline, color: kPurple, size: 60),
                const SizedBox(height: 16),
                const Text(
                  'Sign in to list a property',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                const Text(
                  'You must be logged in to create a property listing.',
                  style: TextStyle(color: Colors.white54),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () => Navigator.pushNamed(context, '/login'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: kPurple,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Sign In',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    if (submitted) {
      return Scaffold(
        backgroundColor: kBg,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.check_circle, color: kPurple, size: 72),
              const SizedBox(height: 16),
              const Text(
                'Property Listed!',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Your property has been saved to MongoDB.',
                style: TextStyle(color: Colors.white60),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => setState(() {
                  submitted = false;
                  step = 0;
                }),
                style: ElevatedButton.styleFrom(
                  backgroundColor: kPurple,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text('List Another'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: kBg,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 16),
            ShaderMask(
              shaderCallback: (b) => const LinearGradient(
                colors: [kPurple, Colors.white],
              ).createShader(b),
              child: const Text(
                'List Your Property',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Step indicator
            Row(
              children: List.generate(steps.length, (i) {
                final active = i <= step;
                return Expanded(
                  child: Column(
                    children: [
                      Container(
                        height: 4,
                        margin: const EdgeInsets.symmetric(horizontal: 2),
                        decoration: BoxDecoration(
                          color: active ? kPurple : Colors.white12,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        steps[i],
                        style: TextStyle(
                          fontSize: 9,
                          color: active ? kPurple : Colors.white38,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                );
              }),
            ),
            const SizedBox(height: 20),

            _buildStep(),

            if (submitError.isNotEmpty) ...[
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: Colors.red.withValues(alpha: 0.3)),
                ),
                child: Text(
                  submitError,
                  style: const TextStyle(color: Colors.redAccent),
                  textAlign: TextAlign.center,
                ),
              ),
            ],

            const SizedBox(height: 24),
            Row(
              children: [
                if (step > 0) ...[
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => setState(() => step--),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white,
                        side: const BorderSide(color: Colors.white24),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text('Back'),
                    ),
                  ),
                  const SizedBox(width: 12),
                ],
                Expanded(
                  child: ElevatedButton(
                    onPressed: submitting
                        ? null
                        : () {
                            if (step < steps.length - 1) {
                              setState(() => step++);
                            } else {
                              _submit();
                            }
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: kPurple,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: submitting
                        ? const SizedBox(
                            width: 22,
                            height: 22,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2.5,
                            ),
                          )
                        : Text(
                            step < steps.length - 1
                                ? 'Next'
                                : 'Submit to MongoDB',
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

class _DropdownField extends StatelessWidget {
  final String label, value;
  final Map<String, String> items;
  final ValueChanged<String?> onChanged;
  const _DropdownField({
    required this.label,
    required this.value,
    required this.items,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(label, style: const TextStyle(color: Colors.white70, fontSize: 13)),
      const SizedBox(height: 6),
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 14),
        decoration: BoxDecoration(
          color: const Color(0xFF1A1A1A),
          borderRadius: BorderRadius.circular(14),
        ),
        child: DropdownButtonHideUnderline(
          child: DropdownButton<String>(
            value: value,
            dropdownColor: const Color(0xFF252525),
            style: const TextStyle(color: Colors.white),
            isExpanded: true,
            items: items.entries
                .map(
                  (e) => DropdownMenuItem(value: e.key, child: Text(e.value)),
                )
                .toList(),
            onChanged: onChanged,
          ),
        ),
      ),
    ],
  );
}

class _CheckChip extends StatelessWidget {
  final String label;
  final bool value;
  final ValueChanged<bool> onChanged;
  const _CheckChip({
    required this.label,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: () => onChanged(!value),
    child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: value
            ? const Color(0xFF703BF7).withValues(alpha: 0.2)
            : const Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: value ? const Color(0xFF703BF7) : Colors.white12,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            value ? Icons.check_box : Icons.check_box_outline_blank,
            size: 16,
            color: value ? const Color(0xFF703BF7) : Colors.white38,
          ),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(
              color: value ? Colors.white : Colors.white60,
              fontSize: 12,
            ),
          ),
        ],
      ),
    ),
  );
}
