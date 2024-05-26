class CreateGames < ActiveRecord::Migration[7.1]
  def change
    enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')

    create_table :games, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.timestamp :end_time
      t.string :username
      t.integer :characters_found, array: true, default: []
      t.belongs_to :puzzle, null: false, foreign_key: true

      t.timestamps
    end
  end
end
