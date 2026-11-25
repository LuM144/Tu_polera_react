import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminEditarProducto from './AdminEditarProducto';

vi.mock('../../components/admin/AdminSidebar', () => ({
  default: () => <div data-testid="admin-sidebar">Sidebar</div>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('AdminEditarProducto (formulario dinámico)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderizar = (ruta = '/admin/productos/editar') =>
    render(
      <MemoryRouter initialEntries={[ruta]}>
        <Routes>
          <Route path="/admin/productos/editar" element={<AdminEditarProducto />} />
          <Route path="/admin/productos/editar/:id" element={<AdminEditarProducto />} />
        </Routes>
      </MemoryRouter>
    );

  it('no muestra campos de categoría hasta elegir una', () => {
    renderizar();

    expect(screen.getByText(/Selecciona una categoría para ver/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Tipo de manga/i)).not.toBeInTheDocument();
  });

  it('genera los atributos y tallas de Poleras', async () => {
    const usuario = userEvent.setup();
    renderizar();

    await usuario.selectOptions(screen.getByLabelText('Categoría'), 'Poleras');

    expect(screen.getByLabelText(/Tipo de manga/i)).toBeInTheDocument();
    expect(screen.getByLabelText('S')).toBeInTheDocument();
    expect(screen.getByLabelText('XL')).toBeInTheDocument();

    await usuario.click(screen.getByLabelText('M'));

    expect(screen.getByLabelText(/Stock/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contorno de pecho/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ancho de hombros/i)).toBeInTheDocument();
  });

  it('usa los campos de Gorras con talla única seleccionada automáticamente', async () => {
    const usuario = userEvent.setup();
    renderizar();

    await usuario.selectOptions(screen.getByLabelText('Categoría'), 'Gorras');

    expect(screen.getByLabelText(/Tipo de gorro/i)).toBeInTheDocument();
    expect(screen.getByText('Talla Única')).toBeInTheDocument();
    expect(screen.getByLabelText(/Contorno de cabeza/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Contorno de pecho/i)).not.toBeInTheDocument();
  });

  it('rechaza guardar un producto sin stock ni medidas válidas', async () => {
    const usuario = userEvent.setup();
    renderizar();

    await usuario.type(screen.getByLabelText('Nombre del producto'), 'Polera Test');
    await usuario.selectOptions(screen.getByLabelText('Categoría'), 'Poleras');
    await usuario.type(screen.getByLabelText('Precio'), '9990');
    await usuario.selectOptions(screen.getByLabelText('Color'), 'rojo');
    await usuario.selectOptions(screen.getByLabelText(/Tipo de manga/i), 'Corta');
    await usuario.selectOptions(screen.getByLabelText(/Imagen existente|existente/i), 'Imagen1');
    await usuario.type(screen.getByLabelText('Descripción'), 'Descripción de prueba');

    await usuario.click(screen.getByRole('button', { name: /Crear producto/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/al menos una talla/i);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('guarda un producto con categoriaId, atributos, stock y medidas por talla', async () => {
    const usuario = userEvent.setup();
    renderizar();

    await usuario.type(screen.getByLabelText('Nombre del producto'), 'Polera Test');
    await usuario.selectOptions(screen.getByLabelText('Categoría'), 'Poleras');
    await usuario.type(screen.getByLabelText('Precio'), '9990');
    await usuario.selectOptions(screen.getByLabelText('Color'), 'rojo');
    await usuario.selectOptions(screen.getByLabelText(/Tipo de manga/i), 'Corta');
    await usuario.click(screen.getByLabelText('M'));

    const stock = screen.getByLabelText(/Stock/i);
    await usuario.clear(stock);
    await usuario.type(stock, '7');
    await usuario.type(screen.getByLabelText(/Contorno de pecho/i), '102');
    await usuario.type(screen.getByLabelText(/Ancho de hombros/i), '44');
    await usuario.type(screen.getByLabelText(/Largo de prenda/i), '68');

    await usuario.selectOptions(screen.getByLabelText(/existente/i), 'Imagen1');
    await usuario.type(screen.getByLabelText('Descripción'), 'Descripción de prueba');

    await usuario.click(screen.getByRole('button', { name: /Crear producto/i }));

    const guardados = JSON.parse(localStorage.getItem('productos'));
    const nuevo = guardados.find(p => p.nombre === 'Polera Test');

    expect(nuevo).toBeDefined();
    expect(nuevo.categoriaId).toBe(1);
    expect(nuevo.atributos).toEqual({ tipo_manga: 'Corta' });
    expect(nuevo.tallas).toEqual({
      M: { stock: 7, medidas: { contorno_pecho: 102, ancho_hombros: 44, largo_prenda: 68 } },
    });
    expect(nuevo).not.toHaveProperty('manga_corta');
    expect(mockNavigate).toHaveBeenCalledWith('/admin/productos');
  });

  it('carga un producto existente para editarlo', () => {
    renderizar('/admin/productos/editar/1');

    const bloque = screen.getByText('Talla M').closest('.admin-variante');

    expect(screen.getByLabelText('Nombre del producto')).toHaveValue('Urban Red');
    expect(screen.getByLabelText(/Tipo de manga/i)).toHaveValue('Corta');
    expect(within(bloque).getByLabelText(/Stock/i)).toHaveValue(10);
    expect(within(bloque).getByLabelText(/Contorno de pecho/i)).toHaveValue(102);
  });
});
