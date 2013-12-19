$(document).ready(function() {
  $.getJSON('http://localhost:9292/api/map_data.json', function(data) {
    window.data = data;
  });
});
