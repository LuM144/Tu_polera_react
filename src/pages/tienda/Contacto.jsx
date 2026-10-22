
import Header from "../../components/tienda/Header.jsx";
import Footer from "../../components/tienda/Footer.jsx";
import { useState } from "react";
import "../../assets/styles/Contacto.css"; 

function Contacto() {

    const [Errores,setErrores]=useState({});
    const [envioExitoso, setEnvioExitoso] = useState(false);
    const validarFormulario=(datos)=>{
        const nuevosErrores={};
        const soloLetras= /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
        if (!datos.nombre.trim()){
            nuevosErrores.nombre="el nombre es obligatorio"
            
        }else if (!soloLetras.test(datos.nombre.trim())){
            nuevosErrores.nombre="el nombre solo puede contener letras";
        }
        if (!datos.apellido.trim()){
            nuevosErrores.apellido="el apellido es obligatorio"
        }else if(!soloLetras.test(datos.apellido.trim())){
            nuevosErrores.apellido="el apellido solo puede contener letras"
        }
        const formatoCorreo= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formatoCorreo.test(datos.correo.trim())){
            nuevosErrores.correo="ingresa un correo valido"
        }
        if (!/^\d{9}$/.test(datos.telefono.trim())){
            nuevosErrores.telefono="ingresa un telefono de 9 digitos"
        }
        if (datos.mensaje.trim().length<10 ){
            nuevosErrores.mensaje="el mensaje debe contener al menos 10 caracteres"
        }
         if (datos.logo && datos.logo.size > 0) {
            const tipoPermitidos=["image/jpeg", "image/png", "image/webp"];
            if (!tipoPermitidos.includes(datos.logo.type) ){
                nuevosErrores.logo="solo se permiten archivos jpg, png, webp"
            }else if (datos.logo.size > 5 *1024 * 1024){
                nuevosErrores.logo="la imagen no puede superar los 5 MB"
            }
        }
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };
    const manejarEnvio=(evento)=>{
        evento.preventDefault();
        const formulario=evento.currentTarget;
        const datosFormulario = new FormData(formulario);
        const datos={
            nombre : datosFormulario.get("nombre") || "",
            apellido: datosFormulario.get("apellido")|| "",
            correo:datosFormulario.get("correo")|| "",
            telefono:datosFormulario.get("telefono")|| "",
            mensaje:datosFormulario.get("mensaje")|| "",
            logo:datosFormulario.get("logo")
        }
        if (validarFormulario(datos)) {
            setEnvioExitoso(true);
        } else {
            setEnvioExitoso(false);
        }

    };
    const manejarCambio = (evento) => {
    const { name, value } = evento.target;

    if (Errores[name]) {
        setErrores((anteriores) => ({
            ...anteriores,
            [name]: ""
        }));
    }
    };



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
                <form onSubmit={manejarEnvio}noValidate>
                  <div className="row">

                    <div className="col-lg-6">
                      <label htmlFor="InputNombre">
                        ingresa tu nombre
                      </label>
                      <input type="text" id="InputNombre" name="nombre" onChange={manejarCambio} 
                      />
                      {Errores.nombre &&(
                        <p className="mensaje-error">
                            {Errores.nombre}
                        </p>
                    )}
                    </div>

                    <div className="col-lg-6">
                      <label htmlFor="InputApellido">
                        apellido
                      </label>
                      <input type="text" id="InputApellido" name="apellido" onChange={manejarCambio} />
                        {Errores.apellido && (
                        <p className="mensaje-error">
                        {Errores.apellido}
                        </p>
                    )}
                    </div>

                    <div className="col-lg-6">
                        <label htmlFor="InputEmail">
                        direccion de correo
                        </label>
                        <input type="email" id="InputEmail" name="correo" onChange={manejarCambio}/>
                        {Errores.correo && (
                        <p className="mensaje-error">
                        {Errores.correo}
                        </p>
                        )}
                    </div>

                    <div className="col-lg-6">
                      <label htmlFor="InputTelefono">
                        numero telefonico
                      </label>
                      <input type="tel" id="InputTelefono" name="telefono" onChange={manejarCambio}/>
                        {Errores.telefono && (
                        <p className="mensaje-error">
                        {Errores.telefono}
                        </p>
                        )}
                    </div>

                    <div className="col-lg-12">
                      <label htmlFor="areaTexto">
                        en que te podemos ayudar
                      </label>
                      <textarea id="areaTexto" rows="3" name="mensaje"
                      accept=".jpg,.jpeg,.png,.webp" 
                      onChange={manejarCambio}
                      />
                        {Errores.mensaje && (
                        <p className="mensaje-error">
                        {Errores.mensaje}
                        </p>
                        )}
                    </div>

                    <div className="col-lg-12">
                      <label htmlFor="formFile">
                        selecciona el logo que quieres
                        en tu polera
                      </label>
                      <input type="file" id="formFile" onChange={manejarCambio} />
                        {Errores.logo && (
                        <p className="mensaje-error">
                        {Errores.logo}
                        </p>
                        )}
                    </div>

                    <div className="col-lg-12">
                      <button type="submit" className="site-btn">
                        enviar
                      </button>
                    </div>
                    {envioExitoso && (
                        <div className="col-lg-12">
                            <div className="mensaje-exito">
                                <h3>✨ ¡Formulario validado!</h3>
                                <p>
                                    Tus datos se han validado correctamente.
                                    ¡Gracias por contactar con Tu Polera! 💖
                                </p>
                            </div>
                        </div>
                    )}
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
