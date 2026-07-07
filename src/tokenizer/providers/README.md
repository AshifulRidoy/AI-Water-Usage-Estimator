# Provider Tokenizers (v2, not yet implemented)

Per PRD.md "Future Improvements" and ESTIMATION.md "Future Models", each provider
may eventually ship its own exact tokenizer (OpenAI, Claude, Gemini). This directory
is where those implementations will live, one file per provider
(e.g. `openai.ts`, `claude.ts`, `gemini.ts`), each exporting a function matching the
`(text: string) => TokenEstimate` shape used by `tokenizer/tokenizer.ts`.

v1 intentionally ships only the character-heuristic fallback (architecture.md:
"Fallback always available"). Wiring a real tokenizer here later should require
no changes outside this directory and `tokenizer/tokenizer.ts`'s registry function.
