let map, start, end, route;
let choosePoint = "start";
let markers = [];
let allNodeMarkers = [];
const geofenceColor = "#FF0000";
const pathColor = "#1e25eb";

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: centerNode,
    zoom: 17,
  });

  const geocoder = new google.maps.Geocoder();
  const infowindowStart = new google.maps.InfoWindow();
  const infowindowEnd = new google.maps.InfoWindow();

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
    if (allNodeMarkers.length !== 0) {
      siiimpleToast.alert("Bạn phải ẩn tất cả các node để tìm đường", {duration: 3000});
      return;
    }
    if (choosePoint === "start") {
      if (route) {
        removePath();
        clearPathMarker();
      }
      start = geofenceMouseClick.latLng.toJSON();
      createMarker(start, "S");
      choosePoint = "end";
    } else if (choosePoint === "end") {
      end = geofenceMouseClick.latLng.toJSON();
      createMarker(end, "E");
      choosePoint = "start";
      const path = findPath(start, end);
      drawPath(path);
      siiimpleToast.success(`Đề xuất đường đi qua ${path.length - 2} Node`, {
        duration: 4000,
      });
    }
  });

  // Create marker
  function createMarker(position, label = "") {
    geocoder.geocode({ location: position }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          const marker = new google.maps.Marker({
            position: position,
            map,
            label: label,
          });
          if (label === "S") {
            markers[0] = marker;
            infowindowStart.setContent(results[0].formatted_address);
            infowindowStart.open(map, marker);
          } else if (label === "E") {
            markers[1] = marker;
            infowindowEnd.setContent(results[0].formatted_address);
            infowindowEnd.open(map, marker);
          }
        }
      }
    });
  }

  function clearPathMarker() {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
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

  // Remove path
  function removePath() {
    if (route) route.setMap(null);
  }

  // Click outside
  map.addListener("click", () => {
    siiimpleToast.alert("Vui lòng chọn trong khu vực phường Thanh Nhàn");
  });

  // Show all node
  document.querySelector("#btn-display").addEventListener("click", () => {
    removePath();
    clearPathMarker();
    choosePoint = "start";
    if (allNodeMarkers.length === 0) {
      for (let i = 0; i < listNode.length; i++) {
        const marker = new google.maps.Marker({
          position: listNode[i],
          map,
          label: `${i + 1}`,
        });
        allNodeMarkers.push(marker);
      }
      siiimpleToast.message(`Show all ${listNode.length} nodes`, {duration: 4000});
      document.querySelector("#btn-display").innerHTML = "Hide all nodes";
    } else {
      for (let i = 0; i < allNodeMarkers.length; i++) {
        allNodeMarkers[i].setMap(null);
      }
      allNodeMarkers = [];
      siiimpleToast.message(`Hide all ${listNode.length} nodes`, {duration: 4000});
      document.querySelector("#btn-display").innerHTML = "Show all nodes";
    }
  });
}
