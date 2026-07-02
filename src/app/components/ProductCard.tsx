import { useState } from 'react';
import { Heart, Plus } from 'lucide-react';
import { useFavorites } from '@/app/hooks/useFavorites';
import { ProductQuickViewModal } from '@/app/components/ProductQuickViewModal';
import { CartDrawer } from '@/app/components/CartDrawer';

export interface ProductVariante {
  varId: number;
  varTalla: string;
  colorNombre?: string;
  colorId?: number | string;
  colorHex?: string;
  varStock: number;
  [key: string]: any; 
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  badge?: string;
  inStock?: boolean;
  proDescuento?: number;
  proDescuentoInicio?: string;
  proDescuentoFin?: string;
  colors?: (number | string)[];
  tallas?: string[];
  variantes?: ProductVariante[];
}

interface ProductCardProps {
  product: Product;
  activeFilters?: any; 
}

export function calcularDescuento(product: Product): { activo: boolean; precioFinal: number } {
  const { price, proDescuento, proDescuentoInicio, proDescuentoFin } = product;
  if (!proDescuento || !proDescuentoInicio || !proDescuentoFin) {
    return { activo: false, precioFinal: price };
  }

  const ahora = Date.now();
  const inicio = new Date(proDescuentoInicio).getTime();
  const fin = new Date(proDescuentoFin).getTime();
  const activo = ahora >= inicio && ahora <= fin;

  return {
    activo,
    precioFinal: activo ? price - price * (proDescuento / 100) : price,
  };
}

export function ProductCard({ product, activeFilters }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const wishlisted = isFavorite(product.id);
  const { activo: descuentoActivo, precioFinal } = calcularDescuento(product);

  // ── 🎯 DETECCIÓN MULTI-FORMATO (ID Y TEXTO) ──
  const colorFiltradoId = activeFilters?.colors?.[0]; 

  const MAPA_ID_A_NOMBRE: Record<number, string> = {
    1: 'blanco', 2: 'negro', 3: 'azul', 4: 'verde',
    5: 'amarillo', 6: 'rojo', 7: 'rosa', 8: 'morado',
    9: 'marron', 10: 'azul cielo', 11: 'gris', 12: 'beige'
  };
  const nombreColorFiltrado = colorFiltradoId ? MAPA_ID_A_NOMBRE[Number(colorFiltradoId)] : null;

// ── 🎯 PRUEBA DE CONSOLA EN VIVO ──
  if (colorFiltradoId) {
    console.log("-----------------------------------------");
    console.log(`🔎 Buscando Producto: ${product.name} (ID: ${product.id})`);
    console.log(`🎨 ID de Color seleccionado en Filtro:`, colorFiltradoId);
    console.log(`📋 Variantes disponibles en este producto:`, product?.variantes);
    
    product?.variantes?.forEach((v: any, index: number) => {
      console.log(`   👉 Variante [${index}]:`, {
        colorId_en_BD: v.colorId || v.idColor,
        colorNombre_en_BD: v.colorNombre,
        imagen_en_BD: v.varImagen || v.imagen || v.imagenUrl || v.proImagen
      });
    });
  }




  // Intentamos emparejar la variante usando cualquier dato disponible
  const varianteDelColorActivo = product?.variantes?.find((v: any) => {
    if (!v || !colorFiltradoId) return false;
    
    // Prueba 1: Comprobar si coincide directamente por ID numérico (ej: v.colorId === 6)
    if (v.colorId && String(v.colorId) === String(colorFiltradoId)) return true;
    if (v.idColor && String(v.idColor) === String(colorFiltradoId)) return true;

    // Prueba 2: Comprobar por texto normalizado (ej: "rojo" === "rojo")
    if (v.colorNombre && nombreColorFiltrado) {
      const nombreBase = v.colorNombre.toLowerCase().trim();
      if (nombreBase === nombreColorFiltrado) return true;
      if (nombreBase === `color${colorFiltradoId}`) return true; // Por si guardaste "color6"
    }

    return false;
  });

  // Recuperación dinámica de la propiedad de imagen que devuelva tu backend
  const imagenVariante = 
    varianteDelColorActivo?.varImagen || 
    varianteDelColorActivo?.imagen || 
    varianteDelColorActivo?.imagenUrl ||
    varianteDelColorActivo?.proImagen ||
    varianteDelColorActivo?.urlImagen;

  const imagenFinal = imagenVariante || product?.image || '';

  return (
    <>
      <div
        className="group cursor-pointer bg-white overflow-hidden transition-all duration-300"
        style={{
          boxShadow: isHovered
            ? '0 16px 40px rgba(124,58,237,0.13), 0 4px 16px rgba(0,0,0,0.06)'
            : '0 2px 12px rgba(124,58,237,0.07), 0 1px 4px rgba(0,0,0,0.04)',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="relative aspect-[3/4] overflow-hidden bg-gray-50"
          onClick={() => setModalOpen(true)}
        >
          {product.badge && product.inStock !== false && (
            <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-white text-xs uppercase tracking-wide bg-[#7c3aed]">
              {product.badge}
            </span>
          )}
          {product.inStock === false && (
            <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-white text-xs uppercase tracking-wide bg-gray-400">
              Agotado
            </span>
          )}

          <img
            src={imagenFinal}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
            style={{ opacity: isHovered && product.hoverImage && !colorFiltradoId ? 0 : 1 }}
          />

          {product.hoverImage && !colorFiltradoId && (
            <img
              src={product.hoverImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
              style={{ opacity: isHovered ? 1 : 0 }}
            />
          )}

          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              opacity: isHovered ? 1 : 0,
              boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Heart
              className="w-4 h-4"
              style={{ color: wishlisted ? '#7c3aed' : '#9ca3af', fill: wishlisted ? '#7c3aed' : 'none' }}
            />
          </button>
        </div>

        <div className="px-3.5 pt-3 pb-3.5 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-gray-800 mb-0.5 transition-colors duration-200"
              style={{ fontSize: 13, fontWeight: 500, color: isHovered ? '#7c3aed' : '' }}
            >
              {product.name}
            </p>
            <div className="flex items-baseline gap-1.5">
              {descuentoActivo ? (
                <>
                  <span className="line-through text-gray-400" style={{ fontSize: 12 }}>
                    S/ {product.price.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 17, fontWeight: 800, color: '#7c3aed' }}>
                    S/ {precioFinal.toFixed(2)}
                  </span>
                </>
              ) : (
                <span style={{ fontSize: 17, fontWeight: 800, color: '#7c3aed' }}>
                  S/ {product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
            disabled={product.inStock === false}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Ver producto"
            style={{
              background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
              boxShadow: '2px 2px 8px rgba(124,58,237,0.3)',
            }}
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={3} />
          </button>
        </div>
      </div>

      {modalOpen && (
        <ProductQuickViewModal
          product={product}
          onClose={() => setModalOpen(false)}
          onAdded={() => { setModalOpen(false); setCartDrawerOpen(true); }}
        />
      )}

      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} />
    </>
  );
}