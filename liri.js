require("dotenv").config();
var keys = require("./keys.js");
// Here we incorporate the "axios" npm package
var axios = require("axios");
//get user inputs, user search terms
//store input in variable
var moment = require("moment");
var fs = require("fs");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(
  keys.spotify,
);

var logFile = "./log.txt";
// Function to write out log file and console.log data
function writeLog(data) {
  console.log(data);
  fs.appendFileSync(logFile, data + "\n");
}
// Log file to store commands and results



var userChoice = process.argv[2];
// determine which function to run. Use the for loop thing that guy and I went over.
//index we want to begin at is (3) and after
var searchTerm = process.argv.splice(3).join(" ");



var switchChoices = function () {
  switch (userChoice) {
    case "concert-this":
      concertThis();
      writeLog("concert-this");
      break;

    case "spotify-this-song":
      //add function
      spotifySearch();
      writeLog("spotify-this-song");
      break;

    case "movie-this":
      movieThis();
      writeLog("movie-this");
      break;
    //add function

    case "do-what-it-says":
      writeLog("do-what-it-says");
      doWhatItSays();
      break;

    default: writeLog("not found");

  }
}


function concertThis() {

  axios.get("https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp").then(
    function (response) {

      //console.log let user know if there are no results
      if (response.data.length === 0) {
        writeLog("Nothing found, no upcoming concerts");
        return;
      }

      //Need to log name of venu, venue location, and date of event.
      //writeLog()  search BTS is a good one
      for (var i = 0; i < 3; i++) {

        writeLog("Location of Venue: " + response.data[i].venue.city + ", " + response.data[i].venue.country)
        writeLog("Name of Venue: " + response.data[i].venue.name);
        writeLog("Date of Venue: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
      }


    }
  );
}

function spotifySearch() {
  spotify.search({ type: 'track', query: searchTerm, limit: '1' }, function (err, data) {
    if (err) {
      writeLog('Error occurred: ' + err);
      return;
    }

    writeLog("Artist name: " + data.tracks.items[0].album.artists[0].name);
    writeLog("Song Name: " + data.tracks.items[0].name);
    writeLog("Preview link: " + data.tracks.items[0].album.artists[0].external_urls.spotify);
    writeLog("Album Name: " + data.tracks.items[0].album.name);


  })
};


function movieThis() {

  // encircle axios whem done testing: if (num2 == "movie-this") {}
  // We then run the request with axios module on a URL with a JSON
  axios.get("http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy").then(
    function (response) {
      var movie = response.data;
      writeLog("Title: " + movie.Title);
      writeLog("Year Released: " + movie.Year);
      writeLog("Rated: " + movie.Rated);
      writeLog("Rotten Tomatoes: " + movie.Ratings[1].Value);
      writeLog("Country: " + movie.Country);
      writeLog("Language: " + movie.Language);
      writeLog("Plot: " + movie.Plot);
      writeLog("Actors: " + movie.Actors);

      // Then we print out the imdbRating
      writeLog("The movie's rating is: " + response.data.imdbRating);
      //writeLog(JSON.stringify(response.data, null, 2));

    }
  )
};


function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) {
      return writeLog("Error")
    }
    
    writeLog(data.split(","));
    var command = data.split(",");
    userChoice = command[0];
    searchTerm = data[0].split(",");

    switchChoices();
  })
}

switchChoices();

