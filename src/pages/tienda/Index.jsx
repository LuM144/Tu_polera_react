import { Link } from "react-router-dom";
import imagen12 from "../../assets/images/imagen12.png";
import imagen1 from "../../assets/images/imagen1.png";
import imagen2 from "../../assets/images/imagen2.png";
import imagen3 from "../../assets/images/imagen3.png";
import imagen13 from "../../assets/images/imagen13.png";
import imagen15 from "../../assets/images/imagen15.png";
// Importa aquí tus archivos CSS si están en src/assets/styles/
import "../../assets/styles/Nosotros.css"; 

function Index() {
  return (
    <div className="pagina-tienda">
      {/* Header / Menú Superior */}
      <header className="header bg-dark text-white py-2">
        <div className="container d-flex justify-content-between align-items-center">
          <p className="mb-0 small text-white">
            Ropa a medida, de calidad y sin marcas a precios accesibles.
          </p>
          <Link to="/registro" className="text-white text-decoration-none small">
            Registro
          </Link>
        </div>
      </header>

      {/* Navegación Principal */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3">
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold fs-3">
            Tu <span className="text-danger">Polera</span>
          </Link>

          <div className="navbar-nav mx-auto gap-3">
            <Link to="/" className="nav-link active fw-bold">Inicio</Link>
            <Link to="/productos" className="nav-link">Productos</Link>
            <Link to="/nosotros" className="nav-link">Nosotros</Link>
            <Link to="/blogs" className="nav-link">Blogs</Link>
            <Link to="/contacto" className="nav-link">Contacto</Link>
          </div>

          <div>
            <Link to="/carrito" className="btn btn-outline-dark btn-sm">
              🛒 Carrito
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero / Carrusel Principal */}
      <section className="hero">
        <div id="carruselHome" className="carousel slide carousel-fade" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carruselHome" data-bs-slide-to={0} className="active" aria-label="Slide 1" />
            <button type="button" data-bs-target="#carruselHome" data-bs-slide-to={1} aria-label="Slide 2" />
            <button type="button" data-bs-target="#carruselHome" data-bs-slide-to={2} aria-label="Slide 3" />
          </div>

          <div className="carousel-inner">
            {/* Slide 1 */}
            <div className="carousel-item active">
              <div 
                className="d-flex align-items-center text-white"
                style={{ 
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imagen15})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  minHeight: '450px'
                }}
              >
                <div className="container p-5">
                  <h6 className="text-uppercase text-warning fw-bold">Ropa esencial a medida</h6>
                  <h1 className="display-4 fw-bold">Sin marcas, puro estilo</h1>
                  <p className="lead">Prendas de alta calidad hechas exactamente para ti y al alcance de todos.</p>
                  <Link to="/productos" className="btn btn-danger btn-lg mt-2">
                    Ver productos →
                  </Link>
                </div>
              </div>
            </div>

            {/* Slide 2 */}
            <div className="carousel-item">
              <div 
                className="d-flex align-items-center text-white"
                style={{ 
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imagen15})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  minHeight: '450px'
                }}
              >
                <div className="container p-5">
                  <h6 className="text-uppercase text-warning fw-bold">Confort y minimalismo</h6>
                  <h1 className="display-4 fw-bold">Calidad sin intermediarios</h1>
                  <p className="lead">Disfruta de prendas cómodas y duraderas sin pagar de más por una etiqueta.</p>
                  <Link to="/productos" className="btn btn-danger btn-lg mt-2">
                    Comprar ahora →
                  </Link>
                </div>
              </div>
            </div>

            {/* Slide 3 */}
            <div className="carousel-item">
              <div 
                className="d-flex align-items-center text-white"
                style={{ 
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imagen12})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  minHeight: '450px'
                }}
              >
                <div className="container p-5">
                  <h6 className="text-uppercase text-warning fw-bold">Moda accesible</h6>
                  <h1 className="display-4 fw-bold">Prendas únicas y duraderas</h1>
                  <p className="lead">Haz que cada prenda básica sea la base perfecta de tu día a día.</p>
                  <Link to="/productos" className="btn btn-danger btn-lg mt-2">
                    Ver catálogo →
                  </Link>
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

      {/* Seccion Categorias */}
      <section className="container my-5 py-4">
        <div className="text-center mb-5">
          <span className="text-uppercase text-muted fw-bold small">Categorías</span>
          <h2 className="fw-bold">Explora nuestros esenciales</h2>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 text-center p-3">
              <img src={imagen1} className="card-img-top mx-auto" style={{ maxHeight: "200px", objectFit: "contain" }} alt="Poleras" />
              <div className="card-body">
                <h4 className="card-title fw-bold">Poleras</h4>
                <p className="card-text text-muted">Descubre nuestras poleras básicas a medida.</p>
                <Link to="/productos?categoria=poleras" className="btn btn-outline-dark btn-sm">Ver poleras</Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 text-center p-3">
              <img src={imagen2} className="card-img-top mx-auto" style={{ maxHeight: "200px", objectFit: "contain" }} alt="Polerones" />
              <div className="card-body">
                <h4 className="card-title fw-bold">Polerones</h4>
                <p className="card-text text-muted">Encuentra comodidad y abrigo sin marcas visibles.</p>
                <Link to="/productos?categoria=polerones" className="btn btn-outline-dark btn-sm">Ver polerones</Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0 text-center p-3">
              <img src={imagen3} className="card-img-top mx-auto" style={{ maxHeight: "200px", objectFit: "contain" }} alt="Gorros" />
              <div className="card-body">
                <h4 className="card-title fw-bold">Gorros</h4>
                <p className="card-text text-muted">Complementa tu estilo sobrio y minimalista.</p>
                <Link to="/productos?categoria=gorras" className="btn btn-outline-dark btn-sm">Ver gorros</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seccion Noticias */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="text-center mb-4">
            <span className="text-uppercase text-muted fw-bold small">Novedades</span>
            <h2 className="fw-bold">Noticias del Taller</h2>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <img src={imagen12} className="card-img-top" style={{ height: "220px", objectFit: "cover" }} alt="Coleccion" />
                <div className="card-body">
                  <h5 className="fw-bold">Nueva colección a medida</h5>
                  <p className="text-muted small">Prendas diseñadas exclusivamente para adaptarse a tu cuerpo sin pagar de más.</p>
                  <Link to="/blogs" className="btn btn-link p-0 text-danger text-decoration-none">Leer más →</Link>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <img src={imagen13} className="card-img-top" style={{ height: "220px", objectFit: "cover" }} alt="Ofertas" />
                <div className="card-body">
                  <h5 className="fw-bold">Moda sin marcas costosas</h5>
                  <p className="text-muted small">Eliminamos intermediarios para entregarte la mejor calidad a precio justo.</p>
                  <Link to="/blogs" className="btn btn-link p-0 text-danger text-decoration-none">Leer más →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <p className="mb-1">© 2026 Tu Polera - Ropa a medida, de calidad y sin marcas.</p>
        </div>
      </footer>
    </div>
  );
}

export default Index;