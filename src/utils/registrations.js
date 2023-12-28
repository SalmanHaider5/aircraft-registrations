import * as cheerio from 'cheerio';
import { registrationsConstants } from "../constants";

export const formatRegistrationData = data => {
    if(!data.regNumber) return undefined;
    const keys = Object.keys(data);
    let obj = {};
    keys.forEach(key => {
        obj[key] = `${data[key]}` || ""
    });
    return obj;
}

export const parseAllRegistrations = async (htmlContent) =>{
    const { models } = registrationsConstants;
    let registrations = [];
    const $ = cheerio.load(htmlContent);
    const rows = $('.c-accordion__container').first().find('tbody tr');
    $(rows).each((index, element) => {
        const tds = $(element).find('td');
        const regNumber = $(tds[0]).text().trim();
        const typeRegistration = $(tds[1]).text().trim();
        const serialNumber = $(tds[2]).text().trim();
        const registeredOwnerName = $(tds[3]).text().trim();
        if(!!regNumber){
            const row = {
                regNumber,
                typeRegistration,
                serialNumber,
                registeredOwnerName
            };
            registrations.push(row);
        }
    });
    return registrations;
}