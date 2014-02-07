var RABBIT = require("./rabbit.js");

var queueNames = process.argv

RABBIT.createConnection(function() {
	RABBIT.subscribe("last", function(err, message) {
		if (err) {
			console.error("First worker error", err);
		} else {
			console.log("First worker: message received", message);
			setTimeout(function() {
				RABBIT.sendMessage("last", message, function() {
				console.log("First worker: message passed to last queue");
				});				
			}, 1000);
		}
	});
});