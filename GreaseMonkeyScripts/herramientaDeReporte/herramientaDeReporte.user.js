// ==UserScript==
// @name		Herramienta de Reporte (HdR) [versión alpha]
// @namespace	http://www.libreware.com.ar/HdR
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
//Estilo y FontAwesome
const HDR_ESTILO	= 'https://github.com/gcosta87/extras/raw/master/GreaseMonkeyScripts/herramientaDeReporte/datos/estilo.css';
const HDR_FA 		= 'https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css'


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

	//Referencia al elemento (dom) que contiene las acciones;
	menuAcciones: null,

	//Retorna el HTML de un boton segun el tipo de recurso de la Entidad para un Objeto reportable {tipo,valor}
	botonesHTML:{
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

//ToDo: armar jerarquía de sitios web a sorpotar. Mejorar la forma de representar "Que" reportar sobre cada recurso del Usuario
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
	HdR.debug('Analisis de contexto realizado sobre Twitter!');
}
	
//Funcion que solo se dedica a actualizar lo que posiblemente varie del contexto..
Twitter.prototype.actualizarContexto= function(){
	//Si la url termina en /status/[0-9]+, es un tweet del usuario
	this.reportable[1].valor= (document.documentURI.match(/status\/[0-9]+$/))? document.documentURI : '';
}


// Sitios web comunes o no "especificados" se podrá reportar la URL actual.
function WebGenerico(){
	Sitio.call(this,'Sitio Web', 'globe', [{tipo:'url', valor:''}] );
}

WebGenerico.prototype=Object.create(Sitio.prototype);
WebGenerico.prototype.constructor=WebGenerico;

WebGenerico.prototype.analizarContexto=function(){
	this.reportable[0].valor=document.documentURI;
};
/*
WebGenerico.prototype.actualizarContexto=function(){
	
};
*/

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
	cargarEstiloDeHdR();
	cargarFontAwesome();

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
createMenu(sitio);
HdR.generarBotonesDeAcciones(sitio);
actualizarMenu(sitio);

