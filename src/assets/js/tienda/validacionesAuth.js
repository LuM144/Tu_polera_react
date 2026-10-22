
export function validarCorreo(correo) {
    const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return formato.test(correo.trim());
}

export function validarRutChileno(rut) {
    const rutLimpio = rut
        .replace(/[.\-\s]/g, "")
        .toUpperCase();

    // Acepta RUT de 7 u 8 dígitos, más el dígito verificador.
    if (!/^\d{7,8}[0-9K]$/.test(rutLimpio)) {
        return false;
    }

    const cuerpo = rutLimpio.slice(0, -1);
    const digitoVerificador = rutLimpio.slice(-1);

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplo;
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    const resultado = 11 - (suma % 11);

    let digitoEsperado;

    if (resultado === 11) {
        digitoEsperado = "0";
    } else if (resultado === 10) {
        digitoEsperado = "K";
    } else {
        digitoEsperado = String(resultado);
    }

    return digitoVerificador === digitoEsperado;
}

export function normalizarRut(rut) {
    return rut.replace(/[.\-\s]/g, "").toUpperCase();
}

export function obtenerUsuarios() {
    try {
        const usuarios = JSON.parse(
            localStorage.getItem("usuarios") || "[]"
        );

        return Array.isArray(usuarios) ? usuarios : [];
    } catch {
        return [];
    }
}
