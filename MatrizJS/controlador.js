/*
   controlador.js

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
//	Funciones Básicas
//
function inicializarGUI(){
	resaltarIncorrectos();
	
	contador.innerHTML='0';
	operaciones.innerHTML='<br/>';	
}

function reiniciar(){
	juego.reiniciar();
	inicializarGUI()
}

function regenerar(){
	juego.regenerar();
	inicializarGUI()
}

//	Operaciones elementales
//
function clickArriba(numero,graficar){
	juego.columnaHaciaArriba(numero);
	procesarMovimiento({icono:'up','numero': numero,'operacion':'clickAbajo'},graficar);
	resaltarFlecha(0,numero+1);
	resaltarTemporalmente(numero,'columna');
}

function clickAbajo(numero,graficar){
	juego.columnaHaciaAbajo(numero);	
	procesarMovimiento({icono:'down','numero': numero,'operacion':'clickArriba'},graficar);
	resaltarFlecha(juego.dimension+1,numero+1);
	resaltarTemporalmente(numero,'columna');
}

function clickIzquierda(numero,graficar){
	juego.filaHaciaIzquierda(numero);
	procesarMovimiento({icono:'left','numero': numero,'operacion':'clickDerecha'},graficar);
	resaltarFlecha(numero+1,0);
	resaltarTemporalmente(numero,'fila');
}

function clickDerecha(numero,graficar){
	juego.filaHaciaDerecha(numero);
	procesarMovimiento({icono:'right','numero': numero,'operacion':'clickIzquierda'},graficar);
	resaltarFlecha(numero+1,juego.dimension+1);
	resaltarTemporalmente(numero,'fila');
	
}

//	Movimientos
//
function procesarMovimiento(operacionInversa,graficar){
	contador.innerHTML++;
	
	if((graficar) && (juego.validar())){
		alert('Perfecto, ganaste!.\nUsaste '+contador.innerHTML+' movimientos en una matriz '+juego.dimension+'x'+juego.dimension+'\neligiendo '+juego.nivelDeDificultad+' movimientos aleatorios!.' );
		regenerar();
	}
	else{
		if(graficar){
			span=document.createElement("span");
			span.setAttribute('onclick',operacionInversa.operacion+'('+operacionInversa.numero+',false);removerOperacion(this)');
			span.innerHTML='<i class="fa fa-arrow-'+operacionInversa.icono+'"></i>'+(operacionInversa.numero+1);
			operaciones.insertBefore(span,operaciones.children[0]);
		}
		resaltarIncorrectos();
	}
}

function removerOperacion(objeto){
	if(operaciones.children.length>0){
		 operaciones.removeChild(objeto);
	 }
}

//	Asistencia
//

function resaltarIncorrectos(){
	datos=document.getElementsByClassName('data');
	dimension=juego.dimension;
	
	for(i=0;i<datos.length;i++){
		codigo=datos[i].innerHTML.charCodeAt()-97;

		if(codigo!==i){
			//Misma Fila
			if((Math.floor(codigo/dimension)) == (Math.floor(i/dimension))){				
				datos[i].className='data proximo';
			}
			else{
					//Misma Columna
				 if((codigo%dimension) == (i%dimension)){
					datos[i].className='data proximo';	
				}
				else{
					datos[i].className='data incorrecto';
				}
			}
		}
		else{
			datos[i].className='data correcto';
		}
	}
}




//	Otros
//

//Resalta temporalmente una fila o columna movida
//numero=num de fila/columna, tipo=[fila|columna]
function resaltarTemporalmente(numero,tipo){
	celdas=tablero.querySelectorAll('.data[data-'+tipo+'="'+parseInt(numero)+'"]')

	for(i=0;i<celdas.length; i++){
		celdas[i].className+=' celdaResaltada';
	}
	
	setTimeout(function(){
		for(i=0;i<celdas.length; i++){
			celdas[i].className=celdas[i].className.replace(' celdaResaltada','');
		}
	},400);
}

//
function resaltarFlecha(fila,columna){
	flecha=tablero.getElementsByTagName('table')[0].rows[fila].cells[columna].children[0].children[0];
	
	flecha.style="color: #29AAE1"
	
	setTimeout(function(){
			flecha.style="color:white;"
	},400);
}


//Muestra la solucion (texto), e invita al usuario a ejecutar paso a paso 
function mostrarSolucion(){
	texto='';

	juego.movimientos.forEach(function(mov){
		texto+='\t'+mov.toString()+'\n';
	});
	
	respuesta=confirm('Los movimientos originales aplicados fueron:\n'+texto+'\n¿Desea ejecutar la solucion?');
	
	if(respuesta){
		reiniciar();
		solucion=juego.movimientos.reverse();
		inversas={'FilaDerecha': clickIzquierda,'FilaIzquierda': clickDerecha, 'ColumnaAbajo': clickArriba, 'ColumnaArriba': clickAbajo}
		solucion.forEach(function(mov,index){
			
				setTimeout(function(m){ 
					//~ return function(){ m.revertir(juego);}
					return function(){ (inversas[m.constructor.name])(m.numero,false);}
				}(mov)
			,2000*index);
			
		});
	}

}


//	Inicialización
//

function jugar(){
	formulario=document.forms['configuracion'];
	tablero= document.getElementById('tablero');
	juego.inicializar(formulario.dimension.value, formulario.dificultad.value, tablero);
	inicializarGUI();
}

contador= document.getElementById('contador');
operaciones=document.getElementById('operaciones');
