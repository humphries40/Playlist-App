// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/
// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/
$(document).ready(function() {
  $("#friend-search").on("ajax:success", function(e, data, status, xhr){
    $("#friend-result").remove();
    $("#findFriends").append('<table></table>');
    table = $("#findFriends").children().last();
    table.append("<tr><th>Name</th><th>Favorite Band</th><th>Favorite Song</th><th>Follow</th></tr>");
    table.attr("id","friend-result")
    for(i = 0; i < data.length; i++){
      table.append("<tr><td>"+data[i].name+"</td><td>"+data[i].favBand+"</td><td>"+data[i].favSong+"</td><td>"+"<a href=" + '"' + "/users/" +data[i].id + '"' + ">View Profile</a>" + "</td></tr>");
    }
  }).bind("ajax:error", function(e, xhr, status, error){
    $("#friend-search").append("<p>ERROR</p>");
  });
});



	
