class AddSpotifyHrefToSongItems < ActiveRecord::Migration
  def change
   add_column :song_items, :spotify_href, :string  
  end
end
