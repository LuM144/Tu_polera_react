// src/components/Header.jsx
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <>
      {/* Menú móvil (Offcanvas) */}
      <div className="offcanvas-menu-overlay" />
      <div className="offcanvas-menu-wrapper">
        <div className="offcanvas__option">
          <div className="offcanvas__links">
            <Link to="/registro" className="boton-cuenta">
              Registro
            </Link>
          </div>
        </div>
        <div className="offcanvas__nav__option">
          <Link to="/carrito" aria-label="Carrito">
            <img src="/img/icon/cart.png" alt="Carrito" />
          </Link>
        </div>
        <nav className="offcanvas__list">
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/productos">Productos</Link></li>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/blogs">Blogs</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </nav>
        <div className="offcanvas__text">
          <p>Diseña y personaliza tus prendas para crear un estilo único.</p>
        </div>
      </div>

      {/* Header Principal */}
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
                    <Link to="/registro" id="botonCuenta" className="boton-cuenta">
                      Registro
                    </Link>
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
                <Link to="/" className="logo-text">
                  Tu <span>Polera</span>
                </Link>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <nav className="header__menu">
                <ul>
                  <li><Link to="/">Inicio</Link></li>
                  <li><Link to="/productos">Productos</Link></li>
                  <li><Link to="/nosotros">Nosotros</Link></li>
                  <li><Link to="/blogs">Blogs</Link></li>
                  <li><Link to="/contacto">Contacto</Link></li>
                </ul>
              </nav>
            </div>
            <div className="col-lg-3 col-md-3">
              <div className="header__nav__option">
                <Link to="/carrito" aria-label="Carrito">
                  <img src="/img/icon/cart.png" alt="Carrito" />
                </Link>
              </div>
            </div>
          </div>
          <div className="canvas__open" role="button" aria-label="Abrir menú">
            <i className="fa fa-bars" />
          </div>
        </div>
      </header>
    </>
  );
}
