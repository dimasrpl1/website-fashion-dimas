// src/app/collection/produk/[id]/page.tsx
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function ProdukDetailPage(props: { params: { id: string } }) {
  const params = await props.params; // WAJIB di Next.js 15
  const id = params.id;

  const { data: product, error } = await supabase
    .from('produk')
    .select(`
      id,
      nama,
      deskripsi,
      harga,
      status,
      produk_gambar (
        url
      )
    `)
    .eq('id', id)
    .single();

  if (error || !product) {
    console.error('Gagal memuat detail produk:', error?.message);
    notFound();
  }

  const imageUrl =
    Array.isArray(product.produk_gambar) && product.produk_gambar.length > 0
      ? product.produk_gambar[0].url
      : '/no-image.jpg';

  const isExternalImage = imageUrl.startsWith('http');
  const whatsappLink = `https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20produk:%20${encodeURIComponent(
    product.nama
  )}`;

  // Konversi status ke boolean
  const isAvailable =
    product.status === true ||
    product.status === 1 ||
    product.status === 'true';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-24 px-6 md:px-12 lg:px-24">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            {isExternalImage ? (
              <img
                src={imageUrl}
                alt={product.nama}
                className={`w-full h-auto object-cover rounded-lg ${
                  !isAvailable ? 'filter blur-sm grayscale' : ''
                }`}
              />
            ) : (
              <Image
                src={imageUrl}
                alt={product.nama}
                width={600}
                height={400}
                className={`w-full h-auto object-cover rounded-lg ${
                  !isAvailable ? 'filter blur-sm grayscale' : ''
                }`}
              />
            )}
            {/* Overlay SOLD jika tidak tersedia */}
            {!isAvailable && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-600/90 backdrop-blur-sm px-6 py-3 rounded-sm border border-red-500/50">
                  <span className="text-white font-light tracking-[0.2em] text-sm sm:text-base uppercase">
                    SOLD
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">
              {product.nama}
            </h1>
            <p className="text-gray-700 mb-4">{product.deskripsi}</p>
            <p className={`text-2xl font-bold mb-6 ${
              isAvailable ? 'text-green-600' : 'text-gray-400 line-through'
            }`}>
              Rp{product.harga.toLocaleString('id-ID')}
            </p>

            {isAvailable ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
              >
                Chat via WhatsApp
              </a>
            ) : (
              <span className="inline-block bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed opacity-70">
                Tidak Tersedia
              </span>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
