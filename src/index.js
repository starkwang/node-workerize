module.exports = filename =>
  function workerize(func) {
    if (typeof func !== 'function') {
      throw `Expect workerize a function. Recieved${typeof func}`;
    }
    return function(...args) {
      const {
        Worker,
        isMainThread,
        parentPort,
        workerData
      } = require('worker_threads');
      if (isMainThread) {
        return new Promise((resolve, reject) => {
          const worker = new Worker(filename, {
            workerData: args
          });
          worker.on('message', resolve);
          worker.on('error', reject);
          worker.on('exit', code => {
            if (code !== 0)
              reject(new Error(`Worker stopped with exit code ${code}`));
          });
        });
      } else {
        const args = workerData;
        parentPort.postMessage(func(...args));
      }
    };
  };
