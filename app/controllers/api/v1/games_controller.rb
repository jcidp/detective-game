class Api::V1::GamesController < ApplicationController
  def show
    puzzle = Puzzle.find(params[:id])
    @game = puzzle.games.build
    if @game.save
      render json: JSON.dump(@game.id)
    else
      render json: @game.errors
    end
  end

  def update
    @game = Game.validate_coordinates(params[:id], params[:name], params[:x], params[:y])
    @highscores = Game.highscores(params[:id]) if @game.end_time
    @index = @highscores.find_index(@game) if @highscores
    render json: {game: @game, highscores: @highscores, index: @index}
  end

  def update_username
    @game = Game.find(params[:id])
    if @game.update(username: params[:username])
      render json: {status: "Success"}
    else
      render json: {status: "Error"}
    end
  end
end
