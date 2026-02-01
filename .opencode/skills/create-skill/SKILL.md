---
name: create-skill
description: How to create and structure OpenCode agent skills
license: MIT
compatibility: opencode
metadata:
  category: documentation
---

## What I do

Guide you through creating OpenCode agent skills.

## File Structure

```
.opencode/skills/<skill-name>/
  └── SKILL.md
```

Or global (available everywhere):
```
~/.config/opencode/skills/<skill-name>/SKILL.md
```

## SKILL.md Template

```markdown
---
name: <skill-name>
description: Brief description of what this skill does
license: MIT
compatibility: opencode
metadata:
  category: <category>
---

## What I do

- List what the skill helps with
- Be specific about use cases

## When to use me

Describe when this skill should be loaded.

## Examples

Provide concrete examples, commands, or patterns.
```

## Naming Rules

- **1-64 characters**
- **Lowercase alphanumeric** with single hyphens
- **No leading/trailing hyphens**
- **No consecutive hyphens** (`--`)
- **Must match directory name**

Valid: `git-release`, `cloudflare-d1`, `react-testing`
Invalid: `GitRelease`, `cloudflare--d1`, `-git-release`

## Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Skill identifier (must match folder name) |
| `description` | Yes | 1-1024 chars, shown in skill list |
| `license` | No | License type |
| `compatibility` | No | `opencode` or `claude` |
| `metadata` | No | Key-value pairs for filtering |

## How Agents Use Skills

1. Agent sees available skills in the skill tool description
2. Agent calls `skill({ name: "skill-name" })` to load it
3. Full SKILL.md content is injected into context

## Testing Your Skill

1. Create the file at `.opencode/skills/<name>/SKILL.md`
2. Start a new OpenCode session
3. Ask "What skills are available?"
4. Test loading it: "Load the <name> skill"

## Permissions (opencode.json)

```json
{
  "permission": {
    "skill": {
      "*": "allow",
      "experimental-*": "ask",
      "internal-*": "deny"
    }
  }
}
```

- `allow`: Load immediately
- `ask`: Prompt user first
- `deny`: Hide from agent
