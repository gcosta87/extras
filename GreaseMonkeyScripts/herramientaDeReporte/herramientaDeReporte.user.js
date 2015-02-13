// ==UserScript==
// @name		Herramienta de Reporte (HdR) [versión alpha]
// @namespace	http://www.libreware.com.ar
// @description	Test de prueba de una Herramienta de Reporte en la navegacion sobre los principales sitios web (Twttier, Facebook, Taringa, etc..)
// @run-at		document-end
// @include		https://twitter.com/*
// @version		0.0.2
// @grant       GM_addStyle
// ==/UserScript==
/*
	herramientaDeReporte.user.js

	Copyright 2015 Gonzalo Gabriel Costa <contactoARROBAlibrewarePUNTOcomPUNTOar>

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

//	//	//	//	//	//	//	//	
//	VARIABLES GLOBALES
//	//	//	//	//	//	//	//	

//Representacion de HdR


var HdR = {
	
	reporte: {
		//Representa a la ONG/Fundacion/Institucion para la cual se configura HdR..
		entidad:{			
			nombre: 'Una ONG',
			web: 'http://www.ong.org/',
			mail: 'info@ong.org',
			facebook: '/ONG'
		},
		//URL donde se deba reportar algun posteo o URL concreta de sitio web.
		url: 'http://www.ong.org/reportar?origen=HdR&url=',
	
		//Mail  donde se deba reportar algun posteo o URL concreta de sitio web.
		mail: 'reporte@ong.org'
	},
	
	//Mas cosas que faltarian definir
	
	
	mostrarInformacion: function() {
		return 'HdR está corriendo con la siguiente configuracion:\\n\\tEntidad: '+this.reporte.entidad.nombre+'\\n\\tWeb: '+this.reporte.entidad.web+'\\n\\tMail: '+this.reporte.entidad.mail+'\\n\\tFacebook: '+this.reporte.entidad.facebook;
	},
	
	//	Debuging
	//setea si se hace debug o no
	modoDebug: true,
	
	debug: function(msj){
		if(this.modoDebug){
			console.log('HdR\t>>>\t'+msj);
		}
	}
	
};



//	//	//	//	//	//	//	//	
//	FUNCIONES PRINCIPALES
//	//	//	//	//	//	//	//	
function determinarDomino(){
	return document.domain.replace('www.','');	
}


function createMenu(sitio){
	//Defino una barra para la herramienta (#hdrMenu)
	hdrMenu	= document.createElement('div');
	hdrMenu.id="hdrMenu";
	//hdrMenu.style="position:fixed;bottom:0px;left:0px;z-index:64;width:100%;background-color:rgba(0,0,0,0.6);color:white;padding:5px 10px;";
	hdrMenu.innerHTML='<span class="titulo" title="Herramienta de Reporte" >HdR</span>\
		<img class="servicio" title="Activado en '+sitio.nombre+'" alt="['+sitio.nombre+']" src="/favicon.ico">	\
		<a href="#" onclick="alert(\''+HdR.mostrarInformacion()+'\');" title="Más info">Info</a>\
	  	  ';

	//Inserto al body
	document.body.appendChild(hdrMenu);
	
	HdR.debug('Menu definido')
}


function inicializar(){
	//Agrego el CSS usado [Requiere replazarse como Resourse..]
	GM_addStyle("	#hdrMenu { position:fixed;bottom:0px;left:0px;z-index:64;width:100%;background-color:rgba(0,0,0,0.6);color:white;padding:5px 10px; }\
				#hdrMenu span.titulo {color: white; border:2px dashed white;padding:5px;;margin-right:20px; font-size:120%;}\
				#hdrMenu img.servicio { margin: auto 0px;padding:10px;width:18px; } ");
	
	//determino el dominio
	dominio=determinarDomino();
	sitio={};
	switch(dominio){
		case 'twitter.com':		sitio.nombre= 'Twitter';
								HdR.debug('Corriendo en Twitter');
								break;
		
		default:				sitio.nombre= 'Sitio Web';
								HdR.debug('Corriendo en un Sitio Web genérico');
								break;
	}
	
	return sitio;
}





//	//	//	//	//	//	//	//	
//	FUNCIONES EXTRAS
//	//	//	//	//	//	//	//	




//	//	//	//	//	//	//	//	
//	INICIO/SETUP
//	//	//	//	//	//	//	//	


sitio=	inicializar();
createMenu(sitio);
