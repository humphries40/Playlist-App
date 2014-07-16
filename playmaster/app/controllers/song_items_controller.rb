class SongItemsController < ApplicationController
  # GET /song_items/?track=
  def index
    require 'erb'

    json_data = {}

    # url encode the search term
    if params[:value]
      value = ERB::Util.url_encode(params[:value])
    end

    case params[:query]
    when "song"
      # search for song

      # construct query url
      spotify_track_url = 'http://ws.spotify.com/search/1/track.json?q='
      if value
        spotify_track_url.concat(value)
      end

      # get json data from spotify
      json_data = get_json_response(spotify_track_url)

      # clean up the data to send to view
      json_data.delete("info")
      # clean up each track element
      json_data["tracks"].each do |track|
        track["album"].delete("availability")
        track["album"].delete("href")
        track.delete("external-ids")
        track.delete("popularity")

        # clean up each artist element
        track["artists"].each do |a|
          a.delete("href")
        end
      end
    when "artist"
      # search for artist

      # construct query url
      spotify_artist_url = "http://ws.spotify.com/search/1/artist.json?q="
      if value
        spotify_artist_url.concat(value)
      end

      # get json data from spotify
      json_data = get_json_response(spotify_artist_url)

      #clean up the data to send to view
      json_data.delete("info")
      json_data["artists"].each do |artist|
        artist.delete("popularity")
      end
    when "album"
      # search for album

      # construct query url
      spotify_album_url = "http://ws.spotify.com/search/1/album.json?q="
      if value
        spotify_album_url.concat(value)
      end

      # get json data from spotify
      json_data = get_json_response(spotify_album_url)

      # clean up the data to send to view
      json_data.delete("info")
      json_data["albums"].each do |album|
        album.delete("external-ids")
        album.delete("availability")
        album.delete("popularity")
      end
    else
      # won't happen
    end

    # tell the view which playlist it is working with
    json_data["playlist_id"] = params[:playlist_id]

    # tell the view what kind of data to expect
    json_data["query"] = params[:query]

    render json: json_data
  end

  # API helper
  def get_json_response(spotify_url)
    require 'open-uri'
    spotify_response = open(spotify_url)
    json_data = ActiveSupport::JSON.decode(spotify_response)
    return json_data
  end

  # POST /song_items/?track=
  # POST /song_items/?
  def create
    @song_item = SongItem.new do |song|
      song.title = CGI::unescapeHTML(params[:title])
      song.artist = CGI::unescapeHTML(params[:artist])
      song.album = CGI::unescapeHTML(params[:album])
      song.spotify_href = CGI::unescapeHTML(params[:href])
      song.playlist_id = params[:playlist_id]
    end

    respond_to do |format|
      if @song_item.save
        format.json { render json: @song_item, status: :created, location: @song_item}
      else
        format.json { render json: @song_item.erros, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /song_items/1
  def destroy
    @song_item = SongItem.find(params[:id])
    playlist_id = @song_item.playlist_id
    @song_item.destroy

    respond_to do |format|
      format.html { redirect_to edit_playlist_path(playlist_id) }
      format.json { head :no_content }
    end
  end
end
