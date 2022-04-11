const animals = require('./data/animals.json');

const express = require('express');
const { type } = require('os');
//instantiates the server
const app = express();

//Filters JSON files results by user parameters
function filterByQuery(query, animalsArray){

    //query for personality traits, personality traits are an array
    let personalityTraits = [];

    //save animalsArray as filteredResults here
    //convert objects into array for .filter() method to work
    let filteredResults = animalsArray.animals;

    if(query.personalityTraits){

        //save personalityTraits as dedicated array
        //If personalityTraits is a string, place it into a new array and save
        if(typeof query.personalityTraits === 'string'){
           personalityTraitsArray = [query.personalityTraits]; 
        }else{
            personalityTraitsArray = query.personalityTraits;
        }

        //Loop through each trait in personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            //Check the trait against each animal in the filteredResults array.
            //Remember, it is initially a copy of the animalsArray,
            //but here we're updating it for each trait in the .forEach() loop.
            //For each trait being targeted in the filter, the filteredResults
            //array will then contain only the entries that contain the trait,
            //so at the end we'll have an array of animals that have every one
            //of the traits when the .forEach() loop is finished
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }

    if(query.diet){
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if(query.species){
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if(query.name){
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }

    //return the filtered results
    return filteredResults;
}

//Creates the initial request/response into the API
app.get('/api/animals', (req, res) =>{
    
    let results = animals;
    console.log(animals);

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