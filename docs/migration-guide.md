# Migration Guide

How to convert traditional brand guidelines (PDF, documents) to MRBS format.

---

## Overview

| Phase | Duration | Activities |
|-------|----------|------------|
| 1. Audit | 1-2 weeks | Inventory existing assets |
| 2. Extract | 1-2 weeks | Pull values and rules |
| 3. Structure | 2-3 weeks | Create MRBS files |
| 4. Validate | 1 week | Test with AI agents |
| 5. Deploy | 1 week | Roll out and train |

---

## Phase 1: Audit Existing Assets

### Inventory Checklist

**Visual Assets**
- [ ] Logo files (formats: AI, EPS, SVG, PNG?)
- [ ] Color palette documentation
- [ ] Typography specimens
- [ ] Spacing/grid guidelines
- [ ] Icon library
- [ ] Photography guidelines
- [ ] Pattern/texture library

**Written Guidelines**
- [ ] Brand voice documentation
- [ ] Tone guidelines
- [ ] Writing style guide
- [ ] Messaging frameworks
- [ ] Boilerplate text

**Templates**
- [ ] Presentation templates (PPT, Keynote, Google Slides)
- [ ] Document templates (Word, Google Docs)
- [ ] Email templates
- [ ] Social media templates
- [ ] Letterhead/stationery

**Rules & Constraints**
- [ ] Logo usage do's/don'ts
- [ ] Color usage rules
- [ ] Typography rules
- [ ] Legal requirements (trademark, disclaimers)

### Document Sources

For each source, note:
- Location (file path, URL)
- Format (PDF, DOCX, PPT, etc.)
- Last updated date
- Owner/maintainer

---

## Phase 2: Extract Values and Rules

### Colors

**From PDF:**
```
Primary Blue
HEX: #0066CC
RGB: 0, 102, 204
CMYK: 100, 60, 0, 0
Use for headlines and primary CTAs
```

**To MRBS:**
```json
{
  "primary": {
    "$value": "#0066CC",
    "$type": "color",
    "cmyk": "100, 60, 0, 0",
    "usage": {
      "recommended": ["headlines", "primary_ctas"],
      "prohibited": ["body_text"]
    }
  }
}
```

### Typography

**From PDF:**
```
Headlines: Inter Bold, 24-48pt
Body: Source Sans Pro Regular, 16pt minimum
Line height: 1.5 for body text
```

**To MRBS:**
```json
{
  "font_family": {
    "heading": {
      "$value": "Inter",
      "weights": [700],
      "usage": "headlines"
    },
    "body": {
      "$value": "Source Sans Pro",
      "weights": [400]
    }
  },
  "scale": {
    "h1": {"$value": "48pt", "font_weight": 700},
    "body": {"$value": "16pt", "line_height": 1.5}
  },
  "rules": {
    "minimum_body_size": "16pt"
  }
}
```

### Voice Guidelines

**From PDF:**
```
Our voice is professional yet approachable. We speak with 
confidence but never arrogance. In formal documents, maintain 
a serious tone. For social media, we can be more conversational.
```

**To MRBS:**
```yaml
voice:
  core_attributes:
    - "Professional yet approachable"
    - "Confident without arrogance"

tone_by_context:
  formal:
    use_for: ["legal", "investor_communications"]
    characteristics: ["serious", "precise"]
    rules:
      contractions: false
      
  conversational:
    use_for: ["social_media", "blog"]
    characteristics: ["warm", "friendly"]
    rules:
      contractions: true
```

### Logo Rules

**From PDF:**
```
DO:
- Use approved logo files only
- Maintain clear space equal to height of logo mark
- Use white version on dark backgrounds

DON'T:
- Rotate or skew the logo
- Change logo colors
- Place on busy backgrounds
```

**To MRBS:**
```yaml
logo:
  clear_space:
    measurement: "height of logo mark"
    minimum: "1x on all sides"
    
  variants:
    - id: "primary"
      usage: "light backgrounds"
    - id: "reversed"
      usage: "dark backgrounds (luminance < 0.5)"
      
  do:
    - "Use approved logo files only"
    - "Maintain minimum clear space"
    - "Use reversed version on dark backgrounds"
    
  dont:
    - "Rotate or skew"
    - "Change colors"
    - "Place on busy backgrounds"
```

---

## Phase 3: Structure the System

### Create Directory Structure

```bash
mkdir -p brand-system/{identity,visual,assets/logos,templates/presentation,rules,examples/{correct,incorrect}}
```

### File Creation Order

1. **brand.manifest.json** — Start here, reference other files
2. **visual/colors.tokens.json** — Core visual identity
3. **visual/typography.tokens.json** — Font definitions
4. **identity/voice-tone.yaml** — Writing guidelines
5. **rules/constraints.yaml** — Do's and don'ts
6. **templates/presentation/manifest.json** — Template definitions
7. **rules/accessibility.yaml** — WCAG requirements
8. **assets/logos/manifest.json** — Logo file inventory

### Conversion Templates

Use these templates to speed up conversion:

**colors.tokens.json template:**
```json
{
  "$schema": "https://mrbs.dev/schema/v1/colors.tokens.json",
  "color": {
    "brand": {
      "primary": {
        "$value": "#REPLACE",
        "$type": "color",
        "usage": {
          "recommended": [],
          "prohibited": []
        }
      }
    },
    "neutral": {},
    "semantic": {}
  }
}
```

**voice-tone.yaml template:**
```yaml
voice:
  core_attributes: []
  we_are: []
  we_are_not: []

tone_by_context:
  formal:
    use_for: []
    rules:
      contractions: false
  professional:
    use_for: []
    rules:
      contractions: limited
  conversational:
    use_for: []
    rules:
      contractions: true
```

---

## Phase 4: Validate

### Schema Validation

```bash
# If using the MRBS validator
mrbs validate ./brand-system

# Or validate JSON manually
npx ajv validate -s schema/brand.manifest.schema.json -d brand.manifest.json
```

### Reference Validation

Check that all paths exist:

```bash
# List all referenced paths from manifest
cat brand.manifest.json | jq -r '.components[]' | while read path; do
  if [ ! -d "$path" ] && [ ! -f "$path" ]; then
    echo "Missing: $path"
  fi
done
```

### AI Testing

Test with actual AI agents:

1. **Basic test:** "Create a headline using brand colors"
2. **Voice test:** "Write a formal email following brand voice"
3. **Template test:** "Create a 5-slide presentation"
4. **Constraint test:** "Create a slide with 10 bullet points" (should be rejected/limited)

### Document Issues

Track problems found during testing:

| Issue | Location | Resolution |
|-------|----------|------------|
| AI used wrong color | colors.tokens.json | Added explicit prohibition |
| Bullets exceeded limit | constraints.yaml | Added max_bullets rule |
| Tone too casual | voice-tone.yaml | Clarified formal context |

---

## Phase 5: Deploy

### Version Control

```bash
git init
git add .
git commit -m "Initial MRBS brand system v1.0.0"
git tag v1.0.0
```

### Distribution Options

1. **Git repository** — For teams using version control
2. **Shared drive** — For non-technical users
3. **API endpoint** — For programmatic access
4. **MCP server** — For Claude integration

### Training

Create documentation for:

- **Brand managers:** How to update the system
- **Designers:** How to use with design tools
- **AI users:** How to reference in prompts
- **Developers:** How to integrate with applications

### Maintenance Plan

- **Weekly:** Review AI-generated content for compliance
- **Monthly:** Update based on common issues
- **Quarterly:** Full audit against source brandbook
- **Annually:** Major version review

---

## Common Challenges

### Challenge: Ambiguous Guidelines

**Problem:** PDF says "use appropriate spacing"

**Solution:** Define specific values
```json
{
  "spacing": {
    "section_gap": {"$value": "48px"},
    "element_gap": {"$value": "16px"}
  }
}
```

### Challenge: Subjective Rules

**Problem:** "Headlines should be impactful"

**Solution:** Convert to testable constraints
```yaml
headlines:
  max_words: 8
  style: "benefit-focused, action-oriented"
  examples:
    good: ["Transform Your Business Today"]
    bad: ["Information About Our Services"]
```

### Challenge: Missing Information

**Problem:** Brandbook doesn't specify contrast requirements

**Solution:** Add based on WCAG standards
```yaml
accessibility:
  min_contrast_text: 4.5
  min_contrast_large: 3.0
```

### Challenge: Conflicting Rules

**Problem:** Different documents have different values

**Solution:** 
1. Identify authoritative source
2. Document the decision
3. Update all references

### Challenge: Complex Templates

**Problem:** Template has many variants and exceptions

**Solution:** Break into discrete layouts with clear rules
```json
{
  "layouts": [
    {"id": "title", "usage": "required_first"},
    {"id": "content_text", "usage": "standard"},
    {"id": "content_image", "usage": "visual_support"}
  ]
}
```

---

## Migration Checklist

### Pre-Migration
- [ ] Identify all brand asset sources
- [ ] Get stakeholder buy-in
- [ ] Assign migration owner
- [ ] Set timeline

### During Migration
- [ ] Create manifest first
- [ ] Convert visual tokens
- [ ] Convert voice guidelines
- [ ] Document constraints
- [ ] Test with AI agents
- [ ] Iterate based on results

### Post-Migration
- [ ] Deploy to team
- [ ] Train users
- [ ] Set up maintenance schedule
- [ ] Archive old brandbook (don't delete)
- [ ] Monitor AI output quality

---

## Success Metrics

| Metric | Before MRBS | After MRBS | Target |
|--------|-------------|------------|--------|
| Time to create presentation | 4-8 hours | 15-30 min | 90%↓ |
| Brand compliance rate | 60-70% | 95%+ | 95%+ |
| Revision cycles | 2-4 rounds | 0-1 rounds | 75%↓ |
| Designer bottleneck | High | Eliminated | — |
