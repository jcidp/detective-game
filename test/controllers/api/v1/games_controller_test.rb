require "test_helper"

class Api::V1::GamesControllerTest < ActionDispatch::IntegrationTest
  test "should create & show game" do
    puzzle = puzzles(:one)

    assert_difference("Game.count") do
      get api_v1_game_url(puzzle)
    end

    assert_equal Game.order(created_at: :desc).first.id.to_json, @response.body
  end

  test "should update game and not return highscores or index" do
    game = games(:four)
    character = characters(:one)
  
    put "/api/v1/games/#{game.id}", params: { id: game.id, name: character.name, x: 1.6, y: 1.8 }, as: :json

    game.reload
    expected_response = {game: game, highscores: nil, index: nil}.to_json
    assert_equal JSON.parse(expected_response), JSON.parse(@response.body)
  end

  test "should update game and return highscores and index" do
    game = games(:five)
    character = characters(:four)
  
    put "/api/v1/games/#{game.id}", params: { id: game.id, name: character.name, x: 1.6, y: 1.8 }, as: :json

    game.reload
    expected_response = {game: game, highscores: [games(:six), game], index: 1}.to_json
    assert_equal JSON.parse(expected_response), JSON.parse(@response.body)
  end

  test "should update game username" do
    game = games(:five)

    put "/api/v1/games/#{game.id}/username", params: { id: game.id, username: "test" }

    game.reload
    assert_equal "test", game.username
    expected_response = {status: "Success"}.to_json
    assert_equal JSON.parse(expected_response), JSON.parse(@response.body)
  end
end
