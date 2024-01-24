import express from 'express';
import { config, logger } from './config';
import './db';
import { flightHistoryService } from './services'

const app = express();

app.get('/add', async (req, res) => {
    const response = await flightHistoryService.createFligtsHistory();
    res.json(response);
});

app.get('/clear', async (req, res) => {
    const response = await flightHistoryService.clearTables();
    res.json(response);
});

app.get('/update', async (req, res) => {
    const response = await flightHistoryService.updateAircrafts();
    res.json(response);
});

const port = config.port;

app.listen(port, () => {
    logger.info(`App is running on port ${port}`);
});