// Boogle game frontEnd
/**
                                        ########################
                                        ########################
                                        ########################
                                        #######  Handle ########
                                        #######  Form   ########
                                        ########################
                                        ########################

 */
/**
GLOABALS AND CONSTANST
// Todo: Refactor this crab, and set up an MD, we are uploading this baby to github
*/
GAME_CLOCK = 25
FOUND_WORDS = new Set()
COLOR_CLASSES = [ "btn-dark", "btn-light",  "btn-primary", "btn-danger", "btn-info" ]

// ******************************************************************************************************************
//todo refactoring:
// 1-set eventlisteners first and try to seperate the functions as possible.
// 2- make a function that sets the board and populates the fields needing population!
// 3- set utility functions like cleanup and updateboard and so on
// 4-make an extra button for replaying the game.
// 5-test
// ******************************************************************************************************************

// form handling
$form = $(".form-group")
// add eventlistener and make request
// this functin has to broken up
$form.on("submit", async function (evt) {
    evt.preventDefault()
    $word = $("#input").val()
    // validate
    if ($word !== "") {
        url = `http://127.0.0.1:5000/check-word?word=${$word}`;

        // make request
        const response = await axios.get(url)
        if (response.status !== 200) {
            console.log(`ERROR checkWord: ${response.status} ${response.statusText}`);
            return;
        }
        // use response
        else {
            $word_guesses = $("#word_guessed")
            $response = $("#response")

            // add word guessed
            $word_guesses.fadeIn("slow", function () {
                $word_guesses.html($word)
            })
            let result = response.data.result
            updateBoard(result)
            // clear

            setTimeout(function () {
            cleanUp()
            }, 1000)
        }
    }
})
// ******************************************************************************************************************

function cleanUp() {
    // setTimeout(function () {
        $word_guesses.empty(),
        $response.empty()
        $form.trigger("reset")

    // },1000)
}
function updateBoard(result) {
    switch (result) {
        case "ok":
            addWordAndUpdateScore()
            break;

        case "not-on-board":
            $response.html("Not on board")
            break;
        case "not-word":
            $response.html("Not a word in the English!")
            break;
}
}

function addWordAndUpdateScore() {
    $response.html("Found a word!")
    if (!FOUND_WORDS.has($word)) {
        FOUND_WORDS.add($word)
        $words = $("#words");
        $words.empty();
        FOUND_WORDS.forEach(word => {
            rand = Math.floor(Math.random() * COLOR_CLASSES.length )
            btn = $(`<button class="btn m-1 p-1 ${COLOR_CLASSES[rand]}">${word}</button>`)
            $words.append(btn)
        })
        // updateScore
        $('#score').html(parseInt($('#score').html(), 10)+$word.length)
    }
    else {
        $response.html("Word already found!")
            setTimeout(function () {
                cleanUp()
            },1500)
            return
    }

}

// displaying the timer
let tick = setInterval(function () {
    $timer = $("#timer");

    if (GAME_CLOCK === 0) {
        // clear interval and disable form
        // todo:
        // send a request with the score and  to update highscore and count the number of times we played
        clearInterval(tick)
        $("#input").prop("disabled", true)
        $(".btn").prop("disabled", true)
        updateHighScore(parseInt($('#score').html()))

    }
    $timer.text(GAME_CLOCK--)
  },1000)

async function updateHighScore(score){
    // send a request for /update-HighScore with the score data
    let url = `http://127.0.0.1:5000/update-HighScore`
    let data = { score: score }
    const response = await axios.post(url, data)
    if (response.status !== 201) {
        console.log(`Error : ${response.status}. Message: ${response.statusText}`)
    }
    else {
        console.log(response)
        // update the #high_score and #games_played
        $("#high_score").html(response.data.high_score)
        $("#games_played").html(response.data.games_played)
    }

}



