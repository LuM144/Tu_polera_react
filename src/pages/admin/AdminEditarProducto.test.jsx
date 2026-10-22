import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminEditarProducto from './AdminEditarProducto';

// 1. Mock de componentes hijos
vi.mock('../../components/admin/AdminSidebar', () => ({
  default: () => <div data-testid="admin-sidebar">Sidebar</div>,
}));

// 2. Mock de imágenes y productos iniciales
vi.mock('../../data/imagenes', () => ({
  images: {
    imagen1: 'url-imagen1.jpg',
    placeholder: 'url-placeholder.jpg',
  },
}));

vi.mock('../../data/productosIniciales', () => ({
  productosIniciales: [
    {
      id: 1,
      nombre: 'Polera Base',
      categoria: 'poleras',
      precio: 10000,
      color: 'Negro',
      descuento: 0,
      tallas: ['M'],
      manga_corta: 'si',
      imagen: 'url-imagen1.jpg',
      descripcion: 'Descripción inicial',
    },
  ],
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AdminEditarProducto Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // Auxiliar para renderizar con React Router manteniendo el contexto de la ruta
  const renderConRuta = (path = '/admin/productos/crear', routePath = '/admin/productos/crear') => {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={routePath} element={<AdminEditarProducto />} />
          <Route path="/admin/editar/:id" element={<AdminEditarProducto />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('debe renderizar la interfaz para crear un nuevo producto', () => {
    renderConRuta('/admin/productos/crear');

    expect(screen.getByRole('heading', { name: /agregar producto/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre del producto/i)).toHaveValue('');
    expect(screen.getByTestId('admin-sidebar')).toBeInTheDocument();
  });

  it('debe cargar los datos de un producto existente al editar (modo edición)', () => {
    // Seteamos un producto en localStorage
    const productoExistente = [
      {
        id: 1,
        nombre: 'Polera Anime',
        categoria: 'poleras',
        precio: 15000,
        color: 'Azul',
        descuento: 10,
        tallas: ['S', 'M'],
        manga_corta: 'si',
        imagen: 'url-imagen1.jpg',
        descripcion: 'Polera de algodón',
      },
    ];
    localStorage.setItem('productos', JSON.stringify(productoExistente));

    renderConRuta('/admin/editar/1');

    expect(screen.getByRole('heading', { name: /editar producto/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre del producto/i)).toHaveValue('Polera Anime');
    expect(screen.getByLabelText(/categoría/i)).toHaveValue('poleras');
    expect(screen.getByLabelText(/precio/i)).toHaveValue(15000);
  });

  it('debe mostrar mensaje si se intenta editar un ID inexistente', () => {
    renderConRuta('/admin/editar/999');

    expect(screen.getByRole('heading', { name: /producto no encontrado/i })).toBeInTheDocument();
    expect(screen.getByText(/no existe un producto con el id solicitado/i)).toBeInTheDocument();
  });

  it('debe actualizar los campos dinámicos al cambiar la categoría', async () => {
    const user = userEvent.setup();
    renderConRuta('/admin/productos/crear');

    const selectCategoria = screen.getByLabelText(/categoría/i);

    // Seleccionar Poleras -> Muestra opción de Manga Corta
    await user.selectOptions(selectCategoria, 'poleras');
    expect(screen.getByLabelText(/¿manga corta\?/i)).toBeInTheDocument();

    // Seleccionar Gorras -> Muestra campo Tipo de Gorro y fija talla "Única"
    await user.selectOptions(selectCategoria, 'gorras');
    expect(screen.getByLabelText(/tipo de gorro/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Única')).toBeChecked();
  });

  it('debe permitir seleccionar y deseleccionar tallas', async () => {
    const user = userEvent.setup();
    renderConRuta('/admin/productos/crear');

    await user.selectOptions(screen.getByLabelText(/categoría/i), 'poleras');

    const checkboxM = screen.getByLabelText('M');
    expect(checkboxM).not.toBeChecked();

    // Seleccionar talla M
    await user.click(checkboxM);
    expect(checkboxM).toBeChecked();

    // Deseleccionar talla M
    await user.click(checkboxM);
    expect(checkboxM).not.toBeChecked();
  });

  it('debe guardar un nuevo producto en localStorage y navegar al terminar', async () => {
    const user = userEvent.setup();
    renderConRuta('/admin/productos/crear');

    // Llenar formulario
    await user.type(screen.getByLabelText(/nombre del producto/i), 'Polera Gamer');
    await user.selectOptions(screen.getByLabelText(/categoría/i), 'poleras');
    await user.clear(screen.getByLabelText(/precio/i));
    await user.type(screen.getByLabelText(/precio/i), '12000');
    await user.type(screen.getByLabelText(/color/i), 'Rojo');
    await user.selectOptions(screen.getByLabelText(/imagen del producto/i), 'url-imagen1.jpg');
    await user.type(screen.getByLabelText(/descripción/i), 'Excelente calidad');

    // Guardar
    await user.click(screen.getByRole('button', { name: /crear producto/i }));

    // Verificar guardado en localStorage
    const productosEnStorage = JSON.parse(localStorage.getItem('productos'));
    expect(productosEnStorage).toHaveLength(2); // 1 inicial + 1 creado
    expect(productosEnStorage[1].nombre).toBe('Polera Gamer');

    // Verificar redirección
    expect(mockNavigate).toHaveBeenCalledWith('/admin/productos');
  });
});
