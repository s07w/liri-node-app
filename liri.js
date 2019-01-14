require("dotenv").config();


var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var moment = require('moment');
moment().format();

var axios = require("axios");
var fs = require("fs");

var command = process.argv[2];
var value = process.argv[3];

switch (command) {
    case "concert-this":
    concertThis(value);
    break;

    case "spotify-this-song":
    spotifySong(value);
    break;

    case "movie-this":
    movieThis(value);
    break;

    case "do-what-it-says":
    simon(value);
    break;

    default:
    console.log("Please choose a valid command.");
    return;
};

function concertThis(value){
    axios.get("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp")
    .then(function(response) {
        for (var i = 0; i < response.value.length; i++) {
            var datetime = response.value[i].datetime;
            var dateArr = datetime.split('T');

            console.log( "-------------------------" +
            "\nVenue Name: " + response.value[i].venue.name +
            "\nVenue Location: " + response.value[i].venue.city +
            "\nEvent Date: " + moment(response.value[i].datetime).format("MM/DD/YYYY") + "\n");
            contentAdded();
        }
    });
}

function spotifySong() {
    var nodeArgs = process.argv;
    var songName = "";
  
    if (nodeArgs.length < 4) {
      songName = "ace base the sign"
    }
    else {
      for (var i = 3; i < nodeArgs.length; i++) {
        if (i > 3 && i < nodeArgs.length) {
          songName = songName + "+" + nodeArgs[i];
        }
        else {
          songName += nodeArgs[i];
  
        }
      }
    }
  
    spotify.search({ type: 'track', query: songName }, function(err, value) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }

      var artistName = value.tracks.items[0].artists[0].name;
  
      // if there are multiple artists on song
      for (i=1; i < value.tracks.items[0].artists.length; i++) {
        if (value.tracks.items[0].artists.length > 1) {
          artistName = artistName + ", " + value.tracks.items[0].artists[i].name;
        }
      }
      console.log("Artist(s): " + artistName + 
      "\nSong Name: " + value.tracks.items[0].name +
      "\nPreview: " + value.tracks.items[0].preview_url +
      "\nAlbum: " + value.tracks.items[0].album.name)
      contentAdded();
      });
  }


function movieThis(value){
    if (!value) {
        value = "mr nobody";
    }

    axios.get("https://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy")
    .then(function(response){
        console.log("------------------------" + 
        "\nMovie Title: " + response.value.Title +
        "\nYear of Release: " + response.value.Year +
        "\nIMDB Rating: " + response.value.imdbRating +
        "\nRotten Tomatoes Rating: " + response.value.Ratings[1].Value +
        "\nCountry Produced: " + response.value.Country +
        "\nLanguage: " + response.value.Language +
        "\nPlot: " + response.value.Plot +
        "\nCast: " + response.value.Actors);
        contentAdded();
    });

}

function simon(value){
    fs.readFile("random.txt", "utf8", function(err, value) {
        if (err) {
          return console.log(err);
        }
    
        // console.log(value);
        value = value.split(",");
        // console.log(value);
        // console.log(value[0]);
        // console.log(value[1]);
        
        action = value[0];
        process.argv[3] = value[1];
        switch (action) {
          case "concert-this":
            // method below removes quotation marks from artist name string
            process.argv[3] = value[1].replace(/['"]+/g, '')
            concertThis();
            break;
        
          case "spotify-this-song":
            spotifySong();
            break;
        
          case "movie-this":
            movieThis();
            break;
        }
      });
    }

function contentAdded() {
    console.log("");
    console.log("Content Added!");
    console.log("-----------------------------------\n");
    appendFile("-----------------------------------\n");
  }
  //appendFile function
  var logvalue = process.argv[2] + ": " + process.argv[3] + ", ";
  function appendFile() {
    fs.appendFile("log.txt", logvalue, function(err) {
      if (err) {
        console.log(err);
      } else {}
    });
  }