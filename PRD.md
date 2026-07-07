# Product Requirements Document

# Project

AI Water Usage Estimator

---

# Problem

Millions of people use AI every day.

Most users have no visibility into the environmental cost of AI inference.

Although exact resource consumption cannot be measured from the client side, meaningful estimates can educate users and encourage more efficient AI usage.

---

# Objective

Create a browser extension that estimates water consumption for AI requests in real time.

The product should make sustainability visible without interrupting normal AI workflows.

---

# Primary Users

Students

Developers

Researchers

Knowledge workers

Environmentally conscious users

AI enthusiasts

---

# User Stories

As a ChatGPT user

I want to know the estimated water usage of each response

so I understand its environmental impact.

---

As a Claude user

I want to compare my total usage over time

so I can reduce unnecessary prompts.

---

As a researcher

I want transparent methodology

so I can understand where estimates come from.

---

# Functional Requirements

## Response Detection

Detect:

user message

assistant response

response completion

Support streaming responses.

---

## Token Estimation

Estimate:

input tokens

output tokens

Allow provider-specific tokenizers later.

Fallback:

character estimation.

---

## Water Estimation

Produce:

water (mL)

confidence

Future:

energy

CO₂

---

## Inline UI

Display below every response:

💧 18 mL

Hover:

Estimated Water Usage

Confidence

Methodology

---

## Dashboard

Show:

Today's usage

Lifetime usage

Number of prompts

Average per prompt

Largest prompt

History

---

## Settings

Enable

Disable extension

Units

Theme

Tooltip

Confidence

---

## Methodology

Dedicated page explaining:

Research sources

Formula

Limitations

Assumptions

Disclaimers

---

# Non-functional Requirements

Fast

Lightweight

Offline

No backend

No tracking

No ads

No cookies

No analytics

---

# Data Storage

Local only

Store

settings

daily stats

history

lifetime totals

No personal conversations stored.

---

# Security

Least privilege permissions

Never read passwords

Never collect prompts

Never upload data

---

# Browser Support

Chrome

Edge

Firefox

Brave

Opera

Manifest V3

---

# UI Requirements

Modern

Minimal

Native-looking

Dark mode

Light mode

Accessible

Responsive popup

---

# Estimation Engine

Inputs

Estimated token count

Estimated model efficiency

Estimated WUE

Outputs

Water estimate

Confidence

Formula should be configurable.

No constants embedded in UI code.

---

# Architecture

Content Script

↓

DOM Observer

↓

Response Parser

↓

Tokenizer

↓

Estimator

↓

Storage

↓

UI Renderer

---

# Risks

Provider DOM changes

Streaming responses

Unknown model versions

Unknown infrastructure

Different tokenizer behavior

Unknown regional data centers

Mitigation

Modular site adapters

Configurable estimators

Transparent assumptions

---

# Acceptance Criteria

The extension must:

Detect AI responses

Estimate token count

Display inline water estimate

Store cumulative totals

Work on ChatGPT

Work on Claude

Work on Gemini

Work in dark mode

Not noticeably slow pages

Never interfere with AI websites

---

# Nice-to-have Features

Weekly report

CSV export

Energy estimation

CO₂ estimation

Provider comparison

Prompt optimization tips

Regional estimates

Model selection

Achievement system

Open estimation API

---

# Out of Scope

Backend

Accounts

Cloud sync

Mobile apps

Prompt logging

Conversation export

AI chatbot

Authentication

Payments

Subscriptions

Telemetry

---

# Success Metrics

Installation count

Daily active users

Average extension rating

Calculation latency

Crash-free sessions

User retention

Store reviews

Methodology transparency