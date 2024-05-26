class Api::V1::CharactersController < ApplicationController
  def puzzle
    puzzle = Puzzle.find_by(name: params[:puzzle_name])
    @characters = puzzle.characters
    render json: @characters
  end

  def validate
    @result = Character.validate_coordinates(params[:name], params[:x], params[:y])
    render json: @result
  end
end
