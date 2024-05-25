class Puzzle < ApplicationRecord
  validates :name, :image_url, presence: true

  has_many :characters
end
