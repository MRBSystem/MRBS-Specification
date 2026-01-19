# MRBS Documentation Standards

**Machine-Readable Brand System - Documentation Requirements and Templates**

Version: 1.0
Status: Final
Updated: 2025-01-19

---

## Required Documentation Files

### 1. README.md (Root Level)

**Template:**
```markdown
# {Brand Name} - Machine-Readable Brand System

[![MRBS Version](https://img.shields.io/badge/MRBS-v1.0.0-blue.svg)](https://mrbs.dev)
[![Brand Version](https://img.shields.io/badge/Brand-v{X.Y.Z}-green.svg)]()

**AI-ready brand identity system for {Organization}**

## Quick Reference

**Primary Color:** {#HEXCODE}
**Fonts:** {Heading Font}, {Body Font}
**Tagline:** "{Tagline}"

## Usage

### For AI Systems
```python
from mrbs import load_brand
brand = load_brand('.')
```

### For Designers
- Colors: `visual/colors.tokens.json`
- Typography: `visual/typography.tokens.json`
- Templates: `templates/`

### For Developers
```javascript
import tokens from '@brand/mrbs/dist/tokens.json';
```

## Structure

```
brand-system/
├── brand.manifest.json    # Entry point
├── identity/              # Voice, values, messaging
├── visual/                # Colors, typography, spacing
├── rules/                 # Constraints, accessibility
├── assets/                # Logos, images
└── templates/             # Presentation, document templates
```

## Validation

```bash
python tools/validator.py .
```

## Contact

**Brand Manager:** {Name} ({email})
**Repository:** {URL}
**Documentation:** {URL}

## License

{License information}
```

---

### 2. CHANGELOG.md

Follow [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
# Changelog

All notable changes to this brand system are documented here.

## [Unreleased]

### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security

## [2.1.0] - 2025-01-19

### Added
- New semantic color tokens for data visualization
- Spacing tokens for presentation layouts

### Changed
- Updated primary color from #0066CC to #0052A3 (better contrast)

### Fixed
- Typography line-height values now consistent across all sizes

## [2.0.0] - 2024-12-01

### Changed
- **BREAKING**: Renamed `color.primary` to `color.brand.primary`
- **BREAKING**: Moved `brand/colors.json` to `visual/colors.tokens.json`

### Migration
See [MIGRATION-v2.md](./MIGRATION-v2.md) for upgrade guide.

[Unreleased]: https://github.com/org/brand/compare/v2.1.0...HEAD
[2.1.0]: https://github.com/org/brand/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/org/brand/releases/tag/v2.0.0
```

---

### 3. CLAUDE.md or AI-INSTRUCTIONS.md

**Template:**
```markdown
# {Brand Name} — AI Agent Instructions

## Brand Overview

{Organization Name} is {brief description}.

**Mission:** {Mission statement}
**Values:** {Core values}

## Key Brand Elements

### Visual Identity
- **Primary Color:** {color} - Use for {usage}
- **Fonts:** {heading font} for headings, {body font} for body text
- **Spacing:** 8px base unit, use multiples

### Voice & Tone
- {Core attribute 1}
- {Core attribute 2}
- {Core attribute 3}

**Context-specific:**
- Formal communications: {tone description}
- Casual communications: {tone description}

## Language Requirements

**Primary language:** {language code}
**Character support required:** {special characters}

## Do's and Don'ts

### Colors
✓ Use primary color for CTAs and headings
✗ Don't use primary color for body text

### Typography
✓ Use 16px minimum for body text
✗ Don't use more than 2 font families

### Content
✓ Use active voice
✗ Avoid jargon and technical terms

## Validation Checklist

When generating content, verify:
- [ ] Colors are from brand palette
- [ ] Fonts match brand typography
- [ ] Tone matches context
- [ ] Accessibility requirements met
- [ ] Required disclaimers included (if applicable)

## Examples

### Good Example
{Example of brand-compliant content}

### Bad Example
{Example of what to avoid}

## Resources

- Full specification: `brand.manifest.json`
- Colors: `visual/colors.tokens.json`
- Voice guidelines: `identity/voice-tone.yaml`
```

---

### 4. CONTRIBUTING.md (For Collaborative Brands)

```markdown
# Contributing to {Brand Name} MRBS

Thank you for your interest in improving our brand system!

## How to Contribute

1. **Open an issue** to discuss proposed changes
2. **Fork the repository**
3. **Create a branch** (`git checkout -b feature/my-change`)
4. **Make your changes** following our guidelines
5. **Run validation** (`python tools/validator.py .`)
6. **Commit with clear message** (see [Commit Guidelines](#commit-guidelines))
7. **Submit pull request**

## What to Contribute

We welcome:
- Bug fixes (incorrect values, broken references)
- Accessibility improvements
- Documentation improvements
- New templates or examples
- Tool improvements

Please discuss before:
- Major visual changes
- New color tokens
- Font changes
- Structural changes

## Code of Conduct

- Be respectful and constructive
- Focus on improving the brand system
- Follow existing patterns and conventions

## Development Setup

```bash
git clone https://github.com/org/brand.git
cd brand
npm install  # or pip install -r requirements.txt
```

## Testing

Before submitting:
```bash
# Validate JSON/YAML syntax
npm run validate:syntax

# Run MRBS validator
npm run validate:mrbs

# Check accessibility
npm run validate:accessibility
```

## Commit Guidelines

Format: `<type>(<scope>): <subject>`

Types: feat, fix, docs, style, refactor, test, chore

Examples:
- `feat(visual): add new color token for data viz`
- `fix(typography): correct line-height for headings`
- `docs(readme): update installation instructions`

## Questions?

Contact: {Brand Manager} ({email})
```

---

### 5. MIGRATION.md (For Major Versions)

```markdown
# Migration Guide: v{X}.x to v{Y}.0

## Overview

Version {Y}.0 introduces breaking changes. This guide helps you upgrade.

## Breaking Changes

### 1. Token Rename: `color.primary` → `color.brand.primary`

**Before:**
```json
{
  "$value": "{color.primary}"
}
```

**After:**
```json
{
  "$value": "{color.brand.primary}"
}
```

**Action Required:**
- Find/replace `{color.primary}` with `{color.brand.primary}` in all files
- Update any hardcoded references in code

### 2. File Moved: `brand/colors.json` → `visual/colors.tokens.json`

**Action Required:**
- Update import paths
- Rebuild generated token files

## Migration Script

We provide a migration script to automate most changes:

```bash
python tools/migrate-v{Y}.py /path/to/brand-system
```

## Manual Steps

1. Review diff of changed files
2. Test all templates still render correctly
3. Verify AI systems still load brand correctly
4. Run full validation suite

## Timeline

- **v{X}.5.0** (current): Deprecated old tokens, warnings in validator
- **v{Y}.0.0** (target): Old tokens removed, breaking changes take effect

## Support

Questions? Open an issue or contact {Brand Manager}.
```

---

## Inline Documentation

### Design Tokens

**Every token should have:**
- `description`: What it is and when to use it
- `usage`: Specific use cases (if applicable)
- `accessibility`: Contrast info (for colors)

**Example:**
```json
{
  "color": {
    "brand": {
      "primary": {
        "$value": "#0066CC",
        "$type": "color",
        "description": "Primary brand color representing trust and professionalism",
        "usage": {
          "recommended": ["headings", "cta_buttons", "links"],
          "prohibited": ["body_text", "large_backgrounds"]
        },
        "accessibility": {
          "wcag_level": "AA",
          "min_contrast_ratio": 4.5,
          "tested_combinations": [
            {
              "background": "#FFFFFF",
              "ratio": 4.8,
              "passes": ["AA", "AAA"]
            }
          ]
        },
        "emotional_association": ["trust", "professionalism", "stability"]
      }
    }
  }
}
```

### YAML Guidelines

**Use comments for non-obvious fields:**

```yaml
# Voice and Tone Guidelines
# How {Brand} communicates across all channels

voice:
  description: "Core voice attributes that remain consistent"

  # These define our fundamental communication style
  core_attributes:
    - "Professional and authoritative"  # We know our subject matter
    - "Educational and accessible"      # We explain clearly without jargon
    - "Environmentally conscious"       # Sustainability is core to our mission

  # Adjust tone based on communication context
  tone_by_context:
    customer_support:
      characteristics: ["empathetic", "helpful", "patient"]
      example: "I understand this is frustrating. Let me help you resolve this."

    marketing:
      characteristics: ["enthusiastic", "confident", "inspiring"]
      example: "Transform your workflow with our innovative solution."
```

---

## Code Examples

**Include practical examples:**

```markdown
## Creating a Presentation

```python
from mrbs import load_brand, create_presentation

# Load brand system
brand = load_brand('./acme-mrbs')

# Create presentation following brand guidelines
pres = create_presentation(
    template=brand.templates.presentation.layouts.content,
    tone=brand.voice_tone.professional
)

pres.add_title_slide(
    title="Q4 Results",
    subtitle=brand.tagline
)

pres.add_content_slide(
    title="Revenue Growth",
    bullets=[
        "30% increase YoY",
        "Expansion into 5 new markets",
        "Customer satisfaction at 94%"
    ],
    colors=brand.colors.data_visualization  # Use brand color palette
)

pres.save('q4-results.pptx')
```
\`\`\`

---

## File Format Conventions

### JSON Files

```json
{
  "indent": "2 spaces",
  "trailing_commas": false,
  "meta_fields": "Use $ prefix ($schema, $value, $type)",
  "key_format": "snake_case",
  "example": {
    "$schema": "https://mrbs.dev/schema/v1.0/colors.tokens.schema.json",
    "color": {
      "brand_primary": {
        "$value": "#0066CC",
        "$type": "color"
      }
    }
  }
}
```

### YAML Files

```yaml
indent: 2 spaces
quote_strings: "Only when necessary (special characters)"
comments: "Use for non-obvious fields"
grouping: "Group related fields under clear hierarchy"

example:
  name: "Example Brand"
  tagline: "Innovation for Tomorrow"
  values:
    - name: "Innovation"
      description: "We push boundaries"
```

### Markdown Files

```markdown
# One sentence per line
This improves git diffs.
Each sentence is on its own line.

# Reference-style links for repeated URLs
[MRBS Spec][spec]
[W3C Design Tokens][w3c-tokens]

[spec]: https://github.com/MRBSystem/MRBS-Specification
[w3c-tokens]: https://design-tokens.github.io/community-group/format/

# Code blocks must specify language
\`\`\`python
print("Hello, World!")
\`\`\`
```

---

## Accessibility Documentation

**Document accessibility conformance:**

```markdown
# Accessibility Statement

{Organization Name} is committed to digital accessibility.

## Conformance Level
WCAG 2.1 Level AA

## Testing
- Last tested: {Date}
- Tools used: {Tool names}
- Screen readers tested: NVDA, JAWS, VoiceOver

## Known Issues
{List any known accessibility issues}

## Feedback
{Contact information for accessibility feedback}
```

---

## Versioning Documentation

**In brand.manifest.json:**
```json
{
  "mrbs_version": "1.0.0",
  "version": "2.1.3",
  "updated": "2025-01-19",
  "changelog": "./CHANGELOG.md"
}
```

---

## Best Practices

1. **Be concise** - Provide essential information, link to details
2. **Include examples** - Show, don't just tell
3. **Keep updated** - Review docs quarterly
4. **Use clear language** - Avoid jargon
5. **Link between docs** - Create navigation paths
6. **Version control** - Track doc changes like code

---

## Documentation Checklist

Before releasing a brand system version:

```markdown
- [ ] README.md complete and current
- [ ] CHANGELOG.md updated with all changes
- [ ] CLAUDE.md / AI-INSTRUCTIONS.md present
- [ ] All tokens have descriptions
- [ ] Code examples tested and working
- [ ] Links verified (no 404s)
- [ ] Version numbers consistent across files
- [ ] Migration guide provided (if MAJOR version)
- [ ] Accessibility statement included
- [ ] Contact information current
```

---

## Conclusion

Good documentation makes MRBS usable and valuable. Follow these standards for consistency and clarity.

For questions, open an issue at the [MRBS repository](https://github.com/MRBSystem/MRBS-Specification).
