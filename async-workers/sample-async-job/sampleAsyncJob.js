import Jobstream from "jobstream-queue-engine";
import path from 'path';
import url from 'url';

class SampleAsyncJob extends Jobstream {
    static configFilePath() {
        const __filename = url.fileURLToPath(import.meta.url);
        const currDir = path.dirname(__filename);
        return path.resolve(currDir, './config.yaml');
    }

    async process({ message }) {
        this.logger.info('SampleAsyncJob processing start...')
        await new Promise((resolve) => {
            const randomTimeDelayInSeconds = Math.floor(Math.random() * 10) + 1
            this.logger.info(`Sleeping for ${randomTimeDelayInSeconds} seconds...`)
            setTimeout(resolve, randomTimeDelayInSeconds * 1000)
        });
        this.logger.info(JSON.stringify(message));
        this.logger.info('SampleAsyncJob processing end.')

        return message;
    }
}

export default SampleAsyncJob;