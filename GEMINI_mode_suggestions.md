# Analysis and Suggestions for GEMINI Mode Files

This document contains the analysis and suggestions for improving the `GEMINI.md` mode-switching workflow.

## Analysis: Division of Concerns

You've correctly established three distinct documents:

1.  **`GEMINI.md`**: This is the **Project Context**. It tells me *what* the project is, its architecture, its coding styles, and its specific files. It's the source of truth for this specific codebase.
2.  **`GEMINI.plan.md`**: This is a **Behavioral Mode**. It tells me *how* to act when I need to be a read-only analyst and planner.
3.  **`GEMINI.implement.md`**: This is also a **Behavioral Mode**. It tells me *how* to act when I need to be a code-writing, test-driven builder.

The core idea is sound. My main suggestion is to make the separation of concerns even cleaner.

## Suggestions for Improvement

### 1. Make Behavioral Modes Project-Agnostic

A "behavioral mode" file should be reusable across different projects. To achieve this, we should remove any project-specific rules from them.

*   **Suggestion:** In `GEMINI.implement.md`, I recommend **deleting the "Coding Style" section** about semicolons.

*   **Reasoning:** The "no semicolons" rule is specific to *this* project and is already correctly defined in the main `GEMINI.md`. If you were to use `GEMINI.implement.md` on a different project that *does* use semicolons, the instruction would be incorrect. The behavioral template should only define the *process* (e.g., "work in increments," "run tests"), not the specific coding style of a project.

### 2. Keep `GEMINI.md` as the Single Source of Truth for Project Rules

Your current `GEMINI.md` is excellent. It should remain the central document for all project-specific information:
*   Tech Stack (JS, Chrome Ext)
*   Directory Structure (`lib/`, `content.js`)
*   Coding Conventions (2-space indent, **no semicolons**)
*   Test Commands (manual for now, but could be `npm test` in the future)

### The "Mode Switching" Workflow

You mentioned you don't want to physically replace `GEMINI.md` each time. I completely agree. Here is how we can make this work seamlessly:

When you want to start a task, you simply tell me which mode to use in your prompt.

*   **Example 1 (Plan Mode):**
    > "I need to add a feature that saves user preferences. **Let's start in Plan Mode.** Please analyze the best way to store data in a Chrome extension and create a plan."

*   **Example 2 (Implement Mode):**
    > "The plan for the preferences feature is approved. **Please switch to Implement Mode** and execute it."

When you give me such a command, I will mentally combine the instructions from two documents:
1.  The **Project Context** from `GEMINI.md`.
2.  The **Behavioral Process** from the mode file you specified (e.g., `GEMINI.plan.md`).

This gives you a simple, prompt-based way to control my workflow without needing any file operations.

## Summary of Recommendations

1.  **Modify `GEMINI.implement.md`**: Remove the "Coding Style" section to make it a purely behavioral, project-agnostic template.
2.  **Keep `GEMINI.md` and `GEMINI.plan.md` as they are.** They are well-structured for their respective purposes.
3.  **Adopt the prompt-based mode switching.** Just tell me which "hat" to wear for each task.
