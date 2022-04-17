// const animals = require('./data/animals.json');


const fs = require('fs');

const path = require('path');

const express = require('express');


//adds port options for Heroku or the one we specified in codebase
const PORT = process.env.PORT || 3001;
//instantiates the server
const app = express();

//middleware to get front end script and styling
app.use(express.static('public/zookeepr-public/zookeepr-public'));

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
//route for index.html to be served as homepage in server
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/zookeepr-public/zookeepr-public/index.html'));
});

//route for animals.html
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepr-public/zookeepr-public/animals.html'));
  });
//route for zookeepers.html
app.get('/zookeepers', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/zookeepr-public/zookeepr-public/zookeepers.html'));
});

//wildcard route to catch invalid requests(nonexistent URL locations) and send back to index
//Wildcards should always come last in requests
app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/zookeepr-public/zookeepr-public/index.html'));
});

//Creates API Server at Port 3001
app.listen(PORT, () =>{
    console.log(`API server now on port ${PORT}!`);
});