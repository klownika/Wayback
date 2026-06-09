import { ProductGrid } from '../components/ProductGrid';

export function OfertasPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8 text-[#c70fff] text-white rounded-2xl p-8">
        <h1 className="text-4xl mb-3">Ofertas Especiales</h1>
        <p className="text-[rgba(255,255,255,0.8)]">Hasta 50% de descuento en piezas seleccionadas</p>
      </div>
      <ProductGrid showViewAll={false} />
    </div>
  );
}
