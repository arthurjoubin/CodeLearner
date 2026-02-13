# Lesson Quality Review

## Progress: 0/0 reviewed

_Last updated: 2026-02-13_

---

## Review Instructions

When reviewing lessons, check for the following issues:

### 1. Rendering Issues
- **Inline code with HTML tags** (e.g., `<html>`, `<div>`) in "Essential to know" sections will render as invisible HTML elements due to a known bug in the custom markdown parser
- Broken markdown syntax (unclosed backticks, malformed links)
- Unclosed code blocks

### 2. "Essential to know" Block Issues
- Any backtick inline code containing HTML-like text (e.g., `<tag>`) will be eaten by the browser
- The parser only handles **bold** text in this block, NOT inline code
- This is a known bug to flag for fixing

### 3. Content Quality
- Factual errors or outdated information
- Incomplete explanations
- Missing sections after the `---` separator
- Lessons that seem too short or incomplete

### 4. Code Examples
- Syntax errors in `codeExample` field
- Mismatches between lesson content and code example
- Missing or unclear code examples

### 5. Structural Issues
- Missing "# Essential to know" section
- Missing `---` separator
- Inconsistent formatting

### Status Legend
- `[ ]` - Not reviewed
- `[OK]` - All good, no issues found
- `[!]` - Has issues (see notes)

---

---

## Review Notes

Use this section to document issues found during review:

### Format: Lesson ID - Issue Description

#### Example:
- `jsx-basics-1` - Inline code `<div>` not rendering in "Essential to know" section (known parser bug)
- `git-basics-3` - Missing code example for `git log` command
- `css-layout-2` - Broken link to flexbox documentation

### Issues Log:

