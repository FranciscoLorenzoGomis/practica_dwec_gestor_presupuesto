// TODO: Crear las funciones, objetos y variables indicadas en el enunciado

// TODO: Variable global
let presupuesto = 0;
let gastos = [];
let idGasto = 0;


function actualizarPresupuesto(valorIntroducido) {

    let numero;
    if (valorIntroducido >= 0 && typeof valorIntroducido === 'number') {
        presupuesto = valorIntroducido;
        numero = presupuesto;
    }
    else {
        numero = -1;
    }

    return numero;
}

function mostrarPresupuesto() {
    // TODO
    return `Tu presupuesto actual es de ${presupuesto} €`
}

function listarGastos() {
    return gastos;
}

function anyadirGasto(gasto) {
    gasto.id = idGasto;
    idGasto++;
    gastos.push(gasto);
}

function borrarGasto(id) {

    for (let i of gastos) {
        let numGasto = i.id;

        if (numGasto == id) {

            let numIndex = gastos.indexOf(i);
            gastos.splice(numIndex, 1);
        }
    }
}

function calcularTotalGastos() {
    let sum = 0;
    for (let i of gastos) {
        sum += i.valor;
    }
    return sum;
}

function calcularBalance() {
    let gastosTotales = calcularTotalGastos();
    let balance = presupuesto - gastosTotales;

    return balance;

}

function filtrarGastos(opciones) {
    return gastos.filter(function (gasto) {
        let resultado = true;
        if (opciones.fechaDesde) {
            if (gasto.fecha < Date.parse(opciones.fechaDesde)) {
                resultado = false;
            }

        }

        if (opciones.fechaHasta) {
            if (gasto.fecha > Date.parse(opciones.fechaHasta)) {
                resultado = false;
            }
        }
        if (opciones.valorMinimo) {
            if (gasto.valor < opciones.valorMinimo) {
                resultado = false;
            }
        }

        if (opciones.valorMaximo) {
            if (gasto.valor > opciones.valorMaximo) {
                resultado = false;
            }
        }
        if (opciones.descripcionContiene) {
            if (!gasto.descripcion.includes(opciones.descripcionContiene)) {
                resultado = false;
            }
        }
        if (opciones.etiquetasTiene) {
            let diferenteEtiqueta = true;
            for (let i in opciones.etiquetasTiene) {
                for (let j in gasto.etiquetas) {
                    if (opciones.etiquetasTiene[i] == gasto.etiquetas[j]) {
                        diferenteEtiqueta = false;
                    }
                }
            }
            if (diferenteEtiqueta) {
                resultado = false;
            }
        }

        return resultado;
    });
}

function agruparGastos(periodo, etiquetas, fechaDesde, fechaHasta) {

    let gastosFiltrados = filtrarGastos({
        etiquetasTiene: etiquetas,
        fechaDesde: fechaDesde,
        fechaHasta: fechaHasta
    })

    let gastosAgrupacion = gastosFiltrados.reduce(function (acc, gasto) {
        let periodoAgrupacio = gasto.obtenerPeriodoAgrupacion(periodo)
        if (!acc[periodoAgrupacio]) {
            acc[periodoAgrupacio] = 0
        }

        acc[periodoAgrupacio] += gasto.valor
        return acc
    }, {})
    return gastosAgrupacion
}


function CrearGasto(descripcion, valor, fecha, ...etiquetas) {
    // TODO


    this.descripcion = descripcion;

    if (valor >= 0) {
        this.valor = valor;
    } else {
        this.valor = 0;
    }

    this.fecha = Date.parse(fecha);


    if (isNaN(this.fecha)) {
        this.fecha = Date.now();
    }

    this.etiquetas = etiquetas;


    this.mostrarGasto = function () {
        return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`;
    }

    this.actualizarDescripcion = function (nuevaDescripcion) {
        this.descripcion = nuevaDescripcion;
    }

    this.actualizarValor = function (nuevoValor) {
        if (nuevoValor >= 0) {
            this.valor = nuevoValor;
            return nuevoValor;
        } else {
            return this.valor;
        }
    }

    this.mostrarGastoCompleto = function () {
        let mensaje = `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\n`
        mensaje = mensaje + `Fecha: ${new Date(this.fecha).toLocaleString("")}\n`
        mensaje = mensaje + `Etiquetas:\n`
        for (let e of this.etiquetas) {
            mensaje = mensaje + `- ${e}\n`
        }
        return mensaje;
    }

    this.actualizarFecha = function (nuevaFechaString) {
        let ts = Date.parse(nuevaFechaString);
        if (!isNaN(ts)) {
            this.fecha = ts;
        }
    }

    this.anyadirEtiquetas = function (...nuevasEtiquetas) {

        for (let etiqueta of nuevasEtiquetas) {
            if (!this.etiquetas.includes(etiqueta)) {
                this.etiquetas.push(etiqueta);
            }
        }
    }

    this.borrarEtiquetas = function (...etiquetasBorrar) {
        this.etiquetas = this.etiquetas.filter(function (e) {
            return !etiquetasBorrar.includes(e)
        })
    }

    this.obtenerPeriodoAgrupacion = function (periodo) {
        let fechaPer;

        if (periodo == "dia") {
            fechaPer = new Date(fecha).toISOString();
            fechaPer = fechaPer.substring(0, 10);
            return fechaPer;
        }
        if (periodo == "mes") {
            fechaPer = new Date(fecha).toISOString();
            fechaPer = fechaPer.substring(0, 7);
            return fechaPer;
        }
        if (periodo == "anyo") {
            fechaPer = new Date(fecha).toISOString();
            fechaPer = fechaPer.substring(0, 4);
            return fechaPer;
        }
    }
}

function transformarListadoEtiquetas(stringEtiquetas) {
    let separadores = /[,.:;\s]+/;
    return stringEtiquetas.split(separadores);
}

function cargarGastos(gastosAlmacenamiento) {
    // Reseteamos la variable global "gastos"
    gastos = [];
    // Procesamos cada gasto del listado pasado a la función
    for (let g of gastosAlmacenamiento) {
        // Creamos un nuevo objeto mediante el constructor
        let gastoRehidratado = new CrearGasto();
        // Copiamos los datos del objeto guardado en el almacenamiento al gasto rehidratado
        Object.assign(gastoRehidratado, g);
        // Añadimos el gasto rehidratado a "gastos"
        gastos.push(gastoRehidratado);
    }
}

// NO MODIFICAR A PARTIR DE AQUÍ: exportación de funciones y objetos creados para poder ejecutar los tests.
// Las funciones y objetos deben tener los nombres que se indican en el enunciado
// Si al obtener el código de una práctica se genera un conflicto, por favor incluye todo el código que aparece aquí debajo
export {
    mostrarPresupuesto,
    actualizarPresupuesto,
    CrearGasto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    calcularBalance,
    filtrarGastos,
    agruparGastos,
    transformarListadoEtiquetas,
    cargarGastos
}
