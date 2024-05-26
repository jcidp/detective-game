class Game < ApplicationRecord
  validates :hash_id, presence: true

  belongs_to :puzzle
end
