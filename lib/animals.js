const fs = require("fs");

const path = require("path");

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
};

//Finds animals by the ID in the index array
function findById(id, animalsArray){
    const result = animalsArray.animals.filter(animal => animal.id === id)[0];

    return result;
};

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
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    //return finished code to post route for response
    return animal;
};

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
  };

  //exports all functions
  module.exports = {
      filterByQuery,
      findById,
      createNewAnimal,
      validateAnimal
  };