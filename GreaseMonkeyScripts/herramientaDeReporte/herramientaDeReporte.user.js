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
// @version		0.0.3
// @downloadURL	https://github.com/gcosta87/extras/raw/master/GreaseMonkeyScripts/herramientaDeReporte/herramientaDeReporte.user.js
// @icon		https://github.com/gcosta87/extras/raw/master/GreaseMonkeyScripts/herramientaDeReporte/logo.png
// @require		datos/js/Sitio.js#16.02.2015
// @resource	CSS_HDR			datos/estilo.css#16.02.2015
// @resource	JSON_ENTIDAD	datos/Entidad.json.js#16.02.2015
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
	//ToDo: Se debería cargar remotamente la propiedad reporte a partir de un archivo JSON dado que representa al "Usuario"
	reporte: {
		//Representa a la ONG/Fundacion/Institucion para la cual se configura HdR. Se describen
		//los datos de la misma.
		entidad:{			
			nombre:		'Una ONG',
			//ToDo: encontrar alternativa para cargarlo evitando el problema del "SameOrigin"...
			logo:		'http://www.ong.org/logo.png',
			web:		'http://www.ong.org/',
			mail:		'info@ong.org',
			facebook:	'/ONG'
		},
		//Recursos: mécanismos para notificar (enviar un Mail, URL de Servidor con url reportada, un twitt ..)
		// Es un arreglo especificando con un obj el tipo (mail|url|twitter) y la data asociada
		recursos:{
			mail:	'reporte@ong.org',
			url:	'http://www.ong.org/reporteDeContenido?origen=HdR&url=',
			twitter:'@ONG'
		}
	},
	//ToDo: Representar mejor menuAcciones y estado,para que un Sitio pueda setear el HTML mas seguro o mostrar texto
	//Objeto de la Jerarquía Sitio que se esta actualmente trabajando.
	sitio: null,
	
	
	//Referencia al elemento (dom) que contiene las acciones;
	menuAcciones: null,

	//Retorna el HTML de un boton segun el tipo de recurso de la Entidad para un Objeto reportable {tipo,valor}
	//ToDO:  mejorar las respuestas en general. Agregar el tipo de reporte (Usuario, Tweet, ...) en el envio de la informacion.
	botonesHTML:{
		//FixMe: salto de linea de windows..\r\n¿? (0d0a)
		'mail':		function(objetoReportable){ return '<a title="Reportar '+objetoReportable.tipo+' vía correo electrónico" onclick="return confirm(\'Ud va a reportar al mail '+HdR.reporte.recursos.mail+' :\\n'+objetoReportable.valor+'\\n\\n¿Está seguro que desea hacerlo?.\');" href="mailto:'+HdR.reporte.recursos.mail+'?subject=Reporte de HdR&body=Se reporta la siguiente URL:%0A'+encodeURI(objetoReportable.valor)+'"><span class="fa-stack fa-lg"><i class="fa fa-square-o fa-stack-2x"></i><i class="fa fa-envelope-o fa-stack-1x"></i></span></a>'; },
		'url':		function(objetoReportable){ urlFinal=HdR.reporte.recursos.url+encodeURI(objetoReportable.valor); return '<a title="Reportar '+objetoReportable.tipo+' vía URL específica" onclick="return confirm(\'Ud reportará a un servidor específico (URL):\\n'+urlFinal+'\\n\\n¿Está seguro que desea hacerlo?.\');" href="'+urlFinal+'" target="_blank"><span class="fa-stack fa-lg"><i class="fa fa-square-o fa-stack-2x"></i><i class="fa fa-link fa-stack-1x"></i></span></i></a>'; },
		'twitter':	function(objetoReportable){ tweet=encodeURI(HdR.reporte.recursos.twitter+' Reporte vía HdR de '+objetoReportable.tipo+':'); return '<a title="Reportar '+objetoReportable.tipo+' vía Twitter" onclick="return confirm(\'Ud creara un tweet a la cuenta oficial de la entidad ('+HdR.reporte.recursos.twitter+') para reportar:\\n'+objetoReportable.valor+'\\n\\n¿Está seguro que desea hacerlo?.\');" href="https://twitter.com/intent/tweet?text='+tweet+'&url='+encodeURI(objetoReportable.valor)+'" target="_blank"><span class="fa-stack fa-lg"><i class="fa fa-square-o fa-stack-2x"></i><i class="fa fa-twitter fa-stack-1x"></i></span></a>'; }
	},

	// Genera las acciones posible segun los recursos de la Entidad y los elementos reportables del Sitio
	generarBotonesDeAcciones: function(sitio){
		recursosKeys=Object.keys(this.reporte.recursos);
		html=''
		for(i=0;i<(recursosKeys.length);i++){
			recurso=recursosKeys[i];			
			html+='<span class="grupoDeAcciones">';
			for(j=0;j<(sitio.reportable.length); j++){				
				if(sitio.reportable[j].valor){
					html+=this.botonesHTML[recurso](sitio.reportable[j]);
				}
			}
			html+='</span>'	
		}		
		this.menuAcciones.innerHTML=html;
		this.debug('Botones generados!');
	},

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
	HdR.debug('Determinación de dominio');
	return document.domain.replace('www.','');
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


function createMenu(sitio){
	//Defino una barra para la herramienta (#hdrMenu)
	hdrMenu	= document.createElement('div');
	hdrMenu.id="hdrMenu";
	hdrMenu.innerHTML='<div class="menu"><span class="titulo" title="Herramienta de Reporte" ><i class="fa fa-3x fa-gear"></i></span>\
		<a href="#" onclick="alert(\''+HdR.mostrarInformacion()+'\');" title="Más info"><i class="fa fa-2x  fa-life-ring"></i></a>\
		<span id="estado">Estado: <i class="fa fa-2x fa-'+sitio.logo+'" title="Trabajando en '+sitio.nombre+'"></i></span>\
		</div>';
		
	menuAcciones=document.createElement('div');
	menuAcciones.id='hdrAcciones';
	menuAcciones.className='acciones';
	
	hdrMenu.appendChild(menuAcciones);	
	HdR.menuAcciones=menuAcciones;

	//Inserto al body
	document.body.appendChild(hdrMenu);	
	HdR.debug('Menu definido');
}


function inicializar(){
	//cargarCSSRemoto('HdR',CSS_HDR);
	GM_addStyle(GM_getResourceText('CSS_HDR'));
	inyectarCSS('FontAwesome',CSS_FA);
	

	//determino el dominio
	dominio=determinarDomino();
	sitio={};
	switch(dominio){
		case 'twitter.com':		sitio=new Twitter();
								break;

		default:				sitio=new WebGenerico();
								break;
	}
	return sitio;
}

//para páginas que utilizan ajax, una posible solucion es detectar cambios en el DOM
//ToDO: mejorar la deteccion segun sitio web o eventos avanzados DOM.
function actualizarMenu(sitio){
	setInterval(function(){
		sitio.actualizarContexto();
		HdR.generarBotonesDeAcciones(sitio);
	},7000);
}


//	//	//	//	//	//	//	//	
//	FUNCIONES EXTRAS
//	//	//	//	//	//	//	//	




//	//	//	//	//	//	//	//	
//	INICIO/SETUP
//	//	//	//	//	//	//	//	


sitio=inicializar();
/*
	Un Sitio deberia llamar a un HdR#createMenu(self), y a un HdR.generarBotonesDeAcciones(self), siendo que esto ultimo varie si 
	se requiere ejecutar ante eventos (periodicamente por el momento), o solo una vez.
	De esa forma #actualizarMenu se eliminaria, y seria implementado en la jerarquia de Sitios.
	La Jeraquia tendria un metodo #procesar() y un procesarAnalizandoCambios()
*/

createMenu(sitio);
HdR.generarBotonesDeAcciones(sitio);
actualizarMenu(sitio);
