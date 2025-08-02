/**
 * MCP CLI Server
 * This server provides a simple HTTP interface to interact with git commands.
 * It supports commands like diff, commit-message, branches, and show.
 * The server listens on port 8080 and allows cross-origin requests.
 * It can be used to discover available commands and execute them via HTTP requests.
 * Example configuration:
 * 
 * ```json
    {"mcpServers": {
        "nodeServer": {
            "command": "node",
            "args": ["mcp-servers/mcp-cli.js"],
            "trust": false
        }
    }```
 */

const http = require('http');
const { exec } = require('child_process');
const url = require('url');
const fs = require('fs');

const settingsPath = '../../.gemini/settings.json';
let settings = {};
try {
  const settingsData = fs.readFileSync(settingsPath, 'utf8');
  settings = JSON.parse(settingsData);
} catch (err) {
  console.error('Error reading settings file:', err);
}

const inactivityTimeout = settings.mcpServerConfig?.inactivityTimeout || 30000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;
  const command = pathname.slice(1);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === '/mcp/discover') {
    const discoveryData = {
      tools: [
        { name: 'diff', description: 'Show the output of git diff' },
        { name: 'commit-message', description: 'Show the output of git diff --staged' },
        { name: 'branches', description: 'Show the output of git branch' },
        {
          name: 'show',
          description: 'Show the content of a file from a specific branch',
          parameters: {
            branch: { type: 'string', description: 'The branch to show the file from' },
            file: { type: 'string', description: 'The file to show' }
          }
        }
      ]
    };
    res.writeHead(200);
    res.end(JSON.stringify(discoveryData));
    return;
  }

  let gitCommand;

  switch (command) {
    case 'diff':
      gitCommand = 'git diff';
      break;
    case 'commit-message':
      gitCommand = 'git diff --staged';
      break;
    case 'branches':
      gitCommand = 'git branch';
      break;
    case 'show':
      const { branch, file } = query;
      if (!branch || !file) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Missing branch or file parameter for show command' }));
        return;
      }
      gitCommand = `git show ${branch}:${file}`;
      break;
    default:
      res.writeHead(404);
      res.end(JSON.stringify({ error: `Unknown command: ${command}` }));
      return;
  }

  exec(gitCommand, (err, stdout, stderr) => {
    if (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: stderr }));
      return;
    }
    res.writeHead(200);
    res.end(JSON.stringify({ content: stdout }));
  });
});

const port = 8080;
let serverInstance;

const startServer = () => {
  serverInstance = server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    resetShutdownTimer();
  });
};

let shutdownTimer;
const resetShutdownTimer = () => {
  if (shutdownTimer) {
    clearTimeout(shutdownTimer);
  }
  shutdownTimer = setTimeout(() => {
    console.log('Server shutting down due to inactivity.');
    serverInstance.close();
  }, inactivityTimeout);
};

server.on('request', resetShutdownTimer);

startServer();

