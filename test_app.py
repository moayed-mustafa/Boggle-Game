from app import app
from unittest import TestCase
from boggle import Boggle
from flask import session, request


testing_board =  [
                ["F","A","S","C","K",],
                ["L","Q","S","X","C",],
                ["X","O","W","Y","Z",],
                ["Z","M","H","S","Z",],
                ["H","F","O","H","W",]
            ]
boogle_game = Boggle()
class BoggleTestCase(TestCase):
    # def setUp(self):
    #     app.config["TESTING"] = True;
    #     app.config["DEBUG"] = False



    # test root route
    def test_root(self):
        """  test root route and session initializintion   """
        with app.test_client() as client:
            response = client.get('/')

            session["board"] = testing_board
            self.assertEqual(response.status_code, 200)
            self.assertEqual(session["high_score"],  0)
            self.assertEqual(session["game_count"],  0)
            self.assertEqual(session["board"], testing_board)


    def test_words(self):
        """ testing check-word route against testing board  """
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session["board"] = testing_board
                # test a valid word on board
            response = client.get('/check-word?word=who')
            result = response.get_json()
            self.assertEqual(response.json["result"], "ok")

                # test a valid word not on board
            response = client.get('/check-word?word=hello')
            result = response.get_json()
            self.assertEqual(response.json["result"], "not-on-board")
                # test a non-valid word

            response = client.get('/check-word?word=xbv')
            result = response.get_json()
            self.assertEqual(response.json["result"], "not-word")

    def test_updates(self):
        with app.test_client() as client:
            # import pdb
            # pdb.set_trace()

            with client.session_transaction() as change_session:
                change_session["high_score"] = 12
                change_session["game_count"] = 7
            response = client.post("/update-HighScore", json={"score": 13})
            result = response.get_json()
            self.assertEqual(response.status_code, 201)
            # high_score & game_count is greater
            self.assertGreater(result["high_score"], 7)
            self.assertGreater(result["games_played"], 7)
            # high_score & game_count is less
            self.assertLess(result["high_score"], 17)
            self.assertLess(result["games_played"], 10)


