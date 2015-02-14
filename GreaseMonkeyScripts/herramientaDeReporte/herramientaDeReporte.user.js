// ==UserScript==
// @name		Herramienta de Reporte (HdR) [versión alpha]
// @namespace	http://www.libreware.com.ar
// @description	Test de prueba de una Herramienta de Reporte en la navegacion sobre los principales sitios web (Twttier, Facebook, Taringa, etc..)
// @run-at		document-end
// @include		https://twitter.com/*
// @version		0.0.1
// @downloadURL	https://github.com/gcosta87/extras/raw/master/GreaseMonkeyScripts/herramientaDeReporte/herramientaDeReporte.user.js
// @icon		https://github.com/gcosta87/extras/raw/master/GreaseMonkeyScripts/herramientaDeReporte/logo.png
// resourse		estilo datos/estilo.css
// resourse		fa datos/fa/css/font-awesome.min.css
// @grant       GM_addStyle
// @grant       GM_getResourceURL
// @grant       GM_getResourceText
// ==/UserScript==

//	//	//	//	//	//	//	//	
//	VARIABLES GLOBALES
//	//	//	//	//	//	//	//	

//Representacion de HdR
var HdR = {
	//ToDo: Se debería cargar remotamente la propiedad reporte a partir de un archivo JSON dado que representa al "Usuario"
	reporte: {
		//Representa a la ONG/Fundacion/Institucion para la cual se configura HdR. Se describen
		//los datos de la misma.
		entidad:{			
			nombre:		'Una ONG',
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
	hdrMenu.innerHTML='<span class="titulo" title="Herramienta de Reporte" ><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAPgSURBVHjaYvz//z/DQAKAAGJiGGAAEEAD7gCAABpwBwAEEFEOKCoq4gRiSVINB+rhJqQGIICIDQFQSr0LNPABEIcRabk3VI8pPnUAAUSUA/r6+n78+/cvC4ilgHhlQUFBMT71QHlvoLq1QCwOxLuAfJyOAAggRlKyYW5u7mwglQLEP4BYe/LkyfewqDEHUgeBmB1J+CMQuwPVn0RXDxBAWEMgMzMzDYgF0MX//PlzBIhBNAcQu2DRxwQUPwfE26DqYJgfiHcC5c3R9QAEEFYHABX7AHExFnF9JENVkOVSU1NBek4DsRAQhwPxOiyO8EA3EyCAcDngKsgBiYmJXjAxIDsAKJaNZOBdJDk/IH8tEBsB8V6oIyKAeA2S+o7Zs2c3otsFEEBY00BsbCwo0RwHYmYgfgTELEAshaZsNxD7A7ErEK8G4ndAPBOIa4D4JhA7QcWWAfGdxYsXV2LzLEAA4UyEERERDUCqnkC63AvEa4C4FohBaeI3EF+BJsBrUEe8WbFixV9cBgAEEN5cEBISEgT1kQ40NP5BQwMZ7AO5F4j5gXg/EMsgyZWuWbOmB58PAAKIqGwYEBDADi2MrIB4CxBzY3HEEiCeg5SuejZs2FBKyGyAAGIktTr28fFxB1JrsTjiABCvAuIpQNy7ZcuWMmLMAwggFlIsNzExCQRS04A4D4gnAjEPkrQDyENA7HjmzJlDxJoJEEBEh4CSkhLI8pWgRAVNXKJAvBWIedGUHgZiX1B6uXfv3mdC5gIEEFEOUFRUhFn+Gmr5f2jq7wfiCUDMh6XyYoRm4eVA3HD//v0f2MwGCCCCDpCXlwflhBVQyx2hwvuh5QIon5fgcAQyOAfE1g8fPsRwBEAA4a0N5eTk/IEOXAHEr4HYEeRYIN4PxFJQthAQywKxOxD/gorB8DcgvgnEv4HYCIixlikAAUSoOgYVnazQVM+C5HMY6Hj06FETkL6KlqDnArEIUE4DSKtCQyAUmwUAAYQzCmRlZaWB1GNoXCLHK9zyx48fV0LVmgCp01DxhyBLgXK/kczSBVIXQVkXKP4d2R6AAMIZAkCHeQAxI1KQIrPbYZZD1d79DwEg9lVky0EAyL8MFC9HtxwEAAIIXxR44hBvffLkSRWyAJD/Hkgdg3ItZGRkMMoXoJpubIYBBBBWBwANYIVWLgxIwToDVBACDarB4bBUIP4KxEKgGhBoBjsx5QtAALHgCH5QnJ4F4u1AvOPp06dXCBkEdNh1aWlpY2iVHAytolcT0gcQQIy06JoBHQIqonmADn9BSC1AADEOdN8QIIAGvGcEEEAD7gCAABpwBwAEGAAEsAINk1E12QAAAABJRU5ErkJggg==" alt="[HdR]"/> Web: '+sitio.nombre+'</span>\
		<a href="#" onclick="alert(\''+HdR.mostrarInformacion()+'\');" title="Más info">Info</a>\
	';

	//Inserto al body
	document.body.appendChild(hdrMenu);
	
	HdR.debug('Menu definido')
}


function inicializar(){
	//Agrego el CSS usado [Requiere replazarse como Resourse..]
	/*GM_addStyle("#hdrMenu { position:fixed;bottom:0px;left:0px;z-index:64;width:100%;border:2px solid #888;background-color:rgba(127,127,130,0.3);color:white;padding:5px 10px; }\
				#hdrMenu span.titulo {color: white; padding:0px;margin-right:20px; font-size:115%;}\
				#hdrMenu span.titulo img {width: auto;height: auto;margin: 0;padding: 0;}\
				#hdrMenu img.servicio { margin: auto 0px;padding:10px;width:18px; } ");
	*/
	
	GM_addStyle(GM_getResourceText("estilo"));
	GM_addStyle(GM_getResourceText("fa"));
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
