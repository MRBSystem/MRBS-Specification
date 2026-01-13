# Contributing to MRBS

Thank you for your interest in contributing to the Machine-Readable Brand System specification!

## Ways to Contribute

### 1. Report Issues

Found a problem or have a suggestion? [Open an issue](https://github.com/MRBSystem/MRBS-Specification/issues/new) with:

- Clear title describing the issue
- Steps to reproduce (if applicable)
- Expected vs. actual behavior
- Your environment (if relevant)

### 2. Improve Documentation

Documentation improvements are always welcome:

- Fix typos or clarify wording
- Add examples
- Translate to other languages
- Improve getting started guides

### 3. Contribute to the Specification

For specification changes:

1. **Discuss first** — Open an issue to discuss significant changes before implementing
2. **Follow the process** — See [Specification Changes](#specification-changes) below
3. **Maintain compatibility** — Consider backward compatibility

### 4. Add Tools

The `/tools` directory welcomes:

- Validators for MRBS compliance
- Converters (from/to other formats)
- Integrations with AI platforms
- CLI utilities

### 5. Share Examples

- Real-world MRBS implementations (anonymized)
- Integration examples with AI tools
- Migration case studies

---

## Development Process

### Setting Up

```bash
# Clone the repository
git clone https://github.com/MRBSystem/MRBS-Specification.git
cd MRBS-Specification

# Install dependencies (for validators/tools)
npm install
```

### Running Validators

```bash
# Validate the example implementation
npm run validate:example

# Validate a specific brand system
npm run validate -- /path/to/brand.manifest.json
```

### Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "schema"
```

---

## Specification Changes

### Minor Changes (Patch)

- Typo fixes
- Clarifications
- Additional examples

Process: Submit PR directly.

### Moderate Changes (Minor Version)

- New optional fields
- New recommended patterns
- Extended examples

Process:
1. Open an issue for discussion
2. Get maintainer approval
3. Submit PR with updated CHANGELOG

### Significant Changes (Major Version)

- Breaking changes to schema
- New required fields
- Structural changes

Process:
1. Open RFC (Request for Comments) issue
2. Community discussion period (minimum 2 weeks)
3. Maintainer review and approval
4. Submit PR with full documentation

---

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows existing style
- [ ] Tests pass locally
- [ ] Documentation updated (if applicable)
- [ ] CHANGELOG updated (for specification changes)
- [ ] Commits are atomic and well-described

### PR Description Template

```markdown
## Summary
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Specification change

## Related Issues
Fixes #123

## Testing
How were these changes tested?

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] CHANGELOG updated
```

### Review Process

1. Automated checks run
2. Maintainer reviews
3. Discussion/iteration if needed
4. Approval and merge

---

## Code Style

### JSON Files

- 2-space indentation
- Trailing newline
- Keys in snake_case
- Use `$` prefix for meta-fields (following Design Tokens spec)

```json
{
  "$schema": "...",
  "color": {
    "primary": {
      "$value": "#0066CC",
      "$type": "color"
    }
  }
}
```

### YAML Files

- 2-space indentation
- Use quotes for strings with special characters
- Comments for non-obvious fields

```yaml
voice:
  # Core brand personality traits
  core_attributes:
    - "Professional but approachable"
```

### Markdown

- One sentence per line (for better diffs)
- Use reference-style links for repeated URLs
- Code blocks with language hints

---

## Governance

### Maintainers

Current maintainers are listed in [MAINTAINERS.md](./MAINTAINERS.md).

### Decision Making

- **Consensus** preferred for most decisions
- **Maintainer approval** required for specification changes
- **Community vote** for major/breaking changes

### Code of Conduct

We follow the [Contributor Covenant](https://www.contributor-covenant.org/). Be respectful, inclusive, and constructive.

---

## Recognition

Contributors are recognized in:

- [CONTRIBUTORS.md](./CONTRIBUTORS.md)
- Release notes
- Annual contributor highlights

---

## Questions?

- Open a [Discussion](https://github.com/MRBSystem/MRBS-Specification/discussions)
- Tag maintainers in issues

Thank you for helping make brand identity accessible to AI! 🎨🤖
