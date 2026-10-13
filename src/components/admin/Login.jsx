// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validación básica de formulario
    if (!correo.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Lógica de inicio de sesión (almacenamiento de sesión / petición API)
    console.log('Iniciando sesión con:', { correo, password });

    // Redirección al panel de administración tras iniciar sesión
    navigate('/admin');
  };

  return (
    <div>
      {/* Componente Header Reutilizable */}
      <Header />

      {/* Cabecera de la página / Breadcrumb */}
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h1>Iniciar Sesión</h1>
                <div className="breadcrumb__links">
                  <Link to="/">Inicio</Link>
                  <span>Iniciar sesión</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de Login */}
      <main>
        <section className="auth">
          <div className="container">
            <div className="registro-container">
              <h2>Iniciar Sesión</h2>
              <p>Ingresa tus datos para acceder a tu cuenta</p>

              {/* Mensaje de error dinámico */}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <label htmlFor="correo">Correo electrónico</label>
                <input
                  type="email"
                  id="correo"
                  placeholder="nombre@ejemplo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />

                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit" className="btn-registrar">
                  Iniciar sesión
                </button>

                <div className="iniciar-sesion">
                  ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
                </div>
                <div className="iniciar-sesion mt-3">
                  <Link to="/">Volver al inicio</Link>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Componente Footer Reutilizable */}
      <Footer />
    </div>
  );
}
