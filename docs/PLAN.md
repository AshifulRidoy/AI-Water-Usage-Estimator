# AI Water Usage Estimator Extension
Version: 1.0

---

# Vision

Build a browser extension that estimates the environmental impact of Large Language Model (LLM) usage by displaying estimated water consumption for every AI response.

The extension should work on major AI platforms including:

- ChatGPT
- Claude
- Gemini

Future support:

- Perplexity
- Grok
- DeepSeek
- Poe
- Cursor
- GitHub Copilot
- OpenRouter

The project is educational.

It MUST never claim exact water consumption.

Every value displayed is an estimate based on publicly available research.

---

# Core Goals

Users should immediately see:

💧 Estimated Water Used

after every AI response.

Example:

💧 21 mL

Hover:

Estimated water usage based on token count and published sustainability research.

---

# Success Criteria

The extension should:

✔ Detect AI responses automatically

✔ Estimate token count

✔ Calculate estimated water usage

✔ Display results inline

✔ Store lifetime statistics

✔ Store daily statistics

✔ Work with dark/light themes

✔ Be fast (<10ms calculation)

✔ Never interfere with website functionality

---

# MVP Scope

Support:

- ChatGPT
- Claude
- Gemini

Features:

- Inline water badge
- Popup dashboard
- Lifetime statistics
- Daily statistics
- Settings page
- Methodology page

---

# Not Included in MVP

No login

No cloud sync

No telemetry

No analytics

No user accounts

No server backend

Entire project should work locally.

---

# Estimation Pipeline

User Prompt

↓

Prompt detected

↓

Response detected

↓

Estimate tokens

↓

Estimate energy

↓

Estimate water

↓

Inject UI

---

# Water Estimation Formula

Inputs:

- input tokens
- output tokens
- model family
- estimated GPU efficiency

Output:

Estimated Water (mL)

Pseudo:

water = f(tokens, energy_per_token, WUE)

Do NOT hardcode random values.

Keep formulas configurable.

---

# Extension Architecture

Browser Extension

Background

- storage
- settings
- calculations

Content Scripts

- DOM observation
- UI injection

Popup

- dashboard
- charts

Options

- settings
- methodology

Shared Library

- estimator
- tokenizer
- storage
- utils

---

# UI Components

Inline Badge

Example:

💧 18 mL

Tooltip

Estimated water usage

Confidence: Medium

Based on:

• token count

• estimated model efficiency

• published research

Popup

Today

Water

Energy

CO₂

Lifetime

History

Settings

Options Page

Units

mL

Liters

Theme

Light

Dark

Auto

Methodology

Research links

Formula

Limitations

Disclaimer

---

# Storage

chrome.storage.local

Store:

daily totals

lifetime totals

history

preferences

---

# Future Features

Carbon emissions

Electricity usage

Regional estimation

GPU estimation

Provider comparison

Prompt efficiency suggestions

Export CSV

Weekly reports

Achievements

Open API

---

# Engineering Principles

Never block the page.

Avoid polling.

Use MutationObserver.

Minimize DOM mutations.

Use TypeScript everywhere.

Write reusable components.

No duplicated logic.

No magic numbers.

Everything configurable.

---

# Error Handling

If estimation fails

Display:

Unavailable

instead of fake values.

Never crash.

Never break websites.

---

# Performance Targets

Content script

<50ms startup

Calculation

<10ms

Memory

<20MB

No noticeable slowdown.

---

# Testing

Unit tests

Estimator

Tokenizer

Storage

Integration

ChatGPT

Claude

Gemini

Manual

Dark mode

Long responses

Streaming responses

Conversation switching

---

# Release Plan

Version 0.1

ChatGPT only

Version 0.2

Claude

Gemini

Version 0.3

Dashboard

Settings

Version 1.0

Public release

Chrome Store

Firefox

Edge