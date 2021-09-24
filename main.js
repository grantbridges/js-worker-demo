$(document).ready(function(){
    console.log("Page loaded");

    var calcWorker = null;

    // ---------

    // Worker management helpers
    let startWorker = () => {
        if (calcWorker === null) {
            console.info(`Starting new calc worker`);
            calcWorker = new Worker('calcWorker.js');

            calcWorker.addEventListener('message', (e) => { 
                $('#output').html(e.data); 
            });
        }
    };

    let killWorker = () => {
        if (calcWorker != null) {
            console.info(`Terminating calc worker`);
            calcWorker.terminate()
            calcWorker = null;
        }
    };

    // ---------

    // Button event listeners
    $('#bnSubmit').click(() => {
        if (calcWorker != null) {
            calcWorker.postMessage($('#inputMessage').val());
        }
    });

    $('#bnStartWorker').click(() => {
        startWorker();

        $('#bnStartWorker').prop('disabled', true);
        $('#bnKillWorker').prop('disabled', false);
        $('#output').html("Worker has started");
    });

    $('#bnKillWorker').click(() => {
        killWorker();

        $('#bnStartWorker').prop('disabled', false);
        $('#bnKillWorker').prop('disabled', true);
        $('#output').html("Worker has terminated - no more input will be handled");
    });

    // ---------

    // Kick off the initial worker
    startWorker();
});