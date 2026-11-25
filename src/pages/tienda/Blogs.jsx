import { Link } from "react-router-dom";
import NavbarTienda from "../../components/tienda/NavbarTienda";
import FooterTienda from "../../components/tienda/FooterTienda";
import { images } from "../../data/imagenes";
import "../../assets/styles/Blogs.css";

// Publicaciones del blog, relacionadas con el funcionamiento real de la tienda.
const publicaciones = [
    {
        id: 1,
        categoria: "Guía",
        titulo: "Cómo usar el comparador de medidas",
        imagen: images.imagen1,
        resumen: "Ingresa tu contorno de pecho u otras medidas en la ficha de la prenda y revisa en cuántos centímetros se diferencian de cada talla.",
        contenido: "En cada producto encontrarás las dimensiones de sus tallas. El comparador te muestra la diferencia entre tus medidas y las de la prenda, pero no elige la talla por ti: así puedes decidir si la prefieres más ajustada o más holgada."
    },
    {
        id: 2,
        categoria: "Despacho",
        titulo: "Cómo calculamos el costo de tu despacho",
        imagen: images.imagen3,
        resumen: "El valor depende de la distancia entre nuestra bodega y la dirección que ingreses.",
        contenido: "Buscamos tu dirección en Chile, medimos la distancia por ruta desde nuestro centro de distribución y aplicamos una tarifa base más un valor por kilómetro. El resultado se muestra en el carrito antes de pagar."
    },
    {
        id: 3,
        categoria: "Catálogo",
        titulo: "Gorras en talla única",
        imagen: images.imagen5,
        resumen: "Jockey, Trucker y Beanie: cada gorra indica su contorno de cabeza y su profundidad.",
        contenido: "Las gorras se venden en talla única. Para saber si te acomodan, compara tu contorno de cabeza con la medida registrada en la ficha del producto."
    }
];

function Blogs() {
    const [destacada, ...otras] = publicaciones;

    return (
        <div className="pagina-tienda pagina-blogs">
            <NavbarTienda />

            <main>
                <section className="portada-pagina">
                    <div className="container">
                        <span className="etiqueta">Blog</span>

                        <h1>Novedades y guías de compra</h1>

                        <p>
                            Consejos para elegir tu talla, entender tu despacho
                            y conocer el catálogo de Tu Polera.
                        </p>
                    </div>
                </section>

                <section className="container seccion-pagina">
                    <article className="blog-destacado">
                        <img
                            src={destacada.imagen}
                            alt={destacada.titulo}
                            className="blog-destacado-imagen"
                        />

                        <div className="blog-destacado-texto">
                            <span className="blog-categoria">{destacada.categoria}</span>

                            <h2>{destacada.titulo}</h2>

                            <p>{destacada.contenido}</p>

                            <Link to="/productos" className="btn btn-tienda">
                                Probarlo en un producto
                            </Link>
                        </div>
                    </article>

                    <div className="row g-4 mt-1">
                        {otras.map(publicacion => (
                            <div className="col-md-6" key={publicacion.id}>
                                <article className="blog-tarjeta">
                                    <img
                                        src={publicacion.imagen}
                                        alt={publicacion.titulo}
                                    />

                                    <div className="blog-tarjeta-texto">
                                        <span className="blog-categoria">
                                            {publicacion.categoria}
                                        </span>

                                        <h3>{publicacion.titulo}</h3>

                                        <p>{publicacion.contenido}</p>
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <FooterTienda />
        </div>
    );
}

export default Blogs;
