import moment from 'moment';
import fetch from 'node-fetch';
import * as registrationParser from './registrations'

// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const fetchHtmlContent = async (url, options) => {
    const response = await fetch(url, options);
    const content = await response.text();
    return content;
}

const fetchJsonData = async (url, options) => {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}

const fetchCurrentFormatedDay = async () => {
    return moment().format('L').toString();
}

const fetchPreviousFormatedDay = async (days) => {
    return moment().subtract(days, 'days').format('L').toString();
}

export {
    registrationParser,
    fetchJsonData,
    fetchCurrentFormatedDay,
    fetchPreviousFormatedDay,
    fetchHtmlContent
}