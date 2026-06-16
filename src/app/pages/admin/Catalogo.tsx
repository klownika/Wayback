import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router'; 
import { FilterSidebar } from '@/app/components/FilterSidebar';
import { ProductCard } from '@/app/components/ProductCard'; 
import { getProductos } from '@/lib/api';
import type { Product } from '@/lib/api';
import type { ProductFilters } from '@/app/types/database';

export function CatalogoPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 
  const [searchParams, setSearchParams] = useSearchParams(); 

  // Capturamos si viene alguna categoría por URL (ej. desde el inicio de la tienda)
  const categoriaUrl = searchParams.get('categoria');
  
  // Estado de filtros extendido para recibir el array de prendas del FilterSidebar
  const [filters, setFilters] = useState<any>({
    categorias: categoriaUrl ? [categoriaUrl] : [], 
    sexo: [],
    colors: [],
    tallas: [],
    soloDisponibles: false,
    precioMin: 0,
    precioMax: 500
  });

  // Sincroniza los filtros si la URL cambia dinámicamente
  useEffect(() => {
    if (categoriaUrl) {
      setFilters((prev: any) => ({
        ...prev,
        categorias: prev.categorias.includes(categoriaUrl) ? prev.categorias : [...prev.categorias, categoriaUrl]
      }));
    }
  }, [categoriaUrl]);

  // Consumo limpio de tu API en Render
  useEffect(() => {
    setLoading(true);
    getProductos()
      .then(res => {
        console.log("👉 [Wayback API Debug]:", res ? res[0] : "Sin datos");
        setProductos(res ?? []);
      })
      .catch(err => console.error("Error conectando a la API:", err))
      .finally(() => setLoading(false));
  }, []);

  // Función de escape para limpiar filtros y URL de un solo golpe
  const resetAll = () => {
    setSearchParams({});
    setFilters({
      categorias: [],
      sexo: [],
      colors: [],
      tallas: [],
      soloDisponibles: false,
      precioMin: 0,
      precioMax: 500
    });
  };

  // ── FILTRADO ULTRA-DEFENSIVO CONTRA LA BASE DE DATOS ──
  const productosFiltrados = useMemo(() => {
    const normalizarTexto = (texto: any) => {
      if (!texto) return "";
      return String(texto)
        .normalize("NFD")                     
        .replace(/[\u0300-\u036f]/g, "")     
        .toLowerCase()
        .trim();
    };

    return productos.filter((producto) => {
      // 📦 A. Filtro Multi-Prendas (Categorías del Sidebar)
      if (filters.categorias && filters.categorias.length > 0) {
        const catProducto = producto.categoria ?? producto.categoriaNombre ?? producto.proCategoria ?? "";
        const match = filters.categorias.some((c: string) => normalizarTexto(catProducto) === normalizarTexto(c));
        if (!match) return false;
      }

      // 🚻 B. Filtro de Género
      if (filters.sexo.length > 0) {
        const generoProducto = producto.sexo ?? producto.genero ?? producto.proSexo ?? "";
        const match = filters.sexo.some((s: string) => normalizarTexto(generoProducto) === normalizarTexto(s));
        if (!match) return false;
      }

      // 🎨 C. Filtro de Colores
      if (filters.colors.length > 0) {
        const coloresProducto = producto.colors ?? producto.colores ?? [];
        const arrayColores = Array.isArray(coloresProducto) ? coloresProducto : [];
        const match = arrayColores.some((c: any) => filters.colors.includes(Number(c)));
        if (!match) return false;
      }

      // 📐 D. Filtro de Tallas
      if (filters.tallas.length > 0) {
        const tallasProducto = producto.tallas ?? producto.proTallas ?? [];
        const arrayTallas = Array.isArray(tallasProducto) 
          ? tallasProducto 
          : (typeof tallasProducto === 'string' ? (tallasProducto as string).split(',') : []);
          
        const match = arrayTallas.some((t: string) => 
          filters.tallas.map((x: string) => x.trim().toUpperCase()).includes(t.trim().toUpperCase())
        );
        if (!match) return false;
      }

      // 🛒 E. Filtro de Disponibilidad
      if (filters.soloDisponibles) {
        const stockVal = producto.inStock ?? producto.stock ?? producto.proStock ?? true;
        const tieneStock = typeof stockVal === 'boolean' ? stockVal : Number(stockVal) > 0;
        if (!tieneStock) return false;
      }

      // 💵 F. Filtro de Precio Máximo
      const precio = Number(producto.price ?? producto.precio ?? producto.proPrecio ?? 0);
      if (precio > filters.precioMax) return false;

      return true;
    });
  }, [productos, filters]);

  return (
    <div className="container mx-auto px-6 py-8 flex gap-8 min-h-[60vh]">
      <FilterSidebar filters={filters} setFilters={setFilters} />

      <div className="flex-1">
        <h2 className="text-xl font-black uppercase tracking-tight mb-6 text-gray-900">
          Catálogo de Productos
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 6].map((n) => (
              <div key={n} className="animate-pulse bg-gray-100 aspect-[3/4] w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productosFiltrados.map((prod) => {
              // 🔑 MAPEO ADAPTATIVO COMPLETO CON TODOS LOS CAMPOS EXIGIDOS POR EL TIPO 'Product'
              const normalizedProduct: Product = {
                id: prod.id ?? prod.proId ?? Math.random(),
                name: prod.name ?? prod.proNombre ?? "Prenda Wayback",
                price: Number(prod.price ?? prod.precio ?? prod.proPrecio ?? 0),
                originalPrice: prod.originalPrice ?? prod.precioOriginal ?? prod.pro_precio_original,
                image: prod.image ?? prod.proImagen ?? "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500",
                hoverImage: prod.hoverImage ?? prod.proImagenHover ?? prod.pro_imagen_alternativa,
                badge: prod.badge,
                // 🔑 Agregamos las propiedades faltantes que rompían el compilador:
                sexo: String(prod.sexo ?? prod.genero ?? prod.pro_sexo ?? 'unisex').toLowerCase(),
                tallas: Array.isArray(prod.tallas ?? prod.pro_tallas) ? (prod.tallas ?? prod.pro_tallas) : [],
                colors: Array.isArray(prod.colors ?? prod.pro_colores) ? (prod.colors ?? prod.pro_colores) : [],
                inStock: typeof (prod.inStock ?? prod.stock ?? prod.proStock) === 'boolean'
                  ? (prod.inStock ?? prod.stock ?? prod.proStock)
                  : Number(prod.stock ?? prod.proStock ?? 1) > 0
              };

              return <ProductCard key={normalizedProduct.id} product={normalizedProduct} />;
            })}
          </div>
        )}

        {!loading && productosFiltrados.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-200 bg-white rounded-2xl p-8 mt-2">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest text-center mb-4">
              No se encontraron prendas con los filtros seleccionados.
            </p>
            <button
              type="button"
              onClick={resetAll}
              className="px-5 py-2 text-xs font-black uppercase tracking-widest bg-black text-white rounded-full hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Restablecer Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}