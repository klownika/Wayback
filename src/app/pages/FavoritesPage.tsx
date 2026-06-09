import { useState } from 'react';
import { Heart, ShoppingBag, X, Filter } from 'lucide-react';

// Mock data de productos favoritos
const mockFavorites = [
  {
    id: 1,
    name: 'Blusa Crop Satinada',
    price: 890,
    originalPrice: 1200,
    image: 'https://images.unsplash.com/photo-1766043071269-93f60fe04df2?w=400&q=75',
    category: 'Blusas',
    inStock: true,
    discount: 25,
  },
  {
    id: 2,
    name: 'Vestido Midi Floral',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1765229276796-c93c73cc3f3b?w=400&q=75',
    category: 'Vestidos',
    inStock: true,
  },
  {
    id: 3,
    name: 'Conjunto Urbano Negro',
    price: 2100,
    originalPrice: 2600,
    image: 'https://images.unsplash.com/photo-1766043071333-5d82991da1ea?w=400&q=75',
    category: 'Conjuntos',
    inStock: false,
    discount: 19,
  },
  {
    id: 4,
    name: 'Top Crop Rayas',
    price: 650,
    image: 'https://images.unsplash.com/photo-1766043071255-64d4ef2ba3a8?w=400&q=75',
    category: 'Tops',
    inStock: true,
  },
  {
    id: 5,
    name: 'Jeans Wide Leg',
    price: 1350,
    image: 'https://images.unsplash.com/photo-1775234576198-a1c680241c07?w=400&q=75',
    category: 'Jeans',
    inStock: true,
  },
  {
    id: 6,
    name: 'Chaqueta Oversize',
    price: 2890,
    originalPrice: 3500,
    image: 'https://images.unsplash.com/photo-1768289222309-23f768607538?w=400&q=75',
    category: 'Chaquetas',
    inStock: true,
    discount: 17,
  },
];

export function FavoritesPage() {
  const [favorites, setFavorites] = useState(mockFavorites);
  const [filter, setFilter] = useState<'all' | 'inStock' | 'onSale'>('all');

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  const filteredFavorites = favorites.filter((item) => {
    if (filter === 'inStock') return item.inStock;
    if (filter === 'onSale') return item.discount;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-[#c70fff] fill-[#c70fff]" />
            <h1 className="text-3xl text-[#c70fff] bg-clip-text text-transparent">
              Mis Favoritos
            </h1>
          </div>
          <p className="text-gray-600">
            {favorites.length} {favorites.length === 1 ? 'artículo guardado' : 'artículos guardados'}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[rgba(199,15,255,0.15)] mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  filter === 'all'
                    ? 'bg-[#c70fff] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('inStock')}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  filter === 'inStock'
                    ? 'bg-[#c70fff] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Disponibles
              </button>
              <button
                onClick={() => setFilter('onSale')}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  filter === 'onSale'
                    ? 'bg-[#c70fff] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                En oferta
              </button>
            </div>
          </div>
        </div>

        {/* Favorites Grid */}
        {filteredFavorites.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[rgba(199,15,255,0.15)]">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No hay favoritos en esta categoría
            </h3>
            <p className="text-gray-500">
              {filter === 'all'
                ? 'Aún no has guardado ningún producto favorito'
                : 'Cambia el filtro para ver otros productos'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[rgba(199,15,255,0.15)] hover:shadow-lg transition-all duration-300 group"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Discount Badge */}
                  {item.discount && (
                    <div className="absolute top-3 left-3 bg-[#c70fff] text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{item.discount}%
                    </div>
                  )}

                  {/* Stock Badge */}
                  {!item.inStock && (
                    <div className="absolute top-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Agotado
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Quick Add Button */}
                  {item.inStock && (
                    <button className="absolute bottom-3 left-3 right-3 bg-[#c70fff] text-white py-3 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 flex items-center justify-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Agregar al carrito
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-xs text-[#c70fff] mb-1">{item.category}</p>
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-800">
                      ${item.price.toLocaleString()}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {favorites.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[rgba(199,15,255,0.15)]">
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Tu lista de favoritos está vacía
            </h3>
            <p className="text-gray-500 mb-6">
              Guarda tus productos favoritos para encontrarlos fácilmente más tarde
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-[#c70fff] text-white rounded-full hover:bg-[#a800d9] transition-colors"
            >
              Explorar productos
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
