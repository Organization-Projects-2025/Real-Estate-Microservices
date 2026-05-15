# Flutter Coding Style and Structure Guide for AI Agents

This document captures the dominant coding style, structure, and implementation patterns found in the analyzed source material. It is intended for an AI agent that must generate new Flutter code in the same style and with the same instructional structure.

## Purpose

Use this guide when generating Flutter/Dart code that should resemble the source material in naming, layout choices, UI composition, and teaching-oriented progression. The source emphasizes compact examples, direct widget composition, repeated milestone-based increments, and practical state-driven UI patterns.[file:1]

## Source Profile

The analyzed material is a Flutter teaching corpus focused on mobile UI, interactivity, navigation, local storage, JSON, models, and introductory backend/Firebase usage. The code style is educational rather than production-grade, favoring short examples, inline widget trees, and incremental milestones over abstraction-heavy architecture.[file:1]

## Core Style Rules

### 1. Prefer minimal runnable examples

Generated code should usually start from a directly runnable Flutter snippet with `import 'package:flutter/material.dart';`, `main()`, `runApp(...)`, and a top-level widget such as `MaterialApp` and `Scaffold`. Examples are commonly self-contained and focused on one concept at a time.[file:1]

### 2. Build UI inline first

The dominant style writes widget trees inline inside `build(BuildContext context)` rather than extracting many helper widgets early. Use direct composition with `Scaffold`, `AppBar`, `Center`, `Padding`, `Column`, `Row`, `Container`, `SingleChildScrollView`, and `Image` before introducing abstractions.[file:1]

### 3. Teach progressively through milestones

Code should evolve one concept at a time. A new example usually changes only one or two ideas, such as adding `AppBar`, then theme, then colors, then alignment, then scrolling, then dynamic generation.[file:1]

### 4. Use StatefulWidget for interaction

Whenever user input, timers, navigation state, selected items, or changing data appear, prefer `StatefulWidget` with `setState(...)`. Stateless widgets are used for static UI or reusable presentational pieces.[file:1]

### 5. Keep examples visually explicit

Prefer readable widget nesting over compact helper abstractions when teaching layout. Explicit `SizedBox`, `Padding`, `Container`, and `Row`/`Column` combinations are common, especially when demonstrating spacing and alignment.[file:1]

## Naming Conventions

### App and page names

Use short instructional names like `App01`, `MyApp`, `Page01`, `page0`, `page1`, `page2`, and `SplashScreen` when the goal is demonstration. In data-driven examples, semantic names such as `StaffRow`, `StaffCard`, and `StaffData` are preferred.[file:1]

### Variables

Use short variable names in simple demos, such as `ls`, `t`, `T`, `pc`, `v`, `m`, `url`, and `index`. For form controllers, use suffix `c`, such as `namec`, `idc`, `emailc`, `deptc`, and `imagec`.[file:1]

### Data fields

Map-based records often use capitalized string keys like `ID`, `Name`, `Email`, `Dept`, and `Image`. Typed models use lowerCamelCase fields like `id`, `name`, `email`, `dept`, and `image`.[file:1]

### Functions

Use short descriptive names such as `printText`, `displayImages`, `staffRow`, `startTimer`, `stopTimer`, `goNext`, `goPrev`, `loadData`, and `pages`. Function names are generally lowerCamelCase.[file:1]

## Structural Patterns

### Basic app shell

Most examples follow this shape:

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const App01());
}

class App01 extends StatelessWidget {
  const App01({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('App 01')),
        body: const Center(
          child: Text('Hello World'),
        ),
      ),
    );
  }
}
```

This minimal shell is the default starting point for introductory examples.[file:1]

### Layout composition

Prefer this progression when generating layout examples:

1. `Text`
2. `Center`
3. `Padding`
4. `Column` or `Row`
5. `SingleChildScrollView`
6. `Container` with decoration
7. Responsive sizing with `MediaQuery`
8. Dynamic widget generation from loops or lists[ file:1]

### Dynamic lists

When generating repeated widgets, return `List<Widget>` from a function or use `.map(...).toList()` or `ListView.builder`. This pattern appears repeatedly for text lists, image lists, selectable options, and profile screens.[file:1]

## UI Conventions

### Text styling

Use `TextStyle` inline with explicit `fontSize`, `fontWeight`, and `color`. Large visible font sizes are common in examples to make behavior obvious, sometimes even intentionally large to demonstrate wrapping or overflow.[file:1]

### Spacing

Use `SizedBox(height: ...)`, `SizedBox(width: ...)`, and `Padding(...)` instead of complex spacing systems. `EdgeInsets.all(...)`, `EdgeInsets.only(...)`, and `EdgeInsets.symmetric(...)` are preferred.[file:1]

### Alignment

Use `mainAxisAlignment` and `crossAxisAlignment` explicitly in `Column` and `Row`. The source often demonstrates `start`, `center`, `end`, `spaceAround`, `spaceBetween`, and `spaceEvenly` as separate focused examples.[file:1]

### Scroll behavior

Use `SingleChildScrollView` to prevent overflow for long columns, forms, image lists, and text-heavy content. For horizontal overflow in rows, use `SingleChildScrollView(scrollDirection: Axis.horizontal, ...)`.[file:1]

### Responsiveness

Use `MediaQuery.of(context).size.width` and `.height` directly inside widgets to size images, avatars, sheets, and proportional row containers. The source prefers simple proportional calculations over layout builders or advanced responsive frameworks.[file:1]

## State Management Rules

### Default mechanism

Use `setState(...)` as the default and expected state management approach. This applies to text input, selected values, checkbox toggles, timer updates, current profile index, page selection, and loaded data.[file:1]

### Controllers

Use `TextEditingController` for editable input fields. For edit forms, prefill controller values before opening a modal sheet; after save or cancel, clear controllers to avoid stale data.[file:1]

### Index-driven UI

Many examples depend on an integer `index` to navigate a list of records or images. Generated code should preserve safe wrap-around behavior when moving next or previous.[file:1]

Preferred patterns:

```dart
index = (index + 1) % staff.length;
```

```dart
index--;
if (index < 0) index = staff.length - 1;
```

These patterns are central to the source style.[file:1]

## Reusable Patterns

### Repeated row helper

For profile-style UIs, use a reusable row representation with a label on the left and value on the right. This may be implemented either as a function like `staffRow(...)` or a presentational `StatelessWidget` like `StaffRow`.[file:1]

### Modal selection UIs

Use `showModalBottomSheet(...)` with `Builder` when context access matters. Common bottom-sheet contents include `ListView.builder`, `RadioListTile`, forms with `TextField`, or informational text.[file:1]

### Feedback

Use `ScaffoldMessenger.of(context).showSnackBar(...)` for save/load success, error messages, or state notifications like timer changes.[file:1]

### Gesture-based interaction

For image-driven examples, wrap content in `GestureDetector` and support `onTap`, `onDoubleTap`, and `onHorizontalDragEnd` to cycle through items.[file:1]

## Data Style

### Early-stage data modeling

Use `Map<String, dynamic>` for introductory data examples, especially when teaching JSON-like structures or quick UI binding. Keys are usually capitalized strings such as `ID`, `Name`, `Email`, `Dept`, and `Image`.[file:1]

### Preferred evolution path

When moving to cleaner structure, introduce a class-based model such as `Staff2` with nullable string fields and a constructor. Later examples may convert lists of maps into lists of objects for stronger semantics and easier UI binding.[file:1]

### Serialization

For save/load examples, use `jsonEncode(...)`, `jsonDecode(...)`, and file operations from `dart:io`. For model-based examples, convert objects into maps before encoding and reconstruct objects after decoding.[file:1]

## Navigation Style

### Bottom navigation

Use `BottomNavigationBar` with a `pageIndex` integer and a `pages(...)` helper function. Labels and icons are explicit and simple, such as Cards, Images, and Data.[file:1]

### PageView

Use a class-level `PageController` and update `pageIndex` in `onPageChanged`. Include helper methods like `goNext()` and `goPrev()` for programmatic navigation.[file:1]

### Named routes

Use `MaterialApp(initialRoute: ..., routes: ...)` for route-based demos. Navigation is generally shown with `Navigator.pushNamed(...)`, `Navigator.pop(...)`, and `Navigator.pushReplacementNamed(...)` for splash-to-main transitions.[file:1]

## Preferred Agent Output Style

When generating code in this style, follow these rules:

- Output a complete Flutter snippet when possible.
- Keep examples focused on one concept.
- Prefer direct widget trees over advanced abstractions.
- Use `const` where easy and obvious.
- Avoid external state-management libraries unless explicitly requested.
- Favor readability and teaching clarity over production architecture.
- Use common Flutter core widgets before introducing advanced APIs.
- Preserve the educational progression from simple to slightly more advanced examples.[file:1]

## Anti-Patterns to Avoid

Do not default to these unless the user explicitly asks for them:

- Clean architecture layers, repositories, services, and dependency injection.
- Riverpod, Bloc, Provider, Redux, or other advanced state tools.
- Over-engineered folder structures.
- Highly abstract reusable systems for very small examples.
- Excessive comments inside code if the request expects direct snippet output.[file:1]

## Agent Instruction Template

Use the following operating rules when writing new code:

```md
- Generate Flutter code in a teaching-oriented style.
- Start with the smallest complete example that demonstrates the requested concept.
- Use MaterialApp + Scaffold as the default shell.
- Use StatefulWidget whenever the UI changes through input, selection, timers, navigation, or loaded data.
- Prefer inline widget composition with Column, Row, Container, Padding, SizedBox, Center, and SingleChildScrollView.
- Use MediaQuery for simple responsive sizing.
- For repeated UI, either return List<Widget> from a function or create a small StatelessWidget.
- Use setState for all state updates unless a different method is explicitly requested.
- For forms, use TextEditingController variables ending with c.
- For record navigation, maintain an integer index with safe wrap-around.
- For modal interactions, prefer showModalBottomSheet with Builder when context is needed.
- For feedback, use ScaffoldMessenger and SnackBar.
- Keep code compact, readable, and ready to paste into a Flutter project.
```

## Inferred Style Summary

The source material teaches Flutter through direct, incremental, stateful examples. The closest match is a classroom-oriented style that values simplicity, visible widget composition, repeated UI patterns, and beginner-friendly progression more than strict production engineering.[file:1]
