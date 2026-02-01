const http = require('http');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose'); // Tambahkan ini

// Koneksi ke MongoDB menggunakan Environment Variable dari Vercel
const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI)
  .then(() => console.log("Terhubung ke MongoDB!"))
  .catch(err => console.error("Gagal konek MongoDB:", err));

const server = http.createServer((req, res) => {
    // Jalankan logika API di sini (Contoh: ambil data produk)
    if (req.url === '/api/products') {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ message: "Koneksi Backend Berhasil!" }));
        return;
    }

    // Melayani file statis (HTML, CSS, JS)
    let filePath = req.url === '/' ? './index.html' : `.${req.url}`;
    let extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
    };

    let contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404);
            res.end('File Tidak Ditemukan');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Vercel akan menentukan PORT secara otomatis, jadi kita gunakan process.env.PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});