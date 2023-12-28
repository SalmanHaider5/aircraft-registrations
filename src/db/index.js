import mongoose from 'mongoose';
import { config, logger } from "../config";

mongoose.connect(config.mongoose.url)
.then(() => {
    console.log('MongoDB URL => ', config.mongoose.url);
    logger.info('Connected to MongoDB');
})
.catch(err => {
    logger.error(err);
});

