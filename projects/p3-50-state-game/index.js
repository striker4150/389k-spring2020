// This is a subset of the states.
// Use this to actually run the game
// (assume this is the full set of states.
// This will make it easier to test.
var states = ["Idaho", "South Dakota", "Hawaii", "Alaska", "Alabama", "New York"];

// These are all the states. It maps the state name to the number which you'll
// want to use in your API call.
var abvMap = {
    "Alabama": "01",
    "Alaska": "02",
    "Arizona": "04",
    "Arkansas": "05",
    "California": "06",
    "Colorado": "08",
    "Connecticut": "09",
    "Delaware": "10",
    "District Of Columbia": "11",
    "Florida": "12",
    "Georgia": "13",
    "Hawaii": "15",
    "Idaho": "16",
    "Illinois": "17",
    "Indiana": "18",
    "Iowa": "19",
    "Kansas": "20",
    "Kentucky": "21",
    "Louisiana": "22",
    "Maine": "23",
    "Maryland": "24",
    "Massachusetts": "25",
    "Michigan": "26",
    "Minnesota": "27",
    "Mississippi": "28",
    "Missouri": "29",
    "Montana": "30",
    "Nebraska": "31",
    "Nevada": "32",
    "New Hampshire": "33",
    "New Jersey": "34",
    "New Mexico": "35",
    "New York": "36",
    "North Carolina": "37",
    "North Dakota": "38",
    "Ohio": "39",
    "Oklahoma": "40",
    "Oregon": "41",
    "Pennsylvania": "42",
    "Rhode Island": "44",
    "South Carolina": "45",
    "South Dakota": "46",
    "Tennessee": "47",
    "Texas": "48",
    "Utah": "49",
    "Vermont": "50",
    "Virginia": "51",
    "Washington": "53",
    "West Virginia": "54",
    "Wisconsin": "55",
    "Wyoming": "56",
}


/*
 * The majority of this project is done in JavaScript.
 *
 * 1. Start the timer when the click button is hit. Also, you must worry about
 *    how it will decrement (hint: setInterval).
 * 2. Check the input text with the group of states that has not already been
 *    entered. Note that this should only work if the game is currently in
 * 3. Realize when the user has entered all of the states, and let him/her know
 *    that he/she has won (also must handle the lose scenario). The timer must
 *    be stopped as well.
 *
 * There may be other tasks that must be completed, and everyone's implementation
 * will be different. Make sure you Google! We urge you to post in Piazza if
 * you are stuck.
 */
var BASE_URL = "https://api.census.gov/data/2013/language"
var GAME_MILLISEC = 20000;

//var STATES = Object.keys(abvMap).sort();
var STATES = states.sort();
var LOWERCASE_STATES = $.map(STATES, function(stateName) {
    return stateName.toLowerCase();
});

var stateStats = {};
var correctAnswers = [];
var timer;

function startTimer() {
    var startTime = Date.now();
    var elapsedTime = 0;
    timer = setInterval(function() {
        elapsedTime = Date.now() - startTime;
        if(elapsedTime <= GAME_MILLISEC) {
            // Display time with decisecond precision
            $("#timer").text(((GAME_MILLISEC - elapsedTime) / 1000.0).toFixed(1));
        } else {
            stopGame();
        }
    }, 1);
}

function playGame() {
    var input, index;
    // Reset game
    correctAnswers = [];
    $("#state-list").html("");
    // Enable input box
    $("#state-input").prop("disabled", false);
    $('#state-input').keyup(function () {
        input = $(this).val().toLowerCase();
        index = $.inArray(input, LOWERCASE_STATES);
        // If the user input is not a duplicate and is a state
        if($.inArray(input, correctAnswers) == -1 && index != -1) {
            // Disable the input until processing is finished
            $(this).prop("disabled", true);

            // Create the new <li> element
            var newLi = $("<li>");
            newLi.text(STATES[index]);
            try {
                newLi.prop("title", stateStats[STATES[index]].toLocaleString()); // Localize number of Spanish speakers
            } catch(e) {
                console.log("Error setting title text: " + e)
            }

            // Put the <li> element in the <ul>
            $("#state-list").append(newLi);
            // Sort the list
            $("#state-list").html(
                $("#state-list").children("li").sort(function (a, b) {
                    return $(a).text().toLowerCase().localeCompare($(b).text().toLowerCase());
                })
            );
            correctAnswers.push(input);

            // Clear and re-enable input
            $(this).val("");
            $(this).prop("disabled", false);

            // End the game if the user correctly names all states
            if(correctAnswers.length == STATES.length) {
                stopGame();
            }
        }
    });
    startTimer();
    console.log("Game is playing...")
}

function stopGame() {
    // Stop the timer
    clearInterval(timer);
    // Disable further input
    $("#state-input").prop("disabled", true);
    $("#state-input").val("");
    if(correctAnswers.length == STATES.length) {
        alert("You win!");
    } else {
        // Print score + missing states
        var message = "Score: " + correctAnswers.length + " / " + STATES.length + "\n";
        message += "\nMissing states:\n"
        // Filter out states that were correctly named
        var missingStates = STATES.filter(stateName => !correctAnswers.includes(stateName.toLowerCase()));
        for(var i in missingStates) {
            message += "\n" + missingStates[i];
        }
        alert(message);
    }
    console.log("Game is stopped!")
}

// Set default time
$("#timer").text((GAME_MILLISEC / 1000.0).toFixed(1));

// Preload state data
var promises = [];
$.each(STATES, function(_i, state) {
    promises.push($.get(BASE_URL, { get: "EST", for: "state:" + abvMap[state], LAN: 625 }, function(data) {
        try {
            stateStats[state] = parseInt(data[1][0]);
        } catch(e) {
            console.log("Error parsing AJAX data: " + e)
        }
    }));
});

// Wait until data is loaded before enabling the start button
$.when.apply($, promises).always(function () {
    // Start the game when the button is pressed
    console.log("Game loaded!");
    $("#start").click(function() {
        playGame();
    });
});
