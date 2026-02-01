---
name: "Codex 5.2"
description: "OpenAI's dedicated coding agent model. Optimized for autonomous software engineering tasks with the ability to run commands, write tests, and create PRs independently."
provider: "OpenAI"
contextWindow: "192K tokens"
pricing: "$3 per million tokens (input), $12 per million tokens (output)"
website: "https://openai.com/codex"
strengths:
  - "Autonomous coding agent capabilities"
  - "Can run commands and tests"
  - "Creates pull requests"
  - "Works in isolated sandbox"
  - "Optimizes for human-style code"
weaknesses:
  - "Limited to coding tasks"
  - "Requires task delegation"
  - "Slower than interactive coding"
bestFor:
  - "Autonomous software development"
  - "Large-scale refactoring"
  - "Bug fixing at scale"
  - "Multi-file code changes"
benchmarks:
  - { name: "SWE-Bench Verified", score: "72%" }
  - { name: "HumanEval", score: "93%" }
  - { name: "LiveCodeBench", score: "88%" }
pubDate: "2025-02-01"
open: false
specialty: "Coding agent"
---

## Overview

Codex 5.2 is OpenAI's specialized coding agent, designed to autonomously handle software engineering tasks from writing features to fixing bugs and creating pull requests.

## Key Strengths

- **Agent Autonomy**: Works independently on coding tasks
- **Environment Execution**: Runs commands, tests, and linters
- **Git Integration**: Creates commits and pull requests
- **Human-Style Code**: Generates code matching team conventions
- **Sandboxed**: Isolated execution environment for security

## Architecture

- **Base Model**: Optimized o3 variant
- **Context Window**: 192K tokens
- **Training**: RL on real-world coding tasks
- **Execution**: Cloud-based sandbox environment

## Pricing

- Input: ~$3 per million tokens
- Output: ~$12 per million tokens
- Available via ChatGPT Pro/Enterprise

## Evolution

| Version | Date | Score SWE-Bench Verified | Statut / Rôle |
|---------|------|--------------------------|---------------|
| o3 (Full Reasoning) | Déc 2024 | 71.7% | Pionnier du raisonnement long. |
| GPT-4.1 Codex | Fév 2025 | 66.5% | Spécialisation "Code Agent". |
| GPT-5.0 Codex | Mai 2025 | 71.0% | Première version GPT-5 Code. |
| GPT-5.1 Codex | Août 2025 | 76.3% | Optimisation multi-fichiers. |
| **GPT-5.2 Codex** | **Déc 2025** | **80.0%** | **Concurrent n°1 d'Opus.** |

Spécialisation progressive sur le codage agentique avec des gains de +13.5 points en un an.
