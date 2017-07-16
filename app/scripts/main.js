var applicationServerPublicKey = 'BEIBJt3PDnxta1DrIFNtaOfou_hbzK-zfJ6TQUUbpnKbWRizuF6xLQ9Y1JnT0xk_7wrNJw48F08Bc4aoMzT1NQ4'

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

var pushButton = document.querySelector('.js-push-btn')

var swRegistration = null
var isSubscribed = false

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;

    initialiseUI()

  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported')
  pushButton.textContent = 'Push Not Supported'
}

function initialiseUI() {
  // Suscribir al usuario.
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true

    if(isSubscribed) {
      // TODO: Unsubscribe user
      unsubscribeUser()
    } else {
      subscribeUser()
    }
  })

  swRegistration.pushManager.getSubscription()
  .then(function (subscription) {
    isSubscribed = !(subscription === null)

    updateSubscriptionOnServer(subscription)

    if(isSubscribed) {
      console.log('User IS subscribed.')
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn()
  })
}

function updateBtn() {
  if(Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.'
    pushButton.disabled = true
    updateSubscriptionOnServer(null)
    return
  }

  if(isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging'
  } else {
    pushButton.textContent = 'Enable Push Messaging'
  }

  pushButton.disabled = false
}

function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
  .then(function (subscription) {
    if(subscription) {
      return subscription.unsubscribe()
    }
  })
  .catch(function (error) {
    console.log('Error unsubscribing', error)
  })
  .then(function () {
    updateSubscriptionOnServer(null)

    console.log('User is unsubscribed.')

    isSubscribed = false

    updateBtn()
  })
}

function subscribeUser() {
  var applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey)

  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function (subscription) {
    console.log('User is subscribed:', subscription)

    updateSubscriptionOnServer(subscription)

    isSubscribed = true

    updateBtn()
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  })
}


function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  var subscriptionJson = document.querySelector('.js-subscription-json');
  var subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}