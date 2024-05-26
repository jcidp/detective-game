class Api::V1::GamesController < ApplicationController
  def create
    puzzle = Puzzle.find_by(name: params[:puzzle_name])
    @game = puzzle.game.build
    if @game.save
      render json: @game.id, status: :created
    else
      render json: @game.errors, status: :unprocessable_entity
    end
  end

  def update
  end
end
