import { logger } from '../config'
import { Registrations } from '../db/models';
import { registrationsConstants } from '../constants'
import { fetchHtmlContent, registrationParser } from '../utils';


export const fetchRegistrations = async () => {
    try{
        logger.info({
            event: 'Service: Request for Registrations for Specific Page'
        });
        const { caa_url, url_headers } = registrationsConstants;
        const options = {
            headers: url_headers
        };
        logger.info({
            event: 'Service: Request for Registrations for Specific Page',
            data: {
                caa_url,
                options
            }
        });
        const html = await fetchHtmlContent(caa_url, options);
        const registrations = await registrationParser.parseAllRegistrations(html);
        logger.info({
            event: 'Service: All Registrations from CAA Website',
            registrations
        });
        const response = await Registrations.insertMany(registrations);
        return response;
    }catch(err){
        logger.error(err);
    }
}