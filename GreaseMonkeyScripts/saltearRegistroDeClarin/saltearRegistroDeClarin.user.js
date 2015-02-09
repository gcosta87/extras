// ==UserScript==
// @name        saltearRegistroDeClarin (Gigya) [versión alpha]
// @namespace   http://www.libreware.com.ar
// @description Evita la aparición de la venta modal que solicita el registro para la lectura de los articulos (provisto por el SaaS Gigya)
// @run-at    document-end
// @require    https://gist.githubusercontent.com/BrockA/2620135/raw/83e1e5e36f130fa4e0cc2127175e293a90674d85/checkForBadJavascripts.js
// @include     *.clarin.com/*
// @version     0.15
// @downloadURL	https://github.com/gcosta87/extras/raw/master/GreaseMonkeyScripts/saltearRegistroDeClarin/saltearRegistroDeClarin.user.js
// @icon		https://github.com/gcosta87/extras/raw/master/GreaseMonkeyScripts/saltearRegistroDeClarin/logo.png
// @grant       none
// ==/UserScript==

/*Actualmente esta es una prueba que funciona, se estará reemplazando por una solucion mas apropiada*/

/*
Método #0		Implementación:Borrador		Testing:Funcionaría
Se setea que el usr "estaria" logueado...
*/
paseE2E.isLoggedIn=function(){return true}


/*
Metodo #1		Implementación:Experimental		Testing:Parcial
Eliminación de scripts de Gigya/Pase utilizados para la solicitud de registro por medio de mini-libreria externa:
  /static/DESGigyaConnect/js/comprimido.js?hash=HASH_NUMBER
  /static/DESPase/login_handler.js?hash=HASH_NUMBER
  /static/DESGigyaConnect/js/wrapper.js
	...
*/
/*checkForBadJavascripts([
	[true, /static[/]Des(Gigya|Pase)/i, function(){console.log('Ok#1')} ],
	[false, /(gigya|paseE2E)[.]/i, function(){console.log('Ok#2')}]  
]);
*/

/*
Metodo #2		Implementación:Experimental		Testing:No testeado
Reemplazo de métodos/objetos utilizados en la inicialización
*/
//unsafeWindow.paseModuleInit=function(){console.log('Inyectado!')};


/*
Metodo #3		Implementación:Experimental		Testing:No funciona
Cierre de ventana modal...
*/
//paseE2E.closeModal()
