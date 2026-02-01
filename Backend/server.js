const http = require('http');
const mongoose = require('mongoose');

// 1. Ambil MONGO_URI dari Environment Variable Vercel
const MONGO_URI = process.env.MONGO_URI;

// 2. Definisi Skema Produk
const ProductSchema = new mongoose.Schema({
    nama: String,
    harga: Number,
    kategori: String
});

// Menggunakan nama koleksi 'producs' sesuai dengan database kamu
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema, 'producs');

// Fungsi pembantu untuk koneksi database yang stabil di Vercel
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Terhubung ke MongoDB!");
    } catch (err) {
        console.error("Gagal koneksi MongoDB:", err);
    }
};

// 3. Buat Server
const server = http.createServer(async (req, res) => {
    // Pastikan koneksi DB siap sebelum memproses request
    await connectDB();

    // Setting header CORS agar Frontend bisa mengakses API
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request untuk CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // API Route untuk mengambil produk
    if (req.url === '/api/products') {
        try {
            // Cek sekali lagi status koneksi
            if (mongoose.connection.readyState !== 1) {
                res.writeHead(503, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: "Database masih dalam proses menyambung, silakan refresh." }));
            }

            const products = await Product.find({});
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(products));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Terjadi kesalahan pada server", details: err.message }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Route tidak ditemukan. Gunakan /api/products" }));
    }
});

// Export untuk Vercel
module.exports = server;

// Jalankan server jika dijalankan secara lokal
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`Server jalan di port ${PORT}`);
    });
}