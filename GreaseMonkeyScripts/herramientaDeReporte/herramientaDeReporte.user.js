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
// @name		Herramienta de Reporte (HdR) [Alpha]
// @namespace	http://www.libreware.com.ar/HdR
// @description	Pequeña Herramienta de Reporte sobre los principales sitios web (Twttier, Facebook, Taringa, etc..)
// @run-at		document-end
// @include		https://twitter.com/*
// @include		https://www.youtube.com/*
// @include		https://plus.google.com/*
// @include		http://ask.fm/*
// @include		https://instagram.com/*
// @match		https://(www|es-la).facebook.com/*
// @version		0.4.5
// @downloadURL	https://github.com/gcosta87/extras/raw/master/GreaseMonkeyScripts/herramientaDeReporte/herramientaDeReporte.user.js
// @icon		https://github.com/gcosta87/extras/raw/master/GreaseMonkeyScripts/herramientaDeReporte/logo.png
// @require		datos/js/Sitio.js#23.02.2015
// @require		datos/js/SitiosConcretos.js#23.02.2015
// @resource	JSON_ENTIDAD	datos/Entidad.json.js#16.02.2015
// @resource	CSS_HDR			datos/estilo.css#22.02.2015
// @noframes
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

//	//	//	//	//	//	//	//	
//	VARIABLES GLOBALES
//	//	//	//	//	//	//	//	
//Estilo de FontAwesome
const CSS_FA	= 'https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css'


//Representacion de HdR
var HdR = {
	//Indica si HdR se encuentra activo o no (minimizado y sin procesar)
	estado: GM_getValue('hdrEstado',true),
	
	//Representa la informacion de la entidad
	entidad:null,

	//ToDo: Representar mejor menuAcciones y estado,para que un Sitio pueda setear el HTML mas seguro o mostrar texto
	//Objeto de la Jerarquía Sitio que se esta actualmente trabajando.
	sitio: null,
	
	//Referencia al elemento (dom) que contiene al menu
	menu: null,
	
	//Referencia al elemento (dom) que contiene las acciones;
	menuAcciones: null,

	inicializar: function(){
		this.debug('Inicializando la herramienta...');
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
		hdrMenu.className='activado';
		
		hdrMenu.innerHTML='<div class="menu">\
			<a nohref class="titulo pseudoLink" onclick="window.postMessage(\'{&quot;fuente&quot;:&quot;HdR&quot;, &quot;operacion&quot;:&quot;toggle&quot;}\',\'*\');" title="Herramienta de Reporte"><i class="fa fa-3x fa-gear"></i></a>\
			<a nohref class="pseudoLink" onclick="window.postMessage(\'{&quot;fuente&quot;:&quot;HdR&quot;, &quot;operacion&quot;:&quot;info&quot;}\',\'*\');" title="Más info"><i class="fa fa-2x  fa-life-ring"></i></a>\
			<a nohref class="pseudoLink" onclick="window.postMessage(\'{&quot;fuente&quot;:&quot;HdR&quot;, &quot;operacion&quot;:&quot;sitioInfo&quot;}\',\'*\');" title="Trabajando con la configuración para '+this.sitio.nombre+'">Sitio: <i class="fa fa-2x fa-'+this.sitio.logo+'"></i></a>\
			</div>';
		
		//Defino el area de los botones de accion..	
		menuAcciones=document.createElement('div');
		menuAcciones.id='hdrAcciones';
		menuAcciones.className='acciones';
		menuAcciones.innerHTML='<span><i class="fa fa-2x fa-info-circle"></i> No hubo detección.</span>'
		
		
		hdrMenu.appendChild(menuAcciones);	
		this.menuAcciones=menuAcciones;
		
		//Inserto al body
		document.body.appendChild(hdrMenu);
		this.menu=hdrMenu;	
		this.debug('Menu definido.');
	},

	//Retorna el HTML de un boton segun el tipo de recurso de la Entidad para un Objeto reportable {tipo,valor}
	botonesHTML:{
		'__linkBase':	function(objetoReportable,numeroReportable,msjVia,msjConfirmacion,recurso,faLogo){ return '<a title="Reportar '+objetoReportable.tipo+' vía '+msjVia+'" onclick="if(confirm(\''+msjConfirmacion+'\\n\\n¿Está seguro que desea hacerlo?.\')) window.postMessage(\'{&quot;fuente&quot;:&quot;HdR&quot;, &quot;operacion&quot;:&quot;reportar&quot;, &quot;recurso&quot;:&quot;'+recurso+'&quot;,&quot;reportable&quot;:'+numeroReportable+'}\',\'*\');" class="pseudoLink '+objetoReportable.tipo+'" nohref><span class="fa-stack fa-lg"><i class="fa fa-square-o fa-stack-2x"></i><i class="fa fa-'+faLogo+' fa-stack-1x"></i></span></a>'; },
		'mail':		function(objetoReportable,numeroReportable){ return HdR.botonesHTML['__linkBase'](objetoReportable, numeroReportable, 'correo electrónico','Ud va a reportar un '+objetoReportable.tipo+' al mail '+HdR.entidad.recursos.mail, 'mail', 'envelope-o'); },
		'url':		function(objetoReportable,numeroReportable){ return HdR.botonesHTML['__linkBase'](objetoReportable, numeroReportable, 'URL de la entidad','Ud va a reportar un '+objetoReportable.tipo+' a la URL provista por la entidad', 'url', 'link'); },
		'twitter':	function(objetoReportable,numeroReportable){ return HdR.botonesHTML['__linkBase'](objetoReportable, numeroReportable, 'Twitter','Ud va a reportar un '+objetoReportable.tipo+' al Twitter de la entidad ('+HdR.entidad.recursos.twitter+')', 'twitter', 'twitter'); }
	},

	// Genera las acciones posible segun los recursos de la Entidad y los elementos reportables del Sitio
	generarBotonesDeAcciones: function(){
		html=''
		
		if(this.sitio.hayReportables()){
			recursosKeys=Object.keys(this.entidad.recursos);

			for(i=0;i<(recursosKeys.length);i++){
				recurso=recursosKeys[i];
				html+='<span class="grupoDeAcciones">';
				for(j=0;j<(this.sitio.reportable.length); j++){				
					if(this.sitio.reportable[j].valor){
						html+=this.botonesHTML[recurso](this.sitio.reportable[j],j);
					}
				}
				html+='</span>'	
			}
			this.debug('Botones de acción generados.');
		}		
		else{
			html='<span><i class="fa fa-2x fa-info-circle"></i> No hubo detección.</span>';
			this.debug('No hay nada que reportar.');
		}
		this.menuAcciones.innerHTML=html;
		
	},
	
	//LLeva a cabo la accion concreta de reportar
	//se recibe como parametro una operacion de consola con los atributos: {recurso:String, reportable:Numero}
	//ToDo: Mejorar la parametrizacion de los reportes
	reportar: function(objeto){
		objetoReportable=this.sitio.reportable[objeto.reportable];
		
		switch(objeto.recurso){
			case 'mail':	window.location='mailto:'+HdR.entidad.recursos.mail+'?subject=Reporte de HdR&body=Se reporta la siguiente información:%0D%0ASitio: '+encodeURI(HdR.sitio.nombre)+'%0D%0AReporte de: '+encodeURI(objetoReportable.tipo)+'%0D%0Ainformación adjunta:%0D%0A'+encodeURI(objetoReportable.valor);
							alert('Se ha realizado el reporte vía mail!');
							break;
			
			case 'url':		window.open(HdR.entidad.recursos.url+objetoReportable.valor+'&sitio='+HdR.sitio.nombre+'&tipo='+objetoReportable.tipo,'_blank');
							alert('Se ha realizado el reporte vía URL!');
							break;
			
			case 'twitter':	window.open('https://twitter.com/intent/tweet?text='+encodeURI(HdR.entidad.recursos.twitter+' Se reporta vía HdR. Tipo:'+objetoReportable.tipo+', Sitio:'+HdR.sitio.nombre+', URL:')+'&url='+objetoReportable.valor,'_blank');
							alert('Se ha realizado el reporte vía Twitter!');
							break;
			
			default:		alert('Ha ocurrido un error!.\nNo se ha llevado acabo la operacion.');
							this.debug('Recurso desconocido. No se puede reportar!!.');
							break;
		}
	},
	
	//representa una comunicacion del DOM original (similar al window.postMessage)	
	consolaHdR: function(objeto){
		switch(objeto.operacion) {
			
			case 'reportar':	this.reportar(objeto);
								break;
			
			case 'toggle':		this.cambiarEstado();
								break;
			
			case 'info':		alert(this.mostrarInformacion());								
								break;
									
			case 'sitioInfo':	this.sitio.info();
								break;
			
			default:		this.debug('Operación invalida! ');
							break;
		}
	},

	//ToDo:Funcion borrador. Se debera implementar correctamente. Mejorar el cambio de estado aislando en una funcion
	cambiarEstado: function(){
		this.estado=!(this.estado);
		GM_setValue('hdrEstado',this.estado);
		alert('Ud ha cambiado el estado de HdR a ' + ((this.estado)? 'Activado.\nHdR escaneara el sitio!':'Desactivado.\nHdR estará inactivo.'));
		if(this.estado){
			this.menu.className='activado';
			this.generarBotonesDeAcciones();
		}
		else{
			this.menu.className='desactivado';
			this.menuAcciones.innerHTML='<span><i class="fa fa-2x fa-warning"></i> HdR desactivado.</span>';
		}
		this.debug('Estado cambiado a '+this.estado);
	},
	
	
	mostrarInformacion: function() {
		camposKeys= Object.keys(this.entidad.info);
		cadena='';
		for(i=0;i<camposKeys.length;i++){
			cadena+='\n\t'+camposKeys[i]+': '+this.entidad.info[camposKeys[i]];
		}

		return 'HdR está corriendo con la configuración provista\npor la siguiente entidad:'+cadena;
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

//ToDo: representar mejor y reemplazar el Switch!!
function determinarSitio(){
	dominio=document.domain.replace('www.','');
	sitio=null;
	switch(dominio){
		case 'twitter.com':			sitio= new Twitter();
									break;
		case 'plus.google.com':		sitio= new GooglePlus();
									break;
		case 'youtube.com':			sitio= new YouTube();
									break;
		case 'ask.fm':				sitio= new AskFm();
									break;
		case 'instagram.com':		sitio= new Instagram();
									break;
		case 'facebook.com':		sitio= new Facebook();
									break;
		default:					sitio= new WebGenerico();
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

//Agrega la posibilidad de conectar HdR con el dom externo para recibir operaciones
function agregarConsolaHdR(){
	window.onmessage=function(event){			
		objeto=JSON.parse(event.data);
		if((objeto) && (objeto.fuente) && (objeto.fuente=='HdR')){
			HdR.consolaHdR(objeto);
		}
	}
	HdR.debug('Activada la Consola HdR para eventos window.postMessage()');		
}
//	//	//	//	//	//	//	//	
//	FUNCIONES EXTRAS
//	//	//	//	//	//	//	//	




//	//	//	//	//	//	//	//	
//	INICIO/SETUP
//	//	//	//	//	//	//	//	
agregarConsolaHdR();
HdR.inicializar();
HdR.generarBotonesDeAcciones();
