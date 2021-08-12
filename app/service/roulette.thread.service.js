const {
  Worker,
  isMainThread,
  parentPort,
  workerData
} = require('worker_threads');


function runService(workerData) {
  try{
  return new Promise((resolve, reject) => {
    const worker = new Worker(`${__dirname}/workerExecuteRoulette.js`, {
      workerData
    });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));

      resolve(true)
    })
  })
  
} catch (error) {
  log.error(error);
  throw Exception.setError(error, false);
}
}

async function run(rouletteId, ticketId) {
  try{
  const result = await runService({
    "rouletteId": rouletteId,
    "ticketId": ticketId
  })

 
  return true;
} catch (error) {
  log.error(error);
  throw Exception.setError(error, false);
}
}


module.exports = {
  run,
}