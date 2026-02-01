---
name: "Kimi K2.5"
description: "Moonshot AI's open-weight flagship with 76.8% SWE-Bench. Best performance-to-cost ratio with native multimodal architecture."
provider: "Moonshot AI"
contextWindow: "256K tokens"
pricing: "$0.50 per million tokens (input), $2.80 per million tokens (output)"
website: "https://kimi.com"
strengths:
  - "Excellent performance/cost ratio"
  - "Open-weight model"
  - "Agent Swarm (100 parallel agents)"
  - "Visual-to-code generation"
  - "Transparent chain-of-thought"
  - "Native multimodal"
weaknesses:
  - "High hardware requirements (128-600GB RAM)"
  - "Occasional stability issues"
  - "Less mature ecosystem"
  - "Resources primarily in Chinese"
bestFor:
  - "Cost-sensitive projects"
  - "Visual-to-code workflows"
  - "Multi-agent orchestration"
  - "Frontend development"
  - "Self-hosted deployments"
benchmarks:
  - { name: "SWE-Bench Verified", score: "76.8%" }
  - { name: "BrowseComp", score: "78.4%" }
  - { name: "LiveCodeBench", score: "85.0%" }
  - { name: "HLE-Full", score: "50.2%" }
pubDate: "2025-02-01"
---

## Overview

Kimi K2.5 is Moonshot AI's January 2026 flagship model, achieving 76.8% on SWE-Bench Verified—just 3-4 points behind GPT-5.2 and Claude 4.5—while delivering a 10× cost advantage as an open-weight model.

## Key Strengths

- **Best Value**: 3-4 points behind frontier models at 1/10th the cost
- **Open-Weight**: Full deployment flexibility and local hosting
- **Agent Swarm**: Native support for 100 parallel agents with 4.5× speedup
- **Visual-to-Code**: Exceptional UI/screenshot to functional code generation
- **Transparent Reasoning**: Visible chain-of-thought for debugging

## Architecture

- **Parameters**: 1T/32B MoE (384 experts, 8 selected per token)
- **Context**: 256K tokens with lossless long-range attention
- **Vision**: MoonViT 400M encoder for native multimodal processing
- **Training**: 15T tokens

## Pricing

- Input (cached): ~$0.10 per million tokens
- Input (standard): ~$0.55 per million tokens  
- Output: ~$2.90 per million tokens
- Automatic context caching reduces costs by 75-83%

## Evolution

| Version | Date | SWE-Bench |
|---------|------|-----------|
| K2 Instruct | Jul 2025 | 65.8% |
| K2 Thinking | Nov 2025 | 71.3% |
| **K2.5** | **Jan 2026** | **76.8%** |

Consistent +5.5 point improvements per generation.
