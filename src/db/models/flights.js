import mongoose from 'mongoose';

const flights = new mongoose.Schema({
    registration: {
        type: String
    },
    year: {
        type: Number
    },
    month: {
        type: Number
    },
    distance: {
        type: Number
    },
    duration: {
        type: Number
    },
    durationRunway: {
        type: Number
    },
    durationRunwayAccuracy: {
        type: Number
    },
    activeDays: {
        type: Number
    },
    flights: {
        type: Number
    },
    airportMovements: [
        {
            icaoCode: {
                type: String
            },
            movements: {
                type: Number
            }
        }
    ]
});
const Flights = mongoose.model('Flights', flights);

export default Flights;

