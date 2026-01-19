# MRBS Accessibility Framework

**Machine-Readable Brand System - Comprehensive Accessibility Requirements**

Version: 1.0
Status: Final
Updated: 2025-01-19

---

## Table of Contents

1. [Overview](#overview)
2. [WCAG Compliance Levels](#wcag-compliance-levels)
3. [Color Accessibility](#color-accessibility)
4. [Typography Accessibility](#typography-accessibility)
5. [Interactive Elements](#interactive-elements)
6. [Document Accessibility](#document-accessibility)
7. [Multilingual Accessibility](#multilingual-accessibility)
8. [Testing Requirements](#testing-requirements)
9. [Accessibility Statement](#accessibility-statement)

---

## Overview

### Purpose

This framework defines comprehensive accessibility requirements for MRBS implementations, ensuring brand materials are accessible to all users including those with disabilities.

### Standards

All MRBS implementations SHOULD conform to:

- **WCAG 2.1** (Web Content Accessibility Guidelines)
- **Level AA** (minimum recommended)
- **Level AAA** (recommended for government/public sector)

### Scope

Accessibility requirements apply to:

- Digital content (websites, applications, documents)
- Print materials (where applicable)
- Templates and design systems
- AI-generated content

---

## WCAG Compliance Levels

### Level A (Minimum)

Basic accessibility features - NOT RECOMMENDED as sole target for MRBS.

### Level AA (Recommended Minimum)

**Required for all MRBS implementations:**

- Color contrast minimum 4.5:1 for normal text
- Color contrast minimum 3:1 for large text (18pt+ or 14pt+ bold)
- Color contrast minimum 3:1 for UI components
- Text resizable up to 200% without loss of content
- Keyboard navigation for all interactive elements
- Focus indicators visible
- Form labels properly associated

### Level AAA (Recommended for Public Sector)

**Enhanced accessibility:**

- Color contrast minimum 7:1 for normal text
- Color contrast minimum 4.5:1 for large text
- No images of text (with exceptions)
- Enhanced error identification
- Help and documentation available

---

## Color Accessibility

### Testing Requirements

All color combinations MUST be tested and documented.

#### Required Test File

`rules/accessibility-test-results.yaml`:

```yaml
test_date: "2025-01-19"
standard: "WCAG 2.1"
level: "AA"
test_tools:
  - name: "WebAIM Contrast Checker"
    url: "https://webaim.org/resources/contrastchecker/"
  - name: "Colour Contrast Analyser"
    version: "3.1.2"

color_contrast_tests:
  primary_on_white:
    foreground: "#0066CC"
    background: "#FFFFFF"
    ratio: 4.8
    passes: ["AA", "AAA"]
    test_tool: "WebAIM Contrast Checker"
    test_date: "2025-01-19"

  primary_on_light_gray:
    foreground: "#0066CC"
    background: "#F5F5F5"
    ratio: 4.5
    passes: ["AA"]
    test_tool: "WebAIM Contrast Checker"
    test_date: "2025-01-19"

  white_on_primary:
    foreground: "#FFFFFF"
    background: "#0066CC"
    ratio: 4.8
    passes: ["AA", "AAA"]
    test_tool: "WebAIM Contrast Checker"
    test_date: "2025-01-19"

  error_on_white:
    foreground: "#D32F2F"
    background: "#FFFFFF"
    ratio: 5.1
    passes: ["AA", "AAA"]
    test_tool: "WebAIM Contrast Checker"
    test_date: "2025-01-19"

required_combinations:
  - description: "Primary color on white background"
    foreground: "color.brand.primary"
    background: "color.neutral.white"
    min_ratio: 4.5

  - description: "Text colors on white"
    foreground: "color.neutral.900"
    background: "color.neutral.white"
    min_ratio: 4.5

  - description: "All semantic colors on white"
    foreground: ["color.semantic.success", "color.semantic.warning", "color.semantic.error", "color.semantic.info"]
    background: "color.neutral.white"
    min_ratio: 4.5
```

#### Required Tests

Test ALL of the following combinations:

1. **Primary brand color** on white background
2. **Primary brand color** on light neutral backgrounds
3. **White/light text** on primary brand color
4. **All text colors** on white background
5. **All text colors** on light backgrounds
6. **All semantic colors** (success, warning, error, info) on:
   - White background
   - Light backgrounds
   - Any colored backgrounds they'll appear on
7. **Interactive elements** (buttons, links) in all states:
   - Default
   - Hover
   - Focus
   - Active
   - Disabled

### Color Usage Guidelines

```yaml
# rules/accessibility.yaml
color_usage:
  contrast_requirements:
    normal_text: 4.5  # 18px and below
    large_text: 3.0   # 18px+ or 14px+ bold
    ui_components: 3.0

  color_independence:
    rule: "Never use color as the ONLY means of conveying information"
    examples:
      error_indication:
        wrong: "Red text to indicate error"
        correct: "Red text + icon + 'Error:' label"
      required_fields:
        wrong: "Red asterisk only"
        correct: "Red asterisk + '(required)' text"
      chart_data:
        wrong: "Color-coded lines only"
        correct: "Color-coded lines + patterns + labels"

  colorblind_considerations:
    test_with:
      - "Deuteranopia (red-green, most common)"
      - "Protanopia (red-green)"
      - "Tritanopia (blue-yellow)"
    tools:
      - "Color Oracle (simulator)"
      - "Coblis (simulator)"
    recommendations:
      - "Avoid red-green as sole differentiator"
      - "Use patterns/textures in addition to color"
      - "Test with grayscale conversion"
```

### Automated Testing

```python
# Example: Color contrast validation
from wcag_contrast_ratio import rgb, passes_AA, passes_AAA

def validate_color_contrast(mrbs_colors, accessibility_rules):
    """Validate all color combinations meet WCAG requirements"""

    failures = []
    required_tests = accessibility_rules['required_combinations']

    for test in required_tests:
        fg_color = resolve_color(test['foreground'], mrbs_colors)
        bg_color = resolve_color(test['background'], mrbs_colors)

        ratio = rgb(fg_color, bg_color)

        if ratio < test['min_ratio']:
            failures.append({
                'description': test['description'],
                'foreground': fg_color,
                'background': bg_color,
                'ratio': round(ratio, 2),
                'required': test['min_ratio'],
                'wcag_level': 'AA' if test['min_ratio'] == 4.5 else 'AAA'
            })

    return {
        'passed': len(failures) == 0,
        'failures': failures,
        'total_tests': len(required_tests)
    }
```

---

## Typography Accessibility

### Font Size Requirements

```yaml
# visual/typography.tokens.json - accessibility constraints
typography:
  accessibility_requirements:
    minimum_sizes:
      body_text:
        value: "16px"
        rem: "1rem"
        rationale: "WCAG 2.1 - Comfortable reading for most users"

      small_text:
        value: "14px"
        rem: "0.875rem"
        usage: "Supporting text, captions"
        limitation: "Use sparingly, not for critical content"

      minimum_legal:
        value: "12px"
        rem: "0.75rem"
        usage: "Fine print only (legal disclaimers, footnotes)"
        warning: "Fails AAA for normal vision users"

    line_height:
      minimum: 1.5
      body_text: 1.5-1.6
      headings: 1.2-1.4

    line_length:
      maximum: "80ch"
      optimal: "50-75ch"
      rationale: "Improves readability and reduces eye strain"

    text_spacing:
      minimum_paragraph_spacing: "1.5em"
      minimum_letter_spacing: "0.12em (for tight fonts)"
```

### Font Requirements

```yaml
font_family:
  accessibility_criteria:
    character_support:
      requirement: "Must support all characters in all supported languages"
      examples:
        latvian: "ā, č, ē, ģ, ī, ķ, ļ, ņ, š, ū, ž, ĀČĒĢĪĶĻŅŠŪŽ"
        french: "àâçèéêëîïôùûüÿœæ"
        german: "äöüßÄÖÜ"

    readability:
      rule: "Select fonts optimized for screen reading"
      avoid:
        - "Decorative fonts for body text"
        - "Fonts with poor character differentiation (I/l/1, O/0)"
        - "Very thin stroke widths"
      prefer:
        - "Sans-serif for digital body text"
        - "High x-height"
        - "Open apertures (a, e, c)"
        - "Clear number forms"

    weight_availability:
      minimum: "Regular (400) and Bold (700)"
      recommended: "Regular (400), Medium (500/600), Bold (700)"
      rationale: "Ensure adequate hierarchy and emphasis"
```

### Dyslexia Considerations

```yaml
dyslexia_friendly:
  recommendations:
    font_choices:
      - "OpenDyslexic"
      - "Comic Sans (surprisingly effective)"
      - "Verdana"
      - "Arial"

    formatting:
      - "Generous line spacing (1.5+)"
      - "Avoid full justification"
      - "Use left alignment"
      - "Avoid italics for long passages"
      - "Use bold for emphasis, not underline"

    color:
      - "Avoid pure white backgrounds (use cream/light gray)"
      - "High contrast but not maximum (black on white can be harsh)"
```

---

## Interactive Elements

### Focus Indicators

**REQUIRED for keyboard navigation:**

```yaml
# rules/accessibility.yaml
focus_indicators:
  requirement: "All interactive elements MUST have visible focus indicators"

  specifications:
    visibility:
      rule: "Focus indicator MUST be clearly visible against all backgrounds"
      min_contrast_ratio: 3.0

    thickness:
      minimum: "2px"
      recommended: "3px"

    style:
      acceptable:
        - "Solid outline"
        - "Dashed outline"
        - "Box shadow"
        - "Background color change (if sufficient contrast)"
      avoid:
        - "Too subtle"
        - "Same color as element"

  examples:
    default_browser:
      acceptable: true
      note: "Browser default is acceptable but custom is better for branding"

    custom_brand:
      outline: "2px solid {color.brand.primary}"
      outline_offset: "2px"
      note: "Branded but accessible"
```

### Touch Targets

```yaml
touch_targets:
  requirement: "Minimum size for touch/click targets"

  sizes:
    minimum:
      width: "44px"
      height: "44px"
      standard: "WCAG 2.1 Level AA"

    recommended:
      width: "48px"
      height: "48px"
      standard: "Material Design, iOS HIG"

  spacing:
    minimum_between_targets: "8px"
    rationale: "Prevent accidental activation"

  exceptions:
    inline_text_links:
      allowed: true
      note: "Links within paragraphs can be smaller but should have adequate padding"
```

### Interactive States

```yaml
interactive_states:
  required_states:
    - default
    - hover
    - focus
    - active
    - disabled
    - error (for form inputs)

  state_differentiation:
    rule: "Each state MUST be visually distinct"
    methods:
      - "Color change"
      - "Border change"
      - "Shadow change"
      - "Icon addition"
    requirement: "Use multiple methods, not color alone"

  disabled_state:
    min_opacity: 0.4
    max_opacity: 0.6
    additional_indicator: "cursor: not-allowed"
    aria_label: "Explain why disabled (if applicable)"
```

---

## Document Accessibility

### Structure Requirements

```yaml
document_structure:
  heading_hierarchy:
    rule: "Use proper heading levels (H1 → H2 → H3)"
    prohibition: "NEVER skip heading levels"
    example_wrong: "H1 → H3 (skipped H2)"
    example_correct: "H1 → H2 → H3"

  alt_text:
    requirement: "All meaningful images MUST have alt text"
    decorative_images: "Use alt='' or role='presentation'"
    guidelines:
      - "Describe function, not just appearance"
      - "Be concise (< 150 characters)"
      - "Don't start with 'Image of'"
      - "Include text from images"

  tables:
    requirement: "All data tables MUST have proper headers"
    use_th: true
    scope_attribute: "row or col"
    caption_element: "Describe table purpose"
    avoid_for_layout: true

  lists:
    rule: "Use proper list markup"
    ordered: "<ol> for sequential items"
    unordered: "<ul> for non-sequential items"
    definition: "<dl> for term/definition pairs"

  links:
    meaningful_text: true
    avoid:
      - "Click here"
      - "Read more"
      - "Learn more"
    prefer:
      - "Download the 2024 Annual Report (PDF, 2MB)"
      - "Read our Accessibility Statement"
```

### PDF Accessibility

```yaml
pdf_requirements:
  structure:
    - "Tagged PDF (PDF/UA compliant)"
    - "Proper heading structure"
    - "Reading order defined"
    - "Table structure defined"

  text:
    - "Actual text (not images of text)"
    - "Selectable and searchable"
    - "OpenType fonts embedded"

  metadata:
    - "Document title"
    - "Document language"
    - "Author information"

  forms:
    - "Form fields labeled"
    - "Tab order logical"
    - "Required fields indicated"

  testing:
    tools:
      - "Adobe Acrobat Pro (Accessibility Checker)"
      - "PAC 2021 (PDF Accessibility Checker)"
      - "Screen reader (NVDA, JAWS)"
```

### Presentations

```yaml
presentation_accessibility:
  powerpoint:
    - "Use built-in slide layouts"
    - "Define reading order"
    - "Add alt text to images"
    - "Use high-contrast themes"
    - "Avoid animations that convey meaning"
    - "Include speaker notes"
    - "Check with Accessibility Checker"

  google_slides:
    - "Use theme layouts"
    - "Add alt text"
    - "High contrast colors"
    - "Readable fonts (18pt+ for body)"
    - "Captions for videos"

  delivery:
    - "Describe visual content verbally"
    - "Provide accessible handouts"
    - "Use microphone if available"
    - "Enable captions if virtual"
```

---

## Multilingual Accessibility

### Language Declaration

```yaml
language_support:
  html_lang_attribute:
    requirement: "MUST declare document language"
    example: '<html lang="lv">'

  language_changes:
    requirement: "MUST mark language changes in content"
    example: '<span lang="en">Project Management</span>'

  supported_languages:
    primary: "lv"
    secondary: ["en", "ru"]

  font_support:
    requirement: "Fonts MUST support ALL diacritics for ALL supported languages"
    testing: "Render test strings for each language"

    test_strings:
      latvian: "Āā Čč Ēē Ģģ Īī Ķķ Ļļ Ņņ Šš Ūū Žž"
      russian: "А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я"
      french: "àâçèéêëîïôùûüÿœæ ÀÂÇÈÉÊËÎÏÔÙÛÜŸŒÆ"
```

### RTL Language Support

```yaml
rtl_support:
  requirement: "If supporting RTL languages (Arabic, Hebrew)"

  implementation:
    - "Mirror layout in RTL mode"
    - "Test all UI components"
    - "Ensure proper text alignment"
    - "Check icon directionality"

  testing:
    - "Test with dir='rtl' attribute"
    - "Use browser RTL mode"
    - "Test with native RTL speakers"
```

---

## Testing Requirements

### Testing Checklist

```markdown
## Accessibility Testing Checklist

### Automated Testing
- [ ] Color contrast ratios (WebAIM, Axe DevTools)
- [ ] HTML validation (W3C Validator)
- [ ] ARIA attributes (axe DevTools)
- [ ] Keyboard navigation (automated tools)

### Manual Testing
- [ ] Keyboard navigation (Tab through ALL interactive elements)
- [ ] Screen reader (NVDA, JAWS, VoiceOver)
- [ ] Zoom to 200% (content remains usable)
- [ ] Resize text only to 200%
- [ ] Color contrast verified
- [ ] Text readable without color
- [ ] Focus indicators visible on ALL elements
- [ ] Form errors clearly indicated
- [ ] Language properly declared
- [ ] Images have appropriate alt text
- [ ] Headings in proper hierarchy
- [ ] Links have meaningful text

### Assistive Technology Testing
- [ ] Screen reader (NVDA - Windows free)
- [ ] Screen reader (JAWS - Windows paid)
- [ ] Screen reader (VoiceOver - macOS/iOS built-in)
- [ ] Screen reader (TalkBack - Android built-in)
- [ ] Voice control (Voice Control - iOS/macOS)
- [ ] Magnification (ZoomText, built-in zoom)

### User Testing
- [ ] Test with users with disabilities (if possible)
- [ ] Collect feedback on pain points
- [ ] Iterate based on findings
```

### Continuous Testing

```yaml
ci_cd_integration:
  pre_commit:
    - "Validate color contrast ratios"
    - "Check for missing alt text"
    - "Verify heading hierarchy"

  automated_pipeline:
    tools:
      - name: "axe-core"
        type: "JavaScript library"
        integration: "Jest, Cypress, Playwright"

      - name: "pa11y"
        type: "CLI tool"
        integration: "CI pipeline"

      - name: "Lighthouse CI"
        type: "Performance + Accessibility"
        integration: "GitHub Actions"

    fail_on:
      - "WCAG AA violations"
      - "Missing alt text"
      - "Insufficient contrast"
      - "Keyboard navigation failures"
```

---

## Accessibility Statement

### Required Content

Every MRBS implementation SHOULD include an accessibility statement:

```markdown
# Accessibility Statement for {Organization Name}

## Our Commitment

{Organization Name} is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.

## Conformance Status

Our brand materials and digital properties conform to **WCAG 2.1 Level {AA|AAA}**.

### What This Means

- [Level AA/AAA] - Explanation of conformance level

## Measures to Support Accessibility

{Organization Name} takes the following measures to ensure accessibility:

- Include accessibility in our brand guidelines
- Provide continuous accessibility training for staff
- Test with assistive technologies
- Include people with disabilities in user testing
- Regularly audit our materials for accessibility

## Feedback

We welcome your feedback on the accessibility of {Organization Name} materials.

**Contact us:**
- Email: {accessibility@organization.com}
- Phone: {phone number}
- Mail: {physical address}

We aim to respond to accessibility feedback within {X business days}.

## Technical Specifications

Our brand materials rely on the following technologies:

- HTML5
- WAI-ARIA
- CSS3
- SVG

## Known Limitations

{List any known accessibility issues and planned remediation}

## Assessment Approach

{Organization Name} assessed the accessibility of our brand system through:

- Self-evaluation
- External accessibility audit by {Auditor Name} on {Date}
- Automated testing with {Tools}
- Manual testing with assistive technologies

## Formal Approval

This accessibility statement was approved by:
- {Name, Title}
- Date: {YYYY-MM-DD}

This statement was last reviewed on: **{Date}**
```

---

## Conclusion

Accessibility is not optional—it's a fundamental requirement for inclusive brand systems. Following this framework ensures your MRBS implementation is usable by everyone.

For questions or to report accessibility issues, contact the MRBS maintainers or open an issue at the [MRBS repository](https://github.com/MRBSystem/MRBS-Specification).

---

## Resources

### Testing Tools

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser (CCA)](https://www.tpgi.com/color-contrast-checker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Pa11y](https://pa11y.org/)

### Screen Readers

- [NVDA (Windows, free)](https://www.nvaccess.org/)
- [JAWS (Windows, paid)](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver (macOS/iOS, built-in)](https://www.apple.com/accessibility/voiceover/)
- [TalkBack (Android, built-in)](https://support.google.com/accessibility/android/answer/6283677)

### Standards and Guidelines

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Section 508](https://www.section508.gov/)
- [EN 301 549 (EU)](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf)

---

*MRBS Accessibility Framework v1.0*
