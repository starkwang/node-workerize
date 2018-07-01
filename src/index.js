module.exports = filename =>
  function workerize(func) {
    if (typeof func !== 'function') {
      throw `Expect workerize a function. Recieved${typeof func}`;
    }
    let Worker, isMainThread, parentPort, workerData;
    try {
      ({
        Worker,
        isMainThread,
        parentPort,
        workerData
      } = require('worker_threads'));
    } catch (e) {
      throw 'It seems something wrong when loading worker_threads.';
    }
    return function(...args) {
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
