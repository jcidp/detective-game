class Api::V1::CharactersController < ApplicationController
  def puzzle
    puzzle = Puzzle.find_by(name: params[:puzzle_name])
    @characters = puzzle.characters
    render json: @characters
  end
end
