function PlotRequests()
{
$.getJSON("http://192.168.1.218:5000/songs", function( data ){
  var items = [];
  $.each( data, function( key, val ) {
    items.push( "<li id='" + key + "'>" + val + "</li>" );
  });
  $( "<ul/>", {"class": "my-new-list", html: items.join( "" )}).appendTo( "body" );});
}
