
var currentMarkers = [];

var bikeIcon = L.icon( {
    iconUrl: 'static/images/marker-bike.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
		className: 'map-marker-bike',
} );

var bikeMap = new L.map( 'map', { zoomControl: false } ).setView( [52.468209, 13.425995], 3 );

L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
} ).addTo( bikeMap );

new L.Control.Zoom( { position: 'bottomleft' } ).addTo( bikeMap );
new L.Hash( bikeMap );

function setNewLocations( locationsArray ) {

    //remove old markers
    currentMarkers.forEach( function ( marker ) {
        bikeMap.removeLayer( marker )
    } );

    //add new markes
    locationsArray.forEach( function ( coordinate ) {
        var marker = L.marker( [coordinate.latitude, coordinate.longitude], {icon: bikeIcon} ).addTo( bikeMap );
        currentMarkers.push( marker );

    } );
};

function countMarkerInView() {
  var counter = 0;
  bikeMap.eachLayer( function(layer) {
    if(layer instanceof L.Marker) {
      if(bikeMap.getBounds().contains(layer.getLatLng())) {
        counter++;
      }
    }
  });
  return counter;
};

var refreshLocationsFromServer = function () {
    $.getJSON( "https://api.criticalmaps.net/postv2", function ( data ) {

        locationsArray = [];

        var locations = data.locations;

        for ( var key in locations ) {
            if ( locations.hasOwnProperty( key ) ) {
                var currentLocation = locations[key];
                var coordinate = {
                    latitude: criticalMapsUtils.convertCoordinateFormat( currentLocation.latitude ),
                    longitude: criticalMapsUtils.convertCoordinateFormat( currentLocation.longitude )
                }
                locationsArray.push( coordinate );
                console.log( "new coords: " + JSON.stringify( coordinate ) + " " + new Date().toString() );
            }
        }

        setNewLocations( locationsArray );
    } );
}
setInterval( function () {
    refreshLocationsFromServer();
    var nBikes = countMarkerInView();
    document.getElementById("countertitle").innerHTML = "Number bikes: " + nBikes;
  }, 2000 );

refreshLocationsFromServer();
