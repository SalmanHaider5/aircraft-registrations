import cron from 'node-cron';
import { logger } from '../config'
import { registrationsService } from '../services';
import { registrationsConstants } from '../constants';
import { registrationParser } from '../utils';

const interval = registrationsConstants.scheduler.interval;

const getAppType = () => {
    const appArg = process.argv.find(arg => arg.includes('app'));
    return !!appArg ? appArg.split("=")[1] : "";
}

const filterRegistrartionsWithDate = async (registrations, previousDate) => {;
    return registrations.filter(registration => registration.certIssueDate !== previousDate);
}

const filterRegistrartionsWithModel = async(registrations) => {
    const { models } = registrationsConstants;
    let newRegistrations = [];
    registrations.forEach(registration => {
        const modelFound = models.includes(registration.model);
        if(modelFound){
            newRegistrations.push(registration.nNumber);
        }
    });
    return newRegistrations;
}


const fetchRegistrations = async () => {
    let allRegistrations = [];
    let dataEnded = false;
    let lastPage = await registrationsService.fetchLastPageNumber();
    logger.info({
        event: 'Scheduler: Fetch Last Page',
        lastPage
    });
    let page = lastPage;
    let previousDate = "";
    while(!dataEnded){
        const registrations = await registrationsService.fetchFAARegistrations(page);
        if(page === lastPage){
            const lastRecord = registrations[registrations.length - 1].certIssueDate;
            previousDate = await registrationParser.fetchPreviousDayForRegistrations(lastRecord);
        }
        page = page - 1;
        dataEnded = !!registrations.find(registration => registration.certIssueDate === previousDate);
        allRegistrations = [...allRegistrations, ...registrations]
    }
    logger.info({
        event: 'Scheduler: Fetch All Registrations',
        allRegistrations
    });
    const latestRegistrations =  await filterRegistrartionsWithDate(allRegistrations, previousDate);
    logger.info({
        event: 'Scheduler: Filtered Registrations with Date',
        latestRegistrations
    });
    const filteredRegistrations = await filterRegistrartionsWithModel(latestRegistrations);
    logger.info({
        event: 'Scheduler: Filtered Registrations with Models',
        filteredRegistrations
    });
    return filteredRegistrations;
}

const job = async () => {
    logger.info('Registrations: Scheduler Started');
    const app = getAppType();
    if(app === 'caa'){
        const registrations = await registrationsService.fetchRegistrations();
        logger.info({
            event: 'Scheduler: Data added into DB',
            registrations
        });
    }else if(app === 'faa'){
        logger.info('Registrations: Scheduler Started');
        const registrations = await fetchRegistrations() || [];
        logger.info({
            event: 'Scheduler: Fetch Registrations after all Filters',
            registrations
        });
        if(registrations.length > 0){
            registrations.forEach(async(registration) => {
                const record = await registrationsService.fetchRegistrationRecord(registration);
                const response = await registrationsService.createRegistration(record);
                logger.info(response);
            });
        }else{
            logger.info({
                event: 'Scheduler: No new registrations found. :-)'
            });
        }
    }else{
        logger.error('App name not given!');
    }
}
job();

// cron.schedule(interval, job);