var RABBIT = require("./rabbit.js");

if (process.argv.length < 2)
	console.log("Usage: node worker.js fromQueueName toQueueName");
var fromQueue = process.argv[2];
var toQueue = process.argv[3];

var workerNumber = 1;
if (process.argv.length == 5)
	workerNumber = process.argv[4];

RABBIT.createConnection(function() {
	RABBIT.subscribeAck(fromQueue, function(err, message, ackCallback) {
		if (err) {
			console.error(fromQueue + " worker #" + workerNumber + " error", err);
		} else {
			console.log(fromQueue + " worker #" + workerNumber + ": message received", message.Messages[0]);
			setTimeout(function() {
				RABBIT.sendMessage(toQueue, message.Messages[0], function() {
					console.log(fromQueue + " worker #" + workerNumber + ": message passed to last queue");
					ackCallback();
				});				
			}, 1000);
		}
	});
});