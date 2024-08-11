require "test_helper"

class Api::V1::PuzzlesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_puzzles_url
    assert_equal [puzzles(:one), puzzles(:two), puzzles(:three)].to_json, @response.body
  end

  test "should show puzzle" do
    puzzle = puzzles(:one)
    get api_v1_puzzle_url(puzzle)
    puzzle_json = {puzzle: puzzle, characters: puzzle.characters}.to_json
    assert_equal puzzle_json, @response.body
  end
end
