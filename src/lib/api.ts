const API_BASE = 'https://y2kvault-backend.onrender.com';

// ── INTERFACES EXISTENTES ──
export interface CategoriaApi {
  catID?: number; cat_id?: number;
  catNombre?: string; cat_nombre?: string;
}

export interface Categoria {
  cat_id: number;
  cat_nombre: string;
}

export interface ClienteApi {
  cli_id?: number; cli_nombre?: string; cli_apellido?: string;
  cli_email?: string; cli_telefono?: string; cli_documento_tipo?: string;
  cli_documento?: string; cli_fecha_registro?: string;
  [key: string]: any;
}

export interface Cliente {
  cli_id: number; cli_nombre: string; cli_apellido: string;
  cli_email: string; cli_telefono: string; cli_documento_tipo: string;
  cli_documento: string; cli_fecha_registro: string;
}

// ── INTERFACES PARA PRODUCTOS (ENRIQUECIDAS) ──
export interface ProductoApi {
  pro_id?: number; proID?: number; id?: number;
  pro_nombre?: string; proNombre?: string; nombre?: string; name?: string; 
  pro_precio?: number; proPrecio?: number; precio?: number; price?: number; 
  pro_precio_original?: number; precioOriginal?: number; originalPrice?: number; // 🔑 Añadido
  pro_imagen?: string; proImagen?: string; imagen?: string; image?: string;
  pro_imagen_alternativa?: string; proImagenHover?: string; hoverImage?: string; // 🔑 Añadido
  badge?: string; // 🔑 Añadido
  pro_sexo?: string; sexo?: string;
  pro_tallas?: string | string[]; tallas?: string[];
  pro_colores?: string | number[]; colors?: number[];
  pro_stock?: number; inStock?: boolean; stock?: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number; // 🔑 Añadido como opcional
  image: string;
  hoverImage?: string;     // 🔑 Añadido como opcional
  badge?: string;          // 🔑 Añadido como opcional
  sexo: string;
  tallas: string[];
  colors: number[];
  inStock: boolean;
}

// Interfaces para el tipado estricto del registro .NET
export interface RegisterData {
  Email: string;
  NombreUsuario: string;
  Contrasena: string;
  Nombres: string;
  Apellidos: string;
  TipoDocumento: string;
  Documento: string;
}

// ── MÉTODO POST: REGISTRAR CLIENTE NUEVO ──
export async function registerClienteApi(data: RegisterData): Promise<{ success: boolean; error?: string }> {
  const url = `${API_BASE}/api/auth/register-cliente`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.Email,
        nombreUsuario: data.NombreUsuario,
        contrasena: data.Contrasena,
        nombres: data.Nombres,
        apellidos: data.Apellidos,
        tipoDocumento: data.TipoDocumento,
        documento: data.Documento
      }),
    });

    const contentType = res.headers.get('content-type');
    let errorMessage = 'Error en el registro.';

    if (contentType && contentType.includes('application/json')) {
      const result = await res.json();
      errorMessage = result.message || errorMessage;
    } else {
      const textError = await res.text();
      errorMessage = textError || errorMessage;
    }

    if (!res.ok) {
      return { success: false, error: errorMessage };
    }
    
    return { success: true };
  } catch (err) {
    return { success: false, error: 'No se pudo establecer conexión con el servidor de registro.' };
  }
}

// ── PARSERS / MAPEADORES ACTUALIZADOS ──
const parseCategoria = (item: CategoriaApi): Categoria => ({
  cat_id: Number(item.catID ?? item.cat_id ?? 0),
  cat_nombre: String(item.catNombre ?? item.cat_nombre ?? ''),
});

const parseCliente = (item: ClienteApi): Cliente => ({
  cli_id: Number(item.cli_id ?? item.id ?? 0),
  cli_nombre: String(item.cli_nombre ?? item.nombre ?? ''),
  cli_apellido: String(item.cli_apellido ?? item.apellido ?? ''),
  cli_email: String(item.cli_email ?? item.email ?? ''),
  cli_telefono: String(item.cli_telefono ?? item.telefono ?? ''),
  cli_documento_tipo: String(item.cli_documento_tipo ?? item.documento_tipo ?? item.tipo_documento ?? 'DNI'),
  cli_documento: String(item.cli_documento ?? item.documento ?? ''),
  cli_fecha_registro: String(item.cli_fecha_registro ?? item.fecha_registro ?? item.createdAt ?? ''),
});

const parseProducto = (item: ProductoApi): Product => {
  let listaTallas: string[] = [];
  if (Array.isArray(item.pro_tallas)) listaTallas = item.pro_tallas;
  else if (Array.isArray(item.tallas)) listaTallas = item.tallas;
  else if (typeof (item.pro_tallas ?? item.tallas) === 'string') {
    listaTallas = (item.pro_tallas ?? item.tallas ?? '').split(',').map(s => s.trim());
  }

  let listaColores: number[] = [];
  if (Array.isArray(item.pro_colores)) listaColores = item.pro_colores;
  else if (Array.isArray(item.colors)) listaColores = item.colors;

  return {
    id: Number(item.pro_id ?? item.proID ?? item.id ?? 0),
    name: String(item.pro_nombre ?? item.proNombre ?? item.nombre ?? item.name ?? 'Producto Sin Nombre'),
    price: Number(item.pro_precio ?? item.proPrecio ?? item.precio ?? item.price ?? 0),
    // 🔑 Mapeamos los campos estéticos nuevos del JSON al tipo Product:
    originalPrice: item.originalPrice ?? item.precioOriginal ?? item.pro_precio_original,
    image: String(item.pro_imagen ?? item.proImagen ?? item.imagen ?? item.image ?? 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500'),
    hoverImage: item.hoverImage ?? item.proImagenHover ?? item.pro_imagen_alternativa,
    badge: item.badge,
    sexo: String(item.pro_sexo ?? item.sexo ?? 'unisex').toLowerCase(),
    tallas: listaTallas,
    colors: listaColores,
    inStock: item.inStock ?? (item.pro_stock !== undefined || item.stock !== undefined ? Number(item.pro_stock ?? item.stock) > 0 : true),
  };
};

// ── FUNCIÓN BASE FETCH ──
async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('wayback_auth_token');
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// ── MÉTODOS DE CATEGORÍAS ──
export async function getCategorias(): Promise<Categoria[]> {
  const url = `${API_BASE}/api/categorias`;
  const data = await fetchJson<CategoriaApi[]>(url);
  return Array.isArray(data) ? data.map(parseCategoria) : [];
}

// ── MÉTODOS DE CLIENTES ──
export async function getClientes(): Promise<Cliente[]> {
  const url = `${API_BASE}/api/admin/reportes/clientes`; 
  const data = await fetchJson<ClienteApi[]>(url);
  return Array.isArray(data) ? data.map(parseCliente) : [];
}

export async function createCliente(cliente: Partial<Cliente>): Promise<Cliente> {
  const url = `${API_BASE}/api/admin/reportes/clientes`;
  return await fetchJson<Cliente>(url, {
    method: 'POST',
    body: JSON.stringify(cliente),
  });
}

export async function updateCliente(id: number, cliente: Partial<Cliente>): Promise<Cliente> {
  const url = `${API_BASE}/api/admin/reportes/clientes/${id}`;
  return await fetchJson<Cliente>(url, {
    method: 'PUT',
    body: JSON.stringify(cliente),
  });
}

export async function deleteCliente(id: number): Promise<{ success: boolean }> {
  const url = `${API_BASE}/api/admin/reportes/clientes/${id}`;
  return await fetchJson<{ success: boolean }>(url, {
    method: 'DELETE',
  });
}

// ── MAPEO INTERNO DE SEGURIDAD (Por si tu .NET espera IDs numéricos) ──
const MAPA_CATEGORIAS_IDS: Record<string, number> = {
  'pantalon': 1,
  'falda': 2,
  'shorts': 3,
  'jogger': 4,
  'camisetas': 5,
  'sueteres': 6,
  'chaquetas': 7,
  'sets-baggy': 8,
  'sets-denim': 9,
  'sets-deportivos': 10,
  'sets-tejidos': 11
};

// ── FILTRAR PRODUCTOS POR CATEGORÍA (CON AUTO-SONDEO DE RUTAS) ──
export async function getProductosPorCategoria(categoryId: number | string): Promise<Product[]> {
  const normalizedId = String(categoryId).toLowerCase().trim();
  const numericId = MAPA_CATEGORIAS_IDS[normalizedId] || null;

  // 🔑 Listamos las 4 formas posibles en las que tu .NET pudo haber estructurado la URL
  const rutasAProbar = [
    `${API_BASE}/api/productos/categoria/${normalizedId}`, // 1. Con barra y texto (ej: /categoria/falda)
    `${API_BASE}/api/productos/categoria=${normalizedId}`, // 2. Con igual y texto (ej: /categoria=falda)
  ];

  // Si conocemos el ID numérico correspondiente, añadimos las opciones numéricas al sondeo
  if (numericId !== null) {
    rutasAProbar.push(`${API_BASE}/api/productos/categoria/${numericId}`); // 3. Con barra e ID (ej: /categoria/2)
    rutasAProbar.push(`${API_BASE}/api/productos/categoria=${numericId}`); // 4. Con igual e ID (ej: /categoria=2)
  }

  // 🚀 El bucle recorre las rutas en orden. La primera que devuelva un 200 OK gana y rompe el ciclo.
  for (const url of rutasAProbar) {
    try {
      const token = localStorage.getItem('wayback_auth_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(url, { method: 'GET', headers });
      
      if (res.ok) {
        const data = await res.json();
        console.log(`🎯 [Wayback Ruteo Éxito]: Conectado con éxito a la URL: ${url}`);
        return Array.isArray(data) ? data.map(parseProducto) : [];
      }
    } catch {
      // Si una ruta da 404 o falla, continúa silenciosamente probando la siguiente
      continue;
    }
  }

  console.warn(`❌ [Wayback Ruteo Fallo]: Ninguna de las rutas coincidió para la categoría: ${categoryId}`);
  return [];
}

// ── MÉTODOS DE PRODUCTOS (CON INYECCIÓN DE CATEGORÍA EN CALIENTE) ──
export async function getProductos(): Promise<Product[]> {
  const categoriasBD = Object.keys(MAPA_CATEGORIAS_IDS);

  try {
    console.log("⏳ [Wayback Catálogo]: Unificando inventario a través del auto-sondeo...");

    // 🚀 Mapeamos las promesas inyectando el ID de la categoría original en cada prenda
    const promesas = categoriasBD.map(async (id) => {
      const productosDeCategoria = await getProductosPorCategoria(id);
      
      // 🔑 AQUÍ: Le grabamos al producto a qué categoría pertenece (ej: producto.categoria = "pantalon")
      return productosDeCategoria.map(producto => ({
        ...producto,
        categoria: id 
      }));
    });

    const resultadosAnidados = await Promise.all(promesas);
    
    // Aplanamos la lista de listas en un único catálogo plano de prendas
    const catalogoCompleto = resultadosAnidados.flat();
    
    // Eliminamos duplicados por ID para proteger la consistencia visual
    const productosUnicos = Array.from(
      new Map(catalogoCompleto.map(p => [p.id, p])).values()
    ) as Product[];

    return productosUnicos;

  } catch (error) {
    console.error("Error crítico en el bypass de catálogo:", error);
    return [];
  }
}

// ── AUTENTICACIÓN ──
export async function loginApi(email: string, pass: string): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
  const url = `${API_BASE}/api/auth/login`; 
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        UsuUsernameOrEmail: email, 
        UsuContrasena: pass 
      }) 
    });
    
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.message || 'Credenciales inválidas' };
    
    return { 
      success: true, 
      token: data.tokenJWT, 
      user: data    
    };
  } catch (err) {
    return { success: false, error: 'No se pudo conectar con el servidor de autenticación.' };
  }
}