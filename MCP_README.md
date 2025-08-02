# Mini-MCP Server for Git Operations

This file provides instructions for using the local mini-MCP server to automate common Git tasks.

## Purpose

The `mcp-server.js` file runs a lightweight Node.js server that exposes several API endpoints to interact with your local Git repository. This allows for quick, scriptable access to Git commands without leaving your editor or terminal.

## How to Start the Server

To start the server, run the following command in your terminal:

```bash
node mcp-server.js
```

The server will start and listen on `http://localhost:3000`.

## API Endpoints

Here are the available endpoints and how to use them:

*   **Generate a Diff**

    ```bash
    curl http://localhost:3000/diff
    ```

*   **Get Staged Changes for a Commit Message**

    ```bash
    curl http://localhost:3000/commit-message
    ```

*   **List Branches**

    ```bash
    curl http://localhost:3000/branches
    ```

*   **Get File Contents from Another Branch**

    ```bash
    curl "http://localhost:3000/show?branch=main&file=README.md"
    ```
