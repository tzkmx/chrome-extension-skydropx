# GEMINI.MD: AI Collaboration Guide

This document provides essential context for AI models interacting with this project. Adhering to these guidelines will ensure consistency and maintain code quality.

## 1. Project Overview & Purpose

* **Primary Goal:** This project is a Chrome extension that provides accessibility helpers and automates repetitive tasks on the SkyDropX web application, specifically targeting quote and order forms.
* **Business Domain:** Logistics and Shipping.

## 2. Core Technologies & Stack

* **Languages:** JavaScript (ES6+).
* **Frameworks & Runtimes:** Chrome Extension environment (Manifest V3).
* **Databases:** Not applicable.
* **Key Libraries/Dependencies:** None. The project uses vanilla JavaScript.
* **Package Manager(s):** Not applicable.

## 3. Architectural Patterns

* **Overall Architecture:** This is a browser extension that injects content scripts into a specific website. The architecture is event-driven, using `MutationObserver` to detect changes in the DOM and trigger actions.
* **Directory Structure Philosophy:**
    * `content.js`: The main content script that interacts with the SkyDropX website.
    * `playwright-like.js`: A utility script that provides functions to simulate user input (typing, pasting) in a way that is compatible with modern web frameworks like React.
    * `manifest.json`: The Chrome extension manifest file, which defines the extension's properties and permissions.
    * `popup.html`: The HTML file for the extension's popup.
    * `notes.txt`: Contains developer notes and ideas for future improvements.
    * `.gitignore`: Specifies files to be ignored by Git.

## 4. Coding Conventions & Style Guide

* **Formatting:** The code uses 2-space indentation.
* **Naming Conventions:**
    * `functions`: camelCase (`handleFormTweaks`)
    * `variables`: camelCase (`versionLabel`)
* **API Design:** Not applicable.
* **Error Handling:** The code uses `Promise`-based error handling with `.catch()` blocks for asynchronous operations.
*   **Semicolons:** Do not use semicolons at the end of lines or files in JavaScript or TypeScript code. The only permitted use of a semicolon is at the beginning of a line to prevent ambiguity with Automatic Semicolon Insertion (ASI), for example, when a line starts with an expression.

## 5. Key Files & Entrypoints

* **Main Entrypoint(s):** `content.js` is the main entrypoint, which is injected into the SkyDropX website.
* **Configuration:** `manifest.json` is the primary configuration file for the extension.

## 6. Development & Testing Workflow

* **Local Development Environment:** To develop this extension, you need to load it as an unpacked extension in Google Chrome.
* **Testing:** There are no automated tests in this project. Testing is done manually by loading the extension and interacting with the SkyDropX website.
* **CI/CD Process:** Not applicable.

## 7. Specific Instructions for AI Collaboration

* **Contribution Guidelines:** There are no formal contribution guidelines.
* **Infrastructure (IaC):** Not applicable.
* **Security:** Be mindful of security when interacting with the DOM and handling user data.
* **Dependencies:** There are no external dependencies.
* **Commit Messages:** There is no formal commit message convention.
