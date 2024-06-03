class Api::V1::PuzzlesController < ApplicationController
  def index
    @puzzles = Puzzle.all
    render json: @puzzles
  end
  
  def show
    @puzzle = Puzzle.find(params[:id])
    @characters = @puzzle.characters
    render json: { puzzle: @puzzle, characters: @characters }
  end
end
