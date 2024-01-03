import * as cheerio from 'cheerio';
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
        const registrations = await registrationParser.parseAllRegistrations(html) || [];
        logger.info({
            event: 'Service: All Registrations from CAA Website',
            registrations
        });
        if(registrations.length > 0){
            const response = await Registrations.insertMany(registrations);
            return response;
        }
    }catch(err){
        logger.error(err);
    }
}

export const createRegistration = async (data) => {
    try{
        logger.info({
            event: 'Service: New Registration',
            data
        });
        const registration = await Registrations.create(data);
        logger.info({
            event: 'Service: Record added in Mongo DB',
            registration
        });
        return registration;
    }catch(err){
        if(err.code === 11000){
            logger.info('Service: Record already exists.');
        }
        logger.error(err);
    }
}

export const fetchLastPageNumber = async () => {
    try{
        const { faa_url, url_headers } = registrationsConstants;
        const options = {
            headers: url_headers
        };
        logger.info({
            event: 'Service: Request for Pagination to Check Page',
            data: {
                url: faa_url,
                options
            }
        });
        const html = await fetchHtmlContent(faa_url, options);
        const $ = cheerio.load(html);
        const pagesStr = $('.pagination2center p').text().trim();
        const pageNumber = await registrationParser.parseLastPageNumber(pagesStr);
        logger.info({
            event: 'Service: Last Page Number',
            pageNumber
        });
        return pageNumber;
    }catch(err){
        logger.error(err);
    }
}

export const fetchFAARegistrations = async (pageNumber) => {
    try{
        logger.info({
            event: 'Service: Request for Registrations for Specific Page',
            pageNumber
        });
        const { faa_url, url_headers } = registrationsConstants;
        const options = {
            headers: url_headers
        };
        const url = `${faa_url}?Sort_Option=5&Page=${pageNumber}`
        logger.info({
            event: 'Service: Request for Registrations for Specific Page',
            data: {
                url,
                pageNumber,
                options
            }
        });
        const html = await fetchHtmlContent(url, options);
        const registrations = await registrationParser.parseAllFAARegistrations(html);
        logger.info({
            event: 'Service: All Registrations for Specific Page',
            registrations
        });
        return registrations;
    }catch(err){
        logger.error(err);
    }
}

export const fetchRegistrationRecord = async(nNumber) => {
    try{
        const { registration_url, url_headers } = registrationsConstants;
        const options = {
            headers: url_headers
        };
        const url = registration_url + nNumber;
        logger.info({
            event: 'Service: Request for Registration Detail for N-Number',
            data: {
                url,
                nNumber,
                options
            }
        });
        const html = await fetchHtmlContent(url, options);
        const record = await registrationParser.parseRegistrationData(nNumber, html);
        logger.info({
            event: 'Service: Registration Detail for N-Number',
            record
        });
        return record;
    }catch(err){
        logger.error(err);
    }
}

