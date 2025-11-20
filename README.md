# NearBeer 
Near Beer is an app to create pub crawls, currently, due to the api used, only breweries are included in the pub crawl. Future changes will fix this.

## How to use:
run 
```
git clone https://github.com/Mereck600/NearBeer.git
```

cd into server directory and run

```
npm i
```
then create a .env file in the root of server and popluate it with
```
MONGO_URI=mongodb://localhost:27017/nearbeer
JWT_SECRET=KEYTHATWORKSFORJWT
```
then run 
```
nodemon index.js
```
Ensure MongoDB is running and you can see "neerbeer" as listed db.
cd into the client dir and run 
```
npm i
```
then run
```
npm start
```
