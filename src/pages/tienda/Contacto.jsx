
import Header from "../../components/tienda/Header.jsx";
import Footer from "../../components/tienda/Footer.jsx";

import "../../assets/styles/Contacto.css"; 

function Contacto() {
  return (
    <>
      <Header />

      <section className="breadcrumb-option">
        <div className="container">
          <div className="breadcrumb__text">
            <h1>Contacto</h1>
            <div className="breadcrumb__links">
              <a href="/admin">Inicio</a>
              <span>Contacto</span>
            </div>
          </div>
        </div>
      </section>

      <main>
        <section className="contact spad">
          <div className="container">
            <div className="contact__box">

              <div className="section-title">
                <span>Escríbenos</span>
                <h2>contacto</h2>
              </div>

              <div className="contact__form">
                <form>
                  <div className="row">

                    <div className="col-lg-6">
                      <label htmlFor="InputNombre">
                        ingresa tu nombre
                      </label>
                      <input type="text" id="InputNombre" />
                    </div>

                    <div className="col-lg-6">
                      <label htmlFor="InputApellido">
                        apellido
                      </label>
                      <input type="text" id="InputApellido" />
                    </div>

                    <div className="col-lg-6">
                      <label htmlFor="InputEmail">
                        direccion de correo
                      </label>
                      <input type="email" id="InputEmail" />
                    </div>

                    <div className="col-lg-6">
                      <label htmlFor="InputTelefono">
                        numero telefonico
                      </label>
                      <input type="tel" id="InputTelefono" />
                    </div>

                    <div className="col-lg-12">
                      <label htmlFor="areaTexto">
                        en que te podemos ayudar
                      </label>
                      <textarea id="areaTexto" rows="3" />
                    </div>

                    <div className="col-lg-12">
                      <label htmlFor="formFile">
                        selecciona el logo que quieres
                        en tu polera
                      </label>
                      <input type="file" id="formFile" />
                    </div>

                    <div className="col-lg-12">
                      <button type="submit" className="site-btn">
                        enviar
                      </button>
                    </div>

                  </div>
                </form>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Contacto;
