import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Minus, Plus, ShoppingBag, Truck, RotateCcw, ShieldCheck } from 'lucide-react';

export interface QuickViewProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  badge?: string;
  inStock?: boolean;
}

interface QuickViewModalProps {
  product: QuickViewProduct;
  onClose: () => void;
}

const SIZES = [
  { label: 'XS', stock: 'ok' },
  { label: 'S',  stock: 'ok' },
  { label: 'M',  stock: 'low' },
  { label: 'L',  stock: 'ok' },
  { label: 'XL', stock: 'ok' },
  { label: 'XXL', stock: 'out' },
] as const;

const SHIPPING = [
  { icon: Truck,        text: 'Envío estándar gratis en pedidos +$50 — llega en 3–5 días hábiles.' },
  { icon: RotateCcw,    text: 'Devoluciones gratis dentro de los 30 días posteriores a la entrega.' },
  { icon: ShieldCheck,  text: 'Compra 100 % segura con cifrado SSL y pasarela de pago certificada.' },
];

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const images = [product.image, ...(product.hoverImage ? [product.hoverImage] : [])];
  // pad up to 4 thumbs reusing available images
  const thumbs = Array.from({ length: 4 }, (_, i) => images[i % images.length]);

  const [activeImg, setActiveImg]       = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty]                   = useState(1);
  const [confirmed, setConfirmed]       = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  // lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleAdd = () => {
    if (!selectedSize) return;
    setConfirmed(true);
    setTimeout(() => { setConfirmed(false); onClose(); }, 1400);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(20,5,45,0.6)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />

      {/* card */}
      <div
        className="relative bg-white rounded-3xl overflow-hidden flex flex-col sm:flex-row w-full"
        style={{
          maxWidth: 860,
          maxHeight: '92vh',
          boxShadow: '0 40px 100px rgba(120,40,220,0.22), 0 8px 32px rgba(0,0,0,0.14)',
        }}
      >
        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
          style={{ boxShadow: '2px 2px 8px rgba(0,0,0,0.12)' }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* ─── LEFT: gallery ──────────────────────────────────── */}
        <div className="sm:w-[360px] flex-shrink-0 bg-gray-50 flex flex-col">
          {/* main image */}
          <div className="relative flex-1 overflow-hidden" style={{ minHeight: 320 }}>
            <img
              key={activeImg}
              src={thumbs[activeImg]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ animation: 'fadeIn .3s ease' }}
            />
            {discount && (
              <span
                className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs"
                style={{ background: 'linear-gradient(135deg,#f97316,#ef4444)', fontWeight: 700 }}
              >
                -{discount}%
              </span>
            )}
          </div>
          {/* thumbnails */}
          <div className="flex gap-2 p-3 border-t border-gray-100 bg-white">
            {thumbs.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className="rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200"
                style={{
                  width: 58, height: 58,
                  outline: activeImg === i ? '2px solid #c70fff' : '2px solid transparent',
                  outlineOffset: 2,
                  opacity: activeImg === i ? 1 : 0.55,
                  transform: activeImg === i ? 'scale(1.06)' : 'scale(1)',
                }}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ─── RIGHT: details ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-6 flex flex-col gap-5 flex-1">

            {/* title + prices */}
            <div>
              <h2 className="text-gray-900 mb-3" style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.3 }}>
                {product.name}
              </h2>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span style={{ fontSize: 28, fontWeight: 900, color: '#c70fff' }}>${product.price}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through" style={{ fontSize: 16 }}>
                    ${product.originalPrice}
                  </span>
                )}
                {discount && (
                  <span
                    className="px-2 py-0.5 rounded-lg text-white text-xs"
                    style={{ background: '#ea580c', fontWeight: 700 }}
                  >
                    -{discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* brief description */}
            <p className="text-gray-500 leading-relaxed" style={{ fontSize: 13 }}>
              Pieza exclusiva de nuestra colección. Confeccionada con telas de alta calidad seleccionadas
              para garantizar confort y durabilidad. Corte y silueta diseñados para realzar cada tipo de
              figura con un estilo contemporáneo y atemporal.
            </p>

            {/* stock */}
            <div className="flex items-center gap-2">
              {product.inStock !== false ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" style={{ boxShadow: '0 0 0 3px rgba(16,185,129,.2)' }} />
                  <span className="text-emerald-600 text-sm" style={{ fontWeight: 600 }}>En stock</span>
                  <span className="text-gray-300 text-sm">·</span>
                  <span className="text-orange-500 text-sm">¡Pocas unidades!</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                  <span className="text-gray-400 text-sm">Sin stock</span>
                </>
              )}
            </div>

            {/* size selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-800 text-sm" style={{ fontWeight: 700 }}>Talla</span>
                <button className="text-xs text-[#c70fff] underline underline-offset-2 hover:text-[#c70fff]">
                  Guía de tallas
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => {
                  const sel = selectedSize === s.label;
                  const out = s.stock === 'out';
                  const low = s.stock === 'low';
                  return (
                    <button
                      key={s.label}
                      disabled={out}
                      onClick={() => setSelectedSize(s.label)}
                      className="relative px-4 py-2 rounded-xl text-sm transition-all duration-200 disabled:cursor-not-allowed"
                      style={{
                        background: sel ? 'linear-gradient(135deg,#c70fff,#c70fff)' : out ? '#f9fafb' : '#fff',
                        color: sel ? '#fff' : out ? '#d1d5db' : '#374151',
                        fontWeight: sel ? 700 : 400,
                        border: sel ? 'none' : out ? '1.5px dashed #e5e7eb' : '1.5px solid #e9d5ff',
                        boxShadow: sel
                          ? '0 4px 12px rgba(199,15,255,0.35)'
                          : out ? 'none' : '2px 2px 6px rgba(0,0,0,0.06)',
                        textDecoration: out ? 'line-through' : 'none',
                      }}
                    >
                      {s.label}
                      {low && !sel && (
                        <span
                          className="absolute -top-2 -right-2 px-1.5 py-px rounded-full text-white leading-none"
                          style={{ fontSize: 9, background: '#f97316', fontWeight: 700 }}
                        >
                          Poco
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {!selectedSize && (
                <p className="text-xs text-gray-400 mt-1.5">Selecciona una talla para continuar</p>
              )}
            </div>

            {/* quantity */}
            <div>
              <span className="text-gray-800 text-sm block mb-2" style={{ fontWeight: 700 }}>Cantidad</span>
              <div
                className="inline-flex items-center rounded-xl overflow-hidden border border-[rgba(199,15,255,0.15)]"
                style={{ boxShadow: '2px 2px 8px rgba(199,15,255,0.08)' }}
              >
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#c70fff] hover:bg-[rgba(199,15,255,0.05)] transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 h-10 flex items-center justify-center border-x border-[rgba(199,15,255,0.15)] text-gray-800" style={{ fontWeight: 700 }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-[#c70fff] hover:bg-[rgba(199,15,255,0.05)] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleAdd}
              disabled={!selectedSize || product.inStock === false}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2.5 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.99]"
              style={{
                background: confirmed
                  ? 'linear-gradient(135deg,#059669,#10b981)'
                  : 'linear-gradient(135deg,#c70fff,#c70fff)',
                boxShadow: confirmed
                  ? '0 6px 20px rgba(16,185,129,0.35)'
                  : '0 6px 20px rgba(199,15,255,0.35)',
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: '0.04em',
              }}
            >
              <ShoppingBag className="w-5 h-5" />
              {confirmed ? '¡LISTO! AÑADIDO AL CARRITO' : 'AÑADIR AL CARRITO'}
            </button>

            {/* shipping info */}
            <div
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: '#faf5ff', border: '1px solid #ede9fe' }}
            >
              {SHIPPING.map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-px"
                    style={{ background: '#ede9fe' }}
                  >
                    <Icon className="w-3.5 h-3.5 text-[#c70fff]" />
                  </div>
                  <p className="text-gray-500 leading-snug" style={{ fontSize: 12 }}>{text}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </div>,
    document.body,
  );
}
