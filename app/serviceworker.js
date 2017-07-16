
self.addEventListener('push', function (event) {
	var title = (event.data && event.data.text()) || 'Un mensaje.'
	var options = {
		body: 'We have received a push message',
		tag: 'push-simple-demo-notification-tag',
		icon: 'https://greenkeeper.io/images/logo_webtorrent.png'
	}

	event.waitUntil(self.registration.showNotification(title, options))
})