/*
   matriz.js

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

var juego = {
		datos: 	[],

		dimension:	0,

		nivelDeDificultad: 0,

		tablero:	null,
		
		movimientos: null,

		inicializar:function(tamano,dificultad,objetoTablero){
			this.dimension= parseInt(tamano);
			this.nivelDeDificultad=parseInt(dificultad);
			this.tablero=objetoTablero;
			this.movimientos=[];

			this.mensajeDebug('Juego nuevo de dimension='+this.dimension+', dificultad='+this.nivelDeDificultad);
			this.regenerar();
		},

		//reinicializa el juego contemplando los movimientos aleatorios..
		reiniciar:function(){
			this.__inicializar();
			this.ejecutarMovimientos();
			this.dibujar();
		},
		
		//"regenera un juego" con nuevos movimientos aleatorios
		regenerar:function(){
			this.__inicializar();

			//Elaboro movimientos aleatorios
			this.movimientos=[];
			for(i=0;i<this.nivelDeDificultad;i++){
				this.movimientos.push(this.movimientoAleatorio());
			}
			this.ejecutarMovimientos();

			this.dibujar();
		},


		
		__inicializar: function(){
			// Inicializo segun corresponda
			switch(this.dimension){
				case 3: 	this.__inicializar3x3();
							break;
							
				case 4: 	this.__inicializar4x4();
							break;
							
				case 5:		this.__inicializar5x5();
							break;
							
				default:	this.dimension=3;
							this.__inicializar3x3();
							this.mensajeDebug('Dimension no determinada al inicializar/restablecer!. Se opta por 3x3 (matriz.js#53)');
							break;
			}
		},
		__inicializar3x3: function(){
			this.datos=	[
				['a','b','c'],
				['d','e','f'],
				['g','h','i']
			];
		},

		__inicializar4x4: function(){
			this.datos=	[
				['a','b','c','d'],
				['e','f','g','h'],
				['i','j','k','l'],
				['m','n','o','p']
			];
		},

		__inicializar5x5: function(){
			this.datos=	[
				['a','b','c','d','e'],
				['f','g','h','i','j'],
				['k','l','m','n','o'],
				['p','q','r','s','t'],
				['u','v','w','x','y']
			];
		},

		dibujar: function(){
			var html='\
					<table class="dimension'+this.dimension+'">\
					<tbody>\
					<tr>\
						<td class="btnSuperior">&nbsp;</td>';
						for(i=0;i<this.dimension;i++){
							html+='<td class="btnSuperior"><a href="#tablero" onclick="clickArriba('+i+',true);"><i class="fa fa-arrow-up"></i></a></td>';
						}
						
						html+='<td class="btnSuperior">&nbsp;</td>\
					</tr>';

			this.datos.forEach(function(fila,index){
				html+='<tr>\
					<td class="btnIzquierdo"><a href="#tablero" onclick="clickIzquierda('+index+',true);"><i class="fa fa-arrow-left"></i></a></td>';
					nroFila=index;
					fila.forEach(function(letra,index){
						html+='<td class="data" data-fila="'+nroFila+'" data-columna="'+index+'">'+letra+'</td>';
					});

					html+='<td class="btnDerecho"><a href="#tablero" onclick="clickDerecha('+index+',true);"><i class="fa fa-arrow-right"></i></a></td>\
				</tr>';
			});

				html+='\
				<tr>\
					<td class="btnInferior">&nbsp;</td>';
					for(i=0; i< this.dimension;i++){
						//~ html+='<td class="btnInferior"><a href="#tablero" onclick="clickAbajo('+i+',true);">↓</a></td>'
						html+='<td class="btnInferior"><a href="#tablero" onclick="clickAbajo('+i+',true);"><i class="fa fa-arrow-down "></i></a></td>'
					}
					html+='<td class="btnInferior>&nbsp;</td>\
				</tr>\
				</tbody>\
			</table>';

			this.tablero.innerHTML=html;
		},


		validar: function(){
			//Por fila, se chequea que cada elemento sea menor al siguiente.
			correcto=true;

			this.datos.forEach(function(arreglo){
				for(i=0; i<(arreglo.length-1); i++){
					if(arreglo[i]> arreglo[i+1]){
						correcto=false;
					}
				}
			});

			//Por ultimo se chequea que el ultimo elemento de cada fila sea menor que su siguiente
			if(correcto){
				for(i=0; i<(this.dimension-1); i++){
					if(this.datos[i][this.dimension-1] > this.datos[i+1][this.dimension-1]){
						correcto=false;
					}
				}
			}
			this.mensajeDebug('Validacion: '+correcto);
			return correcto;
		},
		
		//	Movimientos
		//
		filaHaciaDerecha: function(numeroDeFila){
			this.mensajeDebug('Fila '+numeroDeFila+' >');
			ultimaLetra = this.datos[numeroDeFila][this.dimension-1];
			
			for (i=this.dimension-1; i>0; i--){
				 this.datos[numeroDeFila][i] = this.datos[numeroDeFila][i-1];
			}
			
			this.datos[numeroDeFila][0]=ultimaLetra;
			
			this.dibujar();
		},


		filaHaciaIzquierda: function(numeroDeFila){
			this.mensajeDebug('Fila '+numeroDeFila+' <');
			primeraLetra = this.datos[numeroDeFila][0];
			
			for (i=0; i<this.dimension-1; i++){
				 this.datos[numeroDeFila][i] = this.datos[numeroDeFila][i+1];
			}
			
			this.datos[numeroDeFila][this.dimension-1]=primeraLetra;
			this.dibujar();
		},

		//idem a anteriores pero a nivel columna
		columnaHaciaArriba: function(numeroDeColumna){
			this.mensajeDebug('Columna '+numeroDeColumna+' ^');
			primeraLetra = this.datos[0][numeroDeColumna];
			for (i=0;i<this.dimension-1;i++){
				 this.datos[i][numeroDeColumna] = this.datos[i+1][numeroDeColumna];
			}
			
			this.datos[this.dimension-1][numeroDeColumna]=primeraLetra;
			this.dibujar();
		},

		columnaHaciaAbajo: function(numeroDeColumna){
			this.mensajeDebug('Columna '+numeroDeColumna+' v');
			ultimaLetra = this.datos[this.dimension-1][numeroDeColumna];
			for (i=this.dimension-1;i>0;i--){
				 this.datos[i][numeroDeColumna] = this.datos[i-1][numeroDeColumna];
			}
			
			this.datos[0][numeroDeColumna]=ultimaLetra;
			this.dibujar();	
		},

		//Retorna un Mov (F/C), Numero y Direccion (false=Abajo/Izq, true=Arriba/Der)
		movimientoAleatorio: function(){
			movimientosPosibles=[ColumnaArriba,FilaDerecha, ColumnaAbajo, FilaIzquierda]
			numeroDeOperacion=Math.floor(Math.random()*4);			
			return (new movimientosPosibles[numeroDeOperacion](this));
		},

		//Ejecuta una secuencia de movimientos (arreglo):
		ejecutarMovimientos: function(){
			this.movimientos.forEach(function(movimiento){
				movimiento.ejecutar(juego);
			});
		},


		//	"Testing"
		//
		debuggear:false,
		
		mensajeDebug: function(mensaje){
			if(this.debuggear){
				console.log('>> Debug:\t'+mensaje);	
			}
		},
		debug: function(){
			if(this.debuggear){
				console.log('\nMattriz de tamaño='+this.dimension+' y dificultad='+this.nivelDeDificultad+':\n\t'+this.datos[0]+'\n\t'+this.datos[1]+'\n\t'+this.datos[2]+'\n\n');	
			}
		}
	};
