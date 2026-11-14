# Changelog

All notable changes to the MRBS specification will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial repository structure
- Contribution guidelines

### Changed
- None

### Deprecated
- None

### Removed
- None

### Fixed
- None

### Security
- None

---

## [1.1.0] - 2026-11-14

All additions are optional; every 1.0 brand system remains valid.

### Added
- Provenance and status (§4.5): `$status` (`official` | `derived` | `proposed`), `$source`, `$derived_from` on any value; manifest `provenance` defaults.
  Agents must not present `proposed` values as the owner's identity.
- Brand architecture (§4.6): `brand_architecture` with `role` (`standalone` | `master` | `member`), `parent`, `inherits`, `assigned`, `members` — for brand families where a master brand assigns values to member brands.
- Colour systems (§5.2.1): `color_systems` on colour tokens (RGB, CMYK coated/uncoated, Pantone, NCS, RAL, film, per-medium hex).
- Typeface contexts (§5.3.1): `contexts` and `rationale` on `font_family` entries.
- External and restricted assets (§7.1.1): `external` (`href`, `owner`, `rights`) instead of `file`; per-variant `minimum_size` object.
- Provenance validation (§11.2.1).

---

## [1.0.0] - 2025-01-15

### Added

#### Core Specification
- `brand.manifest.json` — Master index format for brand systems
- Design tokens specification (colors, typography, spacing, effects)
- Voice and tone guidelines format
- Template manifest format for presentations, documents, and emails
- Rules and constraints format (do's/don'ts, accessibility, legal)

#### Schema Files
- `brand.manifest.schema.json` — JSON Schema for manifest validation
- `colors.tokens.schema.json` — JSON Schema for color tokens
- `typography.tokens.schema.json` — JSON Schema for typography tokens
- `voice-tone.schema.json` — JSON Schema for voice guidelines

#### Documentation
- Getting started guide
- Migration guide (PDF brandbook to MRBS)
- AI integration patterns (MCP, REST API, system prompts)

#### Example Implementation
- Complete neutral reference implementation in `/example`
- Correct and incorrect usage examples

#### Tools
- Basic JSON Schema validator
- Manifest structure validator

### Notes
- Initial public release
- Specification designed for compatibility with W3C Design Tokens format
- MCP integration patterns included for AI agent use

---

## Version History Summary

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2025-01-15 | Initial specification release |

---

## Versioning Policy

MRBS follows [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes to schema structure
- **MINOR** (0.X.0): New features, backward-compatible additions
- **PATCH** (0.0.X): Bug fixes, documentation improvements

### Backward Compatibility

We strive to maintain backward compatibility within major versions:

- New optional fields may be added in minor versions
- Required fields will not be added in minor versions
- Existing field semantics will not change in minor versions
- Deprecations will be announced at least one minor version before removal

[Unreleased]: https://github.com/MRBSystem/MRBS-Specification/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/MRBSystem/MRBS-Specification/releases/tag/v1.0.0
