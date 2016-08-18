// Template by http://github.com/jackdougherty/leaflet-map/
// See Leaflet tutorial links in README.md

// set up the map center and zoom level
var map = L.map('map', {
  center: [41.766943, -72.728678], // [41.5, -72.7] for Connecticut; [41.76, -72.67] for Hartford county or city
  maxZoom: 19, // limitation is OpenStreetMap layer
  zoom: 19,
  zoomControl: false, // add later to reposition
  scrollWheelZoom: false
});

// optional : customize link to view source code; add your own GitHub repository
map.attributionControl
.setPrefix('View <a href="http://github.com/jackdougherty/leaflet-map-flickr-precision">code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');

L.control.scale().addTo(map);

// REMOVE AFTER MAP CONSTRUCTION: optional Zoom Label (also in index.html)
L.control.zoomLabel().addTo(map);

// Reposition zoom control other than default topleft
L.control.zoom({position: "topright"}).addTo(map);

// optional: add legend to toggle any baselayers and/or overlays
// global variable with (null, null) allows indiv layers to be added inside functions below
var controlLayers = L.control.layers( null, null, {
  position: "bottomright", // suggested: bottomright for CT (in Long Island Sound); topleft for Hartford region
  collapsed: false // false = open by default
}).addTo(map);

// REMOVE AFTER MAP CONSTRUCTION: optional Coordinate Control (also in index.html)
var c = new L.Control.Coordinates();
c.addTo(map);
map.on('click', function(e) {
    c.setCoordinates(e);
});

/* BASELAYERS */
// use common baselayers below, delete, or add more with plain JavaScript from http://leaflet-extras.github.io/leaflet-providers/preview/
// .addTo(map); -- suffix displays baselayer by default
// controlLayers.addBaseLayer (variableName, 'label'); -- adds baselayer and label to legend; omit if only one baselayer with no toggle desired

var OpenStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19, // limitation of source
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

/* POINT OVERLAYS */
// ways to load point map data from different sources: coordinates in the code, GeoJSON in local directory, remote GeoJSON and JSON


// Flickr photo overlay from remote JSON API feed, such as all Flickr public photos OR only from your account
// Obtain and insert your own flickr API key
// https://www.flickr.com/services/apps/create/
// Use Flickr API explorer to obtain correct endpoint
// https://www.flickr.com/services/api/explore/?method=flickr.photos.search
// Example shows photos.search of georeferenced images using keyword tags
// https://www.flickr.com/services/api/explore/flickr.photos.search

// Define flickrURL endpoint with API explorer: insert your key, and tags= or text= to filter results
var flickrURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=25dcc9a8c7410551dcb0af48c778bde5&user_id=56513965%40N06&tags=cemetery&extras=geo%2Curl_t%2Curl_s%2Curl_m%2Ctitle&format=json&nojsoncallback=1";

// Define the flickr popup display
// ** TO DO: Rewrite link to view original source photo directly on Flickr
// ** POSSIBLY include this code directly in the functions below for easier sequencing by novices
var popupHTML = function(photo){
  var result = "";
      result = '<strong>'+photo.title+'</strong><br>';
      result += '<a href="'+photo.url_m+'" target="_blank">';
      result += '<img src="'+photo.url_s+'"></a>';      //was url_t; want url_s; can change to url_m if desired, but frame needs work
      result += '<small>click image to enlarge in new tab</small>';
      return result;
}
// Load photos from flickr JSON feed (insert your flickrURL above), display with clickable blue markers
$.getJSON(flickrURL, function (data) {
  // Create new layerGroup for the markers, with option to append ".addTo(map);" to display by default
  var layerGroup = new L.LayerGroup().addTo(map);
  // Add layerGroup to your layer control and insert your label to appear in legend
  controlLayers.addBaseLayer(layerGroup, 'Flickr photo blue markers'); // Insert your own legend label
  // Start a loop to insert flickr photo data into photoContent
  for (var i = 0; i < data.photos.photo.length; i++) {
    var photoContent = data.photos.photo[i];
    var marker = new L.marker([photoContent.latitude, photoContent.longitude]);
    marker.bindPopup(popupHTML(photoContent));
    // Add the marker to the layerGroup
    marker.addTo(layerGroup);
  }
});

// Load photos from flickr JSON (insert your flickrURL above), display with clickable photo thumbnails
$.getJSON(flickrURL, function (data) {
  // Create new layerGroup for the markers, with option to append ".addTo(map);" to display by default
  var layerGroup = new L.LayerGroup();
  // Add layerGroup to your layer control and insert your label to appear in legend
  controlLayers.addBaseLayer(layerGroup, 'Flickr photo thumbnail icons');
  // Start a loop to insert flickr photo data into photoContent
  for (var i = 0; i < data.photos.photo.length; i++) {
    var photoContent = data.photos.photo[i];
    var photoIcon = L.icon(
      {iconUrl: photoContent.url_t,
      iconSize: [photoContent.width_t * 0.5, photoContent.height_t * 0.5]}  //reduces thumbnails 50%
    );
    var marker = new L.marker([photoContent.latitude, photoContent.longitude], {icon: photoIcon});
    marker.bindPopup(popupHTML(photoContent));
    // Add the marker to the layerGroup
    marker.addTo(layerGroup);
  }
});
