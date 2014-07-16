// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/
function removeRow() {
  var tdNode = this;
  $(tdNode).parent().next().remove();
  $(tdNode).off("click", removeRow);
  $(tdNode).on("click", playSpotify);
}

function playSpotify() {
  var tdNode = this;
  var songRowNode = $(tdNode).parent();
  var songID = $(tdNode).parent().attr("id");
  var numCol = $(songRowNode).children().length;

  var spotifyEmbed = '<iframe src="https://embed.spotify.com/?uri='+songID+'" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>';
  $(songRowNode).after("<tr><td colspan="+numCol+">"+spotifyEmbed+"</td></tr>");
  $(tdNode).off("click", playSpotify);
  $(tdNode).on("click", removeRow);
}

function addOnClick() {
  var play_cells = $("#playlist tr:gt(0) td:first-child");
  $(play_cells).one("click", playSpotify);
}

function addSongToPlaylist() {
  //get the title, artist, album and send a POST to /song_items
  var titleJ = this.children[1].innerHTML;
  var artistJ = this.children[2].innerHTML;
  var albumJ = this.children[3].innerHTML;
  var spotifyUri = this.id;
  var dataObj = {title: titleJ, artist: artistJ, album: albumJ};
  var playlist_id = $('#playlist_id').attr('value');
  $.ajax({
    type: "POST",
    url: "/song_items",
    data: {title: titleJ, artist: artistJ, album: albumJ, playlist_id: playlist_id, href: spotifyUri},
    dataType: "json"
  }).done(function(){location.reload();});
}

function handleArtistRowClick() {
  var spotifyUri = this.id;
  var requestUrl = "http://ws.spotify.com/lookup/1/.json?uri="+spotifyUri+"&extras=album";
  var table = $("#search-result");
  $.ajax({
    type: "GET",
    url: requestUrl
  });
  console.log("artist row got clicked: "+spotifyUri);
  console.log("try this url: "+requestUrl);
}

function handleAlbumRowClick() {
  var spotifyUri = this.id;
  var requestUrl = "http://ws.spotify.com/lookup/1/.json?uri="+spotifyUri+"&extras=track";
  var table = $("#search-result");
  $.ajax({
    type: "GET",
    url: requestUrl
  });
  //$.ajaxSuccess(songResultTable(table, data));
  console.log("album row got clicked: "+spotifyUri);
  console.log("try this url: "+requestUrl);
}

function songResultTable(table, data) {
  $(table).children().remove();
  table.append("<tr><th>#</th><th>Song Title</th><th>Artist</th><th>Album</th></tr>");
  for(var i = 0; i < data.tracks.length; i++){
    var str = "";
    for(var k = 0; k < data.tracks[i].artists.length; k++){
      if(k === data.tracks[i].artists.length - 1){
        str = str+data.tracks[i].artists[k].name;
      }
      else{
        str = str+data.tracks[i].artists[k].name + ", ";
      }
    }
    table.append("<tr id=\""+data.tracks[i].href+"\"><td>"+(i+1)+"</td><td>"+data.tracks[i].name+"</td><td>"+str+"</td><td>"+data.tracks[i].album.name+"</td></tr>");
    // add click handler to the row just added
    table.children().children().last().on("click", addSongToPlaylist);
  }
}

function artistResultTable(table, data) {
  $(table).children().remove();
  table.append("<tr><th>Artist</th></tr>");
  for (var i = 0; i < data.artists.length; i++) {
    artist = data.artists[i];
    table.append("<tr id=\""+artist.href+"\"><td>"+artist.name+"</td>");
    // add click handler to the row just added
    table.children().children().last().on("click", handleArtistRowClick);
  }
}

function albumResultTable(table, data) {
  $(table).children().remove();
  table.append("<tr><th>Album Title</th><th>Artist</th></tr>");
  for (var i = 0; i < data.albums.length; i++) {
    if (data.albums[i].album === undefined) {
      album  = data.albums[i];
    } else {
      album = data.albums[i].album;
    }
    artists = "";
    if (album.artists !== undefined) {
      for (var j = 0; j < album.artists.length; j++) {
        artists = artists + album.artists[j].name;
        if (j < album.artists.length - 1) {
          artists = artists + ", ";
        }
      }
    } else if (album.artist !== undefined) {
      artists = album.artist;
    }
    table.append("<tr id=\""+album.href+"\"><td>"+album.name+"</td><td>"+artists+"</td></tr>");
    // add click handler to the row just added
    table.children().children().last().on("click", handleAlbumRowClick);
  }
}

function handleAjax(data, status, xhr) {
  $("#search-result").remove();
  $('#search').append('<table></table>');
  var table = $('#search').children().last();
  table.attr("id","search-result");
  switch (data.query)
  {
    case "song":
      songResultTable(table, data);
      break;
    case "artist":
      artistResultTable(table, data);
      break;
    case "album":
      albumResultTable(table, data);
      break;
  }
}
function addAjaxSuccess() {
  $(document).ajaxSuccess(function(event, xhr, settings){
    var json_data = JSON.parse(xhr.responseText);
    var table = $("#search-result");
    if (json_data.info.type === "album"){
      // we just did an album lookup, so we want to output the tracks for the album
      var album = {"name":json_data.album.name};
      // add album to each track because songResultTable expects it
      for (var i = 0; i < json_data.album.tracks.length; i++) {
        json_data.album.tracks[i].album = album;
      }
      songResultTable(table, json_data.album);
    } else if (json_data.info.type === "artist"){
      // just did an artist lookup, so output their albums
      albumResultTable(table, json_data.artist);
    }
  });
  $("#song-search").on("ajax:success", function(event, data, status, xhr){
    handleAjax(data, status, xhr);
  });
  $("#song-search").on("ajax:error", function(event, xhr, status, error){
    $("#song-search").append("<p>ERROR</p>");
  });
}

$(document).ready(function() {
  addOnClick();
  addAjaxSuccess();
});


