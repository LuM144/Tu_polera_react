
import { describe, it, expect, beforeEach } from 'vitest';
import {
    cargarCategorias,
    cargarProductos,
    compararMedidas,
    descontarStock,
    obtenerProductosCriticos,
    obtenerStockTotal,
    revisarStockCarrito
} from './catalogo';
import { calcularPrecioDespacho, configuracionDespachoInicial } from './despacho';
import {
    calcularDistanciaLineaRecta,
    estaEnChile
} from '../../../services/geografiaChile';

beforeEach(() => localStorage.clear());

describe('migración de datos antiguos', () => {
    it('convierte productos con manga_corta/capucha/tipo_gorro y tallas en lista', () => {
        localStorage.setItem('categorias', JSON.stringify(['Poleras', 'Polerones', 'Gorras']));
        localStorage.setItem('productos', JSON.stringify([
            { id: 1, nombre: 'Urban Red', categoria: 'poleras', precio: 100, color: 'rojo',
              descuento: 0, tallas: ['S', 'M'], manga_corta: 'no', imagen: 'imagen1', descripcion: 'x' },
            { id: 9, nombre: 'Gorra X', categoria: 'gorras', precio: 100, color: 'negro',
              descuento: 0, tallas: ['Única'], tipo_gorro: 'Beanie', imagen: 'imagen5', descripcion: 'x' }
        ]));

        const categorias = cargarCategorias();
        const [polera, gorra] = cargarProductos(categorias);

        expect(categorias[0].atributos[0].id).toBe('tipo_manga');
        expect(polera.categoriaId).toBe(1);
        expect(polera.atributos).toEqual({ tipo_manga: 'Larga' });
        expect(polera).not.toHaveProperty('manga_corta');
        expect(polera.tallas.S.medidas.contorno_pecho).toBe(96);
        expect(gorra.categoriaId).toBe(3);
        expect(gorra.atributos).toEqual({ tipo_gorro: 'Beanie' });
    });
});

describe('stock', () => {
    it('descuenta el stock por talla y detecta compras sin stock', () => {
        cargarProductos(cargarCategorias());

        const items = [{ id: 1, nombre: 'Urban Red', talla: 'S', cantidad: 5 }];
        expect(revisarStockCarrito(items)).toHaveLength(0);

        descontarStock(items);
        const urban = JSON.parse(localStorage.getItem('productos')).find(p => p.id === 1);

        expect(urban.tallas.S.stock).toBe(0);
        expect(revisarStockCarrito(items)[0].disponible).toBe(0);
        expect(obtenerStockTotal(urban)).toBe(21);
    });

    it('lista tallas agotadas y con stock bajo', () => {
        const categorias = cargarCategorias();
        const criticos = obtenerProductosCriticos(cargarProductos(categorias), categorias, 5);

        expect(criticos[0]).toMatchObject({ talla: 'XL', stock: 0, agotado: true });
        expect(criticos.every(item => item.stock <= 5)).toBe(true);
    });
});

describe('comparador de medidas', () => {
    it('muestra la diferencia prenda - cliente (96 cm vs 102 cm = 6 cm)', () => {
        const categoria = cargarCategorias()[0];
        const variante = { stock: 1, medidas: { contorno_pecho: 102, ancho_hombros: 44, largo_prenda: 68 } };

        const filas = compararMedidas(categoria, variante, { contorno_pecho: '96' });

        expect(filas.map(f => f.medida.id)).toEqual(['contorno_pecho', 'ancho_hombros']);
        expect(filas[0].diferencia).toBe(6);
        expect(filas[1].diferencia).toBeNull();
    });
});

describe('despacho', () => {
    const config = { ...configuracionDespachoInicial };

    it('aplica precio base, costo por km y tarifas mínima y máxima', () => {
        expect(calcularPrecioDespacho(0, config)).toBe(2990);
        expect(calcularPrecioDespacho(10, config)).toBe(4490);
        expect(calcularPrecioDespacho(500, config)).toBe(15000);
        expect(calcularPrecioDespacho(10, { ...config, tarifaMinima: null, tarifaMaxima: null })).toBe(4490);
    });

    it('calcula distancias y valida que las coordenadas estén en Chile', () => {
        const km = calcularDistanciaLineaRecta(
            { latitud: -33.4372, longitud: -70.6506 },
            { latitud: -33.0472, longitud: -71.6127 }
        );

        expect(km).toBeGreaterThan(90);
        expect(km).toBeLessThan(110);
        expect(estaEnChile(-33.4, -70.6)).toBe(true);
        expect(estaEnChile(40.4, -3.7)).toBe(false);
    });
});
