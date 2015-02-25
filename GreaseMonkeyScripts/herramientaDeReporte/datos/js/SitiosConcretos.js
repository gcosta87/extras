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
		this.setearValorAReportable(0,canal.href);
	}
	else{
		//Si no se pudo extraer analizo la URL (ya que posiblemente este viendo su pagina de USR)
		this.setearReportableConURLMatcheadaConGP(0,/https?:\/\/www.youtube.com\/(user|channel)\/[^\/#]+/i,0);
	}
	
	erVideoId=this.urlActual.match(/https?:\/\/www.youtube.com\/watch[^/]*(v=[^&$]+)/i);
	if(erVideoId){
		this.setearValorAReportable(1,'https://www.youtube.com/watch?'+erVideoId[1]);
	}
	else{
		this.setearValorAReportable(1,null);
	}
	
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
		this.setearValorAReportable(0,'https?://plus.google.com/' + this.urlActual.match('https?://plus.google.com/photos/(of/)?([0-9]+|[+][^\/?#]+)(/albums/[0-9]+)?')[2]);
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





function AskFm(){
	Sitio.call(this,'Ask.Fm', 'eye', [{tipo:'Usuario', valor:null},{tipo:'Respuesta', valor:null}] );
}

AskFm.prototype=Object.create(Sitio.prototype);
AskFm.prototype.constructor=WebGenerico;

AskFm.prototype.analizarContexto=function(){
	this.setearReportableConURLMatcheadaConGP(0,'(https?://ask.fm/[0-9a-zA-ZñÑ]+)',1);
	this.setearReportableConURLMatcheada(1,'/answer/[0-9]+$');
	
	HdR.debug('Analisis de contexto realizado sobre Ask.Fm!');
};




function Instagram(){
	Sitio.call(this, 'Instagram', 'instagram', [{tipo:'Usuario', valor: null},{tipo:'Foto', valor: null}]);
}
Instagram.prototype=Object.create(Sitio.prototype);
Instagram.prototype.constructor=Instagram;


Instagram.prototype.analizarContexto=function(){
	this.actualizarContexto();
	//ToDo: testar eventos mas convenientes
	this.actualizarContextoAnteCambiosDeURL(SITIO_RESPUESTA_INMEDIATA);	
}

Instagram.prototype.actualizarContexto=function(){
	//extraigo el USR del link que lo vincula como Author (rel="author")
	linkAuthor=document.body.querySelector('a[rel="author"]');
	this.setearValorAReportable(0, ((linkAuthor)? linkAuthor.href:null));
	
	
	this.setearReportableConURLMatcheada(1,'https?://instagram.com/p/[^/]+/');
}




function Facebook(){
	Sitio.call(this, 'Facebook', 'facebook', [{tipo:'Usuario',valor:null},{tipo:'Publicación',valor:null},{tipo:'Album',valor:null},{tipo:'Foto',valor:null},{tipo:'Video',valor:null}])
}

Facebook.prototype=Object.create(Sitio.prototype);
Facebook.prototype.constructor=Facebook;

Facebook.prototype.analizarContexto=function(){
	this.actualizarContexto();
	//ToDo: Encontrar un evento más apropiado...
	this.actualizarContextoAnteCambiosDeURL(SITIO_RESPUESTA_INTERMEDIA);	
}

Facebook.prototype.actualizarContexto=function(){
	//USR:	https://www.facebook.com/eldialp/....
	this.setearReportableConURLMatcheadaConGP(0,'(https://(www|es-la).facebook.com/[0-9A-Za-zñÑ_-]+)',1);
	if(this.reportable[0].valor){
		//Intento obtener el usr del DOM: un <a data-gt=... href="facebook.com/USR">
		elemento=document.querySelector('a[data-gt]');
		if((elemento) && (elemento.href.contains('?'))){
			this.setearValorAReportable(0,elemento.href.match('[^?]+')[0]);
		}
	}

	//Publicacion:	https://www.facebook.com/eldialp/posts/846909015352586
	this.setearReportableConURLMatcheada(1,'https://(www|es-la).facebook.com/[0-9A-Za-zñÑ_-]+/posts/');

	//Album:	https://www.facebook.com/media/set/?set=a.490828590960632.103045.132138033496358&type=3
	this.setearReportableConURLMatcheadaConGP(2,'(https://(www|es-la).facebook.com/media/set/?set=[^&]+)',1);

	//Foto:	https://www.facebook.com/eldialp/photos/pb.132138033496358.-2207520000.1424790487./846942782015876/?type=1&theater
	this.setearReportableConURLMatcheada(3,'https://(www|es-la).facebook.com/[0-9A-Za-zñÑ_-]+/photos/');

	//Video:	https://www.facebook.com/video.php?v=2496619384022&set=vr.2496619384022&type=3&theater
	this.setearReportableConURLMatcheada(4,'https://(www|es-la).facebook.com/video.php?');

}



// Sitios web comunes o no "especificados" se podrá reportar la URL actual.
function WebGenerico(){
	Sitio.call(this,'Sitio Web', 'globe', [{tipo:'Url', valor:null}] );
}

WebGenerico.prototype=Object.create(Sitio.prototype);
WebGenerico.prototype.constructor=WebGenerico;

WebGenerico.prototype.analizarContexto=function(){
	this.setearValorAReportable(0,this.urlActual);
	HdR.debug('Analisis de contexto realizado sobre el Sitio Web!');
};
