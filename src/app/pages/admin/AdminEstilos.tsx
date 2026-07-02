import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Plus, Pencil, Trash2, X } from 'lucide-react';
import { getEstilos } from '@/lib/api';
import type { Estilo } from '@/lib/api';

export function AdminEstilos() {
  const [estilos, setEstilos] = useState<Estilo[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Usamos este estado existente para mostrar el "Recordatorio" arriba en la pantalla
  const [error, setError] = useState<string | null>(null);

  // Estados para controlar los formularios visuales
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Estilo | null>(null);
  const [nombre, setNombre] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const cargarEstilos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEstilos();
      setEstilos(data);
    } catch (err) {
      console.error('❌ Error cargando estilos:', err);
      setError('No se pudo cargar la lista de estilos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstilos();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setNombre('');
    setError(null);
    setShowForm(true);
  };

  const openEdit = (estilo: Estilo) => {
    setEditing(estilo);
    setNombre(estilo.estNombre);
    setError(null);
    setShowForm(true);
  };

  // 🔒 Intercepta de forma limpia el guardado/creación sin alertas del sistema
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setShowForm(false);
    setNombre('');
    setEditing(null);
    
    // Mostramos el Recordatorio directamente integrado en el diseño superior
    setError("Recordatorio: Los estilos del sistema son de solo lectura y no se pueden modificar.");
  };

  // 🔒 Intercepta la eliminación de forma limpia
  const handleDelete = () => {
    if (deleteId === null) return;

    setDeleteId(null);
    
    // Mostramos el Recordatorio directamente integrado en el diseño superior
    setError("Recordatorio: Los estilos del sistema son de solo lectura y no se pueden eliminar.");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Encabezado con Botón Agregar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-purple-600" />
            Estilos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {estilos.length} {estilos.length === 1 ? 'estilo activo' : 'estilos activos'}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar Estilo
        </button>
      </div>

      {/* BANNER DE AVISO: Muestra elegantemente el "Recordatorio" arriba sin popups molestos */}
      {error && (
        <div className="flex items-center justify-between gap-3 mb-6 px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl animate-fade-in">
          <span className="text-sm text-purple-800 font-medium flex-1">
            ⚠️ {error}
          </span>
          <button 
            onClick={() => setError(null)} 
            className="text-purple-400 hover:text-purple-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabla de Estilos */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/50">
          <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
            Lista de Estilos
          </span>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-10 text-center text-sm text-gray-400 animate-pulse">
              Cargando estilos desde el servidor...
            </p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold tracking-wider text-gray-400 uppercase bg-gray-50/30">
                  <th className="py-4 px-6 w-24">ID</th>
                  <th className="py-4 px-6">Nombre del Estilo</th>
                  <th className="py-4 px-6 text-right w-32">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {estilos.map((estilo) => (
                  <tr key={estilo.estId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-gray-400">
                      {String(estilo.estId).padStart(2, '0')}
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-800">
                      {estilo.estNombre}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(estilo)}
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(estilo.estId)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* FORMULARIO AGREGAR / EDITAR */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editing ? 'Editar Estilo' : 'Agregar Nuevo Estilo'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Nombre del Estilo
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Ej. Vintage, Minimalista..."
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMACIÓN DE ELIMINACIÓN */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">¿Eliminar estilo?</h3>
            <p className="text-sm text-gray-500">
              Esta acción no se puede deshacer de forma directa si el elemento está en uso.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}