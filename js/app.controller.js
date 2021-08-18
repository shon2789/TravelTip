import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';

export const appController = {
  renderLocation,
};

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onAddLocation = onAddLocation;
window.gSavedLocs = [];

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready');
    })
    .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onAddMarker() {
  console.log('Adding a marker');
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs);
    document.querySelector('.locs').innerText = JSON.stringify(locs);
  });
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log('User position is:', pos.coords);
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
      mapService.panTo(pos.coords.latitude, pos.coords.longitude);
      const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      mapService.addMarker(loc);
    })
    .catch((err) => {
      console.log('err!!!', err);
    });
}

function onPanTo() {
  const searchLocation = document.querySelector('.location-input').value;
  console.log('Panning the Map');
  mapService.codeAddress(searchLocation, mapService.panTo, renderLocation);
}

function renderLocation(location) {
  document.querySelector('.location').innerText = location;
}

function onAddLocation() {
  const lastPos = mapService.getLastLoc();
  const name = document.querySelector('.location').innerText;
  console.log(name);
   lastPos['name'] = name;
 
    gSavedLocs.push(lastPos);
    renderSavedLocs(gSavedLocs)
 
}

function renderSavedLocs(locations){

    let strHtml = ''

    locations.map(loc => {

      strHtml += `

      <h4>${loc.name}</h4>
      
      <div class="actions">
      <div class="loc-actions">Go</div>
      <div class="loc-actions">Delete</div>
      </div>
      `
    })

    document.querySelector('.locs').innerHTML=strHtml;
}