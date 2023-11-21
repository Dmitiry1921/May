import http from 'http';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'node:url';
import {STATIC_SERVER_PORT, STATIC_SERVER_URL} from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const [POST = STATIC_SERVER_PORT] = process.argv.slice(2);

const server = http.createServer((req, res) => {
  if(req.url === '/') {
    // Возвращаем пустую страницу для тестирования
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Playwright test Page</title></head><body></body></html>');
    return;
  }
	const parsedPath = path.parse(req.url);
  const filePath = path.join(__dirname, '../', req.url, parsedPath.ext ? '' : 'index.js');
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.statusCode = 404;
      res.end('Page not found');
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
        return;
      }

      const ext = path.extname(filePath);
      let contentType;

      switch (ext) {
        case '.html':
          contentType = 'text/html';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.js':
          contentType = 'text/javascript';
          break;
        default:
          contentType = 'text/plain';
          break;
      }

      res.setHeader('Content-Type', contentType);
      res.end(data);
    });
  });
});

server.listen(POST, () => {
  console.log(`Server is running on ${STATIC_SERVER_URL}`);
});
