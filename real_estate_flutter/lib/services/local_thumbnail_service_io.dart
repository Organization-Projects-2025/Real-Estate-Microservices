import 'dart:io';
import 'dart:typed_data';

import 'package:path_provider/path_provider.dart';

Future<String> savePickedThumbnail(dynamic file, {String? filenameHint}) async {
  final bytes = await file.readAsBytes() as Uint8List;
  final safeName = (filenameHint == null || filenameHint.trim().isEmpty)
      ? 'thumbnail.jpg'
      : filenameHint.replaceAll(RegExp(r'[^a-zA-Z0-9_.-]'), '_');
  final directory = await getApplicationDocumentsDirectory();
  final relativePath = 'thumbnails/$safeName';
  final target = File(
    '${directory.path}${Platform.pathSeparator}$relativePath',
  );
  await target.parent.create(recursive: true);
  await target.writeAsBytes(bytes, flush: true);
  return relativePath;
}

Future<Uint8List?> readThumbnailBytes(String relativePath) async {
  final file = await _resolveFile(relativePath);
  if (file == null || !await file.exists()) return null;
  return file.readAsBytes();
}

Future<String?> resolveThumbnailPath(String relativePath) async {
  final file = await _resolveFile(relativePath);
  return file?.path;
}

Future<File?> _resolveFile(String relativePath) async {
  final directory = await getApplicationDocumentsDirectory();
  final file = File('${directory.path}${Platform.pathSeparator}$relativePath');
  return file;
}
