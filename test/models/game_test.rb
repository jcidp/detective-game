require "test_helper"

class GameTest < ActiveSupport::TestCase
  test "Game properly validates correct coordinates" do
    game_one = games(:one)
    character_one = characters(:one)
    new_game = Game.validate_coordinates(game_one.id, character_one.name, 1.7, 1.8)
    assert_equal [character_one.id], new_game.characters_found
  end

  test "Game::validate_coordinates keeps characters_found the same if invalid coordinates" do
    game_one = games(:one)
    character_one = characters(:one)
    new_game = Game.validate_coordinates(game_one.id, character_one.name, 1.2, 1.8)
    assert_equal game_one.characters_found, new_game.characters_found
  end

  test "Game::validate_coordinates keeps characters_found the same if repeated character" do
    game_two = games(:two)
    character_two = characters(:two)
    new_game = Game.validate_coordinates(game_two.id, character_two.name, 1.7, 1.8)
    assert_equal game_two.characters_found, new_game.characters_found
  end

  test "Returns the Game highscores for a given puzzle" do
    game_two = games(:two)
    highscores = Game.highscores(game_two.id, game_two.puzzle_id)
    assert_equal [game_two, games(:three)], highscores
  end

  test "#as_json returns only created_at, end_time, username, and characters_found" do
    game_one = games(:one)
    game_keys = game_one.as_json.keys
    assert_equal game_keys.sort, ["created_at", "end_time", "username", "characters_found"].sort
  end
end
