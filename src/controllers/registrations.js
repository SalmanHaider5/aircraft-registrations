import { logger } from '../config';
import { registrationsService } from "../services";

export const getRegistrations = async (req, res) => {
    const records = req.query.records;
    const page = req.query.page;
    const result = await registrationsService.fetchRegistrationsFromDB(records, page);
    logger.info({
        event: 'Controller: Records from DB',
        result
    })
    res.status(result.statusCode).json(result);
};

export const createRegistationsByFile = async (req, res) => {
    if(req.file){
        const file = req.file.filename;
        const result = await registrationsService.readExcel(file);
        logger.info({
            event: 'Controller: Creating new records',
            result
        })
        res.status(result.statusCode).json(result);
    }
}