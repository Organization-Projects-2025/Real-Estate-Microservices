import 'dart:typed_data';

Future<String> savePickedThumbnail(dynamic file, {String? filenameHint}) async {
  throw UnsupportedError(
    'Local thumbnail storage is not available on this platform.',
  );
}

Future<Uint8List?> readThumbnailBytes(String relativePath) async {
  return null;
}

Future<String?> resolveThumbnailPath(String relativePath) async {
  return null;
}
