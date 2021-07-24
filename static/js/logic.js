// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
    center: [0, 0],
    zoom: 3
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Creating function for color coding earthquake dots

function quakeColor(depth) {
    if (depth >= 100) {
        return "maroon"
    } else if (depth >= 75) {
        return "red"
    } else if (depth >= 50) {
        return "orange"
    } else if (depth >= 25) {
        return "yellow"
    } else if (depth >= 10) {
        return "green"
    } else {
        return "blue"
    }
}


// Promise function
d3.json(url).then(data => {

    console.log(data);

    data.features.forEach(element => {

    //   assigning coordinates to variables

        var lon = element.geometry.coordinates[0];
        var lat = element.geometry.coordinates[1];
        var depth = element.geometry.coordinates[2];
        var magnitude = element.properties.mag;
        
        if(lon){
            var circle = L.circle([lat, lon], {
                color: quakeColor(depth),
                fillColor: quakeColor(depth),
                fillOpacity: 0.5,
                radius: magnitude * 20000,
            }).addTo(myMap);
            circle.bindPopup(`<p>Latitude: ${lat}</p> <p>Longitude: ${lon}</p> <p>Depth: ${depth} km</p> <p>Magnitude: ${magnitude}</p>`)
        }
    });

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = [100, 75, 50, 25, 10, 0];
        var colors = ["maroon", "red", "orange", "yellow", "green", "blue"]
        var labels = [];

    // Add min & max
    var legendInfo = "<h3>Eathquake Depth (km)</h3>" +
      "<div class=\"container\">" +
      "<div class=\"row\">" +

        "<div class=\"col-md-9\">" + limits[0] + "</div>" +
        "<div class=\"col-md-3\" style=\"background-color: "  + colors[0] + "\"></div>" +
        
        "<div class=\"col-md-9\">" + limits[1] + "</div>" +
        "<div class=\"col-md-3\" style=\"background-color: "  + colors[1] + "\"></div>" +

        "<div class=\"col-md-9\">" + limits[2] + "</div>" +
        "<div class=\"col-md-3\" style=\"background-color: "  + colors[2] + "\"></div>" +

        "<div class=\"col-md-9\">" + limits[3] + "</div>" +
        "<div class=\"col-md-3\" style=\"background-color: "  + colors[3] + "\"></div>" +

        "<div class=\"col-md-9\">" + limits[4] + "</div>" +
        "<div class=\"col-md-3\" style=\"background-color: "  + colors[4] + "\"></div>" +

        "<div class=\"col-md-9\">" + limits[5] + "</div>" +
        "<div class=\"col-md-3\" style=\"background-color: "  + colors[5] + "\"></div>" +
     
      "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

    // Adding legend to the map
    legend.addTo(myMap);


});


