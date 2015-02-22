/*
	Sitio.js
	
	Copyright 2015 Gonzalo Gabriel Costa <gonzalogcostaARROBAyahooPUNTOcomPUNTOar>
	
	This program is free software; you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation; either version 3 of the License, or
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

/**
 * 	Sitio
 * 	Representa la Jerarquía de sitios web a los cuales se quiere dar soporte y/o representar de forma generica.
 * 
 **/
 
//
//	CLASE ABSTRACTA
//
function Sitio(nombre, logoFA, elementosReportables){
	//atributos
	this.nombre= nombre;
	this.logo=	logoFA;
	this.reportable= elementosReportables;
	this.urlActual=document.documentURI;
	
	//Al crear llevo a cabo el analisis de la página
	this.analizarContexto();
};

Sitio.prototype.analizarContexto=	function(){console.log('Implementar #analizarContexto en hijo de Sitio!')};
Sitio.prototype.actualizarContexto=	function(){console.log('Implementar #actualizarContexto en hijo de Sitio!')};
//ToDo: Reemplazar actualizaciones periodicas por deteccion de eventos en DOM ante llamadas AJAX!!!
Sitio.prototype.actualizarContextoAnteCambios=function(){
	setInterval(function(){
		if(HdR.sitio.urlActual  != document.documentURI){
			HdR.debug('Cambios en el contexto detectados: modificacion de URL.');
			HdR.sitio.urlActual=document.documentURI;
			
			HdR.menuAcciones.innerHTML='<span><i class="fa fa-2x fa-refresh fa-spin"></i> Analizando cambios.</span>';
			
			setTimeout(function(){
				HdR.sitio.actualizarContexto();
				HdR.generarBotonesDeAcciones();
			},5000);
		}
	},1000);
};

//	Funciones comunes útiles a todos los sitios..

//Setea al reportable la url si esta coincide, sino lo seta null.
Sitio.prototype.setearReportableConURLMatcheada=function(indiceReportable,regex){
	this.reportable[indiceReportable].valor= (this.urlActual.match(regex))? this.urlActual : null;
}

//Similar al anterior, pero se indica un grupo de captura (numero).
Sitio.prototype.setearReportableConURLMatcheadaConGP=function(indiceReportable,regex,grupoDeCaptura){
	arrayER=this.urlActual.match(regex);
	this.reportable[indiceReportable].valor=(arrayER)? arrayER[grupoDeCaptura]:null;
}

//Retorna true si existe al menos 1 dato a reportar
Sitio.prototype.hayReportables=function(){
	return this.reportable.some(function(r){return r.valor});
}

