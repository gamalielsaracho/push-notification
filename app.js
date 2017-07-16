var webpush = require('web-push')
var bodyParser =  require('body-parser')

var express = require('express')
var app = express()

app.use(bodyParser.urlencoded({ extended:true }))
app.use(bodyParser.json())

var vapidKeys = webpush.generateVAPIDKeys()

vapidKeys.publicKey // Solamente esta clave será compartida.
vapidKeys.privateKey

// console.log('- My public Key: '+ vapidKeys.publicKey)
// console.log('- My private Key: '+ vapidKeys.privateKey)

app.use(express.static('app'));

app.get('/publickey', function (req, res) {
	res.json({ publicKey: vapidKeys.publicKey })
})

app.post('/push', function (req, res) {
	var subscription = req.body.subscription
	var message = req.body.message

	setTimeout(function() {
		const options = {
	      TTL: 24 * 60 * 60,
	      vapidDetails: {
	        subject: 'mailto:sender@example.com',
	        publicKey: vapidKeys.publicKey,
	        privateKey: vapidKeys.privateKey
	      }
	    }
	    console.log(options)

	    webpush.sendNotification(subscription, message, options)
	}, 0)

	res.send('OK')
})

app.get('/', function (req, res) {
	res.sendfile('./app/index.html')
})


app.listen(3000, function(err) {
	if(err) {
		console.log('Error al correr el servidor 3000')
	}

	console.log('Corriendo en el puerto 3000')
})

