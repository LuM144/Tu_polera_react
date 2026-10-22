import Header from "../../components/tienda/Header.jsx";
import Footer from "../../components/tienda/Footer.jsx";
import { Link } from "react-router-dom";
import "../../assets/styles/Blogs.css";
import imagen1 from "../../assets/images/imagen11.png";
import imagen2 from "../../assets/images/imagen10.png";
import imagen3 from "../../assets/images/imagen12.png";

// Arreglo con las novedades de la tienda enfocadas en ropa a medida y sin marca
const novedades = [
  {
    id: 1,
    titulo: "Polerones Básicos Oversize",
    imagen: imagen2,
    descripcion:
      "Ajuste a medida sin marcas visibles. Confeccionados en franela gruesa de primera calidad para máxima comodidad.",
  },
  {
    id: 2,
    titulo: "Accesorios Minimalistas",
    imagen: imagen1,
    descripcion:
      "Gorras de calce perfecto y acabados limpios. Diseñadas sin logos frontales para un estilo sobrio y elegante.",
  },
  {
    id: 3,
    titulo: "Paleta Neutra & Atemporal",
    imagen: imagen3,
    descripcion:
      "Añadimos tonos neutros y sobrios a nuestras poleras de algodón 100% hilado, pensadas para combinar con todo.",
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
                  ✂️ Perfeccionamos nuestro taller de sastrería y patronaje a medida
                </h3>
                <p>
                  Nuestro compromiso siempre ha sido entregar prendas esenciales que
                  se adapten perfectamente a tu cuerpo y mantengan su estructura lavado
                  tras lavado. Nos complace anunciar la optimización de nuestros procesos de
                  corte y patronaje digital. Con esta mejora, garantizamos ropa hecha a
                  tu medida exacta con costuras reforzadas, caídas impecables y tejidos
                  de alta durabilidad, todo sin etiquetas de marca que inflen el precio final.
                </p>
              </div>
            </div>

            {/* Segunda noticia */}
            <div className="bloque">
              <div className="texto-centrado">
                <h3 className="mb-4">
                  🌱 Calidad de alta gama a precios accesibles para todos
                </h3>
                <p>
                  Democratizamos el vestir a medida eliminando intermediarios y gastos
                  de publicidad de marca. Renovamos nuestro catálogo base integrando telas
                  de algodón premium préshrunk (preencogido) e hilos de alta resistencia.
                  Disfruta de poleras, polerones y accesorios hechos para durar, diseñados
                  con la máxima atención al detalle y al alcance de tu bolsillo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tarjetas de novedades */}
        <section className="spad">
          <div className="container">
            <div className="titulo-coleccion">
              <span>Lo Nuevo En Nuestra Colección</span>
              <h2>✨ Descubre nuestros esenciales a medida ✨</h2>
              <p>
                Ropa sobria, sin logos y confeccionada para adaptarse a tu estilo de vida
              </p>
            </div>
            <div className="row g-4">
              {novedades.map((novedad) => (
                <div className="col-lg-4 col-md-6" key={novedad.id}>
                  <div className="noticia-item">
                    {novedad.imagen && (
                      <img
                        src={novedad.imagen}
                        alt={novedad.titulo}
                        className="noticia-imagen"
                      />
                    )}
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