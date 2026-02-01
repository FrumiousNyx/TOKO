const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Tentukan file yang diminta
    let filePath = req.url === '/' ? './index.html' : `.${req.url}`;
    
    // Ambil ekstensi file (misal: .css, .html)
    let extname = String(path.extname(filePath)).toLowerCase();
    
    // Tentukan tipe konten berdasarkan ekstensi
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
    };

    let contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('File Tidak Ditemukan');
            } else {
                res.writeHead(500);
                res.end(`Maaf, ada error: ${error.code} ..\n`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server sudah ok! Klik di sini: http://localhost:${PORT}`);
});