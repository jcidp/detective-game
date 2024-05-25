class CreateCharacters < ActiveRecord::Migration[7.1]
  def change
    create_table :characters do |t|
      t.string :name
      t.float :x_range, array: true, default: []
      t.float :y_range, array: true, default: []
      t.string :image_url
      t.belongs_to :puzzle, null: false, foreign_key: true

      t.timestamps
    end
  end
end
