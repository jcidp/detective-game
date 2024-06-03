class Puzzle < ApplicationRecord
  validates :name, :description, :image_url, presence: true

  has_many :characters
  has_many :games
end
