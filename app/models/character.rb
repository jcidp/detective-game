class Character < ApplicationRecord
  validates :name, :image_url, :x_range, :y_range, presence: true

  belongs_to :puzzle
end
