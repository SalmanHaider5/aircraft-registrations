import mongoose from 'mongoose';

const registrations = new mongoose.Schema({
    regNumber: {
        type: String,
        require: true,
        unique: true
    },
    serialNumber: {
        type: String
    },
    model: {
        type: String
    },
    mfrYear: {
        type: String
    },
    typeRegistration: {
        type: String
    },
    status: {
        type: String
    },
    certificateIssueDate: {
        type: String
    },
    typeEngine: {
        type: String
    },
    modelSCodebase8: {
        type: String
    },
    modelSCodebase16: {
        type: String
    },
    fractionalOwner: {
        type: String
    },
    registeredOwnerName: {
        type: String
    },
    registeredOwnerStreet: {
        type: String
    },
    registeredOwnerCity: {
        type: String
    },
    registeredOwnerState: {
        type: String
    },
    registeredOwnerZipCode: {
        type: String
    },
    registeredOwnerCountry: {
        type: String
    },
    engineManufacturer: {
        type: String
    },
    engineModel: {
        type: String
    },
    awDate: {
        type: String
    },
    date: {
        type: String
    }
});
const Registrations = mongoose.model('Registrations', registrations);

export default Registrations;

