// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones,
requirejs.config({
    "locale" : "zh-hk",
    "baseUrl": "scripts/lib",
    "paths": {
      "app": "../app",
      "jquery": "https://code.jquery.com/jquery-1.11.3.min",
      "knockout" : "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min",
      "googlemap":
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyAkGtCBYlY5jVJgSLybrruTvGZs5lejQA0&sensor=true!callback",
    },
    "shim": {
        "map":["gmap"]
    }
});

requirejs(["searchlist"]);
