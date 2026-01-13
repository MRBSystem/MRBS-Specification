# Incorrect Examples (Anti-Patterns)

This directory contains examples of brand violations with explanations of what's wrong.

## Purpose

These examples help:
- AI agents recognize and avoid common mistakes
- Designers understand what NOT to do
- Validation tools identify violations

## Contents

### Logo Violations

| File | Violation | Explanation |
|------|-----------|-------------|
| `logo-rotated.png` | Rotation | Logo must not be rotated at any angle |
| `logo-wrong-colors.png` | Color alteration | Logo colors cannot be changed |
| `logo-no-clearspace.png` | Clear space violation | Other elements too close to logo |
| `logo-stretched.png` | Aspect ratio | Logo stretched/compressed |
| `logo-effects.png` | Added effects | No shadows, glows, or outlines |
| `logo-busy-background.png` | Background | Logo on cluttered background |

### Color Violations

| File | Violation | Explanation |
|------|-----------|-------------|
| `color-low-contrast.png` | Contrast | Text doesn't meet 4.5:1 ratio |
| `color-wrong-pairing.png` | Prohibited pair | Primary + Secondary used together |
| `color-off-brand.png` | Wrong colors | Colors not from brand palette |

### Typography Violations

| File | Violation | Explanation |
|------|-----------|-------------|
| `type-wrong-font.png` | Wrong font | Non-brand font used |
| `type-hierarchy-broken.png` | Hierarchy | H1 → H3 (skipped H2) |
| `type-too-many-fonts.png` | Font count | More than 2 font families |
| `type-heading-for-body.png` | Wrong usage | Heading font used for body text |
| `type-justified.png` | Alignment | Justified body text |

### Presentation Violations

| File | Violation | Explanation |
|------|-----------|-------------|
| `slide-too-many-bullets.png` | Content overload | More than 6 bullets |
| `slide-wall-of-text.png` | Too much text | Exceeds word limit |
| `slide-inconsistent.png` | Template deviation | Custom styling vs. template |
| `slide-poor-image.png` | Image quality | Low resolution image |

### Voice Violations

| File | Violation | Explanation |
|------|-----------|-------------|
| `voice-formal-contractions.md` | Wrong tone | Contractions in formal context |
| `voice-jargon.md` | Vocabulary | Prohibited jargon terms |
| `voice-aggressive.md` | Tone | Pushy/salesy language |

## How to Use

### For AI Agents

```
IF output matches any incorrect example pattern:
  - Identify the specific violation
  - Reference the corresponding rule
  - Regenerate following correct guidelines
```

### For Validation

Each incorrect example can be mapped to a specific rule:

```yaml
logo-rotated.png:
  rule: "rules/constraints.yaml#logo.modifications.prohibited[0]"
  violation: "rotate"
  severity: "high"
```

## Structure of Each Example

Each example file should be accompanied by metadata (when possible):

```
[filename].png
[filename].meta.yaml  # Explanation of what's wrong
```

Example meta file:
```yaml
violation:
  type: "logo_rotation"
  rule_reference: "rules/constraints.yaml#logo.dont"
  severity: "high"
  explanation: "The logo has been rotated 15°. Logos must always appear level."
  correct_approach: "Use the original logo file without any rotation"
```

## Adding New Examples

When documenting new violations:

1. Create the visual showing the mistake
2. Add metadata explaining the violation
3. Reference the specific rule being broken
4. Update this README
5. Consider adding corresponding correct example

## Note

These examples exist to teach what to avoid. Never use these as templates!
