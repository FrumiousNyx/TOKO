const http = require('http');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// 1. Definisikan Skema Produk agar sesuai dengan isi database kamu
const ProductSchema = new mongoose.Schema({
    nama: String,
    harga: Number,
    kategori: String
});
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI)
  .then(() => console.log("Terhubung ke MongoDB!"))
  .catch(err => console.error("Gagal konek MongoDB:", err));

// Tambahkan "async" di sini agar bisa menggunakan "await"
const server = http.createServer(async (req, res) => {
    
    // 2. Logika API untuk mengambil data asli dari MongoDB
    if (req.url === '/api/products') {
        try {
            const products = await Product.find(); // Mengambil semua data produk
            res.writeHead(200, { 
                'Content-Type': 'application/json', 
                'Access-Control-Allow-Origin': '*' // Izinkan Frontend mengakses data ini
            });
            res.end(JSON.stringify(products));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Gagal mengambil data dari database" }));
        }
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});