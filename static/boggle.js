/**
 *
 *
 *
                        *##########################
                        #######  Boogle game ########
                        #######  frontEnd   ########
                        ########################
 */

// Globals
let GAME_CLOCK = 60
let FOUND_WORDS = new Set()
let COLOR_CLASSES = [ "btn-dark", "btn-light",  "btn-primary", "btn-danger", "btn-info" ]
let $form = $(".form-group")
// ******************************************************************************************************************
// forms:
$form.on("submit", handleForm)
$("#reload").on("click", function(){ location.reload()})
// ******************************************************************************************************************
// UTILITIY FUNCTIONS

// displaying the timer
let tick = setInterval(function () {
    $timer = $("#timer");
    if (GAME_CLOCK === 0) {
        clearInterval(tick)
        $("#input").prop("disabled", true)
        $form.prop("disabled", true)
        endGame(parseInt($('#score').html()))
    }
    $timer.text(GAME_CLOCK--)
}, 1000)
//   ########################################################
async function makeRequest(url, verb, data) {
    let response
    switch (verb) {
        case "GET":
            response = await axios.get(url)
            return response
        case "POST":
            response = await axios.post(url, data)
            return response
    }
}
//   ########################################################
function updateBoard(result) {
    switch (result) {
        // todo: color the colorCard  #words_card appropriately
        case "ok":
            updateWordsFoundAndScore()
            break;

        case "not-on-board":
            $response.html("Not on board")
            break;
        case "not-word":
            $response.html("Not a word in the English!")
            break;
}
}
//   ########################################################
function updateWordsFoundAndScore() {
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
//   ########################################################
async function endGame(score){
    // send a request for /update-HighScore with the score data
    let url = `http://127.0.0.1:5000/update-HighScore`
    let data = { score: score }
    const response = await makeRequest(url,"POST", data)
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
//   ########################################################
function cleanUp() {
        $word_guesses.empty(),
        $response.empty()
        $form.trigger("reset")
}
// ******************************************************************************************************************
async function handleForm(evt) {

    evt.preventDefault()
    $word = $("#input").val()
    // validate
    if ($word !== "") {
        url = `http://127.0.0.1:5000/check-word?word=${$word}`;
        const response = await makeRequest(url, "GET")
        if (response.status !== 200) {
            console.log(`ERROR checkWord: ${response.status} ${response.statusText}`);
            return;
        }
        else {
            $word_guesses = $("#word_guessed")
            $response = $("#response")
            // add word guessed
            $word_guesses.fadeIn("slow", function () {
                $word_guesses.html($word)
            })
            let result = response.data.result
            updateBoard(result)
            setTimeout(function () {
                cleanUp()
            }, 1000)
        }
    }
}
// ******************************************************************************************************************














