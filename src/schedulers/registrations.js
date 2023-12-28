import cron from 'node-cron';
import { logger } from '../config'
import { registrationsService } from '../services';
import { registrationsConstants } from '../constants';
import { registrationParser } from '../utils';

const interval = registrationsConstants.scheduler.interval;

const job = async () => {
    logger.info('Registrations: Scheduler Started');
    const registrations = await registrationsService.fetchRegistrations();
    logger.info({
        event: 'Scheduler: Data added into DB',
        registrations
    });
}
job();
// cron.schedule(interval, job);