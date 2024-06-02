class Game < ApplicationRecord
  belongs_to :puzzle

  scope :highscores, ->(id) { where("end_time IS NOT NULL").where("username IS NOT NULL OR id = ?", id).order(Arel.sql("end_time - created_at")).limit(10) }

  def as_json(options={})
    super({ only: [:created_at, :end_time, :username, :characters_found] }.merge(options))
  end

  def self.validate_coordinates(id, name, x, y)
    character = Character.find_by(name: name)
    game = Game.find(id);
    x_min, x_max = character[:x_range]
    y_min, y_max = character[:y_range]
    if x.between?(x_min, x_max) && y.between?(y_min, y_max) && !game.characters_found.include?(character.id)
      game.update_characters(character.id)
    else
      game
    end
  end

  def update_characters(character_id)
    new_found_characters = [*self.characters_found, character_id]
    self.end_time = Time.now if (Game.equal_arrays?(self.puzzle.characters.pluck(:id), new_found_characters))
    if self.update(characters_found: new_found_characters)
      self
    else
      self.errors
    end
  end

  def self.equal_arrays?(a, b)
    a.size == b.size && a & b == a
  end
end
