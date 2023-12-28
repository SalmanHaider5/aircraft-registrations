const config = {
    mongoose: {
        url: `${process.env.MONGO_URL}${process.env.DB_NAME}`
    },
    environment: process.env.ENVIRONMENT,
    port: process.env.PORT
};

export default config;