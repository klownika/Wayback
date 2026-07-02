import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { FilterSidebar } from '@/app/components/FilterSidebar';
import { ProductCard } from '@/app/components/ProductCard';
import { getProductos } from '@/lib/api';
import type { Product } from '@/lib/api';

// ── 🆕 MAPA COMPLETO CON LOS 12 COLORES DE TU API ──
const MAPA_COLORS_NOMBRE: Record<number, string> = {
  1: 'blanco', 
  2: 'negro', 
  3: 'azul', 
  4: 'verde',
  5: 'amarillo', 
  6: 'rojo', 
  7: 'rosa', 
  8: 'morado',
  9: 'marron', 
  10: 'azul cielo', 
  11: 'gris', 
  12: 'beige'
};

export function CatalogoPage() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Estado inicial leído una sola vez desde la URL
  const [filters, setFilters] = useState<any>({
    categorias: searchParams.getAll('categoria'),
    sexo: searchParams.get('genero') ? [searchParams.get('genero') as string] : [],
    colors: searchParams.getAll('color').map(Number).filter((n) => !isNaN(n)),
    tallas: searchParams.getAll('talla').map((t) => t.toUpperCase()),
    soloDisponibles: searchParams.get('stock') === 'true',
    precioMin: Number(searchParams.get('precioMin') ?? 0),
    precioMax: Number(searchParams.get('precioMax') ?? 500),
  });

  // ── 🎯 Filtros = fuente de verdad ──
  useEffect(() => {
    let active = true;
    setLoading(true);

    const categorias: string[] = filters.categorias;
    const coloresIds: number[] = filters.colors;
    
    // 💡 RE-DECLARAMOS CORRECTAMENTE 'coloresNombre' PARA TU FUNCIÓN DE API
    const coloresNombre = coloresIds.map((id) => MAPA_COLORS_NOMBRE[id]).filter(Boolean);
    
    const tallasLower = (filters.tallas as string[]).map((t) => t.toLowerCase());
    const genero = filters.sexo.length > 0 ? filters.sexo[0] : undefined;

    const urlParams: [string, string][] = [];
    categorias.forEach((c) => urlParams.push(['categoria', c]));
    coloresIds.forEach((id) => urlParams.push(['color', String(id)]));
    tallasLower.forEach((t) => urlParams.push(['talla', t]));
    if (genero) urlParams.push(['genero', genero]);
    if (filters.soloDisponibles) urlParams.push(['stock', 'true']);
    if (filters.precioMin) urlParams.push(['precioMin', String(filters.precioMin)]);
    if (filters.precioMax !== 500) urlParams.push(['precioMax', String(filters.precioMax)]);
    setSearchParams(urlParams, { replace: true });

    // Petición al backend usando los strings de texto que TypeScript requiere ('string[]')
    getProductos({
      categoria: categorias.length > 0 ? categorias : undefined,
      genero,
      color: coloresNombre.length > 0 ? coloresNombre : undefined, // 👈 Aquí se usa el string ('rojo')
      talla: tallasLower.length > 0 ? tallasLower : undefined,
      stock: filters.soloDisponibles || undefined,
      precioMin: filters.precioMin,
      precioMax: filters.precioMax,
    })
      .then((res) => {
        if (active) {
          console.log('👉 [Wayback C# Catalogo Sync]:', res.length, 'prendas recibidas.');
          setProductos(res ?? []);
        }
      })
      .catch((err) => console.error('Error conectando a la API:', err))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [filters.categorias, filters.sexo, filters.colors, filters.tallas, filters.soloDisponibles, filters.precioMin, filters.precioMax]);

  const resetAll = () => {
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

  return (
    <div className="container mx-auto px-6 py-8 flex items-start gap-8 min-h-[60vh]">
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
            {productos.map((prod) => (
              <ProductCard 
                key={prod.id} 
                product={prod} 
                activeFilters={filters} 
              />
            ))}
          </div>
        )}

        {!loading && productos.length === 0 && (
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