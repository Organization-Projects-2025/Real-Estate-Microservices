import 'dart:convert';
import 'dart:typed_data';
import 'dart:html' as html;

Future<String> savePickedThumbnail(dynamic file, {String? filenameHint}) async {
  final bytes = await file.readAsBytes() as Uint8List;
  final safeName = (filenameHint == null || filenameHint.trim().isEmpty)
      ? 'thumbnail'
      : filenameHint.replaceAll(RegExp(r'[^a-zA-Z0-9_-]'), '_');
  final relativePath =
      'thumbnails/${DateTime.now().millisecondsSinceEpoch}_$safeName';
  html.window.localStorage[relativePath] = base64Encode(bytes);
  return relativePath;
}

Future<Uint8List?> readThumbnailBytes(String relativePath) async {
  final encoded = html.window.localStorage[relativePath];
  if (encoded == null || encoded.isEmpty) return null;
  return base64Decode(encoded);
}

Future<String?> resolveThumbnailPath(String relativePath) async {
  return relativePath;
}
