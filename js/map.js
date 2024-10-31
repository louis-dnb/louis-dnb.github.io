'use strict';

import { Position } from './model/Position.js';

// Import controls
import { CollectionControl } from './controls/collection_control.js';
import { CoordinatesControl } from './controls/coordinates_control.js';
import { LocalCoordinatesControl } from './controls/local_coordinates_control.js';
import { RegionBaseCoordinatesControl } from './controls/region_base_coordinates_control.js';
import { GridControl } from './controls/grid_control.js';
// import { LocationLookupControl } from './controls/location_lookup_control.js';
// import { MapLabelControl } from './controls/map_label_control.js';
import { PlaneControl } from './controls/plane_control.js';
import { RegionLabelsControl } from './controls/region_labels_control.js';
import { RegionLookupControl } from './controls/region_lookup_control.js';
import { TitleLabel } from './controls/title_label.js';

$(document).ready(function () {
    const map = L.map.gameMap('map', {
        maxBounds: [
            [-1000, -1000],
            [12800 + 1000, 12800 + 1000],
        ],
        maxBoundsViscosity: 0.5,

        customZoomControl: true,
        fullscreenControl: true,
        planeControl: true,
        positionControl: true,
        messageBox: true,
        rect: true,
        initialMapId: -1,
        plane: 0,
        x: 3200,
        y: 3200,
        minPlane: 0,
        maxPlane: 3,
        minZoom: -4,
        maxZoom: 4,
        doubleClickZoom: false,
        baseMaps: "data_rs3/basemaps.json",
        loadMapData: true,
        showMapBorder: true,
        enableUrlLocation: true,
        baseMaps: 'https://raw.githubusercontent.com/mejrs/data_rs3/master/basemaps.json',
    });

    // Map squares layer
    L.tileLayer.main('https://raw.githubusercontent.com/mejrs/layers_rs3/master/map_squares/{mapId}/{zoom}/{plane}_{x}_{y}.png', {
        minZoom: -4,
        maxNativeZoom: 3,
        maxZoom: 4,
    }).addTo(map);

    // Icons layer
    L.tileLayer.main('https://raw.githubusercontent.com/mejrs/layers_rs3/master/icon_squares/{mapId}/{zoom}/{plane}_{x}_{y}.png', {
        minZoom: -4,
        maxNativeZoom: 3,
        maxZoom: 4,
    }).addTo(map);

    // Zone squares
    //L.tileLayer.main("https://raw.githubusercontent.com/mejrs/layers_rs3/master/zonemap_squares/{mapId}/{zoom}_0_{x}_{y}.png", {
    //    minZoom: -4,
    //    maxNativeZoom: 2,
    //    maxZoom: 4,
    //}).addTo(map);

    map.getContainer().focus();

    map.addControl(new TitleLabel());
    map.addControl(new CoordinatesControl());
    map.addControl(new RegionBaseCoordinatesControl());
    map.addControl(new LocalCoordinatesControl());
    map.addControl(L.control.zoom());
    map.addControl(new PlaneControl());
    // map.addControl(new LocationLookupControl());
    // map.addControl(new MapLabelControl());
    map.addControl(new CollectionControl({ position: 'topright' }));
    map.addControl(new RegionLookupControl());
    map.addControl(new GridControl());
    map.addControl(new RegionLabelsControl());

    let prevMouseRect, prevMousePos;
    map.on('mousemove', function (e) {
        const mousePos = Position.fromLatLng(e.latlng, map.getPlane());

        if (prevMousePos !== mousePos) {
            prevMousePos = mousePos;
            if (prevMouseRect !== undefined) {
                map.removeLayer(prevMouseRect);
            }

            prevMouseRect = mousePos.toLeaflet();
            prevMouseRect.addTo(map);
        }
    });
});
