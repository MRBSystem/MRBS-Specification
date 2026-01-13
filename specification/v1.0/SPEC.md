# MRBS Specification v1.0

**Machine-Readable Brand System**

Status: **Final**  
Version: **1.0.0**  
Date: **January 2025**

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Terminology](#2-terminology)
3. [File Structure](#3-file-structure)
4. [Brand Manifest](#4-brand-manifest)
5. [Visual Tokens](#5-visual-tokens)
6. [Identity Guidelines](#6-identity-guidelines)
7. [Asset Definitions](#7-asset-definitions)
8. [Template Manifests](#8-template-manifests)
9. [Rules and Constraints](#9-rules-and-constraints)
10. [AI Integration](#10-ai-integration)
11. [Validation](#11-validation)
12. [Extensibility](#12-extensibility)

---

## 1. Introduction

### 1.1 Purpose

The Machine-Readable Brand System (MRBS) specification defines a standardized, structured format for expressing brand identity in a way that is:

- **Machine-parseable** — AI agents and tools can programmatically access and interpret guidelines
- **Semantically rich** — Captures meaning, intent, and context, not just values
- **Validatable** — Rules can be checked programmatically
- **Platform-agnostic** — Works across any system, tool, or AI platform
- **Human-readable** — Remains accessible to designers and brand managers

### 1.2 Scope

This specification covers:

- File formats and structure
- Required and optional fields
- Semantic relationships between components
- Integration patterns for AI systems
- Validation requirements

This specification does NOT cover:

- Specific design recommendations
- Brand strategy guidance
- Implementation details for specific platforms

### 1.3 Conformance

A brand system is MRBS-compliant if it:

1. Contains a valid `brand.manifest.json` at the root
2. All referenced files exist and are valid according to their schemas
3. Passes schema validation for all components

Conformance levels:

- **MRBS Core**: Manifest + at least one component (visual, identity, or rules)
- **MRBS Standard**: Manifest + visual + identity + rules
- **MRBS Complete**: All components including templates and examples

---

## 2. Terminology

| Term | Definition |
|------|------------|
| **Brand System** | A complete MRBS-compliant directory structure |
| **Manifest** | The root `brand.manifest.json` file |
| **Component** | A major section (visual, identity, assets, templates, rules) |
| **Token** | A named design value with metadata |
| **Constraint** | A testable rule that can be validated |
| **Zone** | A defined area within a template with specific rules |
| **Context** | A situation that may have different rules (e.g., formal vs. casual) |

### Requirement Keywords

- **MUST** / **REQUIRED** — Absolute requirement
- **SHOULD** / **RECOMMENDED** — Best practice, may be ignored with reason
- **MAY** / **OPTIONAL** — Truly optional

---

## 3. File Structure

### 3.1 Directory Layout

An MRBS brand system MUST follow this structure:

```
brand-system/
├── brand.manifest.json          # REQUIRED
├── identity/                    # RECOMMENDED
│   ├── brand-values.yaml
│   ├── voice-tone.yaml
│   └── naming.yaml
├── visual/                      # RECOMMENDED
│   ├── colors.tokens.json
│   ├── typography.tokens.json
│   ├── spacing.tokens.json
│   └── effects.tokens.json
├── assets/                      # OPTIONAL
│   ├── logos/
│   │   ├── manifest.json
│   │   └── [logo files]
│   ├── icons/
│   └── photography/
├── templates/                   # OPTIONAL
│   ├── presentation/
│   ├── document/
│   └── email/
├── rules/                       # RECOMMENDED
│   ├── constraints.yaml
│   ├── accessibility.yaml
│   └── legal.yaml
└── examples/                    # OPTIONAL
    ├── correct/
    └── incorrect/
```

### 3.2 File Formats

| Content Type | Format | Extension |
|--------------|--------|-----------|
| Manifest | JSON | `.json` |
| Design tokens | JSON | `.tokens.json` |
| Guidelines | YAML | `.yaml` |
| Asset manifests | JSON | `.json` |
| Logos | SVG (primary), PNG (fallback) | `.svg`, `.png` |
| Documentation | Markdown | `.md` |

### 3.3 Encoding

All text files MUST be UTF-8 encoded without BOM.

---

## 4. Brand Manifest

### 4.1 Purpose

The `brand.manifest.json` is the entry point for any MRBS brand system. AI agents SHOULD read this file first to understand the structure and locate components.

### 4.2 Schema

```json
{
  "$schema": "https://mrbs.dev/schema/v1/brand.manifest.json",
  "mrbs_version": "1.0.0",
  "version": "2.1.0",
  "updated": "2025-01-15",
  
  "organization": {
    "name": "Organization Name",
    "legal_name": "Legal Entity Name (optional)",
    "industry": "Industry Category",
    "website": "https://example.com"
  },
  
  "brand": {
    "name": "Brand Name",
    "tagline": "Brand tagline",
    "mission": "Mission statement",
    "values": ["value1", "value2", "value3"]
  },
  
  "components": {
    "visual": "./visual/",
    "identity": "./identity/",
    "assets": "./assets/",
    "templates": "./templates/",
    "rules": "./rules/",
    "examples": "./examples/"
  },
  
  "ai_instructions": {
    "priority_order": ["rules", "visual", "templates", "identity"],
    "validation_required": true,
    "fallback_behavior": "conservative"
  }
}
```

### 4.3 Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `mrbs_version` | string | MRBS specification version (e.g., "1.0.0") |
| `brand.name` | string | Primary brand name |
| `components` | object | Paths to component directories |

### 4.4 AI Instructions

The `ai_instructions` object provides guidance for AI agents:

- `priority_order`: Order in which to consult components when rules conflict
- `validation_required`: Whether AI should validate output before delivery
- `fallback_behavior`: How to handle ambiguous situations ("conservative" or "creative")

---

## 5. Visual Tokens

### 5.1 Overview

Visual tokens define the core visual language: colors, typography, spacing, and effects. MRBS uses the [W3C Design Tokens](https://design-tokens.github.io/community-group/format/) format as a foundation, with extensions for AI-relevant metadata.

### 5.2 Color Tokens

File: `visual/colors.tokens.json`

```json
{
  "$schema": "https://mrbs.dev/schema/v1/colors.tokens.json",
  "color": {
    "brand": {
      "primary": {
        "$value": "#0066CC",
        "$type": "color",
        "semantic_role": "brand_identity",
        "usage": {
          "recommended": ["headings", "cta_buttons", "links", "accents"],
          "allowed": ["icons", "borders"],
          "prohibited": ["body_text", "large_backgrounds"]
        },
        "pairing": {
          "approved_backgrounds": ["white", "neutral-50", "neutral-100"],
          "prohibited_pairs": ["secondary", "warning"]
        },
        "accessibility": {
          "wcag_level": "AA",
          "min_contrast_ratio": 4.5,
          "tested_combinations": [
            {"background": "#FFFFFF", "ratio": 4.8, "passes": ["AA"]}
          ]
        },
        "emotional_association": ["trust", "professionalism", "stability"]
      },
      "secondary": {
        "$value": "#FF6B35",
        "$type": "color",
        "semantic_role": "accent",
        "usage": {
          "recommended": ["highlights", "callouts"],
          "limit": "≤15% of design surface"
        }
      }
    },
    "neutral": {
      "white": {"$value": "#FFFFFF", "role": "background_primary"},
      "50": {"$value": "#FAFAFA", "role": "background_secondary"},
      "100": {"$value": "#F5F5F5", "role": "background_subtle"},
      "200": {"$value": "#EEEEEE", "role": "border_light"},
      "500": {"$value": "#9E9E9E", "role": "text_disabled"},
      "700": {"$value": "#616161", "role": "text_secondary"},
      "900": {"$value": "#212121", "role": "text_primary"}
    },
    "semantic": {
      "success": {"$value": "{color.brand.primary}", "$type": "color"},
      "warning": {"$value": "#FFC107", "$type": "color"},
      "error": {"$value": "#D32F2F", "$type": "color"},
      "info": {"$value": "#1976D2", "$type": "color"}
    }
  }
}
```

### 5.3 Typography Tokens

File: `visual/typography.tokens.json`

```json
{
  "$schema": "https://mrbs.dev/schema/v1/typography.tokens.json",
  "typography": {
    "font_family": {
      "heading": {
        "$value": "Inter",
        "$type": "fontFamily",
        "fallback": ["system-ui", "sans-serif"],
        "weights": [500, 600, 700],
        "usage": "headings, titles, navigation",
        "source": {
          "type": "google_fonts",
          "url": "https://fonts.google.com/specimen/Inter",
          "license": "OFL"
        }
      },
      "body": {
        "$value": "Source Sans Pro",
        "$type": "fontFamily",
        "fallback": ["system-ui", "sans-serif"],
        "weights": [400, 600],
        "usage": "body text, descriptions"
      },
      "mono": {
        "$value": "JetBrains Mono",
        "$type": "fontFamily",
        "fallback": ["monospace"],
        "weights": [400, 500],
        "usage": "code, technical content"
      }
    },
    "scale": {
      "base": {"$value": "16px", "$type": "dimension"},
      "ratio": {"$value": 1.25, "$type": "number"},
      "h1": {
        "$value": "2.441rem",
        "line_height": 1.2,
        "font_weight": 700,
        "font_family": "{typography.font_family.heading}"
      },
      "h2": {
        "$value": "1.953rem",
        "line_height": 1.25,
        "font_weight": 600,
        "font_family": "{typography.font_family.heading}"
      },
      "h3": {
        "$value": "1.563rem",
        "line_height": 1.3,
        "font_weight": 600,
        "font_family": "{typography.font_family.heading}"
      },
      "h4": {
        "$value": "1.25rem",
        "line_height": 1.35,
        "font_weight": 500,
        "font_family": "{typography.font_family.heading}"
      },
      "body": {
        "$value": "1rem",
        "line_height": 1.6,
        "font_weight": 400,
        "font_family": "{typography.font_family.body}"
      },
      "small": {
        "$value": "0.875rem",
        "line_height": 1.5,
        "font_weight": 400
      },
      "caption": {
        "$value": "0.75rem",
        "line_height": 1.4,
        "font_weight": 400
      }
    },
    "presentation": {
      "title_slide": {"size": "44pt", "weight": 700},
      "section_header": {"size": "36pt", "weight": 600},
      "slide_title": {"size": "28pt", "weight": 600},
      "body": {"size": "18pt", "weight": 400},
      "caption": {"size": "12pt", "weight": 400}
    }
  }
}
```

### 5.4 Spacing Tokens

File: `visual/spacing.tokens.json`

```json
{
  "$schema": "https://mrbs.dev/schema/v1/spacing.tokens.json",
  "spacing": {
    "base_unit": {"$value": "8px", "$type": "dimension"},
    "scale": {
      "xs": {"$value": "4px", "multiplier": 0.5},
      "sm": {"$value": "8px", "multiplier": 1},
      "md": {"$value": "16px", "multiplier": 2},
      "lg": {"$value": "24px", "multiplier": 3},
      "xl": {"$value": "32px", "multiplier": 4},
      "2xl": {"$value": "48px", "multiplier": 6},
      "3xl": {"$value": "64px", "multiplier": 8}
    },
    "semantic": {
      "page_margin": "{spacing.scale.xl}",
      "section_gap": "{spacing.scale.2xl}",
      "element_gap": "{spacing.scale.md}",
      "inline_gap": "{spacing.scale.sm}"
    }
  }
}
```

### 5.5 Effects Tokens

File: `visual/effects.tokens.json`

```json
{
  "$schema": "https://mrbs.dev/schema/v1/effects.tokens.json",
  "effects": {
    "shadow": {
      "sm": {
        "$value": "0 1px 2px rgba(0, 0, 0, 0.05)",
        "$type": "shadow",
        "usage": "subtle elevation"
      },
      "md": {
        "$value": "0 4px 6px rgba(0, 0, 0, 0.1)",
        "$type": "shadow",
        "usage": "cards, dropdowns"
      },
      "lg": {
        "$value": "0 10px 15px rgba(0, 0, 0, 0.1)",
        "$type": "shadow",
        "usage": "modals, prominent elements"
      }
    },
    "radius": {
      "sm": {"$value": "4px", "$type": "dimension"},
      "md": {"$value": "8px", "$type": "dimension"},
      "lg": {"$value": "12px", "$type": "dimension"},
      "full": {"$value": "9999px", "$type": "dimension"}
    },
    "transition": {
      "fast": {"$value": "150ms ease", "$type": "transition"},
      "normal": {"$value": "250ms ease", "$type": "transition"},
      "slow": {"$value": "350ms ease", "$type": "transition"}
    }
  }
}
```

---

## 6. Identity Guidelines

### 6.1 Brand Values

File: `identity/brand-values.yaml`

```yaml
brand_values:
  mission: "Clear mission statement"
  vision: "Long-term vision statement"
  
  values:
    - name: "Innovation"
      description: "We embrace new ideas and approaches"
      behaviors:
        - "Question assumptions"
        - "Experiment and iterate"
        - "Learn from failures"
        
    - name: "Integrity"
      description: "We act honestly and transparently"
      behaviors:
        - "Keep commitments"
        - "Communicate openly"
        - "Admit mistakes"
        
  personality:
    archetype: "The Sage"
    traits:
      primary:
        - trait: "Knowledgeable"
          meaning: "We are experts in our field"
        - trait: "Trustworthy"
          meaning: "We deliver on promises"
      secondary:
        - trait: "Approachable"
          meaning: "We make complex things understandable"
```

### 6.2 Voice and Tone

File: `identity/voice-tone.yaml`

```yaml
voice:
  core_attributes:
    - "Professional but approachable"
    - "Confident without arrogance"
    - "Clear and direct"
    - "Expert but accessible"
  
  we_are:
    - "Helpful and solution-oriented"
    - "Respectful of people's time"
    - "Precise when it matters"
    
  we_are_not:
    - "Condescending or preachy"
    - "Overly casual or flippant"
    - "Vague or wishy-washy"
    - "Aggressive or pushy"

tone_by_context:
  formal:
    use_for:
      - "Legal documents"
      - "Annual reports"
      - "Investor communications"
      - "Contracts"
    characteristics:
      - "Authoritative"
      - "Precise"
      - "Conservative"
    rules:
      contractions: false
      colloquialisms: false
      humor: false
      sentence_length: "medium_to_long"
    example_good: "We are committed to delivering exceptional value to our stakeholders."
    example_bad: "We're totally dedicated to giving you guys awesome results!"
    
  professional:
    use_for:
      - "Presentations"
      - "Proposals"
      - "White papers"
      - "Case studies"
    characteristics:
      - "Confident"
      - "Knowledgeable"
      - "Engaging"
    rules:
      contractions: "limited"
      colloquialisms: false
      humor: "subtle_if_appropriate"
      sentence_length: "varied"
    example_good: "Our solution addresses three critical challenges facing the industry."
    example_bad: "Our amazing solution is going to blow your mind!"
    
  conversational:
    use_for:
      - "Blog posts"
      - "Social media"
      - "Internal communications"
      - "Customer support"
    characteristics:
      - "Warm"
      - "Helpful"
      - "Accessible"
    rules:
      contractions: true
      colloquialisms: "moderate"
      humor: "appropriate"
      sentence_length: "short_to_medium"

writing_rules:
  grammar:
    active_voice: "preferred"
    oxford_comma: true
    numbers: "spell_1_to_10_numerals_above"
    
  vocabulary:
    prefer:
      - use: "solutions"
        instead_of: "products"
      - use: "partners"
        instead_of: "customers"
      - use: "team members"
        instead_of: "employees"
    avoid:
      - "synergy"
      - "leverage (as verb)"
      - "disrupt"
      - "revolutionary"
      - "best-in-class"
      
  formatting:
    headline_max_words: 8
    paragraph_sentences: "3-5"
    bullet_max_words: 15
```

### 6.3 Naming Conventions

File: `identity/naming.yaml`

```yaml
naming:
  products:
    pattern: "[Brand] [Descriptor]"
    rules:
      - "Use title case"
      - "Maximum 3 words"
      - "Avoid generic terms alone"
    examples:
      good: ["Acme Analytics", "Acme Cloud Platform"]
      bad: ["acme analytics", "The Acme Super Amazing Platform"]
      
  features:
    pattern: "[Action/Noun] [Descriptor]"
    rules:
      - "Use sentence case"
      - "Be descriptive, not clever"
    examples:
      good: ["Smart scheduling", "Team dashboard"]
      bad: ["SmartSched™", "The Hub"]
      
  internal_projects:
    pattern: "[Codename]"
    rules:
      - "Use nature/mythology themes"
      - "Single word preferred"
```

---

## 7. Asset Definitions

### 7.1 Logo Manifest

File: `assets/logos/manifest.json`

```json
{
  "$schema": "https://mrbs.dev/schema/v1/logo.manifest.json",
  "logo": {
    "primary": {
      "file": "primary.svg",
      "usage": "Default logo for most applications",
      "formats": {
        "svg": "primary.svg",
        "png_1x": "primary.png",
        "png_2x": "primary@2x.png"
      }
    },
    "reversed": {
      "file": "reversed.svg",
      "usage": "For dark backgrounds",
      "use_when": "background_luminance < 0.5"
    },
    "monochrome": {
      "file": "monochrome.svg",
      "usage": "Single-color applications",
      "color_options": ["black", "white", "primary"]
    },
    "icon": {
      "file": "icon.svg",
      "usage": "Favicon, app icon, small spaces",
      "minimum_size": "24px"
    }
  },
  "rules": {
    "minimum_size": {
      "digital": "40px height",
      "print": "15mm height"
    },
    "clear_space": {
      "measurement": "height of logo mark",
      "minimum": "1x on all sides"
    },
    "backgrounds": {
      "approved": ["white", "neutral-50", "primary (with reversed logo)"],
      "prohibited": ["busy patterns", "low contrast colors", "competing graphics"]
    },
    "modifications": {
      "prohibited": [
        "rotation",
        "skewing",
        "color alteration",
        "adding effects",
        "cropping",
        "recreation"
      ]
    }
  }
}
```

### 7.2 Photography Guidelines

File: `assets/photography/guidelines.yaml`

```yaml
photography:
  style:
    preferred:
      - "Natural lighting"
      - "Authentic moments"
      - "Diverse representation"
      - "Clean compositions"
      - "Relevant to content"
    avoid:
      - "Overly staged or stock-looking"
      - "Heavy filters or artificial color grading"
      - "Isolated subjects on pure white"
      - "Clichéd imagery"
      - "Low resolution or pixelated"
      
  subjects:
    people:
      - "Show genuine expressions"
      - "Include diverse ages, ethnicities, abilities"
      - "Context-appropriate attire"
    environments:
      - "Clean and organized spaces"
      - "Good lighting"
      - "Relevant to brand context"
      
  technical:
    minimum_resolution: "300dpi for print, 72dpi for web"
    aspect_ratios:
      hero: "16:9"
      square: "1:1"
      portrait: "4:5"
    color_space: "sRGB for web, CMYK for print"
    
  treatments:
    allowed:
      - "Light color correction"
      - "Cropping within guidelines"
      - "Brand color overlay (30% max opacity)"
    prohibited:
      - "Heavy vignettes"
      - "Artificial lens flares"
      - "HDR effects"
      - "Extreme saturation"
```

---

## 8. Template Manifests

### 8.1 Presentation Templates

File: `templates/presentation/manifest.json`

```json
{
  "$schema": "https://mrbs.dev/schema/v1/template.manifest.json",
  "template": {
    "type": "presentation",
    "name": "Corporate Presentation",
    "version": "2.0",
    "file": "template.pptx",
    "dimensions": {
      "width": 960,
      "height": 540,
      "aspect_ratio": "16:9",
      "unit": "px"
    }
  },
  "layouts": [
    {
      "id": "title",
      "name": "Title Slide",
      "slide_index": 0,
      "purpose": "Opening slide for presentations",
      "usage": "required_first",
      "zones": {
        "title": {
          "position": {"x": 60, "y": 180, "width": 840, "height": 120},
          "typography": "title_slide",
          "max_characters": 60,
          "alignment": "center",
          "required": true
        },
        "subtitle": {
          "position": {"x": 60, "y": 320, "width": 840, "height": 80},
          "typography": "body",
          "max_characters": 120,
          "alignment": "center",
          "required": false
        },
        "date": {
          "position": {"x": 60, "y": 480, "width": 200, "height": 30},
          "typography": "caption",
          "format": "MMMM D, YYYY",
          "required": false
        }
      },
      "logo_position": "bottom_right"
    },
    {
      "id": "section",
      "name": "Section Divider",
      "slide_index": 1,
      "purpose": "Introduce new sections",
      "usage": "recommended_every_5_slides",
      "zones": {
        "section_title": {
          "position": {"x": 60, "y": 200, "width": 600, "height": 100},
          "typography": "section_header",
          "max_characters": 40,
          "required": true
        },
        "section_description": {
          "position": {"x": 60, "y": 320, "width": 600, "height": 120},
          "typography": "body",
          "max_characters": 200,
          "required": false
        }
      }
    },
    {
      "id": "content_text",
      "name": "Title + Content",
      "slide_index": 2,
      "purpose": "Standard content slide",
      "zones": {
        "slide_title": {
          "position": {"x": 60, "y": 40, "width": 840, "height": 60},
          "typography": "slide_title",
          "max_characters": 50,
          "required": true
        },
        "content": {
          "position": {"x": 60, "y": 120, "width": 840, "height": 380},
          "typography": "body",
          "supports": ["bullets", "numbered_list", "paragraphs"],
          "max_bullets": 6,
          "max_words_per_bullet": 15,
          "required": true
        }
      }
    },
    {
      "id": "content_image_right",
      "name": "Content + Image",
      "slide_index": 3,
      "purpose": "Content with supporting visual",
      "zones": {
        "slide_title": {
          "position": {"x": 60, "y": 40, "width": 840, "height": 60},
          "typography": "slide_title",
          "max_characters": 50
        },
        "content": {
          "position": {"x": 60, "y": 120, "width": 400, "height": 380},
          "typography": "body",
          "max_bullets": 5
        },
        "image": {
          "position": {"x": 500, "y": 80, "width": 420, "height": 420},
          "accepts": ["jpg", "png", "svg"],
          "aspect_ratio_tolerance": 0.2
        }
      }
    },
    {
      "id": "chart",
      "name": "Data Visualization",
      "slide_index": 4,
      "purpose": "Charts and graphs",
      "zones": {
        "slide_title": {
          "typography": "slide_title",
          "max_characters": 50
        },
        "chart": {
          "position": {"x": 60, "y": 100, "width": 840, "height": 380},
          "accepts": ["bar", "line", "pie", "area", "scatter"],
          "max_series": 5,
          "colors": "use_brand_palette",
          "label_typography": "caption"
        },
        "source": {
          "position": {"x": 60, "y": 500, "width": 400, "height": 20},
          "typography": "caption",
          "prefix": "Source: ",
          "required_when": "data_external"
        }
      }
    },
    {
      "id": "closing",
      "name": "Closing Slide",
      "slide_index": 5,
      "purpose": "End slide with contact/CTA",
      "usage": "required_last",
      "zones": {
        "headline": {
          "typography": "section_header",
          "max_characters": 40,
          "alignment": "center"
        },
        "contact": {
          "typography": "body",
          "max_lines": 4
        }
      }
    }
  ],
  "usage_rules": {
    "min_slides": 5,
    "max_slides": 30,
    "max_bullets_per_slide": 6,
    "max_words_per_slide": 75,
    "required_layouts": ["title", "closing"],
    "recommended_structure": {
      "first": "title",
      "last": "closing",
      "section_divider_every": 5
    }
  }
}
```

---

## 9. Rules and Constraints

### 9.1 Constraints

File: `rules/constraints.yaml`

```yaml
constraints:
  logo:
    minimum_sizes:
      digital: "40px height"
      print: "15mm height"
      icon: "24px"
    clear_space: "1x logo height on all sides"
    do:
      - "Use approved logo files only"
      - "Maintain aspect ratio"
      - "Ensure adequate contrast"
      - "Use reversed version on dark backgrounds"
    dont:
      - "Rotate or skew"
      - "Add shadows, glows, or effects"
      - "Alter colors"
      - "Place on busy backgrounds"
      - "Stretch or compress"
      - "Recreate or redraw"
      
  colors:
    combinations:
      approved:
        - foreground: "primary"
          background: "white"
          usage: "Primary content"
        - foreground: "white"
          background: "primary"
          usage: "Buttons, headers"
      prohibited:
        - colors: ["primary", "secondary"]
          reason: "Insufficient contrast, visual conflict"
    usage_limits:
      secondary: "≤15% of design surface"
      
  typography:
    do:
      - "Use heading font for headings only"
      - "Maintain consistent hierarchy"
      - "Use adequate line height (1.4-1.6)"
      - "Left-align body text"
    dont:
      - "Mix more than 2 font families"
      - "Use heading font for body text"
      - "Use decorative fonts"
      - "Justify body text"
      - "Use all caps for more than 3 words"
      
  imagery:
    do:
      - "Use high-quality, relevant images"
      - "Ensure proper licensing"
      - "Maintain consistent style"
    dont:
      - "Use pixelated or low-res images"
      - "Apply heavy filters"
      - "Use clichéd stock photos"
      
  presentations:
    structure:
      one_idea_per_slide: true
      max_bullets: 6
      max_words_per_bullet: 15
      min_font_size: "14pt"
    content:
      data_requires_source: true
      prefer_visuals_over_text: true
```

### 9.2 Accessibility

File: `rules/accessibility.yaml`

```yaml
accessibility:
  wcag_target: "AA"
  
  color_contrast:
    normal_text:
      minimum_ratio: 4.5
      applies_to: "text smaller than 18pt or 14pt bold"
    large_text:
      minimum_ratio: 3.0
      applies_to: "text 18pt+ or 14pt+ bold"
    ui_components:
      minimum_ratio: 3.0
      applies_to: "buttons, form fields, icons"
      
  typography:
    minimum_body_size: "16px"
    minimum_line_height: 1.5
    maximum_line_length: "80 characters"
    
  images:
    alt_text: "required for meaningful images"
    decorative_images: "mark as decorative (empty alt)"
    
  documents:
    heading_hierarchy: "required (no skipping levels)"
    reading_order: "must be logical"
    tables: "must have headers"
    
  color_independence:
    rule: "Never use color alone to convey information"
    example: "Error states need icons or text, not just red color"
```

### 9.3 Legal

File: `rules/legal.yaml`

```yaml
legal:
  trademark:
    symbol_usage:
      registered: "Use ® on first prominent use"
      unregistered: "Use ™ for unregistered marks"
    proper_usage:
      - "Always use as adjective, not noun"
      - "Never pluralize or make possessive"
      - "Maintain consistent capitalization"
      
  copyright:
    notice_format: "© [Year] [Company Name]. All rights reserved."
    placement: "Footer of documents, websites"
    
  disclaimers:
    required_contexts:
      - context: "financial_projections"
        text: "Forward-looking statements involve risks and uncertainties."
      - context: "testimonials"
        text: "Individual results may vary."
        
  image_usage:
    requirements:
      - "Verify licensing for all images"
      - "Maintain model releases for identifiable people"
      - "Credit photographers as required by license"
```

---

## 10. AI Integration

### 10.1 System Prompt Pattern

For direct AI integration, include brand context in system prompts:

```markdown
## Brand Context

Follow MRBS brand guidelines:

### Quick Reference
- Primary: #0066CC | Secondary: #FF6B35
- Headings: Inter (600, 700) | Body: Source Sans Pro (400, 600)
- Voice: Professional but approachable

### Key Rules
- Max 6 bullets per slide, 15 words per bullet
- Always use active voice
- Contrast ratio minimum: 4.5

### Full Guidelines
See: [path/to/brand.manifest.json]
```

### 10.2 MCP Integration

MRBS can be exposed via [Model Context Protocol](https://modelcontextprotocol.io):

```typescript
interface BrandMCPServer {
  resources: {
    "brand://manifest": BrandManifest;
    "brand://colors": ColorTokens;
    "brand://typography": TypographyTokens;
    "brand://voice/{context}": VoiceGuidelines;
    "brand://templates/{type}": TemplateManifest;
    "brand://rules": Constraints;
  };
  
  tools: {
    validate_content(content: ContentInput): ValidationResult;
    get_color_pair(foreground: string, background: string): PairingResult;
    check_contrast(color1: string, color2: string): ContrastResult;
  };
}
```

### 10.3 REST API Pattern

```yaml
openapi: 3.0.0
paths:
  /brand/manifest:
    get:
      summary: Get brand manifest
      
  /brand/colors:
    get:
      summary: Get color tokens with usage rules
      
  /brand/typography:
    get:
      summary: Get typography tokens
      
  /brand/voice/{context}:
    get:
      summary: Get voice guidelines for context
      parameters:
        - name: context
          in: path
          schema:
            enum: [formal, professional, conversational]
            
  /brand/templates/{type}:
    get:
      summary: Get template manifest
      parameters:
        - name: type
          in: path
          schema:
            enum: [presentation, document, email]
            
  /brand/validate:
    post:
      summary: Validate content against brand rules
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                content_type: string
                colors_used: array
                fonts_used: array
                text_content: string
```

---

## 11. Validation

### 11.1 Schema Validation

All MRBS files MUST validate against their respective JSON Schemas:

| File | Schema |
|------|--------|
| `brand.manifest.json` | `brand.manifest.schema.json` |
| `colors.tokens.json` | `colors.tokens.schema.json` |
| `typography.tokens.json` | `typography.tokens.schema.json` |
| `*.yaml` | Corresponding YAML schema |

### 11.2 Reference Validation

All internal references MUST resolve:

- File paths in manifest MUST exist
- Token references (e.g., `{color.brand.primary}`) MUST resolve
- Template references MUST point to valid layouts

### 11.3 Constraint Validation

Content created using MRBS SHOULD be validated against:

- Color contrast requirements
- Typography rules
- Template zone constraints
- Content length limits

---

## 12. Extensibility

### 12.1 Custom Fields

MRBS allows custom fields with the `x_` prefix:

```json
{
  "color": {
    "brand": {
      "primary": {
        "$value": "#0066CC",
        "x_pantone": "PMS 2935 C",
        "x_internal_code": "BLU-001"
      }
    }
  }
}
```

### 12.2 Custom Components

Additional components can be added to the manifest:

```json
{
  "components": {
    "visual": "./visual/",
    "x_motion": "./motion/",
    "x_audio": "./audio/"
  }
}
```

### 12.3 Profiles

Organizations can define profiles for subsets of the brand:

```json
{
  "profiles": {
    "product_a": {
      "colors": "./profiles/product-a/colors.tokens.json",
      "inherits": ["visual", "identity"]
    }
  }
}
```

---

## Appendix A: File Format Quick Reference

| Content | Format | Extension | Schema |
|---------|--------|-----------|--------|
| Manifest | JSON | `.json` | `brand.manifest.schema.json` |
| Design tokens | JSON | `.tokens.json` | `*.tokens.schema.json` |
| Guidelines | YAML | `.yaml` | `*.schema.yaml` |
| Logos | SVG | `.svg` | N/A |
| Templates | Native + JSON | `.pptx` + `.json` | `template.manifest.schema.json` |

## Appendix B: Token Reference Syntax

Reference other tokens using curly braces:

```json
{
  "semantic": {
    "success": {
      "$value": "{color.brand.primary}"
    }
  }
}
```

## Appendix C: WCAG Contrast Ratios

| Level | Normal Text | Large Text | UI Components |
|-------|-------------|------------|---------------|
| AA | 4.5:1 | 3:1 | 3:1 |
| AAA | 7:1 | 4.5:1 | N/A |

---

*End of Specification*
