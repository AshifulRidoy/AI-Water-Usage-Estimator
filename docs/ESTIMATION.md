# ESTIMATION.md
Project: AI Water Usage Estimator
Version: 1.0

---

# Purpose

This document defines the estimation engine used throughout the application.

It specifies:

- Mathematical formulas
- Configurable constants
- Confidence scoring
- Provider assumptions
- Units
- Versioning

The estimation engine MUST be deterministic.

Given the same input, it MUST always produce the same output.

---

# Important Principle

The extension DOES NOT measure resource consumption.

It estimates resource consumption.

Every displayed value should include:

≈

Example

💧 ≈ 17 mL

Never display

💧 17 mL

---

# Input Schema

The estimator receives the following input.

```ts
interface EstimationInput {
    provider: string
    model?: string

    inputTokens: number
    outputTokens: number

    tokenizer: "provider" | "heuristic"

    timestamp: number
}
```

---

# Output Schema

```ts
interface EstimationResult {

    waterML: number

    energyWh: number

    carbonGrams: number

    confidence: "High" | "Medium" | "Low"

    estimationVersion: string
}
```

---

# Total Tokens

```
TotalTokens =
InputTokens + OutputTokens
```

---

# Energy Estimation

Version 1 uses a configurable constant.

```
Energy (Wh)

=

Total Tokens

×

EnergyPerToken
```

Where

```
EnergyPerToken

=

CONFIG.ENERGY_PER_TOKEN
```

Never hardcode this value.

---

# Water Estimation

```
Water

=

Energy

×

WaterUsageFactor
```

Where

```
WaterUsageFactor

=

CONFIG.WATER_PER_WH
```

---

# Carbon Estimation

```
Carbon

=

Energy

×

CarbonFactor
```

Where

```
CarbonFactor

=

CONFIG.CARBON_PER_WH
```

---

# Configurable Constants

Version 1

```ts
CONFIG = {

    ENERGY_PER_TOKEN:

        configurable,

    WATER_PER_WH:

        configurable,

    CARBON_PER_WH:

        configurable

}
```

All values should be loaded from one configuration file.

Future versions may download updated values.

---

# Confidence Scoring

High

Requirements

Known provider

Known tokenizer

Known model

---

Medium

Known provider

Known tokenizer

Unknown model

---

Low

Unknown provider

Character heuristic

Unknown model

---

Pseudo

```text
if
provider
&& tokenizer
&& model

↓

High


else if

provider
&& tokenizer

↓

Medium


else

↓

Low
```

---

# Token Estimation

Preferred

Provider tokenizer

Fallback

Character estimation

Formula

```
Estimated Tokens

=

Characters

÷

CharactersPerToken
```

Default

```
CharactersPerToken

=

4
```

Configurable.

---

# Rounding

Display

Water

One decimal place

Example

18.4 mL

Energy

Two decimal places

Example

0.13 Wh

Carbon

Two decimal places

Example

0.09 g

Internal calculations should preserve full precision.

---

# Minimum Display

If estimate

<0.1 mL

Display

```
<0.1 mL
```

Do not display

0 mL

---

# Maximum Display

If

>1000 mL

Display

```
1.25 L
```

Automatically convert.

---

# Unit Conversion

Supported

Water

mL

L

US fl oz

Energy

Wh

kWh

Carbon

g

kg

---

# Provider Defaults

Version 1

ChatGPT

Unknown Model

Claude

Unknown Model

Gemini

Unknown Model

The estimator should remain provider-independent.

Provider-specific tuning belongs in future versions.

---

# Unsupported Providers

If provider cannot be identified

Use

Generic configuration

Confidence

Low

---

# Versioning

Each estimate includes

```
estimationVersion
```

Example

```
1.0.0
```

Displayed in Methodology.

---

# Error Handling

Invalid token count

↓

Return

Unavailable

Negative values

↓

Throw validation error

NaN

↓

Unavailable

Never crash UI.

---

# Validation Rules

Input Tokens

>=0

Output Tokens

>=0

Provider

Required

Tokenizer

Required

Timestamp

Required

---

# Future Models

Version 2

Separate estimation models

ChatGPT

Claude

Gemini

DeepSeek

Perplexity

OpenRouter

Each provider may override:

EnergyPerToken

WaterPerWh

CarbonPerWh

Confidence

---

# Future Improvements

Model-aware estimation

Region-aware estimation

GPU-aware estimation

Datacenter-aware estimation

Real-time sustainability APIs

Research-backed constants

Streaming estimation

---

# Testing

The estimator must have 100% unit test coverage.

Test

Zero tokens

Large responses

Long prompts

Unknown providers

Missing model

Negative values

NaN

Unit conversions

Confidence calculation

Rounding

---

# Golden Rule

The estimation engine should be completely independent of:

Browser

DOM

React

Chrome APIs

Storage

UI

It should behave like a pure mathematical library.

Input

↓

Calculation

↓

Output

Nothing more.
