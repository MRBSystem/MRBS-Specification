# Multi-Language Support Specification

**MRBS Specification v1.0 - Multilingual Brand Systems**

Version: 1.0
Status: Final
Updated: 2025-01-19

---

## Overview

This document defines patterns and best practices for brands operating in multiple languages within the MRBS framework.

---

## Language Declaration

### In brand.manifest.json

```json
{
  "organization": {
    "name": "Acme Corporation",
    "languages": {
      "default": "en",
      "supported": ["en", "es", "fr", "de"],
      "fallback_chain": ["en"]
    }
  }
}
```

---

## File Organization Patterns

### Option 1: Separate Files per Language

**Use for:** Long-form content (guidelines, documentation)

```
identity/
├── voice-tone.en.yaml
├── voice-tone.es.yaml
├── voice-tone.fr.yaml
├── messaging.en.yaml
├── messaging.es.yaml
└── messaging.fr.yaml
```

### Option 2: Multilingual in Single File

**Use for:** Short content (taglines, values, labels)

```yaml
# identity/messaging.yaml
tagline:
  en: "Innovation for Tomorrow"
  es: "Innovación para el Mañana"
  fr: "Innovation pour Demain"
  de: "Innovation für Morgen"

mission:
  en: "To empower global businesses through technology"
  es: "Empoderar a las empresas globales mediante la tecnología"
  fr: "Autonomiser les entreprises mondiales grâce à la technologie"
  de: "Globale Unternehmen durch Technologie stärken"

values:
  - name:
      en: "Innovation"
      es: "Innovación"
      fr: "Innovation"
      de: "Innovation"
    description:
      en: "We push boundaries and embrace new ideas"
      es: "Superamos límites y adoptamos nuevas ideas"
      fr: "Nous repoussons les limites et adoptons de nouvelles idées"
      de: "Wir überschreiten Grenzen und begrüßen neue Ideen"
```

**Recommendation:** Use Option 2 for structured data, Option 1 for prose.

---

## Translation Policy

```yaml
# identity/translation-policy.yaml
translation_policy:
  primary_language: "en"
  workflow: "Create in primary, translate to all supported"

  synchronization:
    rule: "All languages must have equivalent content"
    exceptions:
      - "Language-specific idioms"
      - "Cultural references"
      - "Legal requirements specific to region"

  quality_assurance:
    professional_translation: true
    native_speaker_review: true
    brand_team_approval: true
    context_provided: true

  character_support:
    en: "Standard Latin alphabet"
    es: "á é í ó ú ü ñ ¿ ¡"
    fr: "à â ç è é ê ë î ï ô ù û ü ÿ œ æ"
    de: "ä ö ü ß"
    lv: "ā č ē ģ ī ķ ļ ņ š ū ž"
```

---

## Typography for Multilingual Brands

### Font Selection

```json
{
  "typography": {
    "font_family": {
      "primary": {
        "$value": "Inter",
        "$type": "fontFamily",
        "language_support": {
          "latin_extended": true,
          "cyrillic": true,
          "greek": false,
          "required_for": ["en", "es", "fr", "de", "lv", "ru"]
        },
        "character_coverage": {
          "latin_basic": "✓",
          "latin_extended_a": "✓",
          "latin_extended_b": "✓",
          "cyrillic": "✓"
        }
      }
    }
  }
}
```

### Test Strings

```yaml
font_testing:
  test_strings:
    latin_basic: "The quick brown fox jumps over the lazy dog 0123456789"
    latin_diacritics: "àáâãäåæçèéêëìíîïñòóôõöøùúûüýÿ ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖØÙÚÛÜÝŸ"
    latvian: "Āā Čč Ēē Ģģ Īī Ķķ Ļļ Ņņ Šš Ūū Žž"
    spanish: "¿¡áéíóúüñÁÉÍÓÚÜÑ"
    french: "àâçèéêëîïôùûüÿœæ ÀÂÇÈÉÊËÎÏÔÙÛÜŸŒÆ"
    german: "äöüßÄÖÜ"
    russian: "А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я"
```

---

## Voice and Tone Across Languages

### Language-Specific Adaptations

```yaml
# identity/voice-tone.yaml
voice:
  universal_attributes:
    - "professional"
    - "approachable"
    - "knowledgeable"

  language_specific:
    en:
      formality: "Professional but conversational"
      contractions: "Acceptable in informal contexts"
      tone: "Direct and clear"

    es:
      formality: "Formal in external communications (use 'usted')"
      regional_variants:
        spain: "Use 'vosotros' forms"
        latam: "Use 'ustedes' forms"
      tone: "Warm and respectful"

    fr:
      formality: "Formal (use 'vous')"
      canadian_french: "Note Canadian vs European differences"
      tone: "Elegant and precise"

    de:
      formality: "Formal (use 'Sie')"
      compound_words: "Keep reasonable length, use hyphens if needed"
      tone: "Clear and structured"

terminology:
  preferred_terms:
    product_name:
      en: "Dashboard"
      es: "Panel de Control"
      fr: "Tableau de Bord"
      de: "Übersicht"
    # Keep original if widely understood:
    project_management:
      en: "Project Management"
      es: "Project Management"  # Keep English
      fr: "Gestion de Projet"
      de: "Projektmanagement"
```

---

## Templates and Layouts

### Language-Specific Considerations

```json
{
  "templates": {
    "presentation": {
      "layouts": {
        "title": {
          "default": "layouts/title.xml",
          "language_specific": {
            "de": "layouts/title.de.xml",  // Longer words need more space
            "ru": "layouts/title.ru.xml"   // Cyrillic may need different sizing
          }
        }
      }
    }
  }
}
```

### Text Expansion Guidelines

```yaml
text_expansion:
  # English baseline = 100%
  # Plan for these expansions when designing:
  spanish: "15-30% longer than English"
  french: "15-20% longer than English"
  german: "20-35% longer than English"
  russian: "10-15% longer than English"
  chinese: "30% shorter than English"
```

---

## Right-to-Left (RTL) Language Support

### If Supporting RTL Languages

```yaml
rtl_support:
  languages: ["ar", "he", "fa", "ur"]

  implementation:
    html_dir: 'dir="rtl"'
    css: "Logical properties (margin-inline-start, not margin-left)"
    layout: "Mirror layout, but not logos/icons"
    text_alignment: "Right-aligned by default"

  exceptions:
    numbers: "LTR even in RTL contexts"
    latin_text: "LTR embedded in RTL"
    logos: "Do not mirror brand marks"

  testing:
    - "Test all UI components"
    - "Check reading order"
    - "Verify icon directionality"
    - "Test with native speakers"
```

---

## Localization Workflow

### Process

```yaml
workflow:
  1_create:
    language: "primary_language"
    owner: "Content team"
    format: "MRBS YAML/JSON"

  2_prepare:
    action: "Extract strings for translation"
    context: "Provide usage context for translators"
    style_guide: "Share voice/tone guidelines"

  3_translate:
    method: "Professional translation service"
    require: "Native speakers with brand training"

  4_review:
    technical: "Verify YAML/JSON syntax"
    linguistic: "Native speaker review"
    brand: "Brand team approval"

  5_integrate:
    action: "Add to MRBS repository"
    validation: "Run automated tests"

  6_sync:
    rule: "Keep all languages in sync"
    notification: "Alert when primary language changes"
```

---

## Accessibility Considerations

### Language Declaration

```html
<!-- HTML -->
<html lang="en">
  <!-- English content -->
  <p lang="es">Esta frase está en español.</p>
</html>
```

```yaml
# MRBS metadata
language_metadata:
  primary_language: "en"
  language_tags: "ISO 639-1 (en, es, fr, de)"
  declare_in_output: true
```

### Screen Reader Support

```yaml
screen_reader_considerations:
  language_switching:
    rule: "Declare language changes for proper pronunciation"
    example: '<span lang="fr">Bonjour</span>'

  abbreviations:
    provide_expansion: true
    example: "EU (European Union) / UE (Unión Europea)"
```

---

## AI Integration for Multilingual

### Loading Strategy

```python
def load_brand_context(language: str, mrbs_path: Path):
    """Load brand context for specific language"""

    manifest = load_json(mrbs_path / 'brand.manifest.json')
    default_lang = manifest['organization']['languages']['default']

    # Load language-specific or fall back to default
    voice_tone_path = mrbs_path / f'identity/voice-tone.{language}.yaml'
    if not voice_tone_path.exists():
        voice_tone_path = mrbs_path / f'identity/voice-tone.{default_lang}.yaml'

    voice_tone = load_yaml(voice_tone_path)

    # Load multilingual messaging
    messaging = load_yaml(mrbs_path / 'identity/messaging.yaml')

    return {
        'language': language,
        'voice_tone': voice_tone,
        'tagline': messaging['tagline'][language],
        'mission': messaging['mission'][language],
        'values': [v['name'][language] for v in messaging['values']]
    }
```

---

## Example: Multilingual Implementation

### File Structure

```
brand-system/
├── brand.manifest.json
├── identity/
│   ├── messaging.yaml          # Multilingual (short content)
│   ├── voice-tone.en.yaml      # English guidelines
│   ├── voice-tone.es.yaml      # Spanish guidelines
│   ├── voice-tone.fr.yaml      # French guidelines
│   └── translation-policy.yaml
├── visual/
│   └── typography.tokens.json  # Font with multilingual support
└── templates/
    ├── presentation/
    │   ├── manifest.en.json
    │   ├── manifest.es.json
    │   └── layouts/
    │       ├── title.xml
    │       └── title.de.xml    # German-specific (longer text)
```

---

## Best Practices

1. **Choose fonts with broad character support** - Verify coverage for all languages
2. **Design for text expansion** - German/Spanish can be 30% longer than English
3. **Provide context to translators** - Explain usage, tone, and constraints
4. **Test with native speakers** - Automated translation is insufficient
5. **Maintain synchronization** - Keep all languages updated when primary changes
6. **Declare languages properly** - For accessibility and SEO
7. **Consider cultural differences** - Colors, imagery, and idioms may need adaptation

---

## Conclusion

Multilingual brand systems require careful planning and ongoing maintenance. Follow these patterns to ensure consistency across languages while respecting linguistic and cultural differences.

For questions, open an issue at the [MRBS repository](https://github.com/MRBSystem/MRBS-Specification).
