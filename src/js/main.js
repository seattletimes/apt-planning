//load our custom elements
require("component-leaflet-map");
require("component-responsive-frame");

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

//ICH code for popup template if needed----------

var data = require("./apt-map.geo.json");
var mapElement = document.querySelector("leaflet-map");

if (mapElement) {
    var L = mapElement.leaflet;
    var map = mapElement.map;
  
    map.scrollWheelZoom.disable();
  
    var focused = false;
  
    var year = "planned";
  
    var commafy = s => (s * 1).toLocaleString().replace(/\.0+$/, "");
  
    var onEachFeature = function(feature, layer) {
      // var breakdown = breakdownData[feature.properties.BEAT]
      layer.bindPopup("", {
        minWidth: 200
      });
      layer.on({
        popupopen: function(e) {
          e.popup.setContent(`
  <h4>${feature.properties.city}</h4>
  Planned apartments: ${commafy(feature.properties.planned)}<br>
  Currently under construction: ${commafy(feature.properties.construction)}<br>
          `);
          layer.setStyle({ weight: 2, fillOpacity: 1 });
        },
        mouseover: function(e) {
          layer.setStyle({ weight: 2, fillOpacity: 1 });
        },
        mouseout: function(e) {
          if (focused && focused == layer) { return }
          layer.setStyle({ weight: 0.5, fillOpacity: 0.5 });
        }
      });
    };
  
    map.on("popupclose", function() {
      if (focused) {
        focused.setStyle({ weight: 0.5, fillOpacity: 0.7 });
        focused = false;
      }
    });
  
    var getColor = function(d) {
      var value = d[year];
      if (typeof value == "string") {
        value = Number(value.replace(/,/, ""));
      }
      console.log(value)
      if (typeof value != "undefined") {
        // condition ? if-true : if-false;
       return value >= 2001 ? '#081d58' :
               value >= 1001 ? '#135699' :
               value >= 501 ? '#1d91c0' :
               value >= 101 ? '#66ccb2' :
               '#d2e8c4' ;
      } else {
        return "gray"
      }
    };
  
    var style = function(feature) {
      var s = {
        fillColor: getColor(feature.properties),
        weight: 0.5,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.5
      };
      return s;
    }
  
    var geojson = L.geoJson(data, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);
  
  }
  
   map.scrollWheelZoom.disable();

// Add city/neighborhood labels above tracts
var topLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
    opacity: 0.6,
    pane: "markerPane",
  }).addTo(map);