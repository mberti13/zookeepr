const $animalForm = document.querySelector('#animal-form');

const handleAnimalFormSubmit = event => {
  event.preventDefault();

  // get animal data and organize it
  const name = $animalForm.querySelector('[name="animal-name"]').value;
  const species = $animalForm.querySelector('[name="species"]').value;
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;

  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
  }

  if (diet === undefined) {
    diet = '';
  }

  const selectedTraits = $animalForm.querySelector('[name="personality"').selectedOptions;
  const personalityTraits = [];
  for (let i = 0; i < selectedTraits.length; i += 1) {
    personalityTraits.push(selectedTraits[i].value);
  }
  //animals object is the data submitted into the form for creation
  const animalObject = { name, species, diet, personalityTraits };

  // FETCH info from animals.json with a POST Route
  //Bc request is coming from server, we don't need to provide a full URL
  fetch('/api/animals', {
    //Links fetch to the post method to add animals in server.js
    method: 'POST',
    //Headers informs request that it will be JSON data
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json' 
    },
    //Adds stringified data of animalsObject to the body property(req.body)
    body: JSON.stringify(animalObject)
  })
    .then(response => {
      if(response.ok){
        console.log(animalObject);
        return response.json();
      }else {
      alert('Error: ' + response.statusText);
      }
    })
    .then(postResponse => {
      console.log(postResponse);
      alert('Thank you for adding an animal!');
    });
};

$animalForm.addEventListener('submit', handleAnimalFormSubmit);
