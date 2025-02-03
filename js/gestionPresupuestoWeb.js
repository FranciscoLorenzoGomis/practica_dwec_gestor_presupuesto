import * as gesPres from "./gestionPresupuesto.js";

document.getElementById("anyadirgasto-formulario").addEventListener("click", nuevoGastoWebFormulario);
function mostrarDatoEnId(idElemento, valor) {

    let textBox = document.getElementById(idElemento);
    textBox.textContent = valor;
}
function mostrarGastoWeb(idElemento, gasto) {


    let divGen = document.createElement('div');
    divGen.className = "gasto";

    let divDes = document.createElement('div');
    divDes.className = "gasto-descripcion";
    divDes.append(gasto.descripcion);

    let divFech = document.createElement('div');
    divFech.className = "gasto-fecha";
    divFech.append(gasto.fecha);


    let divVal = document.createElement('div');
    divVal.className = "gasto-valor";
    divVal.append(gasto.valor)

    let divEti = document.createElement('div');
    divEti.className = "gasto-etiquetas";

    divGen.append(divDes, divFech, divVal, divEti);



    for (let etiqueta of gasto.etiquetas) {

        let spanEti = document.createElement('span');
        spanEti.className = "gasto-etiquetas-etiqueta";

        spanEti.append(`${etiqueta},`);

        divEti.append(spanEti);


        let elimitaretiquetassobre = new BorrarEtiquetasHandle();
        elimitaretiquetassobre.gasto = gasto;
        elimitaretiquetassobre.etiqueta = etiqueta;
        spanEti.addEventListener("click", elimitaretiquetassobre);

    }


    let contenido = document.getElementById(idElemento);


    contenido.append(divGen);

    let botoneditar = document.createElement("button");
    botoneditar.type = "button";
    botoneditar.className = "gasto-editar";
    botoneditar.textContent = "Editar";
    let btnedit = new EditarHandle();
    btnedit.gasto = gasto;
    botoneditar.addEventListener("click", btnedit);

    let botonborrar = document.createElement("button");
    botonborrar.type = "button";
    botonborrar.className = "gasto-borrar";
    botonborrar.textContent = "Borrar";
    let btnborrar = new BorrarHandle();
    btnborrar.gasto = gasto;
    botonborrar.addEventListener("click", btnborrar);

    divGen.append(botoneditar);
    divGen.append(botonborrar);

    let botoneditarform = document.createElement("button");
    botoneditarform.type = "button";
    botoneditarform.className = "gasto-editar-formulario";
    botoneditarform.textContent = "Editar (formulario)";
    let btneditform = new EditarHandleFormulario();
    btneditform.gasto = gasto;
    botoneditarform.addEventListener("click", btneditform);
    divGen.append(botoneditarform);

    // Añadir el nuevo botón para borrar a través de la API
    let botonborrarApi = document.createElement("button");
    botonborrarApi.type = "button";
    botonborrarApi.className = "gasto-borrar-api";
    botonborrarApi.textContent = "Borrar (API)";
    let btnborrarApi = new BorrarApiHandle(gasto);
    btnborrarApi.gasto = gasto;
    botonborrarApi.addEventListener("click", btnborrarApi);
    divGen.append(botonborrarApi);
}

function EditarHandleFormulario() {
    this.handleEvent = function (event) {

        let plantillaForm = document.getElementById('formulario-template').content.cloneNode(true);;
        let form = plantillaForm.querySelector('form');
        event.currentTarget.after(form);
        let botonEdit = event.currentTarget;
        botonEdit.disabled = true;
        form.elements.descripcion.value = this.gasto.descripcion;
        form.elements.valor.value = this.gasto.valor;

        form.elements.fecha.value = new Date(this.gasto.fecha).toISOString().substr(0, 10);
        form.elements.etiquetas.value = this.gasto.etiquetas;

        let bSubmit = new submiteditformHandle();
        bSubmit.gasto = this.gasto;
        form.addEventListener('submit', bSubmit);
        let handleCancel = new cancelHandle();
        let btnCancelar = form.querySelector("button.cancelar");
        btnCancelar.addEventListener("click", handleCancel);

        let botonEnviarApi = form.querySelector(".gasto-enviar-api");
        let btnEnviarApi = new EnviarApiEditHandle();
        btnEnviarApi.gasto = this.gasto;
        botonEnviarApi.addEventListener("click", btnEnviarApi);

    }
}

function mostrarGastosAgrupadosWeb(idElemento, agrup, periodo) {

    let div = document.createElement('div');
    let h1 = document.createElement('h1');

    div.className = "agrupacion";
    h1.innerHTML = "Gastos agrupados por " + periodo;
    div.append(h1);

    for (let [key, value] of Object.entries(agrup)) {
        let div1 = document.createElement('div');
        let span = document.createElement('span');
        let span1 = document.createElement('span');

        div1.className = "agrupacion-dato";
        span.className = "agrupacion-dato-clave";
        span1.className = "agrupacion-dato-valor";



        span.append(" " + key);
        span1.append("  " + value);

        div1.append(span);
        div1.append(span1);
        div.append(div1);
    }

    let contenido = document.getElementById(idElemento);

    contenido.append(div);
}

document.getElementById("actualizarpresupuesto").addEventListener("click", botonactualizarpresupuesto);
document.getElementById("anyadirgasto").addEventListener("click", nuevoGastoWeb);

function botonactualizarpresupuesto() {
    let promtpresupuesto = prompt("Introduzca nuevo presupuesto");
    promtpresupuesto = parseFloat(promtpresupuesto);
    let nuevopresupuesto = promtpresupuesto;

    gesPres.actualizarPresupuesto(nuevopresupuesto);



    repintar();
}

function nuevoGastoWeb() {

    let descripcion = prompt("Introduzca descripcion");
    let valor = prompt("Introduzca valor");
    let valorbien = parseFloat(valor);

    let fecha = prompt("Introduzca fecha");
    let fechabien = new Date(fecha);
    fechabien.toISOString;
    let etiquetas = prompt("Introduzca etiquetas");
    let arrEtiquetas = etiquetas.split(', ');

    let gastonuevo = new gesPres.CrearGasto(descripcion, valorbien, fechabien, ...arrEtiquetas);

    gesPres.anyadirGasto(gastonuevo);

    repintar();
}

function repintar() {

    mostrarDatoEnId("presupuesto", gesPres.mostrarPresupuesto());
    mostrarDatoEnId("gastos-totales", gesPres.calcularTotalGastos());
    mostrarDatoEnId("balance-total", gesPres.calcularBalance());

    document.getElementById("listado-gastos-completo").innerHTML = "";

    let listaGastos = gesPres.listarGastos();
    for (let g of listaGastos) {
        mostrarGastoWeb("listado-gastos-completo", g);
    }
}

function EditarHandle() {

    this.handleEvent = function (e) {

        let descripcion = prompt("Introduzca descripcion");
        let valor = prompt("Introduzca valor");
        let valorbien = parseFloat(valor);

        let fecha = prompt("Introduzca fecha");
        let fechabien = new Date(fecha);
        fechabien.toISOString;
        let etiquetas = prompt("Introduzca etiquetas");
        let arrEtiquetas = etiquetas.split(', ');

        this.gasto.actualizarDescripcion(descripcion);
        this.gasto.actualizarValor(valorbien);
        this.gasto.actualizarFecha(fechabien);
        this.gasto.anyadirEtiquetas(...arrEtiquetas);


        repintar();

    }


}
function BorrarHandle() {
    this.handleEvent = function (e) {

        gesPres.borrarGasto(this.gasto.id);

        repintar();

    }

}
function BorrarEtiquetasHandle() {

    this.handleEvent = function (e) {

        this.gasto.borrarEtiquetas(this.etiqueta);


        repintar();
    }
}

function nuevoGastoWebFormulario() {
    let plantillaForm = document.getElementById("formulario-template").content.cloneNode(true);
    let form = plantillaForm.querySelector("form");

    let formtemplate = document.getElementById("controlesprincipales");
    formtemplate.append(form);

    let botonanyadirform = document.getElementById("anyadirgasto-formulario");
    botonanyadirform.disabled = true;

    // Manejar el envío del formulario
    let formhandleEnvioboton = new enviarnuevoGastoHandleform();
    form.addEventListener("submit", formhandleEnvioboton);

    // Añadir manejador de eventos para enviar a la API
    let formhandleEnviarApiBoton = new EnviarApiHandle();
    form.querySelector(".gasto-enviar-api").addEventListener("click", formhandleEnviarApiBoton);

    // Manejar la cancelación del formulario
    let handleCancel = new cancelHandle();
    let btnCancelar = form.querySelector("button.cancelar");
    btnCancelar.addEventListener("click", handleCancel);

    repintar();
}

function enviarnuevoGastoHandleform() {
    this.handleEvent = function (e) {
        e.preventDefault();
        let actual = e.currentTarget;

        let nuevaDesc = actual.elements.descripcion.value;
        let nuevoValor = actual.elements.valor.value;
        let nuevaFecha = actual.elements.fecha.value;
        let nuevasEtiquetas = actual.elements.etiquetas.value;
        nuevoValor = parseFloat(nuevoValor);

        let gasto1 = new gesPres.CrearGasto(nuevaDesc, nuevoValor, nuevaFecha, nuevasEtiquetas);
        gesPres.anyadirGasto(gasto1);

        let anyadirGasto = document.getElementById("anyadirgasto-formulario");
        anyadirGasto.disabled = false;

        repintar();
    }
}
function cancelHandle() {
    this.handleEvent = function (event) {
        event.currentTarget.parentNode.remove();
        document.getElementById("anyadirgasto-formulario").removeAttribute("disabled");

        repintar();
    }
}
function submiteditformHandle() {
    this.handleEvent = function (event) {
        event.preventDefault();

        let form = event.currentTarget;
        let ndescripcion = form.elements.descripcion.value;
        let nvalor = form.elements.valor.value;
        let nfecha = form.elements.fecha.value;
        let netiquetas = form.elements.etiquetas.value;
        nvalor = parseFloat(nvalor);
        let netiquetasArray = netiquetas.split(',');

        this.gasto.actualizarDescripcion(ndescripcion);
        this.gasto.actualizarValor(nvalor);
        this.gasto.actualizarFecha(nfecha);
        this.gasto.anyadirEtiquetas(...netiquetasArray);
        repintar();

    }

}

function filtrarGastosWeb(evento) {
    evento.preventDefault();

    // Obtener valores del formulario
    const descripcionFilt = formularioFiltrado["formulario-filtrado-descripcion"].value.trim();
    const valorMinimoFilt = parseFloat(formularioFiltrado["formulario-filtrado-valor-minimo"].value) || "";
    const valorMaximoFilt = parseFloat(formularioFiltrado["formulario-filtrado-valor-maximo"].value) || "";
    const fechaInicialFilt = formularioFiltrado["formulario-filtrado-fecha-desde"].value;
    const fechaFinalFilt = formularioFiltrado["formulario-filtrado-fecha-hasta"].value;
    let etiquetasFilt = formularioFiltrado["formulario-filtrado-etiquetas-tiene"].value.trim();

    // Transformar etiquetas si existen
    etiquetasFilt = etiquetasFilt.length > 0 ? gesPres.transformarListadoEtiquetas(etiquetasFilt) : null;

    // Crear objeto de filtros
    const filtros = {
        descripcionContiene: descripcionFilt || null,
        valorMinimo: valorMinimoFilt || null,
        valorMaximo: valorMaximoFilt || null,
        fechaDesde: fechaInicialFilt || null,
        fechaHasta: fechaFinalFilt || null,
        etiquetasTiene: etiquetasFilt || null,
    };

    // Filtrar los gastos
    const gastosFiltrados = Object.values(filtros).some(valor => valor !== null && valor !== "")
        ? gesPres.filtrarGastos(filtros)
        : gesPres.listarGastos();

    // Limpiar el contenedor de gastos y mostrarlos
    const contenedorGastos = document.getElementById('listado-gastos-completo');
    contenedorGastos.innerHTML = "";

    gastosFiltrados.forEach(gasto => mostrarGastoWeb("listado-gastos-completo", gasto));
}

// Nueva función para guardar los gastos en localStorage
function guardarGastosWeb() {
    const gastos = gesPres.listarGastos();
    localStorage.setItem('GestorGastosDWEC', JSON.stringify(gastos));
}

// Nueva función para cargar los gastos desde localStorage
function cargarGastosWeb() {
    const gastosGuardados = localStorage.getItem('GestorGastosDWEC');
    const gastos = gastosGuardados ? JSON.parse(gastosGuardados) : [];
    gesPres.cargarGastos(gastos);
    repintar();
}

// Añadir manejadores de eventos para los botones de guardar y cargar
document.getElementById("guardar-gastos").addEventListener("click", guardarGastosWeb);
document.getElementById("cargar-gastos").addEventListener("click", cargarGastosWeb);

let formularioFiltrado = document.getElementById("formulario-filtrado");
formularioFiltrado.addEventListener("submit", filtrarGastosWeb);

let botonCargarGastosAPI = document.getElementById("cargar-gastos-api");
botonCargarGastosAPI.addEventListener("click", cargarGastosApi)

async function cargarGastosApi() {
    const nombreUsuario = document.getElementById("nombre_usuario").value;

    if (nombreUsuario) {

        const url = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${nombreUsuario}`;

        let respuesta = await fetch(url);
        let datos = await respuesta.json();
        console.log(datos);

        (respuesta.ok) ? (gesPres.cargarGastos(datos), repintar()) : (alert("Error de red"));

    } else {

        alert("Introduce nombre de usuario");
    }
}

function BorrarApiHandle(gasto) {
    this.gasto = gasto; // Asignar el gasto directamente en el constructor
    this.handleEvent = async () => {
        const nombreUsuario = document.getElementById("nombre_usuario").value;
        if (!nombreUsuario) {
            console.error('Nombre de usuario está vacío');
            return;
        }
        const url = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${nombreUsuario}/${this.gasto.gastoId}`;
        console.log('URL:', url); // Mensaje de depuración

        try {
            const response = await fetch(url, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
            console.log('Gasto eliminado correctamente'); // Mensaje de depuración
            cargarGastosApi(); // Actualizar la lista en la página
        } catch (error) {
            console.error('Hubo un problema con la solicitud Fetch:', error);
        }
    }
}

function EnviarApiHandle() {
    this.handleEvent = async function(event) {
        event.preventDefault();
        const nombreUsuario = document.getElementById("nombre_usuario").value;
        const url = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${nombreUsuario}`;
        const form = event.currentTarget.closest('form');
        const data = {
            descripcion: form.elements.descripcion.value,
            valor: form.elements.valor.value,
            fecha: form.elements.fecha.value,
            etiquetas: form.elements.etiquetas.value.split(',')
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
            cargarGastosApi(); // Actualizar la lista en la página
        } catch (error) {
            console.error('Hubo un problema con la solicitud Fetch:', error);
        }
    }
}

function EnviarApiEditHandle() {
    this.handleEvent = async function(event) {
        event.preventDefault();
        const nombreUsuario = document.querySelector('input#nombre_usuario').value;
        const gastoId = this.gasto.id;
        const url = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${nombreUsuario}/${gastoId}`;
        const form = event.currentTarget.closest('form');
        const data = {
            descripcion: form.elements.descripcion.value,
            valor: form.elements.valor.value,
            fecha: form.elements.fecha.value,
            etiquetas: form.elements.etiquetas.value.split(',')
        };

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            await response.json();
            cargarGastosApi(); // Actualizar la lista en la página
        } catch (error) {
            console.error('Hubo un problema con la solicitud Fetch:', error);
        }
    }
}

export {
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb,
    filtrarGastosWeb,
    guardarGastosWeb,
    cargarGastosWeb,
    cargarGastosApi,
    BorrarApiHandle,
    EnviarApiHandle,
    EnviarApiEditHandle,
    EditarHandleFormulario,
    nuevoGastoWebFormulario,
    enviarnuevoGastoHandleform
}