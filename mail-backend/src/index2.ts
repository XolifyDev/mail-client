import * as https from "https";
import * as fs from "fs";
import Imap from "imap";
import { simpleParser } from "mailparser";
import * as path from "path";
import { inspect } from "util";

const certsPath = path.join(
  process.env.HOME! || process.env.USERPROFILE!,
  "certs"
);

console.log(fs.readFileSync(path.join(certsPath, "server.key")));

// SSL/TLS server options
const serverOptions: https.ServerOptions = {
  key: fs.readFileSync(path.join(certsPath, "server.key")),
  cert: fs.readFileSync(path.join(certsPath, "server.crt")),
  ca: fs.readFileSync(path.join(certsPath, "server.crt")), // Add this line
};

// Create HTTPS server
const httpsServer = https.createServer(serverOptions, (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, secure world!\n");
});

// IMAP configuration
// @ts-ignore
const imapConfig: Imap.ImapOptions = {
  user: "nagariawaleed@gmail.com",
  password: "msen kcnx fuvc gzzv",
  host: "imap.gmail.com",
  port: 993,
  tls: true,
};
// Start HTTPS server
const PORT = 3000;
httpsServer.listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}/`);
});
