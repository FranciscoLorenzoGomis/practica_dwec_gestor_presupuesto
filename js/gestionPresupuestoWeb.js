"use strict";

import * as gesPres from "./gestionPresupuesto";

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
        span.addEventListener("click", elimitaretiquetassobre);
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
    botonborrar.className = "gasto-editar";
    botonborrar.textContent = "Editar";
    let btnborrar = new BorrarHandle();
    btnborrar.gasto = gasto;
    botonborrar.addEventListener("click", btnborrar);
}

DivGen.append(botoneditar);
DivGen.append(botonborrar);

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
    let promt = prompt("Introduzca nuevo presupuesto");
    let nuevopresupuesto = parsefloat(promt);
    gesPres.actualizarPresupuesto(nuevopresupuesto);

    repintar();
}

function nuevoGastoWeb() {
    let descripcion = prompt("Introduzca descripcion");
    let valor = prompt("Introduzca valor");
    let valorbien = parsefloat(valor);
    let fecha = prompt("Introduzca fecha");
    let fechabien = new Date(fecha);
    fechabien.toISOString;
    let etiquetas = prompt("Introduzca etiquetas");
    let arrEtiquetas = etiquetas.split(', ');
    let gastonuevo = new CrearGasto(descripcion, valorbien, fechabien, ...arrEtiquetas);

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
        let valorbien = parsefloat(valor);
        let fecha = prompt("Introduzca fecha");
        let fechabien = new Date(fecha);
        fechabien.toISOString;
        let etiquetas = prompt("Introduzca etiquetas");
        let arrEtiquetas = etiquetas.split(', ');
        this.gasto.actualizarDescripcion(descripcion);
        this.gasto.actualizarValor(valorbien);
        this.gasto.actualizarfecha(fechabien);
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

export {
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb
};