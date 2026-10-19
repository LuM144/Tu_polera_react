<div>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Productos</title>
  {/* Fuente de la plantilla Male Fashion */}
  <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700;800;900&display=swap" rel="stylesheet" />
  {/* Bootstrap */}
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" />
  {/* Iconos */}
  <link rel="stylesheet" href="css/font-awesome.min.css" />
  <link rel="stylesheet" href="css/elegant-icons.css" />
  {/* CSS propio (tema Male Fashion) */}
  <link rel="stylesheet" href="css/style.css" />
  {/* Menú móvil */}
  <div className="offcanvas-menu-overlay" />
  <div className="offcanvas-menu-wrapper">
    <div className="offcanvas__option">
      <div className="offcanvas__links">
        <a href="registro.html" className="boton-cuenta">Registro</a>
      </div>
    </div>
    <div className="offcanvas__nav__option">
      <a href="carrito.html" aria-label="Carrito"><img src="img/icon/cart.png" alt="Carrito" /></a>
    </div>
    <nav className="offcanvas__list">
      <ul>
        <li><a href="index.html">Inicio</a></li>
        <li className="active"><a href="productos.html">Productos</a></li>
        <li><a href="nosotros.html">Nosotros</a></li>
        <li><a href="blogs.html">Blogs</a></li>
        <li><a href="contacto.html">Contacto</a></li>
      </ul>
    </nav>
    <div className="offcanvas__text">
      <p>Diseña y personaliza tus prendas para crear un estilo único.</p>
    </div>
  </div>
  {/* Header */}
  <header className="header">
    <div className="header__top">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-7">
            <div className="header__top__left">
              <p>Diseña y personaliza tus prendas para crear un estilo único.</p>
            </div>
          </div>
          <div className="col-lg-6 col-md-5">
            <div className="header__top__right">
              <div className="header__top__links">
                <a href="registro.html" id="botonCuenta" className="boton-cuenta">Registro</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="container">
      <div className="row">
        <div className="col-lg-3 col-md-3">
          <div className="header__logo">
            <a href="index.html" className="logo-text">Tu <span>Polera</span></a>
          </div>
        </div>
        <div className="col-lg-6 col-md-6">
          <nav className="header__menu">
            <ul>
              <li><a href="index.html">Inicio</a></li>
              <li className="active"><a href="productos.html">Productos</a></li>
              <li><a href="nosotros.html">Nosotros</a></li>
              <li><a href="blogs.html">Blogs</a></li>
              <li><a href="contacto.html">Contacto</a></li>
            </ul>
          </nav>
        </div>
        <div className="col-lg-3 col-md-3">
          <div className="header__nav__option">
            <a href="carrito.html" aria-label="Carrito"><img src="img/icon/cart.png" alt="Carrito" /></a>
          </div>
        </div>
      </div>
      <div className="canvas__open" role="button" aria-label="Abrir menú"><i className="fa fa-bars" /></div>
    </div>
  </header>
  {/* Cabecera de página */}
  <section className="breadcrumb-option">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="breadcrumb__text">
            <h1>Nuestros productos</h1>
            <div className="breadcrumb__links">
              <a href="index.html">Inicio</a>
              <span>Productos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* Productos */}
  <main>
    <section className="shop spad">
      <div className="container">
        {/* Filtros */}
        <div className="shop__filters">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <label htmlFor="filtroTipo">Tipo</label>
              <select id="filtroTipo">
                <option value="todos">Todos</option>
                <option value="poleras">Poleras</option>
                <option value="polerones">Polerones</option>
                <option value="gorras">Gorras</option>
              </select>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label htmlFor="filtroColor">Color</label>
              <select id="filtroColor">
                <option value="todos">Todos</option>
                <option value="negro">Negro</option>
                <option value="rojo">Rojo</option>
                <option value="amarillo">Amarillo</option>
              </select>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label htmlFor="filtroDescuento">Rango de Descuentos</label>
              <select id="filtroDescuento">
                <option value="todos">Todos</option>
                <option value={0}>Sin descuento</option>
                <option value={25}>25% o más</option>
                <option value={50}>50% o más</option>
                <option value={90}>90% o más</option>
              </select>
            </div>
          </div>
        </div>
        {/* Listado */}
        <div id="contenedorProductos" className="row">
        </div>
      </div>
    </section>
  </main>
  {/* Modal producto */}
  <div className="modal fade" id="modalProducto" tabIndex={-1}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="modalNombre" />
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" />
        </div>
        <div className="modal-body">
          <div className="modal-imagen-contenedor">
            <img id="modalImagen" src alt />
          </div>
          <p id="modalDescripcion" className="mt-3" />
          <p id="modalPrecio" className="fw-bold" />
          <div className="modal-talla">
            <label htmlFor="modalTalla" className="form-label">Talla</label>
            <select id="modalTalla" />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-linea" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" id="btnAgregarCarrito" className="site-btn">Añadir al carrito</button>
        </div>
      </div>
    </div>
  </div>
  {/* Footer */}
  <footer className="footer">
    <div className="container">
      <div className="row">
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="footer__about">
            <div className="footer__logo">
              <a href="index.html" className="logo-text">Tu <span>Polera</span></a>
            </div>
            <p>Diseña y personaliza tus prendas para crear un estilo único.</p>
          </div>
        </div>
        <div className="col-lg-3 offset-lg-1 col-md-3 col-sm-6">
          <div className="footer__widget">
            <h6>Navegación</h6>
            <ul>
              <li><a href="index.html">Inicio</a></li>
              <li><a href="productos.html">Productos</a></li>
              <li><a href="nosotros.html">Nosotros</a></li>
              <li><a href="contacto.html">Contacto</a></li>
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-6">
          <div className="footer__widget">
            <h6>Tu cuenta</h6>
            <ul>
              <li><a href="registro.html">Registrarse</a></li>
              <li><a href="carrito.html">Mi carrito</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 text-center">
          <div className="footer__copyright__text">
            <p>© 2026 Tu Polera - Todos los derechos reservados</p>
            <p className="credito">Diseño basado en la plantilla Male Fashion de <a href="https://colorlib.com" target="_blank" rel="noopener">Colorlib</a></p>
          </div>
        </div>
      </div>
    </div>
  </footer>
  {/* Javascript */}
</div>
