// Javascript doesn't have queues?? Ugh, fine, I'll make my own
class Queue {
    constructor() {
        this.queue = [];
        this.tail = 0;
        this.head = 0;
    }

    enqueue(item) {
        this.queue.push(item);
    }

    dequeue() {
        return !this.isEmpty() ? this.queue.shift() : null;
    }

    isEmpty() {
        return this.queue.length == 0;
    }
}

// Input object - can contain more complex input data
class CalcWorkerInput {
    static ID_COUNTER = 0;
    id = CalcWorkerInput.ID_COUNTER++;

    constructor(data) {
        this.data = data;
    }
}

class CalcWorkerOutput {
    constructor(data) {
        this.data = data;
    }
}

// -----------

class CalcWorker {
    #inputQueue = new Queue();
    #input = null;

    // some logging helpers
    #logDebug = (message) => { console.debug(`---- Calc Worker: ${message}`) };
    #logInfo  = (message) => { console.info (`---- Calc Worker: ${message}`) };
    #logError = (message) => { console.error(`---- Calc Worker: ${message}`) };

    constructor() {
        this.#logInfo(`New worker created`);
    }

    start() {
        this.#logInfo(`Starting work loop`);

        // Set up listener for messages from parent
        self.addEventListener('message', this.#onNewInput);

        // Kick off the work loop
        self.setInterval(this.#doWork, 50/*ms*/);
    }

    #onNewInput = (e) => {
        this.#logInfo(`Received input: ${e.data}`);
        this.#inputQueue.enqueue(e.data);
    }

    #doWork = (e) => {
        this.#handleInput();
        this.#handleWork();
    }

    #handleInput() {
        let newInput = this.#inputQueue.dequeue();
        if (newInput != null) {
            this.#input = new CalcWorkerInput(newInput);
            this.#logInfo(`Creating new work input [${this.#input.id}] for data "${newInput}"`);
        }
    }

    #handleWork() {
        if (this.#input != null) {
            this.#logInfo(`Handling work for input [${this.#input.id}]`);
            
            // create new output
            let output = new CalcWorkerOutput();
            output.data = this.#input.data;

            this.#logInfo(`Posting work complete for work input [${this.#input.id}]`);
            self.postMessage(`Finished worker handling for input ${this.#input.id}: "${output.data}"`);

            // clear out input
            this.#input = null;
        }
    }
}

// Create it!
let calcWorker = new CalcWorker();
calcWorker.start();