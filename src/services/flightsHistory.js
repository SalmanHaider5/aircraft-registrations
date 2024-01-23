import { logger } from '../config'
import { Aircrafts, Flights } from '../db/models';
import { flightsHistoryConstants } from '../constants'
import { fetchJsonData } from '../utils';

const createAircrafts = async (data) => {
    try{
        await Aircrafts.insertMany(data, { ordered: false }).catch(err => {
            logger.error(err);
        });
        logger.info({
            event: 'Service: Aircrafts added to Database'
        });
        const registrations = data.map(aircraft => aircraft.registration)
        logger.info({
            event: 'Registrations',
            registrations
        });
        return registrations
    }catch(err){
        logger.error(err);
    }
}

const createFlights = async (data) => {
    try{
        const response = await Flights.insertMany(data, { ordered: false }).catch(err => {
            logger.error(err);
        });
        return response;
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
        const { aircraftTypes, aircraftSearchUrl, headers } = flightsHistoryConstants
        logger.info({
            event: 'Service: Create Flights History',
        });
        const urls = aircraftTypes.map(type => `${aircraftSearchUrl}?aircraftType=${type}`);
        for(let i in urls){
            logger.info({
                event: 'Service: Requesting for Aircrafts Data',
                url: urls[i]
            });
            const data = await fetchJsonData(urls[i], { headers });
            if(data.success && data.aircraft.length > 0){
                const registrations = await createAircrafts(data.aircraft)
                await fetchHistory(registrations)
                logger.info({
                    event: 'Service: Flights history added to Database'
                });
            }
        }
        return { message: 'Flights Added' }
    }catch(err){
        logger.error(err);
    }
}