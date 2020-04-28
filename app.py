from boggle import Boggle
from flask import Flask, request, render_template, jsonify, session
from flask_debugtoolbar import DebugToolbarExtension
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
# DebugToolbar
app.debug = True
app.config['SECRET_KEY'] = 'Give me more cheese!! Pleeze!!!'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
toolbar = DebugToolbarExtension(app)

# instantiate game class
boggle_game = Boggle()

# set a route to render the main html page and set the session
@app.route('/')
def root():
    """ initialize session and render main page """

    board = boggle_game.make_board()
    session['board'] = board
    if 'game_count' not in session:
        session["high_score"] = 0
        session["game_count"] = 0
    return render_template("index.html", board=board)


# set up a route to handle the request for guessing a game!
@app.route('/check-word')
def cehck_word():
    board = session['board']
    word = request.args["word"]
    valid_word = boggle_game.check_valid_word(board, str(word))
    return jsonify({"result": valid_word})

# set up a request for handling score and highest score.
@app.route('/update-HighScore', methods=["POST"])
def update_high_score():
    # import pdb
    # pdb.set_trace()
    score = request.json["score"]
    session["high_score"] = max(session["high_score"], score)
    session["game_count"] = session["game_count"]  + 1
    result = {"high_score": session["high_score"], "games_played": session["game_count"]}
    response = jsonify(result)
    print(f"response: {response}")
    response.status_code = 201
    return response