class Character < ApplicationRecord
  validates :name, :image_url, :x_range, :y_range, presence: true

  belongs_to :puzzle

  def as_json(options={})
    super({ only: [:name, :id, :image_url] }.merge(options))
  end

  def self.validate_coordinates(name, x, y)
    character = Character.find_by(name: name)
    x_min, x_max = character[:x_range]
    y_min, y_max = character[:y_range]
    p "Data: x_range = #{x_min} - #{x_max}, y_range = #{y_min} - #{y_max}, coordinates = #{x}, #{y}"
    x.between?(x_min, x_max) && y.between?(y_min, y_max)
  end
end
