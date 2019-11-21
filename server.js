`use strict`;

require('dotenv').config();

const express = require('express');

const cors = require('cors');


const superagent = require('superagent');
const PORT = process.env.PORT;

const server = express();

server.use(cors());

//*************************************************************************************************** */

function locationHandler(req,res){
let locationData = getLocation(req.query.data);
res.status(200).json(locationData);
}






function getLocation(city){

    const url = `https://maps.googleapis.com/maps/api/geocode/json?assress=${city}&key=${process.env.GOOGLE_GEOCODE_API}`
    console.log(url)
    .then(data => {
        let location = new Location (city ,data.body);
return location;
console.log(location);

    });
// return new Location(city, data);
}









//**location************************************************************************************************************* */



server.get('/location', (request, response) => {
    const locationData = require('./data/geo.json');
    const location = new Location(locationData);
    response.status(200).json(location);
})

function Location(data) {
    this.search_query = 'lynnwood';
    this.formatted_query = data.results[0].formatted_address;
    this.lat = data.results[0].geometry.location.lat;
    this.lng = data.results[0].geometry.location.lng;
}






//***weather*********************************************************************************************************************************** */





server.get('/weather', (request, response) => {
    const weatherData = require('./data/darksky.json');
    locWeather(weatherData.daily.data);

    response.status(200).json(weatherArr);
    console.log('locWeather');

})

function Weather(jsonData) {
  console.log(jsonData);

    this.forcast = jsonData.summary;
    this.time = new Date(jsonData.time*1000).toDateString();
}




  let weatherArr = [];


  // function Weather( jsonData ) {
  //   console.log('data : ', jsonData);
  //   this.forcast = jsonData.summary;
  //   this.time = new Date(jsonData.time*1022.1).toDateString();
  // }
  
  function locWeather(array)
  {
  
    array.forEach(element => {
      weatherArr.push(new Weather(element))
    });
 
  };
  




//**error********************************************************************************************************************* */

server.get('/foo',(request,response) =>{
    throw new Error('ops');
})

server.use('*', (request, response) => {
    response.status(404).send('Not Found')
})

server.use((error,request,response) => {
    response.status(500).send(error)
})


server.listen(PORT, () => console.log(`app listening on ${PORT}`)) 














'use strict';

// Dependecies (express, cors, dotenv)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

const PORT = process.env.PORT || 3000;

const app = express();

app.use( cors() );

// make the the callBack function a seprate fuctions :locationHandler,weatherHandler

app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/events',eventHandler);

function locationHandler(req,res) {
  // Query String = ?a=b&c=d
  getLocation(req.query.data)
    .then( (locationData) => res.status(200).json(locationData) );
}

function getLocation(city) {
  // No longer get from file
  // let data = require('./data/geo.json');

  // Get it from Google Directly`
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.API}`

  return superagent.get(url)
    .then( data => {
      return new Location(city, data.body);
    })

}

function Location(city, data) {
  this.search_query = city;
  this.formatted_query = data.results[0].formatted_address;
  this.latitude = data.results[0].geometry.location.lat;
  this.longitude = data.results[0].geometry.location.lng;

}


// WEATHER
// ------------------------------- _________________ //

function weatherHandler(req,res) {
  // Query String = ?a=b&c=d
  getWeather(req.query.data)
    .then( weatherData => res.status(200).json(weatherData) );

}

function getWeather(query) {
  // let data = require('./data/darksky.json');
  const url = `https://api.darksky.net/forecast/${process.env.DARK_SKY}/${query.latitude},${query.longitude}`;
  return superagent.get(url)
    .then( data => {
      let weather = data.body;
      return weather.daily.data.map( (day) => {
        return new Weather(day);
      });
    });
}

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toDateString();
}

// add event >>>>>>>>>>>>>>>


function eventHandler(req,res) {
    // Query String = ?a=b&c=d
    getEvent(req.query.data.search_query)
      .then( eventData => res.status(200).json(eventData) );
  
  }
  
  function getEvent(city) {
    // let data = require('./data/darksky.json');
    const url = `http://api.eventful.com/json/events/search?app_key=${process.env.EVENT_KEY}&location=${city}`;
    return superagent.get(url)
      .then( data => {
        let eventA = JSON.parse(data.text);

        console.log('data : ', eventA);
        return eventA.events.event.map( (day) => {
            console.log({day});
          return new Event(day);
        });
      });
  }
  
  function Event(day) {
    this.link=day.url;
    this.name=day.title;
    this.event_date=day.start_time;
    this.summary=day.description;  
}
  








app.use('*', (req,res) => {
 

  res.status(404).send('NOT FOUND!');
});

app.listen( PORT, () => console.log('hello world, from port', PORT));