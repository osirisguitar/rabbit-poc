/**
 * Return a rabbit mq object that can push messages
 */
const	amqp                     =   require('amqp');

var connection = null;

var RABBIT = {
	createConnection: function(callback) {
		connection = amqp.createConnection({ host: 'localhost' });
		connection.on("ready", function() {
			callback();
		});
	},

	sendMessage: function(queueName, message, callback) {
		try
		{
				var messageBody = JSON.stringify(message);
	
				connection.queue(queueName, options = { durable: true }, function(q) {
					connection.publish(queueName, messageBody, option = { deliveryType: 2});
					callback();
			 	});

			// var connection = amqp.createConnection({ host: 'localhost' });
			// var messageBody = JSON.stringify(message);
	
			// console.log("Waiting for connection");

			// // Wait for connection to become established.
			// connection.on('ready', function () {
			// 	// var defaultExchange = connection.exchange('');
			// 	console.log("Connection ready");
			// 	var exchange = connection.exchange('confirmingExchange', options={ confirm: true, type: 'direct', autoDelete: false }, function(exchange) {
			// 		connection.queue(queueName, options = { durable: true }, function(q) {
			// 			console.log("Connected to queue, publishing message to", queueName);
			// 			q.bind(exchange, queueName, function() {
			// 				console.log("Bound to queue", queueName);
			// 				exchange.publish(queueName, messageBody, options = { deliveryType: 2 }, function(hasError, err) {
			// 					//console.log("Message published?", !hasError, err);
			// 					connection.end();
			// 					if (hasError) {
			// 						callback(err);
			// 					} else {
			// 						callback();
			// 					}
			// 				});
			// 			});
			// 	 	});
			// 	});
			// });
		} catch (exception) {
			console.error(exception);
		}
	},

	subscribe: function(queueName, callback) {
		try {
			connection.queue(queueName, { durable: true }, function(q) {
				q.bind("#");
				q.subscribe(/*{ ack: true, prefetchCount: 1 },*/ function(message, object, queueOptions, originalMessage) {
					callback(null, { Messages: [ JSON.parse(message.data.toString()) ]}, originalMessage);
				}).addCallback(function(result) {
					consumerTag = result.consumerTag;
				});	
			});									
		} catch (exception) { 
			console.error(exception);
		}
	},

	subscribeAck: function(queueName, callback) {
		try {
			connection.queue(queueName, { durable: true }, function(q) {
				q.bind("#");
				q.subscribe({ ack: true, prefetchCount: 1 }, function(message, object, queueOptions, originalMessage) {
					callback(null, { Messages: [ JSON.parse(message.data.toString()) ]}, function() {
						q.shift();
					});
				}).addCallback(function(result) {
					consumerTag = result.consumerTag;
				});	
			});									
		} catch (exception) { 
			console.error(exception);
		}		
	},

	receiveMessage: function(queueName, callback) {
		try
		{
				var consumerTag;

				connection.queue(queueName, { durable: true }, function(q) {
					q.bind("#");
					q.subscribe({ ack: true, prefetchCount: 1 }, function(message, object, queueOptions, originalMessage) {
						callback(null, { Messages: [ JSON.parse(message.data.toString()) ]}, originalMessage);
						q.shift();
						q.unsubscribe(consumerTag);
					}).addCallback(function(result) {
						consumerTag = result.consumerTag;
					});	
				});						
		}
		catch (exception) {
			console.error("receiveMessage error when connecting to rabbit", exception);
		}
	},

	getQueueNameFromPath: function(queuePath) {
		var queuePathParts = queuePath.split("/");
		var queueName = queuePathParts[queuePathParts.length - 1];
		return queueName;
	}
}

module.exports = RABBIT;