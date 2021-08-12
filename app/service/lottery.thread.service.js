const {
  Worker,
  isMainThread,
  parentPort,
  workerData
} = require('worker_threads');
const log = require('../utils/log.utility')
const Exception = require('../utils/error.utility');


function runService(workerData) {
  // console.log('-------runService----------');
  return new Promise((resolve, reject) => {
    const worker = new Worker(`${__dirname}/workerExecuteLootery.js`, {
      workerData
    });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      // console.log('-----exit------->',code);
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));

      resolve(true)
    })
  })
}

async function run(LotteryId) {
  try{
    // console.log('-------run-----1->');
  const result = await runService(LotteryId)
  // console.log('-------run---2--->', result);


  return result;
} catch (error) {
  log.error(error);
  throw Exception.setError(error, false);
}
}


module.exports = {
  run,
}