import express from 'express';
import { config, logger } from './config';
import './db';
import './schedulers';

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to CAA Parser');
});

const port = config.port;

app.listen(port, () => {
    logger.info(`App is running on port ${port}`);
});
