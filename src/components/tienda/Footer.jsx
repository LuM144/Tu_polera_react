// src/components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-6">
            <div className="footer__about">
              <div className="footer__logo">
                <Link to="/" className="logo-text">
                  Tu <span>Polera</span>
                </Link>
              </div>
              <p>Diseña y personaliza tus prendas para crear un estilo único.</p>
            </div>
          </div>
          <div className="col-lg-3 offset-lg-1 col-md-3 col-sm-6">
            <div className="footer__widget">
              <h6>Navegación</h6>
              <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/productos">Productos</Link></li>
                <li><Link to="/nosotros">Nosotros</Link></li>
                <li><Link to="/contacto">Contacto</Link></li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-md-3 col-sm-6">
            <div className="footer__widget">
              <h6>Tu cuenta</h6>
              <ul>
                <li><Link to="/registro">Registrarse</Link></li>
                <li><Link to="/carrito">Mi carrito</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="footer__copyright__text">
              <p>© 2026 Tu Polera - Todos los derechos reservados</p>
              <p className="credito">
                Diseño basado en la plantilla Male Fashion de{' '}
                <a href="https://colorlib.com" target="_blank" rel="noopener noreferrer">
                  Colorlib
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
