<div>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tu Polera</title>
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
        <li className="active"><a href="index.html">Inicio</a></li>
        <li><a href="productos.html">Productos</a></li>
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
              <li className="active"><a href="index.html">Inicio</a></li>
              <li><a href="productos.html">Productos</a></li>
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
  {/* Hero */}
  <section className="hero">
    <div id="carruselHome" className="carousel slide carousel-fade hero__slider" data-bs-ride="carousel">
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carruselHome" data-bs-slide-to={0} className="active" aria-label="Diapositiva 1" />
        <button type="button" data-bs-target="#carruselHome" data-bs-slide-to={1} aria-label="Diapositiva 2" />
        <button type="button" data-bs-target="#carruselHome" data-bs-slide-to={2} aria-label="Diapositiva 3" />
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <div className="hero__items" style={{backgroundImage: 'url("Imagenes/banner_placeholder.png")'}} role="img" aria-label="Poleras personalizadas">
            <div className="container">
              <div className="row">
                <div className="col-xl-5 col-lg-7 col-md-8">
                  <div className="hero__text">
                    <h6>Poleras personalizadas</h6>
                    <h1>Diseña tu estilo</h1>
                    <p>Crea prendas personalizadas a tu gusto.</p>
                    <a href="productos.html" className="primary-btn">Ver productos <span className="arrow_right" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <div className="hero__items" style={{backgroundImage: 'url("Imagenes/banner_placeholder.png")'}} role="img" aria-label="Polerones personalizados">
            <div className="container">
              <div className="row">
                <div className="col-xl-5 col-lg-7 col-md-8">
                  <div className="hero__text">
                    <h6>Polerones personalizados</h6>
                    <h1>Tu diseño, tu estilo</h1>
                    <p>Personaliza tus prendas favoritas.</p>
                    <a href="productos.html" className="primary-btn">Comprar ahora <span className="arrow_right" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <div className="hero__items" style={{backgroundImage: 'url("Imagenes/banner_placeholder.png")'}} role="img" aria-label="Productos personalizados">
            <div className="container">
              <div className="row">
                <div className="col-xl-5 col-lg-7 col-md-8">
                  <div className="hero__text">
                    <h6>Productos personalizados</h6>
                    <h1>Productos únicos</h1>
                    <p>Haz que cada producto sea especial.</p>
                    <a href="productos.html" className="primary-btn">Ver catálogo <span className="arrow_right" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carruselHome" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" />
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carruselHome" data-bs-slide="next">
        <span className="carousel-control-next-icon" />
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  </section>
  {/* Categorías */}
  <section className="banner spad">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="section-title">
            <span>Categorías</span>
            <h2>Explora nuestras categorías</h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-7 offset-lg-4">
          <div className="banner__item">
            <div className="banner__item__pic">
              <img src="Imagenes/poleras.png" alt="Poleras" />
            </div>
            <div className="banner__item__text">
              <h2>Poleras</h2>
              <p>Descubre nuestras poleras personalizadas.</p>
              <a href="productos.html?categoria=poleras">Ver poleras</a>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="banner__item banner__item--middle">
            <div className="banner__item__pic">
              <img src="Imagenes/polerones.png" alt="Polerones" />
            </div>
            <div className="banner__item__text">
              <h2>Polerones</h2>
              <p>Encuentra polerones personalizados.</p>
              <a href="productos.html?categoria=polerones">Ver polerones</a>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="banner__item banner__item--last">
            <div className="banner__item__pic">
              <img src="Imagenes/gorros.png" alt="Gorros" />
            </div>
            <div className="banner__item__text">
              <h2>Gorros</h2>
              <p>Personaliza tu gorro a tu gusto.</p>
              <a href="productos.html?categoria=gorras">Ver gorros</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* Productos destacados */}
  <section className="product spad">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="section-title">
            <span>Lo más visto</span>
            <h2>Productos destacados</h2>
          </div>
        </div>
      </div>
      <div id="carruselProductos" className="carousel slide" data-bs-ride="carousel">
        <div id="productosDestacados" className="carousel-inner">
          {/* Los productos se cargarán mediante JavaScript */}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carruselProductos" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" />
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carruselProductos" data-bs-slide="next">
          <span className="carousel-control-next-icon" />
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>
    </div>
  </section>
  {/* Noticias */}
  <section className="spad pt-0">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="section-title">
            <span>Novedades</span>
            <h2>Noticias</h2>
          </div>
        </div>
      </div>
      <div id="carruselNoticias" className="carousel slide carousel-noticias" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carruselNoticias" data-bs-slide-to={0} className="active" aria-label="Noticia 1" />
          <button type="button" data-bs-target="#carruselNoticias" data-bs-slide-to={1} aria-label="Noticia 2" />
          <button type="button" data-bs-target="#carruselNoticias" data-bs-slide-to={2} aria-label="Noticia 3" />
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="Imagenes/banner_placeholder.png" className="d-block w-100" alt="Nueva colección" />
            <div className="carousel-caption">
              <h3>Nueva colección disponible</h3>
              <p>Ya puedes encontrar nuestra nueva colección.</p>
              <a href="productos.html" className="primary-btn">Ver productos</a>
            </div>
          </div>
          <div className="carousel-item">
            <img src="Imagenes/banner_placeholder.png" className="d-block w-100" alt="Descuentos" />
            <div className="carousel-caption">
              <h3>¡Descuentos especiales!</h3>
              <p>Aprovecha nuestras ofertas por tiempo limitado.</p>
              <a href="productos.html?descuento=25" className="primary-btn">Ver ofertas</a>
            </div>
          </div>
          <div className="carousel-item">
            <img src="Imagenes/banner_placeholder.png" className="d-block w-100" alt="Personalización" />
            <div className="carousel-caption">
              <h3>Personaliza tus productos</h3>
              <p>Crea diseños únicos para tus productos favoritos.</p>
              <a href="productos.html" className="primary-btn">Personalizar</a>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carruselNoticias" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" />
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carruselNoticias" data-bs-slide="next">
          <span className="carousel-control-next-icon" />
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>
    </div>
  </section>
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
  {/* JavaScript del Home */}
</div>
