class CreateSongItems < ActiveRecord::Migration
  def change
    create_table :song_items do |t|
      t.string :artist
      t.string :album
      t.string :title

      t.timestamps
    end
  end
end
