class Playlist < ActiveRecord::Base
  attr_accessible :title, :user_id
  validates :title, presence: true
  belongs_to :user
  has_many :song_items
end
