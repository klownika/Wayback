import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

interface Categoria {
  cat_id: number;
  cat_nombre: string;
  tipo: 'prenda' | 'coleccion';
}

const INITIAL: Categoria[] = [
  { cat_id: 1,  cat_nombre: 'Pantalón',        tipo: 'prenda' },
  { cat_id: 2,  cat_nombre: 'Falda',            tipo: 'prenda' },
  { cat_id: 3,  cat_nombre: 'Shorts',           tipo: 'prenda' },
  { cat_id: 4,  cat_nombre: 'Jogger',           tipo: 'prenda' },
  { cat_id: 5,  cat_nombre: 'Camisetas',        tipo: 'prenda' },
  { cat_id: 6,  cat_nombre: 'Suéteres',         tipo: 'prenda' },
  { cat_id: 7,  cat_nombre: 'Chaquetas',        tipo: 'prenda' },
  { cat_id: 8,  cat_nombre: 'Sets Baggy',       tipo: 'coleccion' },
  { cat_id: 9,  cat_nombre: 'Sets Denim',       tipo: 'coleccion' },
  { cat_id: 10, cat_nombre: 'Sets Deportivos',  tipo: 'coleccion' },
  { cat_id: 11, cat_nombre: 'Sets Tejidos',     tipo: 'coleccion' },
];

export function AdminCategories() {
  const [cats,     setCats]     = useState<Categoria[]>(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState<Categoria | null>(null);
  const [nombre,   setNombre]   = useState('');
  const [tipo,     setTipo]     = useState<'prenda' | 'coleccion'>('prenda');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openAdd = () => { setEditing(null); setNombre(''); setTipo('prenda'); setShowForm(true); };
  const openEdit = (c: Categoria) => { setEditing(c); setNombre(c.cat_nombre); setTipo(c.tipo); setShowForm(true); };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    if (editing) {
      setCats((prev) => prev.map((c) => c.cat_id === editing.cat_id ? { ...c, cat_nombre: nombre, tipo } : c));
    } else {
      setCats((prev) => [...prev, { cat_id: Date.now(), cat_nombre: nombre, tipo }]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setCats((prev) => prev.filter((c) => c.cat_id !== id));
    setDeleteId(null);
  };

  const prendas    = cats.filter((c) => c.tipo === 'prenda');
  const colecciones = cats.filter((c) => c.tipo === 'coleccion');

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111', letterSpacing: '-0.02em', marginBottom: 4 }}>Categorías</h1>
          <p style={{ fontSize: 13, color: '#9ca3af' }}>{cats.length} categorías activas</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 text-white"
          style={{ background: '#c70fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#a800d9'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#c70fff'; }}
        >
          <Plus style={{ width: 14, height: 14 }} /> Agregar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[{ label: 'Prendas', items: prendas }, { label: 'Colecciones', items: colecciones }].map(({ label, items }) => (
          <div key={label} className="bg-white" style={{ border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #f3f4f6' }}>
              <h2 style={{ fontSize: 12, fontWeight: 700, color: '#374151', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</h2>
            </div>
            <div>
              {items.map((c, i) => (
                <div
                  key={c.cat_id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
                  style={{ borderBottom: i < items.length - 1 ? '1px solid #f9f9f9' : 'none' }}
                >
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 11, color: '#d1d5db', fontWeight: 600, minWidth: 20 }}>
                      {String(c.cat_id).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{c.cat_nombre}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(c)} className="p-1.5 text-gray-300 hover:text-[#c70fff] transition-colors">
                      <Edit2 style={{ width: 13, height: 13 }} />
                    </button>
                    <button onClick={() => setDeleteId(c.cat_id)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 style={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative z-10 bg-white w-full p-6" style={{ maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{editing ? 'Editar categoría' : 'Nueva categoría'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-300 hover:text-gray-600 transition-colors">
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Nombre</label>
                <input
                  type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Vestidos" autoFocus
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-[#c70fff] focus:bg-white transition-all"
                  style={{ fontSize: 14 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#374151', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Tipo</label>
                <div className="flex gap-3">
                  {(['prenda', 'coleccion'] as const).map((t) => (
                    <button
                      key={t} type="button" onClick={() => setTipo(t)}
                      className="flex-1 py-2.5 capitalize transition-all"
                      style={{
                        border: `1.5px solid ${tipo === t ? '#c70fff' : '#e5e7eb'}`,
                        background: tipo === t ? 'rgba(199,15,255,0.06)' : 'transparent',
                        color: tipo === t ? '#c70fff' : '#6b7280',
                        fontSize: 13, fontWeight: tipo === t ? 700 : 400,
                      }}
                    >
                      {t === 'prenda' ? 'Prenda' : 'Colección'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors" style={{ fontSize: 12, fontWeight: 600 }}>Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 text-white" style={{ background: '#c70fff', fontSize: 12, fontWeight: 700 }}>
                  {editing ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteId(null)} />
          <div className="relative z-10 bg-white p-6" style={{ maxWidth: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 8 }}>¿Eliminar categoría?</h3>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Los productos asociados quedarán sin categoría.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-600" style={{ fontSize: 12 }}>Cancelar</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-500 text-white hover:bg-red-600 transition-colors" style={{ fontSize: 12, fontWeight: 700 }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
