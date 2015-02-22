#![Logo](logo.png) herramientaDeReporte (HdR)

## Intro
El HdR es un pequeño script, que se encuentra en un estado muy inmaduro de desarrallo (*borrador*),el cual está pensado para ayudar a una entidad (ONG/Fundacion/Grupo de Usuarios..) recibir reportes de contenidos en la web. La idea es que al visitar determinados sitios web, se agregue al mismo una barra en la parte inferior de la ventana del navegador, que permita reportar contenidos web como: la URL actual hasta Usuarios y/o publicaciones (Tweets, posteos,etc..).

Para lograr esto se tiene pensado implementar para los principales sitios webs (como son las redes sociales) pequeñas "funcionalidades" que posibiliten identificacion del usuario y/o contenidos como se mencionó antes. Por el momento solo se esta haciendo una prueba sobre Twitter, para reportar Usuarios y Tweets. De esta forma se evalua *cuanto procesamiento* (de informacion y/o webs) soporta este script, dado que se utiliza JavaScript a través de un "plugin".

Las formas de reportar dichos contenidos se pretenden que sean variadas como vía: Mail, Twitter, una URL especifica (util para que la entidad implemente una solucion práctica) o incluso otras formas relacionadas con la web.

## Características principales
Puede verlo en acción en este video:

  [![Prueba de HdR en varios sitios web][1]][2]
 [1]: http://img.youtube.com/vi/ZKYOgnaxRfc/0.jpg "Prueba de HdR en varios sitios web"
 [2]: http://www.youtube.com/watch?v=ZKYOgnaxRfc
  
  
  - Sencilla: la herramienta siempre será sencilla para el usuario (y rudimentaria) por la tecnología usada (JavaScript vía un plugin).
  - Es simple de configurar: se definen las vías de contacto de la entidad (HdR) y sitios sobre los cuales se desea utilizar (GreseMonkey).
  - Fácil instalación. Se deshabilita desactivando GreaseMonkey (1 click) o bien yendo a Complementos. Su eliminacion es como la de cualquier plugin de un navegador.
  - No requiere de nigún servidor para realizar los reportes.
  - El usuario (y/o Entidad) no necesita preocuparse por como son las URLs para reportar: esto permite que se obtengan URLs que después pueden ser accedidas y visualizar el contenido reportado en cuestión.
  - Aún se encuentra en estado (muy) inmaduro de desarrollo y (sinceramente) se están evaluando sus capacidades. Se puede probar sobre Twitter, Google+ o Youtube, y se tiene pensado brindar soporte en las principales redes sociales usadas en Argentina como son: Facebook, Instagram, Tumblr, Taringa, Badoo, Ask.fm, entre otras.
  - Es liberado bajo la licencia GPLv3: puede ser usado, mejorado y distribuido libremente.

## Usos
Una entidad podría:
  - Sumar voluntarios ocacionales y/o no especializados con el uso de una herramienta simple. 
  - Sacar provecho configurando HdR con su sitio web para que pueda hacer un tratamiento a los reportes: similar a un formulario de contacto especializado para tal fin, por ejemplo.
  - Darle el fin que quiera, es Software Libre! ;).

## Motivación
Este pequeño script, HdR, está pensado para ser genérico. Se puede reportar por diversos fines según las necesidades de la entidad para la cual se lo configura. Se mantendrá simple y algo rudimentario (por la tecnología empleada), para que pueda ser usado por usuarios sin mayores dificultades. Esto posibilitaria a una Entidad como una ONG recibir reportes de sus voluntarios de una forma sencilla.

Surgió como una pequeña herramienta para "denunciar" contenido inapropiado pero que se ha decidido hacer generica para que puedea usarse para cualquier fin.

## Instalación

El script está hecho para trabajar principalmente con GreaseMonkey, un addon de firefox, si bien puede (y debería) correr de forma nativa en Google Chrome y en otros navegadores, aunque no fue probado por el momento (puede presentar incompatibilidad). Si ud detecta esto, por favor notifíquelo.

Para instalar entonces verifique que posee [GreaseMonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) instalado y luego procesada a instar este script  haciendo [ click aquí](https://github.com/gcosta87/extras/raw/master/GreaseMonkeyScripts/herramientaDeReporte/herramientaDeReporte.user.js). De esta forma lo habrá instalarlo de forma definitiva.

## ¿Que se está haciendo?
Actualmente se esta mejorando:
  - Forma de deteccion de cambios en sitios dinámicos (Youtube, Twitter,..) que hacen uso intesivo de AJAX.
  - Soporte para otros sitios: Facebook, Ask.fm, Badoo, etc..
  - Mejorando y puliendo el código ;)

Se tiene pensado implementarse una forma de desactivar su funcionamiento y ocultar parcialmente la barra (minimizarla).


## ¿Cómo funciona?
(falta definir)
