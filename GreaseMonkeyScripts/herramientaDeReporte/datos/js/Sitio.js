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
 
 //	CONSTANTES
 //
 
 //Tiempos establecidos para responder ante un evento: la demora supone tolerar pequeñas mod al DOM
 const SITIO_RESPUESTA_INMEDIATA = 400;
 const SITIO_RESPUESTA_NORMAL = 1000;
 const SITIO_RESPUESTA_INTERMEDIA = 2500;
 const SITIO_RESPUESTA_LENTA = 5000;
 
 
 
 
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


//	Funciones de respuesta ante cambios



//ToDo: Reemplazar actualizaciones periodicas por deteccion de eventos en DOM ante llamadas AJAX!!!
Sitio.prototype.actualizarContextoAnteCambiosDeURL=function(tiempoDeRespuesta){
	setInterval(function(){
		if(HdR.sitio.urlActual  != document.documentURI){
			HdR.sitio.respuestaAlCambioDeContexto(tiempoDeRespuesta,'modificacion de URL');
		}
	},1000);
};

//Agrega el evento correspondiente para ejecutar ante cambios en en la clasee del Body
Sitio.prototype.actualizarContextoAnteCambiosDeClase=function(objetoAObservar,tiempoDeRespuesta){	
	observer = new MutationObserver(function(mutations) {
		HdR.sitio.respuestaAlCambioDeContexto(tiempoDeRespuesta, 'className modificada en elemento');
	});
 
	var configuracion = { attributes: true, attributeFilter: ['class']};	
	observer.observe(objetoAObservar, configuracion);
};


Sitio.prototype.respuestaAlCambioDeContexto=function(tiempoDeRespuesta, msjDebug){
	HdR.debug('Cambios en el contexto detectados: '+msjDebug);
	HdR.sitio.urlActual=document.documentURI;
	
	HdR.menuAcciones.innerHTML='<span><i class="fa fa-2x fa-refresh fa-spin"></i> Analizando cambios.</span>';
	
	setTimeout(function(){
		HdR.sitio.actualizarContexto();
		HdR.generarBotonesDeAcciones();
	},tiempoDeRespuesta);

}
//	Funciones comunes útiles a todos los sitios..

//Presenta al Usr informacion del sitio, cm p.e: que puede reportar.
Sitio.prototype.info=function(){
	info='HdR está usando la configuración para '+this.nombre+', la\ncual le provee la posibilidad de reportar:';
	this.reportable.forEach(function(e){info+='\n\t· '+e.tipo})
	
	alert(info);
};


//Setea al reportable la url si esta coincide, sino lo seta null.
Sitio.prototype.setearReportableConURLMatcheada=function(indiceReportable,regex){
	this.reportable[indiceReportable].valor= (this.urlActual.match(regex))? encodeURI(this.urlActual) : null;
}

//Similar al anterior, pero se indica un grupo de captura (numero).
Sitio.prototype.setearReportableConURLMatcheadaConGP=function(indiceReportable,regex,grupoDeCaptura){
	arrayER=this.urlActual.match(regex);
	this.reportable[indiceReportable].valor=(arrayER)? encodeURI(arrayER[grupoDeCaptura]):null;
}

//Retorna true si existe al menos 1 dato a reportar
Sitio.prototype.hayReportables=function(){
	return this.reportable.some(function(r){return r.valor});
}


//PEqueño setter que codifica la URL (valor)
Sitio.prototype.setearValorAReportable=function(numeroReportable, valor){
	this.reportable[numeroReportable]=(valor)? encodeURI(valor):null;
}
