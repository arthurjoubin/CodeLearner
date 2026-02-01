---
name: "DeepSeek 3.2"
description: "DeepSeek's latest flagship with enhanced agentic capabilities and reasoning. Strong performance in coding and reasoning tasks with efficient MoE architecture at competitive pricing."
provider: "DeepSeek"
contextWindow: "128K tokens"
pricing: "$0.27 per million tokens (input), $1.10 per million tokens (output)"
website: "https://www.deepseek.com"
open: true
specialty: "Agentic reasoning"
strengths:
  - "Enhanced agentic capabilities"
  - "Strong coding performance"
  - "Reasoning-integrated responses"
  - "Very competitive pricing"
  - "Open-source weights available"
  - "Efficient MoE architecture"
weaknesses:
  - "Occasional censorship on sensitive topics"
  - "Context window smaller than competitors"
  - "Less refined for creative writing"
  - "Rate limits on free tier"
bestFor:
  - "Agent-based workflows"
  - "Coding and technical tasks"
  - "Reasoning-intensive applications"
  - "Cost-effective deployments"
  - "Research and analysis"
benchmarks:
  - { name: "HumanEval", score: "89%" }
  - { name: "MMLU", score: "88%" }
  - { name: "LiveCodeBench", score: "82%" }
  - { name: "SWE-Bench Verified", score: "68%" }
pubDate: "2025-01-20"
currentFavorite: false
---

## Overview

DeepSeek 3.2 is the latest flagship model from DeepSeek, released in January 2025. It builds upon the success of previous versions with enhanced agentic capabilities and integrated reasoning, making it particularly strong for coding tasks and autonomous agent workflows.

## Key Strengths

- **Agentic Excellence**: Native support for multi-step reasoning and tool use
- **Coding Prowess**: Strong performance on coding benchmarks with efficient inference
- **Cost Efficiency**: Among the most affordable frontier models available
- **Open Weights**: Model weights available for local deployment and fine-tuning
- **Reasoning Integration**: Built-in chain-of-thought capabilities

## Architecture

- **Architecture**: Mixture-of-Experts (MoE)
- **Context Window**: 128K tokens
- **Parameters**: 236B total (21B active per token)
- **Training**: Extensive pre-training on code and reasoning tasks

## Pricing

- Input (cached): ~$0.07 per million tokens
- Input (standard): ~$0.27 per million tokens
- Output: ~$1.10 per million tokens
- Extremely competitive pricing for the performance offered

## Evolution

| Version | Date de sortie | Score SWE-bench Verified | Évolution Majeure |
|---------|---------------|--------------------------|-------------------|
| DeepSeek V3 | Déc. 2024 | 45.4% | Version de base du flagship. |
| DeepSeek R1 | Jan. 2025 | 49.2% | Introduction du raisonnement pur (RL). |
| DeepSeek V3-0324 | Mars 2025 | 48.2% | Optimisation de l'architecture MoE. |
| DeepSeek R1-0528 | Mai 2025 | 53.5% | Amélioration du "Chain of Thought". |
| DeepSeek V3.1 | Août 2025 | 66.0% | Mode Hybride (Think/Non-Think). |
| DeepSeek V3.2-Exp | Sept. 2025 | 67.8% | Introduction de la Sparse Attention. |
| **DeepSeek V3.2** | **Déc. 2025** | **68.4%** | **Modèle actuel (Official Reasoner).** |
| DeepSeek V3.2 Spec. | Déc. 2025 | 73.1% | Version "Speciale" optimisée pour les agents. |

Progression impressionnante de +27.7 points en un an, montrant l'accent mis sur les capacités agentiques et le raisonnement.
