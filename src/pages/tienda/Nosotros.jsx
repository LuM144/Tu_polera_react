
import Header from "../../components/tienda/Header.jsx";
import Footer from "../../components/tienda/Footer.jsx";
import "../../assets/styles/Nosotros.css";

function Nosotros() {
  return (
    <>
      <Header />

      <section className="breadcrumb-option pagina-nosotros">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h1>Nosotros</h1>
                <div className="breadcrumb__links">
                  <a href="/">Inicio</a>
                  <span>Nosotros</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="pagina-texto pagina-nosotros">
        <section className="spad pb-0">
          <div className="container">

            {/* Quiénes somos */}
            <div className="bloque">
              <div className="section-title">
                <span>Quiénes somos</span>
                <h2>⭐ acerca de nosotros ⭐</h2>
              </div>

              <div className="texto-centrado">
                <p>
                  Creemos que vestir bien no debe depender de marcas ni logos costosos. 
                  Nacimos con el propósito de devolver el valor a lo esencial: prendas básicas 
                  hechas exactamente a tu medida, confeccionadas con telas de primera calidad 
                  y diseñadas para durar. Prescindimos de intermediarios y etiquetas innecesarias 
                  para ofrecerte ropa perfecta a precios reales y accesibles para todos.
                </p>
              </div>
            </div>

            {/* Misión */}
            <div className="bloque">
              <div className="section-title">
                <span>Lo que nos mueve</span>
                <h2>🚩 nuestra misión</h2>
              </div>

              <div className="texto-centrado">
                <p>
                  Nuestra misión es democratizar la moda a medida. Nos dedicamos a confeccionar 
                  prendas atemporales sin marca, priorizando el calce perfecto, la comodidad 
                  y la durabilidad de cada tejido. Queremos que vista bien sin pagar de más 
                  por una etiqueta.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Ventajas / Por qué elegirnos */}
        <section className="spad">
          <div className="container">
            <div className="section-title">
              <span>Nuestras ventajas</span>
              <h2>por qué elegirnos</h2>
            </div>

            <div className="row g-4">

              <div className="col-lg-4 col-md-6">
                <div className="feature-box">
                  <h3>📐 confección a medida</h3>
                  <p>
                    Diseñamos cada prenda para que se adapte a ti. Olvídate de los tallajes 
                    estándar incomodos y disfruta de un ajuste óptimo que resalta tu estilo propio.
                  </p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="feature-box">
                  <h3>✨ esencia sin marca</h3>
                  <p>
                    Apostamos por el minimalismo inteligente. Sin logos llamativos ni diseños recargados; 
                    la calidad del corte y de la tela son los verdaderos protagonistas.
                  </p>
                </div>
              </div>

              <div className="col-lg-4 col-md-12">
                <div className="feature-box">
                  <h3>🏷️ precio justo y accesible</h3>
                  <p>
                    Eliminamos los costes de marketing de marca e intermediarios para ofrecerte ropa de 
                    alta gama a precios al alcance de todos.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Nosotros;