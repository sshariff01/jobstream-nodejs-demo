import express from 'express'; //Import the express dependency

import SampleAsyncJob from './async-workers/sample-async-job/sampleAsyncJob.js';

const app = express();              //Instantiate an express app, the main work horse of this server
const port = 4444;                  //Save the port number where your server will be listening

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/post', async (req, res) => {
    const sampleAsyncJob = await SampleAsyncJob.create();
    const response = await sampleAsyncJob.enqueue({
        message: req.body,
    });
    res.status(202).send(response);
});

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Main server listening on port ${port}`);
});

[
    "001", "002", "003"
].forEach((id, workerCount) => {
    const port = 1000 + workerCount;
    const workerId = `worker-${id}`;
    const pollingInterval = (workerCount + 1) * 2000;

    app.listen(port, async () => {
        const sampleAsyncJob = await SampleAsyncJob.create({ workerId: workerId });

        setInterval(async () => { await sampleAsyncJob.dequeue(); }, pollingInterval)
        console.log(`Background SampleAsyncJob worker ${workerId} listening on port ${port}, polling queue every ${pollingInterval} ms`);
    });
});