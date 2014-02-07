var RABBIT = require("./rabbit.js");

var messageCount = 10;
if (process.argv.length > 2)
	messageCount = process.argv[2];

RABBIT.createConnection(function() {
	var i = 0;

	var interval = setInterval(function() {
		RABBIT.sendMessage("first", "Message " + (i++ + 1), function(err) {
			if (err) {
				console.error("Error when sending message" + i);
			} else {
				console.log("Sent message " + i);
			}

		});
		if (i == messageCount) {
			clearInterval(interval);
			console.log("Producer done");
		}
	}, 100);
});