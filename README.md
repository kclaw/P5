Neighbourhood Map
=========================================
    This project works around map and show places we are interested in(interest).

Map Functionality
=========================================
1. display markers that pinned on interest.
2. show information of interest in infowindow (use wikipedia data api)

Location Detail Functionality
=========================================
1. provides information of interest (by wikipedia data api)

Search Functionality
=========================================
1. filter interest according to input
2. dispaly search result of interest
3. pan to interest on map
4. display in listview

How to run?
=========================================
open index.html


Technical Involvement
=========================================
    This program makes use of google map api,wikipedia data api,knockout.js,require.js framework/library.
    
    This project has many javascript files which defined in AMD using require.js,
    js file is loaded on demand.
    In this structure, all js files are put under scripts folder.
    Configuration file of require.js is put under scripts/app folder.
    And any other js modeule which defined in AMD specification or traditional js script files are put under scripts/lib folder.
    program.js is main entry point of program which is configured to be called in main.js.
    Before any code executed in program.js, knockout.js,jquery framework and container.js and some components which adds to container are loaded.
    Since using knockout.js, components are going to registered and some bindingHandlers are assigned in program.js
    At last, function addOverlay is called to add saerchlist component as a floating layer into google map.
    
    By the way, debug.js is loaded in global envirnoment by configuration file(main.js). so function debug can be called inside each module. debug.js is used to log down important information at the moment in execution flow. It would display debug information only when is set to be enable. It is a good tool to know what is going on of a program.
    
    Type in debug.enable('*') into console of a browser and refresh the browser.
    For more details, browse to https://github.com/visionmedia/debug