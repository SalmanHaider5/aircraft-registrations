import { config } from '../config';

const { radarboxApi: { key } } = config

export const flightsHistoryConstants = {
    aircraftSearchUrl: 'https://api.radarbox.com/v2/aircraft/search',
    flightsUrl: 'https://api.radarbox.com/v2/aircraft',
    headers: {
        'Authorization': 'Bearer ' + key
    },
    aircraftTypes: ["BE4W"],
    excelSheetColumns: {
        A: 'aircraft',
        C: 'description',
        D: 'make',
        E: 'model',
        F: 'category'
    }
}