class AddDescriptionToPuzzles < ActiveRecord::Migration[7.1]
  def change
    add_column :puzzles, :description, :string
  end
end
