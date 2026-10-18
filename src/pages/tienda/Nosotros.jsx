
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

            
            <div className="bloque">
              <div className="section-title">
                <span>Quiénes somos</span>
                <h2>⭐ acerca de nosotros ⭐</h2>
              </div>

              <div className="texto-centrado">
                <p>
                  En TU POLERA, creemos que la ropa es mucho más
                  que tela: es una forma de expresión. Nacimos
                  con la idea de romper con lo común y darte
                  el poder de llevar tus propias ideas, diseños
                  y emociones en prendas de uso diario.
                  Lo que comenzó como un proyecto enfocado en
                  la creatividad y el detalle, hoy se ha
                  convertido en el lugar donde tus ideas cobran
                  vida en poleras, polerones y gorras únicas.
                </p>
              </div>
            </div>

            <div className="bloque">
              <div className="section-title">
                <span>Lo que nos mueve</span>
                <h2>🚩 nuestra mision</h2>
              </div>

              <div className="texto-centrado">
                <p>
                  Nos dedicamos a crear prendas personalizadas
                  de alta calidad que reflejen la personalidad
                  de cada persona o la identidad de cada marca,
                  grupo o emprendimiento. Queremos que cada
                  producto que recibas supere tus expectativas
                  en diseño, comodidad y durabilidad.
                </p>
              </div>
            </div>

          </div>
        </section>

        <section className="spad">
          <div className="container">
            <div className="section-title">
              <span>Nuestras ventajas</span>
              <h2>por que elegirnos</h2>
            </div>

            <div className="row g-4">

              <div className="col-lg-4 col-md-6">
                <div className="feature-box">
                  <h3>🧵 calidad superior</h3>
                  <p>
                    Seleccionamos telas cómodas, duraderas y
                    de excelente tacto, junto con técnicas de
                    estampado/bordado de alta definición para
                    que tu diseño dure lavado tras lavado.
                  </p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="feature-box">
                  <h3>🎨 personalizacion sin limites</h3>
                  <p>
                    Desde un detalle sutil hasta un diseño
                    completo. Ya sea para un regalo especial,
                    tu marca personal o el uniforme de tu
                    equipo, lo hacemos realidad.
                  </p>
                </div>
              </div>

              <div className="col-lg-4 col-md-12">
                <div className="feature-box">
                  <h3>👁️ atencion al detalle</h3>
                  <p>
                    Cada prenda pasa por un proceso riguroso
                    de control de calidad. Nos preocupamos
                    por los acabados tanto como tú.
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
