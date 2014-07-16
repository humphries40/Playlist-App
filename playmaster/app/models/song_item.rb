class SongItem < ActiveRecord::Base
  attr_accessible :album, :artist, :title, :playlist_id, :spotify_href
  belongs_to :playlist
end
