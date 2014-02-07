var fork = require("child_process").fork;

var queues = [ ["first", "second"], ["second", "third"], [ "third", "last" ]];

var workerCount = 1;
if (process.argv.length > 2)
	workerCount = process.argv[2];

for (i = 0; i < workerCount; i++) {
	queues.forEach(function(queuePairs) {
		console.log("from", queuePairs[0], "to", queuePairs[1]);
		fork(process.cwd() + '/worker.js', [ queuePairs[0], queuePairs[1], i ]);
	});	
}
