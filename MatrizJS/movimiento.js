/*
   movimiento.js

   Copyright 2015 Gonzalo G. Costa <gonzalogcostaARROBAyahoo.com.ar>

   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
   MA 02110-1301, USA.
*/

//	Movimiento
//

//Se modela un movimiento para un juego dado
function Movimiento(objeto){	
	//Si recibo un numero lo seteo, sino es un juego y determino uno aleatorio...
	if(typeof objeto == 'number'){
		this.numero=objeto;
	}
	else{
		this.numero=Math.floor(Math.random() * objeto.dimension);
	}
}

//Retorna una Clase Movimiento opuesta
Movimiento.prototype.movimientoInverso=function(){}
//aplica el movimiento al juego
Movimiento.prototype.ejecutar=function(juego){}
//Operacion contraria a ejecutar
Movimiento.prototype.revertir=function(juego){}

//	Subclases de Movimiento. Las 4 operaciones posible FilaDerecha, ColumnaArriba,...
//


function FilaIzquierda(objeto){
	Movimiento.call(this,objeto);
}

FilaIzquierda.prototype= Object.create(Movimiento.prototype);
FilaIzquierda.prototype.constructor= FilaIzquierda;

FilaIzquierda.prototype.revertir=function(juego){
	juego.filaHaciaDerecha(this.numero)
}

FilaIzquierda.prototype.ejecutar=function(juego){
	juego.filaHaciaIzquierda(this.numero);
}

FilaIzquierda.prototype.movimientoInverso=function(){
	return FilaDerecha;
}

FilaIzquierda.prototype.toString=function(){
	return 'Fila '+(this.numero+1)+' →'
}


function FilaDerecha(objeto){
	Movimiento.call(this,objeto);
}

FilaDerecha.prototype=Object.create(Movimiento.prototype);
FilaDerecha.prototype.constructor=FilaDerecha;


FilaDerecha.prototype.revertir=function(juego){
	juego.filaHaciaIzquierda(this.numero);
}

FilaDerecha.prototype.ejecutar=function(juego){
	juego.filaHaciaDerecha(this.numero);
}

FilaDerecha.prototype.movimientoInverso=function(){
	return FilaIzquierda;
}

FilaDerecha.prototype.toString=function(){
	return 'Fila '+(this.numero+1)+' ←'
}


function ColumnaArriba(objeto){
	Movimiento.call(this,objeto);
}
ColumnaArriba.prototype= Object.create(Movimiento.prototype);
ColumnaArriba.prototype.constructor= ColumnaArriba;


ColumnaArriba.prototype.revertir=function(juego){
	juego.columnaHaciaAbajo(this.numero);
}

ColumnaArriba.prototype.ejecutar=function(juego){
	juego.columnaHaciaArriba(this.numero);
}

ColumnaArriba.prototype.movimientoInverso=function(){
	return ColumnaAbajo;
}
ColumnaArriba.prototype.toString=function(){
	return 'Columna '+(this.numero+1)+' ↑'
}


function ColumnaAbajo(objeto){
	Movimiento.call(this,objeto);
}

ColumnaAbajo.prototype=Object.create(Movimiento.prototype);
ColumnaAbajo.prototype.constructor=ColumnaAbajo;


ColumnaAbajo.prototype.revertir=function(juego){
	juego.columnaHaciaArriba(this.numero);
}

ColumnaAbajo.prototype.ejecutar=function(juego){
	juego.columnaHaciaAbajo(this.numero);
}

ColumnaAbajo.prototype.movimientoInverso=function(){
	return ColumnaArriba;
}

ColumnaAbajo.prototype.toString=function(){
	return 'Columna '+(this.numero+1)+' ↓'
}
