class Api::V1::PuzzlesController < ApplicationController
  def show
    @puzzle = Puzzle.find_by(name: params[:id])
    @characters = @puzzle.characters
    render json: { puzzle: @puzzle, characters: @characters }
  end
end
