const animals = require('./data/animals.json');

const express = require('express');
//instantiates the server
const app = express();

//Filters JSON files results by user parameters
function filterByQuery(query, animalsArray){

    let filteredResults = animalsArray;

    if(query.diet){
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if(query.species){
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if(query.name){
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}


//Creates the initial request/response into the API
app.get('/api/animals', (req, res) =>{
    let results = animals;

    // console.log(req.query)
    if(req.query){
        results = filterByQuery(req.query, results);
    }

    res.json(results);
});

//Creates API Server at Port 3001
app.listen(3001, () =>{
    console.log('API server now on port 3001');
});