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
	erUsuario=this.urlActual.match(/(https?:\/\/twitter.com\/[^#/]+)/);
	this.reportable[0].valor=(erUsuario)? erUsuario[1]:null;
	this.actualizarContexto();
	//ToDo: Mejorar la forma de llamar a esta funcion. Con TemplateMethod..?
	this.actualizarContextoAnteCambios();
	HdR.debug('Analisis de contexto realizado sobre Twitter!');
}
	
//Funcion que solo se dedica a actualizar lo que posiblemente varie del contexto..
Twitter.prototype.actualizarContexto= function(){
	//Si la url termina en /status/[0-9]+, es un tweet del usuario
	this.reportable[1].valor= (this.urlActual.match(/status\/[0-9]+$/))? this.urlActual : null;
}



function YouTube(){
	Sitio.call(this, 'YouTube', 'youtube',[{tipo:'Usuario', valor: null},{tipo:'Video', valor: null }]);
}

YouTube.prototype=Object.create(Sitio.prototype);
YouTube.prototype.constructor=YouTube;



YouTube.prototype.analizarContexto=function(){
	this.actualizarContexto();
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
		canal=this.urlActual.match(/https?:\/\/www.youtube.com\/(user|channel)\/[^\/#]+/i)
		this.reportable[0].valor= (canal)? canal[0]: null;
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
	this.actualizarContextoAnteCambios();
}

GooglePlus.prototype.actualizarContexto=function(){
	//Obtengo el posible Album
	this.setearReportableConURLMatcheadaConGP(2,'(https?://plus.google.com/photos/([0-9]+|[+][^\/?#]+)/albums/[0-9]+)',1);
	
	//Si el USR esta viendo un album, la ID del usr se puede obtener de la url..
	if(this.reportable[2].valor){
		//ToDo: testar bn para evitar error de Null al acceder al Arreglo de Grupos de captura.
		this.reportable[0].valor= 'https?://plus.google.com/' + this.urlActual.match('https?://plus.google.com/photos/([0-9]+|[+][^\/?#]+)/albums/[0-9]+')[1];
	}
	else{
		//Saco el ID del usuario o bien su nombre de la URL
		this.setearReportableConURLMatcheadaConGP(0,'(https?://plus.google.com/([0-9]+|[+][^\/?#]+))',1);
	}

	//Saco una publicacion de la URL actual
	this.setearReportableConURLMatcheadaConGP(1,'(https?://plus.google.com/([0-9]+|[+][^\/?#]+)/posts/[^/?#]+)',1);

	//Foto la obtengo la URL, aunque se deberia extraer de otra forma mas efectiva...
	this.setearReportableConURLMatcheadaConGP(3,'(https?://plus.google.com/([0-9]+|[+][^\/?#]+)/photos/photo/.+)',1);
	
	
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
