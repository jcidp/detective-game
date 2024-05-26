class Api::V1::GamesController < ApplicationController
  def create
    puzzle = Puzzle.find_by(name: params[:puzzle_name])
    @game = puzzle.games.build
    if @game.save
      render json: JSON.dump(@game.id)
    else
      render json: @game.errors
    end
  end

  def update
    render json: Game.validate_coordinates(params[:id], params[:name], params[:x], params[:y])
  end
end
