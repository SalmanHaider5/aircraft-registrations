import mongoose from 'mongoose';

const aircrafts = new mongoose.Schema({
    modeS: {
        type: String
    },
    registration: {
        type: String
    },
    typeIcao: {
        type: String
    },
    typeDescription: {
        type: String
    },
    classDescription: {
        type: String
    },
    aircraft: {
        type: String
    },
    make: {
        type: String
    },
    model: {
        type: String
    },
    category: {
        type: String
    },
    companyIcao: {
        type: String
    },
    companyName: {
        type: String
    },
    serialNumber: {
        type: String
    },
    photos: {
        type: [String]
    },
    thumbnails: {
        type: [String]
    }
});
const Aircrafts = mongoose.model('Aircrafts', aircrafts);

export default Aircrafts;

