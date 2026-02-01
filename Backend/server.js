const http = require('http');
const mongoose = require('mongoose');

// 1. Ambil MONGO_URI dari Environment Variable Vercel
const MONGO_URI = process.env.MONGO_URI; 

// 2. Koneksi ke MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("Terhubung ke MongoDB!"))
  .catch(err => console.error("Gagal konek MongoDB:", err));

// 3. Definisi Skema Produk
const ProductSchema = new mongoose.Schema({
    nama: String,
    harga: Number,
    kategori: String
});

// Perbaikan: Menambahkan 'producs' (tanpa 't') sebagai nama koleksi eksplisit 
// agar sesuai dengan screenshot database kamu.
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema, 'producs');

// 4. Buat Server
const server = http.createServer(async (req, res) => {
    
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
            // Pastikan koneksi DB sudah siap (status 1 = connected)
            if (mongoose.connection.readyState !== 1) {
                res.writeHead(503, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Database belum siap, coba lagi nanti." }));
                return;
            }

            const products = await Product.find();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(products));
        } catch (err) {
            console.error("Error saat ambil data:", err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Gagal ambil data dari database" }));
        }
        return;
    }

    // Halaman utama jika akses URL selain /api/products
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Backend Nike Store sudah aktif dan terhubung ke MongoDB.');
});

// PENTING: Hanya jalankan server.listen jika di lingkungan Lokal (Bukan Vercel)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`Server lokal berjalan di port ${PORT}`);
    });
}

// Export server untuk digunakan oleh Vercel
module.exports = server;