import fs from 'fs';
import xcelToJson from 'convert-excel-to-json';
import { logger } from '../config'
import { Aircrafts, Flights } from '../db/models';
import { flightsHistoryConstants } from '../constants'
import { fetchJsonData } from '../utils';

export const readExcel = async () => {
    try{
        const { excelSheetColumns } = flightsHistoryConstants;
        const files = fs.readdirSync('./');
        const excelFiles = files.map(file => {
            const fileNameArray = file.split(".");
            if(fileNameArray[fileNameArray.length - 1] === 'xlsx'){
                return file;
            }
        }).filter(file => !!file);
        if(excelFiles.length > 1 || excelFiles.length === 0){
            return {
                sccess: false,
                statusCode: 422,
                error: 'There is no file or multiple files. Please keep just 1 *.xslx file.'
            }
        }
        const result = xcelToJson({
            sourceFile: `./${excelFiles[0]}`,
            columnToKey: excelSheetColumns
        });
        let obj = [];
        if(result && result.Sheet1){
            obj = result.Sheet1
            obj.shift();
        }else{
            logger.info({
                event: 'Data from Excel File',
                data: obj
            });
        }
        return obj;
    }catch(err){
        logger.error(err);
    }
}

export const clearTables = async () => {
    try{
        await Aircrafts.deleteMany({});
        await Flights.deleteMany({});
        return { message: "All data removed from tables!" }
    }catch(err){
        logger.error(err);
    }
}

const createAircrafts = async (data) => {
    try{
        const sheetData = await readExcel();
        const mappedData = data.map(aircraft => {
            const otherData = sheetData.find(row => row.description === aircraft.typeDescription) || {};
            return {
                ...aircraft,
                ...otherData
            }
        })
        await Aircrafts.insertMany(mappedData, { ordered: false }).catch(err => {
            logger.error(err);
        });
        logger.info({
            event: 'Service: Aircrafts added to Database'
        });
    }catch(err){
        logger.error(err);
    }
}

const createFlights = async (data) => {
    try{
        const mappedData = data.map(aircraft => {
            return aircraft.aircraftStatitics.map(stat => { return { ...stat, registration: aircraft.registration}})
        });
        const history = [].concat(...mappedData);
        await Flights.insertMany(history, { ordered: false }).catch(err => {
            logger.error(err);
        });
    }catch(err){
        logger.error(err);
    }
}

const fetchHistory = async (registrations) => {
    try{
        const { flightsUrl, headers } = flightsHistoryConstants
        const urls = registrations.map(registration => `${flightsUrl}?registration=${registration}`);
        for(let i in urls){
            logger.info({
                event: 'Service: Requesting for Flights History',
                url: urls[i]
            });
            const data = await fetchJsonData(urls[i], { headers });
            const flights = data.aircraft.aircraftStatitics.map(stat => {
                return {
                    ...stat,
                    registration: data.aircraft.registration
                }
            })
            await createFlights(flights);
            logger.info({
                event: 'Service: Flights history added to Database'
            });
        }
    }catch(err){
        logger.error(err);
    }
}

export const createFligtsHistory = async () => {
    try{
        const { aircraftTypes, aircraftSearchUrl, headers, response } = flightsHistoryConstants
        logger.info({
            event: 'Service: Create Flights History',
        });
        const urls = aircraftTypes.map(type => `${aircraftSearchUrl}?aircraftType=${type}&includeStatistics=true`);
        for(let i in urls){
            logger.info({
                event: 'Service: Requesting for Aircrafts Data',
                url: urls[i]
            });
            const data = await fetchJsonData(urls[i], { headers });
            if(data.success && data.aircraft.length > 0){
                const aircrafts = data.aircraft;
                await createAircrafts(aircrafts)
                await createFlights(aircrafts);
                logger.info({
                    event: 'Service: Flights history added to Database'
                });
            }else{
                logger.error({
                    event: 'Service: Something went wrong!'
                });
            }
        }
        
        return { message: 'Flights Added' }
    }catch(err){
        logger.error(err);
    }
}


export const updateAircrafts = async () => {
    try{
        const sheetData = await readExcel();
        for(let data of sheetData){
            logger.info({
                event: 'Service: Updating Data',
                data
            });
            await Aircrafts.updateMany({ typeDescription: data.description }, data);
        }
        return { message: 'Records in Database successfully updated!' }
    }catch(err){
        logger.error(err);
    }
}