let map, start, end, route;
let choosePoint = "start";
let markers = [];
const geofenceColor = "#FF0000";
const pathColor = "#1e25eb";

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: centerNode,
    zoom: 17,
  });

  // Construct the geofence
  const geofence = new google.maps.Polygon({
    paths: listNodeGeofence,
    strokeColor: geofenceColor,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: geofenceColor,
    fillOpacity: 0.25,
  });
  geofence.setMap(map);

  // Click geofence
  geofence.addListener("click", (geofenceMouseClick) => {
    if (choosePoint === "start") {
      if (route) route.setMap(null);
      if (start) removeMarker("start");
      start = geofenceMouseClick.latLng.toJSON();
      createMarker(start, "S");
      choosePoint = "end";
    } else if (choosePoint === "end") {
      if (end) removeMarker("end");
      end = geofenceMouseClick.latLng.toJSON();
      createMarker(end, "E");
      choosePoint = "start";
      const path = findPath(start, end);
      drawPath(path);
    }
  });

  // Create marker
  function createMarker(position, label = "") {
    const marker = new google.maps.Marker({
      position: position,
      map,
      label: label,
    });
    if (label === "S") markers[0] = marker;
    else if (label === "E") markers[1] = marker;
  }

  // Remove marker
  function removeMarker(markerName) {
    if (markerName === "start") {
      markers[0].setMap(null);
      markers[0] = null;
    } else if (markerName === "end") {
      markers[1].setMap(null);
      markers[1] = null;
    }
  }

  // Draw path
  function drawPath(path) {
    route = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: pathColor,
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    route.setMap(map);
  }

  // Click outside
  map.addListener("click", (mapsMouseEvent) => {
    alert("Vui lòng chọn trong khu vực phường Thanh Nhàn");
  });
}
