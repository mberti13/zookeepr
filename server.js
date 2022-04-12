const animals = require('./data/animals.json');

const express = require('express');
const { type } = require('os');

//adds port options for Heroku or the one we specified in codebase
const PORT = process.env.PORT || 3001;
//instantiates the server
const app = express();


// NEEDED TO RECEIVE DATA FORMATTED CORRECTLY IN POST REQUESTS
//parse incoming string or array data
//takes incoming POST data and converts it to key/value pairings
//that can be accessed in the req.body object.
//extended: true means there could be a nested sub-array
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
// takes incoming POST data in the form of JSON
// and parses it into the req.body JavaScript object.
app.use(express.json());



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

//
function findById(id, animalsArray){
    const result = animalsArray.animals.filter(animal => animal.id === id)[0];

    return result;
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

//API response for filtering animals by id #
app.get('/api/animals/:id', (req,res) =>{
    const result = findById(req.params.id, animals);
    //if response good, return results
    if(result){
        res.json(result);
    }else{
        //return a 404 error
        res.send(404);
    }

});

// route to allow for server to accept data to be used and/or stored server-side
app.post('/api/animals', (req, res) =>{

    //req.body is where our incoming content will be
    console.log(req.body);

    res.json(req.body);
});

//Creates API Server at Port 3001
app.listen(PORT, () =>{
    console.log(`API server now on port ${PORT}!`);
});