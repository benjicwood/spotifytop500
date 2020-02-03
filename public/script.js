(function() {

     var stateKey = 'spotify_auth_state';

     /*

     Obtains parameters from the hash of the URL
     @return Object

     */

     function getHashParams() {
          var hashParams = {};
          var e, r = /([^&;=]+)=?([^&;]*)/g,
               q = window.location.hash.substring(1);
          while (e = r.exec(q)) {
               hashParams[e[1]] = decodeURIComponent(e[2]);
          }
          return hashParams;
     }

     /*

     Generates a random string containing numbers and letters
     @param  {number} length The length of the string
     @return {string} The generated string

     */

     function generateRandomString(length) {
          var text = '';
          var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

          for (var i = 0; i < length; i++) {
               text += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          return text;
     };

     function listItem(response) {

          var str = '<div>'
          response.forEach(function(response) {
               console.log(response.track.artists[0].name);
               str += '<p>' + response.track.artists[0].name + ' - ' + response.track.name + '</p>';
          });

          str += '</div>'

          document.getElementById('tracks-container').innerHTML = str;
     }

     var userProfileSource = document.getElementById('user-profile-template').innerHTML,
          userProfileTemplate = Handlebars.compile(userProfileSource),
          userProfilePlaceholder = document.getElementById('user-profile');

     oauthSource = document.getElementById('oauth-template').innerHTML,
          oauthTemplate = Handlebars.compile(oauthSource),
          oauthPlaceholder = document.getElementById('oauth');

     var params = getHashParams();

     var access_token = params.access_token,
          state = params.state,
          storedState = localStorage.getItem(stateKey);

     if (access_token && (state == null || state !== storedState)) {
          alert('There was an error during the authentication');
     } else {
          localStorage.removeItem(stateKey);
          if (access_token) {
               $.ajax({
                    url: 'https://api.spotify.com/v1/playlists/1A9N8kBvBjpIBlWs5Y0A9r',
                    headers: {
                         'Authorization': 'Bearer ' + access_token
                    },
                    success: function(response) {
                         userProfilePlaceholder.innerHTML = userProfileTemplate(response);

                         listItem(response.tracks.items)

                         $('#login').hide();
                         $('#loggedin').show();
                    }
               });
          } else {
               $('#login').show();
               $('#loggedin').hide();
          }

          // https://api.spotify.com/v1/playlists/1A9N8kBvBjpIBlWs5Y0A9r
          // https://api.spotify.com/v1/artists/43ZHCT0cAZBISjO8DG9PnE/related-artists

          document.getElementById('login-button').addEventListener('click', function() {

               var client_id = '59e549049655494494ae722dc395e29d'; // Your client id
               // var client_secret = '99adf94a3e0a47e8a029cf17eda9dfc5'; // Your secret
               var redirect_uri = 'http://localhost:8888/'; // Your redirect uri

               var state = generateRandomString(16);

               localStorage.setItem(stateKey, state);
               var scope = 'user-read-private user-read-email';

               var url = 'https://accounts.spotify.com/authorize';
               url += '?response_type=token';
               url += '&client_id=' + encodeURIComponent(client_id);
               url += '&scope=' + encodeURIComponent(scope);
               url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
               url += '&state=' + encodeURIComponent(state);
               //
               window.location = url;
          }, false);
     }
})();