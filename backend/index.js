// server.js

const http = require('http');
const WebSocket = require('ws');
const pty = require('node-pty');

const server = http.createServer();

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  const cols = 80;
  const rows = 24;

  const shell = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols,
    rows,
    cwd: process.env.HOME,
    env: process.env,
  });

  shell.on('data', (data) => {
    ws.send(data);
  });

  ws.on('message', (msg) => {
    shell.write(msg);
  });

  ws.on('close', () => {
    shell.kill();
  });

  ws.send('Connected to bash shell.');
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`WebSocket server listening on port ${PORT}`);
});
