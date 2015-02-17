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
	
	//Al crear llevo a cabo el analisis de la página
	this.analizarContexto();
};

Sitio.prototype.analizarContexto=	function(){console.log('Implementar #analizarContexto en hijo de Sitio!')};
Sitio.prototype.actualizarContexto=	function(){console.log('Implementar #actualizarContexto en hijo de Sitio!')};
//ToDo: Reemplazar actualizaciones periodicas por deteccion de eventos en DOM ante llamadas AJAX!!!
Sitio.prototype.actualizarContextoAnteCambios=function(){
	setInterval(function(){
		HdR.sitio.actualizarContexto();
		HdR.generarBotonesDeAcciones();
	},7000);
};

//
//	CLASES CONCRETAS DE SITIOS (HIJOS)
//
function Twitter(){
	Sitio.call(this, 'Twitter', 'twitter',[{tipo:'Usuario', valor: ''},{tipo:'Tweet', valor: '' }]);
}
Twitter.prototype=Object.create(Sitio.prototype);
Twitter.prototype.constructor=Twitter;


Twitter.prototype.analizarContexto=function(){
	//extraigo el usr de la URL		
	this.reportable[0].valor=document.documentURI.match(/(https?:\/\/twitter.com\/[^#/]+)/)[1]
	this.actualizarContexto();
	//ToDo: Mejorar la forma de llamar a esta funcion. Con TemplateMethod..?
	this.actualizarContextoAnteCambios();
	HdR.debug('Analisis de contexto realizado sobre Twitter!');
}
	
//Funcion que solo se dedica a actualizar lo que posiblemente varie del contexto..
Twitter.prototype.actualizarContexto= function(){
	//Si la url termina en /status/[0-9]+, es un tweet del usuario
	this.reportable[1].valor= (document.documentURI.match(/status\/[0-9]+$/))? document.documentURI : '';
}



function YouTube(){
	Sitio.call(this, 'YouTube', 'youtube',[{tipo:'Usuario', valor: null},{tipo:'Video', valor: null }]);
}

YouTube.prototype=Object.create(Sitio.prototype);
YouTube.prototype.constructor=YouTube;



YouTube.prototype.analizarContexto=function(){
	this.actualizarContextoAnteCambios();
}
YouTube.prototype.actualizarContexto=function(){
	//Extraigo el ID del Channel para evitar cambios de nombre y que afecten futura lectura del reporte.
	
	
	//canal=document.querySelector("meta[itemprop='channelId']")  Descartado porque no se actualiza vía AJAX, dando falso positivo!!!
	canal=document.querySelector('div.yt-user-info a');
	if(canal){
		//~ this.reportable[0].valor='https://www.youtube.com/channel/'+canal.content;	
		this.reportable[0].valor=canal.href;	
	}
	else{
		//Si no se pudo extraer analizo la URL (ya que posiblemente este viendo su pagina de USR)
		canal=document.documentURI.match(/https?:\/\/www.youtube.com\/(user|channel)\/[^\/#]+/i)
		this.reportable[0].valor= (canal)? canal[0]:'';
	}
	
	erVideoId=document.documentURI.match(/https?:\/\/www.youtube.com\/watch[^/]*(v=[^&$]+)/i);
	this.reportable[1].valor=(erVideoId)? 'https://www.youtube.com/watch?'+erVideoId[1] : '';
	HdR.debug('Analisis de contexto realizado sobre YouTube!');
}


// Sitios web comunes o no "especificados" se podrá reportar la URL actual.
function WebGenerico(){
	Sitio.call(this,'Sitio Web', 'globe', [{tipo:'Url', valor:''}] );
}

WebGenerico.prototype=Object.create(Sitio.prototype);
WebGenerico.prototype.constructor=WebGenerico;

WebGenerico.prototype.analizarContexto=function(){
	this.reportable[0].valor=document.documentURI;
};
