# Getting Started with MRBS

This guide will help you create your first Machine-Readable Brand System.

## Prerequisites

- Basic understanding of JSON and YAML formats
- Your existing brand guidelines (PDF, documents, or institutional knowledge)
- Text editor or IDE

## Quick Start (15 minutes)

### Step 1: Create Directory Structure

```bash
mkdir -p my-brand/{identity,visual,assets/logos,templates,rules}
```

### Step 2: Create the Manifest

Create `brand.manifest.json` at the root:

```json
{
  "$schema": "https://mrbs.dev/schema/v1/brand.manifest.json",
  "mrbs_version": "1.0.0",
  "version": "1.0.0",
  "updated": "2025-01-15",
  "brand": {
    "name": "Your Brand Name",
    "tagline": "Your tagline"
  },
  "components": {
    "visual": "./visual/",
    "identity": "./identity/",
    "rules": "./rules/"
  }
}
```

### Step 3: Define Your Colors

Create `visual/colors.tokens.json`:

```json
{
  "color": {
    "brand": {
      "primary": {
        "$value": "#YOUR_COLOR",
        "$type": "color",
        "usage": {
          "recommended": ["headings", "buttons"],
          "prohibited": ["body_text"]
        }
      }
    },
    "neutral": {
      "white": {"$value": "#FFFFFF"},
      "black": {"$value": "#000000"}
    }
  }
}
```

### Step 4: Add Voice Guidelines

Create `identity/voice-tone.yaml`:

```yaml
voice:
  core_attributes:
    - "Professional but approachable"
    - "Clear and direct"

tone_by_context:
  professional:
    use_for: ["presentations", "documents"]
    rules:
      contractions: limited
```

### Step 5: Validate

Run the validator (if available):

```bash
mrbs validate ./my-brand
```

Or manually check that all file paths in the manifest exist.

**Done!** You now have a basic MRBS-compliant brand system.

---

## Full Implementation Guide

### Phase 1: Audit Existing Assets

Before creating your MRBS, inventory what you have:

1. **Visual Elements**
   - [ ] Logo files (what formats? what variants?)
   - [ ] Color palette (hex values, usage rules)
   - [ ] Typography (font names, weights, sizes)
   - [ ] Icons, patterns, imagery guidelines

2. **Written Guidelines**
   - [ ] Voice and tone documentation
   - [ ] Writing style rules
   - [ ] Do's and don'ts

3. **Templates**
   - [ ] Presentation templates
   - [ ] Document templates
   - [ ] Email templates

### Phase 2: Structure the System

Create the full directory structure:

```
my-brand/
├── brand.manifest.json
├── identity/
│   ├── brand-values.yaml
│   ├── voice-tone.yaml
│   └── naming.yaml
├── visual/
│   ├── colors.tokens.json
│   ├── typography.tokens.json
│   ├── spacing.tokens.json
│   └── effects.tokens.json
├── assets/
│   ├── logos/
│   │   ├── manifest.json
│   │   ├── primary.svg
│   │   └── reversed.svg
│   └── icons/
├── templates/
│   └── presentation/
│       └── manifest.json
├── rules/
│   ├── constraints.yaml
│   └── accessibility.yaml
└── examples/
    ├── correct/
    └── incorrect/
```

### Phase 3: Convert Visual Elements

#### Colors

Transform color swatches into tokens:

**Before (PDF):**
> Primary Blue: #0066CC  
> Use for headlines and buttons

**After (JSON):**
```json
{
  "primary": {
    "$value": "#0066CC",
    "usage": {
      "recommended": ["headlines", "buttons"],
      "prohibited": ["body_text"]
    },
    "accessibility": {
      "min_contrast_ratio": 4.5
    }
  }
}
```

#### Typography

Transform font specifications:

**Before (PDF):**
> Headings: Inter Bold  
> Body: Source Sans Pro Regular  
> Minimum size: 16px

**After (JSON):**
```json
{
  "font_family": {
    "heading": {
      "$value": "Inter",
      "weights": [600, 700],
      "usage": "headings only"
    },
    "body": {
      "$value": "Source Sans Pro",
      "weights": [400, 600]
    }
  },
  "rules": {
    "minimum_body_size": "16px"
  }
}
```

### Phase 4: Codify Written Guidelines

#### Voice and Tone

Transform prose into structured rules:

**Before (PDF):**
> We speak with confidence but not arrogance. In formal documents, avoid contractions. For blog posts, a more conversational tone is appropriate.

**After (YAML):**
```yaml
voice:
  core_attributes:
    - "confident without arrogance"

tone_by_context:
  formal:
    use_for: ["legal", "investor communications"]
    rules:
      contractions: false
      
  conversational:
    use_for: ["blog", "social media"]
    rules:
      contractions: true
```

### Phase 5: Document Templates

For each template, create a manifest describing:

1. **Layout zones** — Where content goes
2. **Content constraints** — Max characters, bullets, etc.
3. **Visual rules** — Typography, colors for each zone

Example for a slide layout:

```json
{
  "id": "content_text",
  "name": "Title + Content",
  "zones": {
    "slide_title": {
      "position": {"x": 60, "y": 40, "width": 840, "height": 60},
      "typography": "slide_title",
      "max_characters": 50
    },
    "content": {
      "max_bullets": 6,
      "max_words_per_bullet": 15
    }
  }
}
```

### Phase 6: Add Examples

Include both correct and incorrect examples:

```
examples/
├── correct/
│   ├── presentation-good.png
│   └── document-good.png
└── incorrect/
    ├── logo-wrong-color.png
    └── too-many-fonts.png
```

Each incorrect example should explain **why** it's wrong.

---

## Testing Your Brand System

### Manual Validation

- [ ] All file paths in manifest exist
- [ ] JSON files are valid JSON
- [ ] YAML files are valid YAML
- [ ] Color values are valid hex codes
- [ ] Token references resolve (e.g., `{color.brand.primary}`)

### AI Testing

Try using your brand system with an AI agent:

1. Upload or reference your `brand.manifest.json`
2. Ask the AI to create content following the guidelines
3. Verify the output matches your brand rules

Example prompt:
> "Create a 5-slide presentation about our Q1 results. 
> Follow the brand guidelines in ./my-brand/"

### Iterate

Based on AI output quality:
- Add more specific rules where AI made mistakes
- Clarify ambiguous guidelines
- Add examples for edge cases

---

## Next Steps

- Read the [full specification](../specification/v1.0/SPEC.md)
- Explore the [example implementation](../example/)
- Learn about [AI integration patterns](./ai-integration.md)
- Review the [migration guide](./migration-guide.md) for converting existing brandbooks
