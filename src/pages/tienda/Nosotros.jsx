import NavbarTienda from "../../components/tienda/NavbarTienda";
import FooterTienda from "../../components/tienda/FooterTienda";
import Icono from "../../components/Iconos";
import "../../assets/styles/Nosotros.css";

const SERVICIOS = [
    {
        icono: "tienda",
        titulo: "Catálogo por categorías",
        texto: "Poleras, polerones, gorras y las categorías que se sumen con el tiempo, siempre con información clara de cada prenda."
    },
    {
        icono: "regla",
        titulo: "Tallas y medidas",
        texto: "Cada talla indica sus dimensiones. Puedes ingresar tus medidas y compararlas con las de la prenda antes de comprar."
    },
    {
        icono: "mapa",
        titulo: "Búsqueda de direcciones",
        texto: "Ingresas tu dirección en Chile y la ubicamos para coordinar el despacho."
    },
    {
        icono: "camion",
        titulo: "Despacho calculado",
        texto: "El costo estimado se calcula según la distancia entre nuestra bodega y tu dirección, y lo ves antes de pagar."
    }
];

function Nosotros() {
    return (
        <div className="pagina-tienda pagina-nosotros">
            <NavbarTienda />

            <main>
                <section className="portada-pagina">
                    <div className="container">
                        <span className="etiqueta">Nosotros</span>

                        <h1>Ropa básica, simple y accesible</h1>

                        <p>
                            Tu Polera es una tienda online de prendas de vestir
                            cómodas, funcionales y a precios que se ajustan a
                            tu bolsillo.
                        </p>
                    </div>
                </section>

                <section className="container seccion-pagina">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-6">
                            <h2>Qué es Tu Polera</h2>

                            <p>
                                Nos dedicamos a vender prendas básicas para el
                                día a día. Ofrecemos poleras, polerones, gorras
                                y otras prendas que iremos incorporando, en
                                distintos colores, tallas y medidas.
                            </p>

                            <p>
                                Funcionamos solo de manera online, por lo que no
                                tenemos un local abierto al público. Los pedidos
                                salen desde nuestro centro de distribución hacia
                                cualquier dirección de Chile.
                            </p>
                        </div>

                        <div className="col-lg-6">
                            <div className="tarjeta-objetivo">
                                <h3>Nuestro objetivo</h3>

                                <p>
                                    Que comprar ropa sea simple: entregar
                                    información detallada de cada producto y
                                    herramientas que ayuden a elegir la prenda
                                    correcta y a coordinar el despacho sin
                                    sorpresas.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="seccion-pagina seccion-oscura">
                    <div className="container">
                        <h2 className="text-center mb-4">Cómo te ayudamos a comprar</h2>

                        <div className="row g-4">
                            {SERVICIOS.map(servicio => (
                                <div className="col-md-6 col-lg-3" key={servicio.titulo}>
                                    <article className="tarjeta-servicio">
                                        <Icono nombre={servicio.icono} tamano={32} />

                                        <h3>{servicio.titulo}</h3>

                                        <p>{servicio.texto}</p>
                                    </article>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <FooterTienda />
        </div>
    );
}

export default Nosotros;
