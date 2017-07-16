'use strict';

// self hace referencia al service worker.
// Escuchando los eventos push.
self.addEventListener('push', function(event) {
	// event, receptor de eventos.
	// console.log(event.data.text())
	var dato = event.data.text()
	console.log('[Service Worker] Push Received.');
  	console.log('[Service Worker] Push had this data: '+dato);

  	var title = 'Hola mundo. y sha.'

  	var options = {
  		body: dato,
  		icon: 'http://www.infocree.hol.es/img/logo.png',
  		badge: 'http://www.infocree.hol.es/img/logo.png'
  	}
	// El método event.waitUntil() toma un promesa y el navegador mantendrá
	// vivo tu service worker hasta que la promesa se haya resuelto. 
  	event.waitUntil(self.registration.showNotification(title, options))
})

// Con esto podemos controlar los clicks, cuando se le dá click a las notificaciones 
// que están en pantalla.
self.addEventListener('notificationclick', function(event) {
	console.log('[Service Worker] Notification click Received.')

	// Se cierra la notificación al cual le dió click.
	event.notification.close()

	// yyyy luego, abrimos una ventana o pestaña cargando la url, 
	// En una app real, al dale click a la notificación, 
	// debería mostrar el contenido de algún post u otra cosa que enviamos. 
	event.waitUntil(clients.openWindow('https://developers.google.com/web/'))
})