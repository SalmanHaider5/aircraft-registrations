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
To run flights history
```
npm run start app=
```