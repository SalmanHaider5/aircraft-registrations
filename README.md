# aircraft-registrations

## Getting Started
To get you started you can simply clone the repository

```
git clone https://github.com/SalmanHaider5/aircraft-registrations
```
and install the dependencies
```
npm install
```

### Environment Variables
Create a `.env` file in root directory and add following parameters:
```shell
PORT=
MONGO_URL=
DB_NAME=
ENVIRONMENT=
RADARBOX_API_KEY=
```

### Run the Application
Add app name which needs to be parsed `app=caa` or `app=faa`
```
npm run start app=
```
To store flights history, Keep excel sheet in root directory and run
```
npm run flights
```

### APIs for Flights History
```
GET - /add # To add new Data
```
```
GET - /update #To update new data
``` 
```
GET - /clear # To remove data from tables
```