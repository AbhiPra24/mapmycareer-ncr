# AGENTS.md – Token & Quota Optimization Guidelines

This repository operates under strict token and API quota constraints. All agent behavior must adhere to the following operational rules.

---

## 1. Zero-Fluff Communication
- **No Fillers:** Omit greetings, pleasantries, apologies, and conversational boilerplate (e.g., avoid "Sure, I can help with that!", "Here is the code you requested").
- **Direct Output:** Deliver code, commands, or answers directly without preambles.
- **No Unsolicited Explanations:** Do not explain basic programming concepts or narrate your inner monologue unless explicitly prompted.

---

## 2. Strict Context Management (Anti-Bloat)
- **No Folder Crawls:** Never run broad recursive directory listings, workspace scans, or unstructured searches. If paths are unknown or ambiguous, ask the user directly for specific file paths.
- **Targeted Reading:** Read only the explicit lines or files required for the immediate task. Never pull in speculative or peripheral reference files "just in case."

---

## 3. Surgical Execution & Diff Optimization
- **Surgical Edits Only:** When modifying existing code, update only the target lines, functions, or blocks. Never rewrite unchanged files or produce full-file replacements for minor diffs.
- **Plan Gate on Complex Tasks:** For multi-file changes or non-trivial refactors, provide a concise 3-4 bullet plan and await user confirmation before executing file writes or heavy tool calls.
- **Fail-Fast Rule (2-Strike Max):** If a command, test, or tool call fails twice consecutively, halt immediately, present the error trace, and request user direction. Do not enter automated retry loops.

---

## 4. Session Hygiene
- **Prompt Session Resets:** Upon completing a self-contained feature, bug fix, or refactor, remind the user to run `/clear` or start a new conversation to flush dead context.
