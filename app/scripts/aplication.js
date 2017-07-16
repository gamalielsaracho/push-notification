
var vapidServerPublicKey

var swRegistration = null
var webPushButton = document.querySelector('.webpush-button')

function urlB64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('serviceworker.js')
  .then(function(swReg) {
  	console.log('estado permiso: '+Notification.permission)

  	if (Notification.permission === "granted") {
	  console.log("Permission to receive notifications has been granted");
	}else {
	  console.log("PUEDES ACTIVAR LAS NOTIFICACIONES");
	}

    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;

	subscribeUser()
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported')
}


function subscribeUser() {
  // var applicationServerKey = urlB64ToUint8Array(response.publicKey)

	$.get('http://localhost:3000/publickey')
	.then(function (response) {
		// vapidServerPublicKey = response.publicKey

	  	swRegistration.pushManager.subscribe({
	    	userVisibleOnly: true,
	    	applicationServerKey: urlB64ToUint8Array(response.publicKey)
	  	})
	  	.then(function (subscription) {
	    	console.log('User is subscribed:', subscription)
	  	})
	  	.catch(function(err) {
	    	console.log('Failed to subscribe the user: ', err);
	  	})
	})
	.catch(function(error) {
		console.log(error)
	})

}


webPushButton.addEventListener('click', function() {
	navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
	    serviceWorkerRegistration.pushManager.getSubscription()
	    .then((subscription) => {
	    	console.log(subscription.toJSON())
	      $.post('http://localhost:3000/push', {
	        subscription: subscription.toJSON(),
	        message: 'You clicked a button!'
	      });
	  });
	});
})

// function subscribeUser() {
// 	var serverKey = urlB64ToUint8Array(vapidServerPublicKey)
// 	console.log(serverKey)

// 	navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
// 		serviceWorkerRegistration.pushManager.subscribe({
// 			userVisibleOnly: true,
// 			applicationServerKey: serverKey
// 		})

// 		// console.log(serviceWorkerRegistration)
// 	})
// } 