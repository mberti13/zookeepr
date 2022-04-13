// const animals = require('./data/animals.json');


const fs = require('fs');

const path = require('path');

const express = require('express');


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

//function to create a new animal through the POST request
function createNewAnimal(body, animalsArray){
    // console.log(body);

    //function main code
    //set body into animal variable
    const animal = body;
    //pushes animal(body) to end of animalArray but not the JSON file()
    animalsArray.push(animal);

    //WRITES DATA TO ANIMALS.JSON USING FS AND PATH
    fs.writeFileSync(
        //links __dirname to path to animals.json
        path.join(__dirname, './data/animals.json'),
        //saves array as JSON // NULL => dont want to edit any existing data
        // 2 => create white space to make more readable
        JSON.stringify( animalsArray, null, 2)
    );

    //return finished code to post route for response
    return animal;
}

const readFile = () =>{
    const animals = JSON.parse(fs.readFileSync(path.join(__dirname, './data/animals.json')));
    return animals;
}

//Creates the initial request/response into the API
app.get('/api/animals', (req, res) =>{
    const animals = readFile();
    // JSON.parse(fs.readFileSync(path.join(__dirname, './data/animals.json')));

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
    const animals = readFile();
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
    const animalsObject = readFile();
    //req.body is where our incoming content will be
    //sets animal id to current index value since array starts at 0
    console.log(animalsObject.animals.length);
    req.body.id = animalsObject.animals.length.toString();

    //if any data in req.body is incorrect, send 400 error back
    // if(!validateAnimal(req.body)){
    //     res.status(400).send('The animal is not properly formatted.');
    // }else{
        //add animal to JSON file and animals array in this function
        const animal = createNewAnimal(req.body, animalsObject.animals);
        res.json(animal);
    }
);

//Creates API Server at Port 3001
app.listen(PORT, () =>{
    console.log(`API server now on port ${PORT}!`);
});