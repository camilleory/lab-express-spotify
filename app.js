require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: "4c3ac45eb75641529dc187ed6b214240",
    clientSecret: "4706c8c71b95438b92f66c1075a93d1d"
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:



app.get('/home', (req, response, next) => response.render("index"))
app.get('/artists-search', (req, response, next) => {

    //console.log(req.query) // { artist : 'alksjdhahsd' } // ?artist=alksjdhahsd

    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            //console.log('The received data from the API: ', JSON.stringify(data.body));
            //console.log('API:', data.body.artists)


            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            response.render("artist-search-result",data.body.artists)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:albumId', (req, res, next) => {

    spotifyApi.getArtistAlbums(req.params.albumId).then(
        function(data) {
          //console.log('Artist albums', data.body.items[0].images);
          console.log('param', req.params)
          res.render("albums",data.body)

        },
        function(err) {
          console.error(err);
        });

});

  

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


