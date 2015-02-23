/*
	SitioConcretos.js
	
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
//
//	CLASES CONCRETAS DE SITIOS (HIJOS)
//
function Twitter(){
	Sitio.call(this, 'Twitter', 'twitter',[{tipo:'Usuario', valor: null},{tipo:'Tweet', valor: null }]);
}
Twitter.prototype=Object.create(Sitio.prototype);
Twitter.prototype.constructor=Twitter;


Twitter.prototype.analizarContexto=function(){
	//extraigo el usr de la URL		
	this.setearReportableConURLMatcheadaConGP(0,/(https?:\/\/twitter.com\/[^#/]+)/,1);

	this.actualizarContexto();
	this.actualizarContextoAnteCambiosDeURL(SITIO_RESPUESTA_LENTA);
	HdR.debug('Analisis de contexto realizado sobre Twitter!');
}
	
//Funcion que solo se dedica a actualizar lo que posiblemente varie del contexto..
Twitter.prototype.actualizarContexto= function(){
	//Si la url termina en /status/[0-9]+, es un tweet del usuario
	this.setearReportableConURLMatcheada(1,/status\/[0-9]+$/);
}



function YouTube(){
	Sitio.call(this, 'YouTube', 'youtube',[{tipo:'Usuario', valor: null},{tipo:'Video', valor: null }]);
}

YouTube.prototype=Object.create(Sitio.prototype);
YouTube.prototype.constructor=YouTube;



YouTube.prototype.analizarContexto=function(){
	this.actualizarContexto();
	//~ this.actualizarContextoAnteCambiosDeURL();
	this.actualizarContextoAnteCambiosDeClase(document.body,SITIO_RESPUESTA_INMEDIATA);
}

YouTube.prototype.actualizarContexto=function(){
	//Extraigo el ID del Channel para evitar cambios de nombre y que afecten futura lectura del reporte.

	canal=document.querySelector('div.yt-user-info a');
	if(canal){
		this.reportable[0].valor=canal.href;
	}
	else{
		//Si no se pudo extraer analizo la URL (ya que posiblemente este viendo su pagina de USR)
		this.setearReportableConURLMatcheadaConGP(0,/https?:\/\/www.youtube.com\/(user|channel)\/[^\/#]+/i,0);
	}
	
	erVideoId=this.urlActual.match(/https?:\/\/www.youtube.com\/watch[^/]*(v=[^&$]+)/i);
	this.reportable[1].valor=(erVideoId)? 'https://www.youtube.com/watch?'+erVideoId[1] : null;
	
	HdR.debug('Analisis de contexto realizado sobre YouTube!');
}




function GooglePlus(){
	Sitio.call(this,'Google+','google-plus',[{tipo:'Usuario', valor:null},{tipo:'Publicación', valor:null},{tipo:'Album', valor:null},{tipo:'Foto', valor:null}]);
}

GooglePlus.prototype=Object.create(Sitio.prototype);
GooglePlus.prototype.constructor=GooglePlus;

GooglePlus.prototype.analizarContexto=function(){
	this.actualizarContexto();
	//G+ no es compatible ante el metodo de cambio de clase (al volver atras, no responde)
	this.actualizarContextoAnteCambiosDeURL(SITIO_RESPUESTA_INMEDIATA);
}

GooglePlus.prototype.actualizarContexto=function(){
	//Saco el ID del usuario o bien su nombre de la URL
	this.setearReportableConURLMatcheadaConGP(0,'(https?://plus.google.com/([0-9]+|[+][^\/?#]+))',1);
	
	//Si el USR esta viendo un album, la ID del usr se puede obtener de la url..
	if(!this.reportable[0].valor){
		//ToDo: testar bn para evitar error de Null al acceder al Arreglo de Grupos de captura.
		this.reportable[0].valor= 'https?://plus.google.com/' + this.urlActual.match('https?://plus.google.com/photos/(of/)?([0-9]+|[+][^\/?#]+)(/albums/[0-9]+)?')[2];
	}

	//Obtengo el posible Album
	this.setearReportableConURLMatcheadaConGP(2,'(https?://plus.google.com/photos/([0-9]+|[+][^\/?#]+)/albums/[0-9]+)',1);
	
	//Saco una publicacion de la URL actual
	this.setearReportableConURLMatcheadaConGP(1,'(https?://plus.google.com/([0-9]+|[+][^\/?#]+)/posts/[^/?#]+)',1);

	//Foto: la obtengo de la URL, aunque son solo de albunes
	//ToDo: Encontrar una forma de reportar fotos en la que "aparece", simial al caso q se comenta abajo:
	this.setearReportableConURLMatcheadaConGP(3,'(https?://plus.google.com/([0-9]+|[+][^\/?#]+)/photos/photo/.+)',1);
	if(!this.reportable[3].valor){
		this.setearReportableConURLMatcheadaConGP(3,'(https?://plus.google.com/photos/([0-9]+|[+][^\/?#]+)/albums/[0-9]+/[0-9]+)',1);
	}
	
	
	HdR.debug('Analisis de contexto realizado sobre Google+!');
}




// Sitios web comunes o no "especificados" se podrá reportar la URL actual.
function WebGenerico(){
	Sitio.call(this,'Sitio Web', 'globe', [{tipo:'Url', valor:null}] );
}

WebGenerico.prototype=Object.create(Sitio.prototype);
WebGenerico.prototype.constructor=WebGenerico;

WebGenerico.prototype.analizarContexto=function(){
	this.reportable[0].valor=this.urlActual;
};
