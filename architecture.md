# Architecture Document
Project: AI Water Usage Estimator
Version: 1.0

---

# Goals

The architecture should prioritize:

- Modularity
- Maintainability
- Extensibility
- Performance
- Testability

Every major feature should be replaceable without affecting the rest of the system.

---

# High Level Architecture

                    Browser Extension
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
 Background Service Worker             Content Script
        │                                     │
        │                            Detect AI Responses
        │                                     │
        │                            Parse Response
        │                                     │
        │                             Estimate Tokens
        │                                     │
        │                             Estimate Water
        │                                     │
        │                              Update Storage
        │                                     │
        │                             Inject Inline UI
        │
        │
 Popup Dashboard
        │
 Settings Page
        │
 Methodology Page

---

# Technology Stack

Language

- TypeScript

Framework

- React

Bundler

- Vite

State

- Zustand

Storage

- chrome.storage.local

Charts

- Chart.js

Testing

- Vitest

End-to-End

- Playwright

Linting

- ESLint

Formatting

- Prettier

---

# Folder Structure

src/

    adapters/

        chatgpt/

        claude/

        gemini/

        adapter.interface.ts

    estimator/

        water.ts

        energy.ts

        carbon.ts

        confidence.ts

        constants.ts

    tokenizer/

        tokenizer.ts

        fallback.ts

        providers/

    storage/

        storage.ts

        statistics.ts

        settings.ts

    content/

        observer.ts

        injector.ts

        renderer.ts

        parser.ts

    background/

        index.ts

        messaging.ts

    popup/

        components/

        pages/

        hooks/

    options/

        pages/

        components/

    methodology/

        page.tsx

    shared/

        types/

        utils/

        constants/

        hooks/

    ui/

        Badge.tsx

        Tooltip.tsx

        Card.tsx

        Spinner.tsx

        Theme.ts

---

# Layer Responsibilities

Adapters

Responsible for interacting with specific AI websites.

Each adapter knows:

- DOM selectors
- response containers
- prompt containers
- streaming behavior

Adapters never perform calculations.

---

Estimator

Responsible for all calculations.

Input

ResponseData

Output

WaterEstimate

No UI logic.

No DOM access.

Pure functions only.

---

Storage

Responsible for:

settings

history

statistics

totals

Uses chrome.storage.local.

Never accessed directly by UI.

Always use repository methods.

---

Content Layer

Responsible for:

DOM observation

Response detection

Response parsing

UI injection

Never stores data.

Never performs calculations.

---

Popup

Responsible for:

Dashboard

Statistics

History

Settings shortcuts

---

Options

Responsible for:

Configuration

Units

Display preferences

Methodology

---

Methodology

Static information.

Research references.

Formula explanation.

Disclaimers.

---

# Adapter Pattern

Every provider implements:

interface AIProviderAdapter {

    name

    matches(url)

    observe()

    extractPrompt()

    extractResponse()

    responseFinished()

}

Supported providers

ChatGPTAdapter

ClaudeAdapter

GeminiAdapter

Future

PerplexityAdapter

DeepSeekAdapter

CursorAdapter

CopilotAdapter

OpenRouterAdapter

---

# Response Flow

User sends prompt

↓

MutationObserver detects changes

↓

Adapter parses response

↓

Tokenizer estimates tokens

↓

Estimator calculates

↓

Storage updates totals

↓

Renderer injects badge

---

# Water Estimator

Interface

estimateWater()

Input

{

inputTokens

outputTokens

provider

model

}

Output

{

waterML

confidence

energyWh

carbonGrams

}

Estimator should never touch the DOM.

---

# Tokenizer

Interface

estimateTokens()

Implementations

Character heuristic

Future

OpenAI tokenizer

Claude tokenizer

Gemini tokenizer

Fallback always available.

---

# Confidence Engine

Return

High

Medium

Low

Factors

Known provider

Known tokenizer

Known model

Unknown model

Character estimation

Example

Known tokenizer

+

Known provider

=

High

---

# Storage Schema

settings

{

enabled

units

theme

showTooltip

showConfidence

}

statistics

{

today

lifetime

history

}

history

{

date

provider

water

tokens

}

---

# Messaging

Background ↔ Content

Use message passing only.

Never access storage directly from popup.

Popup requests data from background.

Background returns state.

---

# UI Components

Badge

Displays

💧 18 mL

Tooltip

Displays

Water

Confidence

Methodology

Dashboard Card

Displays

Totals

Charts

History

Settings Toggle

Simple switch.

---

# Theme

Support

Light

Dark

Auto

Use CSS variables.

No inline styles.

---

# Styling

Use CSS Modules.

Avoid global CSS.

Every component owns its styles.

---

# Error Handling

If provider unsupported

Do nothing.

If parsing fails

Log debug message.

If estimation fails

Display

Unavailable

Never throw uncaught exceptions.

---

# Performance

MutationObserver

Debounce updates.

Never poll DOM.

Reuse observers.

Avoid repeated token estimation.

Cache response hashes.

---

# Caching

Cache

Last parsed response

Last estimate

Provider lookup

Avoid recalculating unchanged responses.

---

# Logging

Development

Verbose

Production

Errors only.

Debug mode configurable.

---

# Testing Strategy

Unit

Estimator

Tokenizer

Confidence

Storage

Integration

Adapters

Renderer

Popup

E2E

ChatGPT

Claude

Gemini

Streaming responses

Dark mode

Conversation switching

---

# Coding Standards

Strict TypeScript

No any

No magic numbers

Small functions

Pure calculations

Dependency Injection where practical

Single Responsibility Principle

Maximum function length

50 lines

Maximum file length

300 lines preferred

---

# Extending Providers

Adding a new provider should require:

1.

Create adapter

2.

Register adapter

3.

Provide selectors

No other code changes.

---

# Future Architecture

v2

Plugin system

External estimation engine

Cloud synchronization (optional)

Custom estimation models

Research updates

Regional water estimates

Provider-specific tokenizers

---

# Security

Never transmit user prompts.

Never upload conversations.

Never collect analytics.

Local-first architecture.

Least-permission browser extension.

---

# Design Principles

- Pure business logic
- Adapter-based provider support
- Configuration over hardcoding
- Local-first
- Privacy-first
- Easily testable
- Easily extensible
- High performance