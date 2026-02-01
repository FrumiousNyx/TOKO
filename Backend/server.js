const http = require('http');
const mongoose = require('mongoose');

// 1. Koneksi ke MongoDB menggunakan variabel dari Vercel
const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI)
  .then(() => console.log("Terhubung ke MongoDB!"))
  .catch(err => console.error("Gagal konek MongoDB:", err));

// 2. Definisikan Skema Produk (Sesuaikan dengan nama kolom di MongoDB kamu)
const ProductSchema = new mongoose.Schema({
    nama: String,
    harga: Number,
    kategori: String
});
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// 3. Buat Server
const server = http.createServer(async (req, res) => {
    
    // Setting header agar bisa diakses oleh link frontend vercel kamu (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Jalankan logika API untuk ambil data asli
    if (req.url === '/api/products') {
        try {
            const products = await Product.find(); // Ini langkah yang mengambil data asli
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(products));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Gagal ambil data database" }));
        }
        return;
    }

    // Jika akses halaman utama server
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Backend Nike Store sudah aktif dan terhubung ke MongoDB.');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});