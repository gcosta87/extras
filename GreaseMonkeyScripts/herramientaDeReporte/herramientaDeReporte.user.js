/*
	herramientaDeReporte.user.js
	
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

// ==UserScript==
// @name		Herramienta de Reporte (HdR) [versión alpha]
// @namespace	http://www.libreware.com.ar/HdR
// @description	Test de prueba de una Herramienta de Reporte en la navegacion sobre los principales sitios web (Twttier, Facebook, Taringa, etc..)
// @run-at		document-end
// @include		https://twitter.com/*
// @version		0.0.5
// @downloadURL	https://github.com/gcosta87/extras/raw/master/GreaseMonkeyScripts/herramientaDeReporte/herramientaDeReporte.user.js
// @icon		https://github.com/gcosta87/extras/raw/master/GreaseMonkeyScripts/herramientaDeReporte/logo.png
// @require		datos/js/Sitio.js#16.02.2015
// @resource	JSON_ENTIDAD	datos/Entidad.json.js#16.02.2015
// @resource	CSS_HDR			datos/estilo.css#16.02.2015
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// ==/UserScript==

//	//	//	//	//	//	//	//	
//	VARIABLES GLOBALES
//	//	//	//	//	//	//	//	
//Estilo de FontAwesome
const CSS_FA	= 'https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css'


//Representacion de HdR
var HdR = {
	//Representa la informacion de la entidad
	entidad:null,

	//ToDo: Representar mejor menuAcciones y estado,para que un Sitio pueda setear el HTML mas seguro o mostrar texto
	//Objeto de la Jerarquía Sitio que se esta actualmente trabajando.
	sitio: null,
	
	//Referencia al elemento (dom) que contiene las acciones;
	menuAcciones: null,

	inicializar: function(){
		GM_addStyle(GM_getResourceText('CSS_HDR'));
		inyectarCSS('FontAwesome',CSS_FA);
			
		this.entidad= JSON.parse(GM_getResourceText('JSON_ENTIDAD'));	
		this.sitio= determinarSitio();
		
		this.inyectarMenu();
	},
	
	
	inyectarMenu: function(){
		//Defino la barra para la herramienta (#hdrMenu)
		hdrMenu	= document.createElement('div');
		hdrMenu.id="hdrMenu";
		
		hdrMenu.innerHTML='<div class="menu"><span class="titulo" title="Herramienta de Reporte" ><i class="fa fa-3x fa-gear"></i></span>\
			<a nohref class="pseudoLink" onclick="alert(\''+this.mostrarInformacion()+'\');" title="Más info"><i class="fa fa-2x  fa-life-ring"></i></a>\
			<span id="estado">Estado: <i class="fa fa-2x fa-'+this.sitio.logo+'" title="Trabajando en '+this.sitio.nombre+'"></i></span>\
			</div>';
		
		//Defino el area de los botones de accion..	
		menuAcciones=document.createElement('div');
		menuAcciones.id='hdrAcciones';
		menuAcciones.className='acciones';
		
		hdrMenu.appendChild(menuAcciones);	
		this.menuAcciones=menuAcciones;
		
		//Inserto al body
		document.body.appendChild(hdrMenu);	
		this.debug('Menu definido.');
	},

	//Retorna el HTML de un boton segun el tipo de recurso de la Entidad para un Objeto reportable {tipo,valor}
	botonesHTML:{
		//FixMe: salto de linea de windows..\r\n¿? (0d0a)
		'mail':		function(objetoReportable){ return '<a title="Reportar '+objetoReportable.tipo+' vía correo electrónico" onclick="return confirm(\'Ud va a reportar al mail '+HdR.entidad.recursos.mail+' :\\n'+objetoReportable.valor+'\\n\\n¿Está seguro que desea hacerlo?.\');" href="mailto:'+HdR.entidad.recursos.mail+'?subject=Reporte de HdR&body=Se reporta la siguiente información:%0D%0ASitio: '+encodeURI(HdR.sitio.nombre)+'%0D%0AReporte de: '+encodeURI(objetoReportable.tipo)+'%0D%0Ainformación adjunta:%0D%0A'+encodeURI(objetoReportable.valor)+'"><span class="fa-stack fa-lg"><i class="fa fa-square-o fa-stack-2x"></i><i class="fa fa-envelope-o fa-stack-1x"></i></span></a>'; },
		'url':		function(objetoReportable){ urlFinal=HdR.entidad.recursos.url+encodeURI(objetoReportable.valor+'&sitio='+HdR.sitio.nombre+'&tipo='+objetoReportable.tipo); return '<a title="Reportar '+objetoReportable.tipo+' vía URL específica" onclick="return confirm(\'Ud reportará a un servidor específico provisto por la Entidad:\\nURL:'+HdR.entidad.recursos.url+'\\nDatos:'+objetoReportable.valor+'\\n\\n¿Está seguro que desea hacerlo?.\');" href="'+urlFinal+'" target="_blank"><span class="fa-stack fa-lg"><i class="fa fa-square-o fa-stack-2x"></i><i class="fa fa-link fa-stack-1x"></i></span></i></a>'; },
		'twitter':	function(objetoReportable){ tweet=encodeURI(HdR.entidad.recursos.twitter+' Reporte vía HdR. Tipo:'+objetoReportable.tipo+', Sitio:'+HdR.sitio.nombre+', URL:'); return '<a title="Reportar '+objetoReportable.tipo+' vía Twitter" onclick="return confirm(\'Ud creara un tweet a la cuenta oficial de la entidad ('+HdR.entidad.recursos.twitter+') para reportar:\\n'+objetoReportable.valor+'\\n\\n¿Está seguro que desea hacerlo?.\');" href="https://twitter.com/intent/tweet?text='+tweet+'&url='+encodeURI(objetoReportable.valor)+'" target="_blank"><span class="fa-stack fa-lg"><i class="fa fa-square-o fa-stack-2x"></i><i class="fa fa-twitter fa-stack-1x"></i></span></a>'; }
	},

	// Genera las acciones posible segun los recursos de la Entidad y los elementos reportables del Sitio
	generarBotonesDeAcciones: function(){
		recursosKeys=Object.keys(this.entidad.recursos);
		html=''
		for(i=0;i<(recursosKeys.length);i++){
			recurso=recursosKeys[i];			
			html+='<span class="grupoDeAcciones">';
			for(j=0;j<(this.sitio.reportable.length); j++){				
				if(this.sitio.reportable[j].valor){
					html+=this.botonesHTML[recurso](this.sitio.reportable[j]);
				}
			}
			html+='</span>'	
		}		
		this.menuAcciones.innerHTML=html;
		this.debug('Botones generados!');
	},

	mostrarInformacion: function() {
		//~ return 'HdR está corriendo con la siguiente configuracion:\\n\\tEntidad: '+this.entidad.info.nombre+'\\n\\tWeb: '+this.entidad.info.web+'\\n\\tMail: '+this.entidad.info.mail+'\\n\\tFacebook: '+this.entidad.info.facebook;
		camposKeys= Object.keys(this.entidad.info);
		cadena='';
		for(i=0;i<camposKeys.length;i++){
			cadena+='\\n\\t'+camposKeys[i]+': '+this.entidad.info[camposKeys[i]];
		}
		
		return 'HdR está corriendo con la configuración provista\\npor la siguiente entidad:'+cadena;
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

function determinarSitio(){
	dominio=document.domain.replace('www.','');
	sitio=null;
	switch(dominio){
		case 'twitter.com':		sitio= new Twitter();
								break;
		default:				sitio= new WebGenerico();
								break;
	}
	return sitio;
}

//Inserta un link hacia una hoja de estilo. Se indica nombre de referencia (para debug) y la URL concreta.
function inyectarCSS(nombre,url ){
	linkCSS = document.createElement('link');
	linkCSS.href=url;
	linkCSS.rel="stylesheet";
	linkCSS.type="text/css";
	
	document.head.appendChild(linkCSS);
	HdR.debug('Inyectado CSS de '+nombre+' en HEAD del sitio web.');
}

//	//	//	//	//	//	//	//	
//	FUNCIONES EXTRAS
//	//	//	//	//	//	//	//	




//	//	//	//	//	//	//	//	
//	INICIO/SETUP
//	//	//	//	//	//	//	//	
HdR.inicializar();
HdR.generarBotonesDeAcciones();
