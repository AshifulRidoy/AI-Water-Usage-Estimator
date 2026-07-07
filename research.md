# Research & Estimation Methodology
Project: AI Water Usage Estimator
Version: 1.0

---

# Purpose

This document defines the scientific assumptions used to estimate the environmental impact of Large Language Model (LLM) inference.

The browser extension DOES NOT measure actual water usage.

Instead, it estimates usage using publicly available research, sustainability reports, and peer-reviewed studies.

Every displayed value should be labeled as an estimate.

---

# Disclaimer

The extension cannot determine:

- The exact GPU used
- The actual datacenter
- Cooling technology
- Water recycling systems
- Regional Water Usage Effectiveness (WUE)
- Exact energy consumed
- Internal optimizations used by AI providers

Therefore every estimate includes uncertainty.

---

# Research Sources

Primary categories

• Google Sustainability Reports

• Microsoft Sustainability Reports

• NVIDIA GPU Power Specifications

• Academic papers on AI inference energy consumption

• Research on Water Usage Effectiveness (WUE)

• Research on carbon footprint of LLM inference

Future versions should include direct citations with publication year, DOI, or URL where applicable.

---

# High Level Model

User Prompt

↓

Input Tokens

↓

Output Tokens

↓

Estimated Compute

↓

Estimated Energy

↓

Estimated Water

↓

Display

---

# Variables

Input Tokens

Estimated number of prompt tokens.

Output Tokens

Estimated number of generated tokens.

Estimated Compute

Approximate computation required for inference.

Estimated Energy

Estimated electrical energy used.

Estimated Water

Estimated freshwater consumed for cooling and electricity generation.

---

# Token Estimation

Preferred

Provider tokenizer

Fallback

Character heuristic

Approximation

English

1 token ≈ 4 characters

For languages with different tokenization behavior, confidence should be reduced.

---

# Estimation Formula

Water

EstimatedWater

=

EstimatedEnergy

×

WaterUsageFactor

Where

EstimatedEnergy

=

TotalTokens

×

EnergyPerToken

All constants must remain configurable.

Never hardcode values inside UI components.

---

# Confidence Levels

High

Known provider

Known tokenizer

Known model

Medium

Known provider

Estimated tokenizer

Unknown model

Low

Unknown provider

Character heuristic only

Confidence should always be displayed alongside the estimate.

---

# Assumptions

The estimation assumes:

- Modern accelerator hardware
- Typical inference workloads
- Average datacenter efficiency
- Public cloud infrastructure
- Average WUE values rather than provider-specific measurements

---

# Units

Water

mL

L

Energy

Wh

kWh

Carbon

gCO₂e

kgCO₂e

---

# Scientific Limitations

The extension cannot account for:

Batch inference

Dynamic batching

Quantization

Mixture of Experts routing

Speculative decoding

Caching

Provider optimizations

Regional energy mix

Renewable energy usage

Water recycling

Waste heat reuse

Therefore estimates should be interpreted as educational approximations.

---

# Display Rules

Always display

Estimated Water

Never display

Water Used

Always include

≈

Example

💧 ≈18 mL

Not

💧18 mL

---

# Transparency

Users should be able to inspect:

Formula

Research assumptions

Confidence level

Known limitations

Version of estimation engine

---

# Future Improvements

Provider-specific estimation models

Regional estimation

Live sustainability APIs (if providers expose them)

Dynamic model identification

GPU family estimation

Better tokenizer support

---

# Validation Strategy

Compare estimated values against:

Published research

Academic benchmarks

Provider sustainability reports

Community feedback

Estimation consistency

---

# Versioning

Research assumptions should be versioned independently from application releases.

Example

Research v1.0

Application v1.3.2

This allows estimation improvements without major code changes.