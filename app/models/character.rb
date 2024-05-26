class Character < ApplicationRecord
  validates :name, :image_url, :x_range, :y_range, presence: true

  belongs_to :puzzle

  def as_json(options={})
    super({ only: [:name, :id, :image_url] }.merge(options))
  end
end
