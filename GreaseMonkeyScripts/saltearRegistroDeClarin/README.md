# saltearRegistroDeClarin (Gigya)
Dado que el diario Clarin ha implementando en estos días un servicio de suscripción para algunas plataformas de los lectores (en Firefox bajo Linux no parece afectar), se ha decidio hacer un pequeño script que permita evitar ese registro no "obligatorio".

**Actualmente se puede saltear ese registro sin necesidad de instalación alguna, simplemente navegando de forma privada en el Firefox** (o de Incógnito en Google Chrome) con el navegador, dado un detalle técnico del servicio (SaaS) utilizado para registro del usuario (Gigya) que es implementado por el diario.

Por otro lado sino restaria la deshabilitación por medio de algun script como intenta hacer en este caso.

## Instalación

El script está hecho para trabajar principalmente con GreaseMonkey, un addon de firefox, si bien puede (y debería) correr de forma nativa en Google Chrome (aunque no fue probado).

Para instalar entonces verifique que posee [GreaseMonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) instalado y luego procesada a hacer [click aquí](https://github.com/gcosta87/extras/raw/master/GreaseMonkeyScripts/saltearRegistroDeClarin/saltearRegistroDeClarin.user.js) para instalarlo de forma definitiva.

## ¿Cómo funciona?
En estos momentos esta en un estado borrador, pero para mejorarlo se debería:
  1. Leer la documentación del Gigya (software SaaS utilizado para el registo) para encontrar de forma correcta el mecanismo para desactivarlo (tedioso)
  2. Eliminar el/los scripts utilizados para la activiacion del registro.
  3. Utilizar llamadas a los métodos definidos: Actualmente se está usando esto, inspeccionando objetos como *gigyagi* o *paseE2E*, entre otros.
