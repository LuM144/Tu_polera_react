// Logotipo de Tu Polera: una polera estilizada junto al nombre de la tienda.
// La variante "claro" se usa sobre fondos oscuros.

function Logo({ variante = "oscuro", mostrarTexto = true, className = "" }) {
    return (
        <span className={`logo-tupolera logo-${variante} ${className}`.trim()}>
            <svg
                className="logo-marca"
                width="36"
                height="36"
                viewBox="0 0 32 32"
                aria-hidden="true"
                focusable="false"
            >
                <rect
                    className="logo-fondo"
                    x="1"
                    y="1"
                    width="30"
                    height="30"
                    rx="8"
                />

                <path
                    className="logo-polera"
                    d="M11 7l-5 3 2 4 3-1.4V25h10V11.6l3 1.4 2-4-5-3c-.4 1.7-2.2 3-4 3s-3.6-1.3-4-3z"
                />
            </svg>

            {mostrarTexto && (
                <span className="logo-texto">
                    <strong>TU POLERA</strong>
                    <small>Ropa básica para todos</small>
                </span>
            )}
        </span>
    );
}

export default Logo;
