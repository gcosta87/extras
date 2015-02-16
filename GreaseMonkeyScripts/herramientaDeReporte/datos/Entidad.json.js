{
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
}
