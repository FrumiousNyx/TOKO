async function loadProducts() {
    const container = document.getElementById('product-container');
    
    // GANTI link di bawah ini dengan URL Backend Vercel kamu nanti
    const BACKEND_URL = 'https://toko-nike-backend.vercel.app/api/products';

    try {
        const response = await fetch(BACKEND_URL);
        const products = await response.json();

        container.innerHTML = ''; // Hapus pesan loading

        products.forEach(item => {
            const card = `
                <div class="card">
                    <div class="img-placeholder"></div>
                    <div class="card-info">
                        <h3>${item.nama}</h3>
                        <p>${item.kategori}</p>
                        <p class="price">Rp ${item.harga.toLocaleString()}</p>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (error) {
        container.innerHTML = '<p>Gagal memuat produk. Pastikan Backend sudah jalan.</p>';
        console.error(error);
    }
}

loadProducts();