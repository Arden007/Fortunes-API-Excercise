// the fs module is use to write data to the DOM or Database but in this case we will be writing to the array of fortunes instead
const fs = require("fs");

// this express const is now a function that allows us to create the express app , to do that we call the express function in a const called app
const express = require("express");

// bodyParser allows node to recieve in Json format information that it will from user when updating ect.(bassically when the api recieves req from the frontEnd it allow the 2 to communincate and understand on another)
const bodyParser = require("body-parser");

// for us to have access to the fortunes data we need to require it as a module
const fortunes = require("./data/fortunes.json");
const { json } = require("body-parser");

// lets define the port number go to bin folder
// const port = 3000;

const app = express();
// express has a get method that we can use in our app as shown below, the get method has 2 params :1- being the endPoint ,2- providing a call back function that will run when our endPoint is reached

// to use the bodyParser middleware we need to tell the app to use it
app.use(bodyParser.json());

// GET ALL

app.get("/", (req, res) => {
  // console.log("Requesting fortunes");

  // Too send the data instead of logging it we need to use res.send method
  //   res.send("Requesting fortunes");

  //   for us to display our Json object we use res.json method instead of res.send
  res.json(fortunes);
});

// GET BY RANDOM

app.get("/fortunes/random", (req, res) => {
  // console.log("Requesting random fortune");

  // we can use a random index to get a random fortune to do that we will use the math.random() func that will turn a dec from 0 to 1(bassically it will give us a random number)
  // by multiplying the random number with the length of the api(Array) we should get something between 0 and the length of the api
  // const randomIndex = Math.floor(Math.random() * fortunes.length);
  // to prevent us from getting a decimal we need to Math.Floor the multiplication mentioned above

  // now that we have created a randomIndex above we need to access the Fortunes array and pass in randomIndex to get a random fortune and store it in a const below
  // const rFortunes = fortunes[randomIndex];

  // after all of that we need to respond with this random fortune object in the request
  // res.json(rFortunes);

  // Must read the above method is storeed in a var that is only used once which makes the above code unneccessary , the correct way of doing this will be to call the func Math in the Response shown below
  res.json(fortunes[Math.floor(Math.random() * fortunes.length)]);
});

// GET BY ID

// the cologn(:) is a special type of syntax that tells our app our endPoint will be a parameter like the Id of an object as shown below.
app.get("/fortunes/:id", (req, res) => {
  // to pass in parameters we will have to use req.params so lets log it and see what we get , if it logs the id you pasted(eg.{id:1}) in we can use
  console.log(req.params);
  // now that we know we can use an array method called find that takes in a callback function which will allows us to look at each item individually within the array by storing it within the first parameter of or callback(f)
  // f will represent the an indivual fortune(OUR ARRAY/ DATA) , next we check wether the Id of our data matachs the params passed in
  // find take the first item that match the condition below
  res.json(fortunes.find((f) => f.id == req.params.id));
});

// Helper Function/middleware
const writeFortunes = (json) => {
  fs.writeFile("./data/fortunes.json", JSON.stringify(json), (err) =>
    console.log(err)
  );
};

// CREATE
app.post("/fortunes", (req, res) => {
  // with the post method we will be interacting with the req.body so let log it see what we getting
  console.log(req.body);

  // now that we know we getting back the desired data we will store the names of the variables in a const ,and take the matching fields in the req.body
  const { message, lucky_number, spirt_animal } = req.body;

  // first we need to take the fortunes array and map through the Id"s and return a new array of just Id's
  const fortune_Id = fortunes.map((f) => f.id);
  // now lets define the new furtune obbject and pass in that data we recieve in our request body on top, since our keys and values between the 2 is identitical we will be using a ES6
  // but to complete our furtune object we need a key of Id ,and we want the value to increment on the length of our current array (add on) for this we will need to create a const with fortune_Id and use the Map method to return to us a new array with ID's show above
  // after creating the new array of id's we can now assign our new object of fortune with and id that takes in the max length of our array and increments to it, to do that we need to set our id to Math.max(...fortune_Id)
  // const fortune = {
  // with the map method we need to make sure we account for an empty array otherwise we will have a never ending loop we do this with a turnarry operator
  // id: Math.max(...fortune_Id),

  // with turnarry operator and increment
  //   id: (fortune_Id.length > 0 ? Math.max(...fortune_Id) : 0) + 1,
  //   message,
  //   lucky_number,
  //   spirt_animal,
  // };

  // after we have created our furtune object above we can then display the new array of fortunes by concaternating the data(concat) shown below
  const newFortunes = fortunes.concat({
    // with the map method we need to make sure we account for an empty array otherwise we will have a never ending loop we do this with a turnarry operator
    // id: Math.max(...fortune_Id),

    // with turnarry operator and increment
    id: (fortune_Id.length > 0 ? Math.max(...fortune_Id) : 0) + 1,
    message,
    lucky_number,
    spirt_animal,
  });

  // to display the the updated array we will send backk the data of newFortunes
  // at the moment we can display the data but unfortunately its on saved to do this we nwwd to import the fs module to enable us to write the data to our array of fortunes

  // the fs module has a write file method that allows us to replcae this fortunes.json file with our new data, for the first parameter it takes a path and the file name of the data we want to write to ,
  // for the second parameter we provide a string that will represent what we want write to the file , we'll use the json.stringfly method that will convert our new fortunes array into a json string
  // for the third parameter wewill have a callback function that will check if any err ocurried while writing to the file
  // fs.writeFile("./data/fortunes.json", JSON.stringify(newFortunes), (err) =>
  //   console.log(err)
  // );
  //since we using this write function more than once once lets create a helper function that will do the above but stored in a variable

  // Helper Function
  writeFortunes(newFortunes);

  res.json(newFortunes);
});

// UPDATE
app.put("/fortunes/:id", (req, res) => {
  const { id } = req.params;
  // const {message, lucky_number,spirt_animal} = req.body;
  // now that we have set our data we want update (the object keys) we will find a id in the our data matching the req.body params
  const oldFortunes = fortunes.find((f) => f.id == id);
  // after finding matching the id's we need to set our data and req.body data to match so we can update the keys in a specific object
  // when updating our data values we need to make sure that the values of the object only updates if values are provide , we do this with if statement
  // if (message) oldFortunes.message = message;
  // if (lucky_number) oldFortunes.lucky_number = lucky_number;
  // if (spirt_animal) oldFortunes.spirt_animal = spirt_animal;
  // the code duplication above can be avoided by defining our key and loop through each to check if there keys have diferrent values and setting it to the req.body values
  // first we create an array with our key, then run a forEach to look at the keys individually
  ["message", "lucky_number", "spirt_animal"].forEach((key) => {
    // now we need to check if the key is present in the req.body and then proceed to updating it with setting it equal to the request.body[key]
    if (req.body[key]) oldFortunes[key] = req.body[key];
  });

  // after we our data has been updated with req.body values we can write to file which contain the data fortunes.json with fs.writeFile method
  // fs.writeFile("./data/fortunes.json", JSON.stringify(fortunes), (err) => console.log(err)
  // );
  //since we using this write function more than once once lets create a helper function that will do the above but stored in a variable

  // Helper Function
  writeFortunes(fortunes);

  // now we can finally send back our new data
  res.json(fortunes);
});

// DELETE
app.delete("/fortunes/:id", (req, res) => {
  // first we need to accept/grab the id in the req.params
  const { id } = req.params;

  // now we can create a new array of fortune objects that does match the req.params by filtering throught the data.
  // The Filter method returns a new array based on the condition set , in this case we want to return all the Id's that does not match the req.params
  const new_fortunes = fortunes.filter(f => f.id != id);

  // now that we have our new data lets write to where our old id stored with the Helper Function
  writeFortunes(new_fortunes);

  // Log
  // console.log(new_fortunes);

  // now that we dont we can respond with the new array of fortune objects
  res.json(new_fortunes);
});

// After we have set our Request and Response above we need to make a call to our listen func to make this server live, the first param will be the port which will auto attach to localhost
// now we can add the sec params which will be a called back func which will log a msg that the server is listening on the port number
// app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
