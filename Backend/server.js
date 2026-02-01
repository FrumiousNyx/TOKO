const http = require('http');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI)
  .then(() => console.log("Terhubung ke MongoDB!"))
  .catch(err => console.error("Gagal konek MongoDB:", err));

const ProductSchema = new mongoose.Schema({
    nama: String,
    harga: Number,
    kategori: String
});
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const server = http.createServer(async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/api/products') {
        try {
            const products = await Product.find();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(products));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Gagal ambil data database" }));
        }
    } else {
        // Halaman utama server jika bukan akses /api/products
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Backend Nike Store sudah aktif dan terhubung ke MongoDB.');
    }
});

// Ganti bagian paling bawah server.js kamu dengan ini:
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
}

module.exports = server;