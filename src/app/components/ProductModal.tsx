import { useState } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function ProductModal({ product, onClose }: any) {
  const [selectedTalla, setSelectedTalla] = useState<string | null>(null);
  const { addToCart } = useCart();

  if (!product) return null;

  const ordenTallas: { [key: string]: number } = { 'S': 1, 'M': 2, 'L': 3, 'XL': 4 };
  const tallasOrdenadas = product?.tallas?.sort((a: string, b: string) => 
    (ordenTallas[a] || 99) - (ordenTallas[b] || 99)
  );

  const handleAddToCart = () => {
    if (!selectedTalla) {
      alert("Por favor, selecciona una talla.");
      return;
    }

    // CORRECCIÓN: Forzamos el precio a número aquí
    const precioNumerico = Number(product.price) || 0;

    addToCart({ 
      ...product, 
      talla: selectedTalla, 
      price: precioNumerico 
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <X size={20} />
        </button>
        <div className="flex flex-col md:flex-row gap-8">
          <img src={product.image} className="w-full md:w-1/2 aspect-square object-cover rounded-2xl" />
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-black uppercase">{product.name}</h2>
            <p className="text-3xl font-bold text-purple-600">S/ {Number(product.price || 0).toFixed(2)}</p>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-2">TALLA: {selectedTalla || 'SELECCIONA'}</p>
              <div className="flex flex-wrap gap-2">
                {tallasOrdenadas?.map((t: string) => (
                  <button key={t} onClick={() => setSelectedTalla(t)} className={`px-4 py-2 border-2 rounded-lg font-bold ${selectedTalla === t ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-200'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleAddToCart} className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800">
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}