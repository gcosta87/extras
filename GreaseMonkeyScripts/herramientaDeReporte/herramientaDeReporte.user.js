// ==UserScript==
// @name		Herramienta de Reporte (HdR) [versión alpha]
// @namespace	http://www.libreware.com.ar
// @description	Test de prueba de una Herramienta de Reporte en la navegacion sobre los principales sitios web (Twttier, Facebook, Taringa, etc..)
// @run-at		document-end
// @include		https://twitter.com/*
// @version		0.0.2
// @downloadURL	https://github.com/gcosta87/extras/raw/master/GreaseMonkeyScripts/herramientaDeReporte/herramientaDeReporte.user.js
// @icon		https://github.com/gcosta87/extras/raw/master/GreaseMonkeyScripts/herramientaDeReporte/logo.png
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// ==/UserScript==

//	//	//	//	//	//	//	//	
//	VARIABLES GLOBALES
//	//	//	//	//	//	//	//	

const HDR_ESTILO = 'https://github.com/gcosta87/extras/raw/master/GreaseMonkeyScripts/herramientaDeReporte/datos/estilo.css'
const HDR_FA = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css'

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
		recursos:[
			{tipo:	'mail',valor:	'reporte@ong.org'}
			//{tipo: 'url', valor: 'http://ong.org/reporte?origen=HdR&url='}
			//{tipo: 'twitter', valor: 'usuarioDeTwitter'}
		]
	},
	
	//ToDo: Mas cosas que faltarian definir
	
	//Ruta absoluta al directorio «/datos» (iconos, extras..). El usuario podría cambiarlo para uno propio
	datos: 'http://extras.libreware.com.ar/HdR/datos',


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

//ToDo: armar jerarquía de sitios web a sorpotar. Mejorar la forma de representar "Que" reportar sobre cada recurso del Usuario
//Por ejemplo: Twitter -> Usuario y Tweet, sobre los recursos del Usurario (mail, URL..)
var Twitter={
	nombre: 'Twitter',
	//logo de FontAwesome (sin 'fa-')
	logo: 'twitter',
	
	urlBase: 'http://twitter.com',
	
	//Datos a reportar
	reportable:  [
		 {tipo:'Usuario', valor: ''},
		 {tipo:'Tweet', valor: '' }
	],
	
	//Procesa la página actual y carga el contexto
	analizarContexto: function(){
		//extraigo el usr de la URL		
		this.reportable[0].valor=document.documentURI.match(/(twitter.com\/[^#/]+)/)[1]
		this.actualizarContexto();
		HdR.debug('Analisis de contexto realizado sobre Twitter!');
	},
	
	//Codigo HTML con los botones para integrar al menu:
	acciones: function(){
		html='<span>';
		for(i=0;i<this.reportable.length; i++){
			if(this.reportable[i].valor){
				html+='<button title="Reportar '+this.reportable[i].tipo+' vía MAIL" onclick="alert(\'Ud ha reportado:\\n'+this.reportable[i].valor+'\\n\\nMuchas gracias!.\');"><i class="fa fa-2x fa-envelope-o" ></i></button>'
			}
		}
		html+='</span>'
		HdR.debug('Botones generados!');
		return html;
	},
	//Funcion que solo se dedica a actualizar lo que posiblemente varie del contexto..
	actualizarContexto: function(){
		//Si la url termina en /status/[0-9]+, es un tweet del usuario
		this.reportable[1].valor= (document.documentURI.match(/status\/[0-9]+$/))? document.documentURI : '';
	}
};

//ToDo: definir para sitios en general para reportar URL actual.
var WebGenerico={nombre: 'Sitio Web', logo:'globe', analizarContexto: function(){}, acciones: function(){}};


//	//	//	//	//	//	//	//	
//	FUNCIONES PRINCIPALES
//	//	//	//	//	//	//	//	



function determinarDomino(){
	HdR.debug('Determinación de dominio');
	return document.domain.replace('www.','');
}

function cargarEstiloDeHdR(){
	//Salteo posible limitacion de "SameOrigin"...
	GM_xmlhttpRequest({
		method: "GET",
		url: HDR_ESTILO,
		onload: function(response) {
			GM_addStyle(response.responseText);
		}
	});
	HdR.debug('Estilo de HdR cargado remotamente');
}

function cargarFontAwesome(){
	fa = document.createElement('link');
	fa.href=HDR_FA;
	fa.rel="stylesheet";
	
	document.head.appendChild(fa);
	HdR.debug('Soporte para FontAwesome cargado');
}


function createMenu(sitio){
	//Defino una barra para la herramienta (#hdrMenu)
	hdrMenu	= document.createElement('div');
	hdrMenu.id="hdrMenu";
	hdrMenu.innerHTML='<div class="menu"><span class="titulo" title="Herramienta de Reporte" ><i class="fa fa-3x fa-gear"></i></span>\
		<a href="#" onclick="alert(\''+HdR.mostrarInformacion()+'\');" title="Más info"><i class="fa fa-2x  fa-life-ring"></i></a>\
		<span id="estado">Estado: <i class="fa fa-2x fa-'+sitio.logo+'" title="Trabajando en '+sitio.nombre+'"></i></span>\
		</div>\
		<div id="hdrAcciones" class="acciones">'+sitio.acciones()+'</div>\
	';

	//Inserto al body
	document.body.appendChild(hdrMenu);	
	HdR.debug('Menu definido');
}


function inicializar(){
	cargarEstiloDeHdR();
	cargarFontAwesome();

	//determino el dominio
	dominio=determinarDomino();
	sitio={};
	switch(dominio){
		case 'twitter.com':		sitio=Twitter;
								break;

		default:				sitio=WebGenerico;
								HdR.debug('Corriendo en un Sitio Web genérico');
								break;
	}
	//Se analiza la página actual del USR
	sitio.analizarContexto();
	return sitio;
}

//para páginas que utilizan ajax, una posible solucion es detectar cambios en el DOM
//ToDO: mejorar la deteccion segun sitio web o eventos avanzados DOM.
//ToDO: Definir como enganchar esta funcion desde el sitio web concreto para asi ejecutar solo cuando es necesario
function actualizarMenu(sitio){
	menuAcciones= document.getElementById('hdrAcciones');
	setInterval(function(){
		sitio.actualizarContexto();
		menuAcciones.innerHTML=sitio.acciones();
	},7000)
}


//	//	//	//	//	//	//	//	
//	FUNCIONES EXTRAS
//	//	//	//	//	//	//	//	




//	//	//	//	//	//	//	//	
//	INICIO/SETUP
//	//	//	//	//	//	//	//	


sitio=inicializar();
createMenu(sitio);
actualizarMenu(sitio);
