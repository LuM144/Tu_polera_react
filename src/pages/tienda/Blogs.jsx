
import Header from "../../components/tienda/Header.jsx";
import Footer from "../../components/tienda/Footer.jsx";
import { Link } from "react-router-dom";
import "../../assets/styles/Blogs.css";

// Arreglo con las novedades de la tienda
const novedades = [
  {
    id: 1,
    titulo: "polerones oversize",
    descripcion:
      "Un corte moderno, cómodo y de franela gruesa, ideal para la temporada.",
  },
  {
    id: 2,
    titulo: "Nuevos estilos de Gorras",
    descripcion:
      "Incorporamos modelos tipo Trucker y Dad Hats con viseras de alta calidad, perfectas para bordados frontales.",
  },
  {
    id: 3,
    titulo: "Paleta de colores de temporada",
    descripcion:
      "Añadimos tonos neutros, pasteles y colores de alto contraste en nuestras poleras de algodón 100%.",
  },
];

function Blogs() {
  return (
    <>
      <Header />
      {/* Cabecera de página */}
      <section className="breadcrumb-option pagina-blogs">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h1>Blogs</h1>
                <div className="breadcrumb__links">
                  <Link to="/">Inicio</Link>
                  <span>Blogs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <main className="pagina-texto pagina-blogs">
        <section className="spad pb-0">
          <div className="container">
            <div className="section-title">
              <span>Blog</span>
              <h2>⭐ Novedades ⭐</h2>
            </div>

            {/* Primera noticia */}
            <div className="bloque">
                <div className="texto-centrado">
                    <h3 className="mb-4">
                        <h3 className="mb-4">
                            ✨ Estrenamos nueva tecnología de estampados y bordados
                        </h3>
                    </h3>
                <p>
                  nuestro compromiso siempre ha sido entregar prendas
                  que no solo se vean bien el primer día, sino que
                  soporten el uso diario sin perder su color ni su
                  forma. Por eso, nos complace anunciar que hemos
                  actualizado los equipos e insumos de nuestro taller.
                  Con esta mejora, garantizamos estampados con detalles
                  muchísimo más precisos, bordados de alta densidad y
                  una resistencia al lavado significativamente superior.
                  Ya sea que necesites un diseño complejo con degradados
                  para una polera o un logo detallado para una gorra,
                  el resultado tendrá una textura suave y un acabado
                  profesional.
                </p>
              </div>
            </div>
            {/* Segunda noticia */}
            <div className="bloque">
              <div className="texto-centrado">
                <h3 className="mb-4">
                  🚀Lanzamiento de Nuevos Productos y Colores
                </h3>
                <p>
                  Sumamos nuevas opciones de polerones oversize,
                  gorras de distintos estilos y una paleta de
                  colores renovada para que tus personalizaciones
                  no tengan límites.
                  Sabemos que cada cliente tiene un estilo único,
                  y por eso en [Tu Polera] acabamos de
                  renovar completamente nuestro catálogo de prendas
                  base para personalización.
                  A partir de esta semana, encontrarás disponibles:
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tarjetas de novedades */}
        <section className="spad">
          <div className="container">
            <div className="row g-4">
              {novedades.map((novedad) => (
                <div
                  className="col-lg-4 col-md-6"
                  key={novedad.id}
                >
                  <div className="noticia-item">
                    <h4>{novedad.titulo}</h4>
                    <p>{novedad.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Blogs;
