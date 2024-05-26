class Game < ApplicationRecord
  belongs_to :puzzle

  def self.validate_coordinates(id, name, x, y)
    character = Character.find_by(name: name)
    game = Game.find(id);
    x_min, x_max = character[:x_range]
    y_min, y_max = character[:y_range]
    p "Data: x_range = #{x_min} - #{x_max}, y_range = #{y_min} - #{y_max}, coordinates = #{x}, #{y}"
    if x.between?(x_min, x_max) && y.between?(y_min, y_max) && !game.characters_found.include?(character.id)
      if game.update(characters_found: [*game.characters_found, character.id])
        game.characters_found
      else
        game.errors
      end
    else
      game.characters_found
    end
  end
end
