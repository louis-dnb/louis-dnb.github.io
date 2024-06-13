'use strict';

import { Position } from './model/Position.js';

// Import controls
import { CollectionControl } from './controls/collection_control.js';
import { CoordinatesControl } from './controls/coordinates_control.js';
import { LocalCoordinatesControl } from './controls/local_coordinates_control.js';
import { RegionBaseCoordinatesControl } from './controls/region_base_coordinates_control.js';
import { GridControl } from './controls/grid_control.js';
import { LocationLookupControl } from './controls/location_lookup_control.js';
import { MapLabelControl } from './controls/map_label_control.js';
import { PlaneControl } from './controls/plane_control.js';
import { RegionLabelsControl } from './controls/region_labels_control.js';
import { RegionLookupControl } from './controls/region_lookup_control.js';
import { TitleLabel } from './controls/title_label.js';
import { Region } from './model/Region.js';

$(document).ready(function () {


    const currentUrl = new URL(window.location.href);

    const urlCentreX = currentUrl.searchParams.get("centreX");
    const urlCentreY = currentUrl.searchParams.get("centreY");
    const urlCentreZ = currentUrl.searchParams.get("centreZ");
    const urlZoom = currentUrl.searchParams.get("zoom");

    const urlRegionID = currentUrl.searchParams.get("regionID");

    var map = L.map('map', {
        //maxBounds: L.latLngBounds(L.latLng(-40, -180), L.latLng(85, 153))
        zoomControl: false,
        renderer: L.canvas()
    });

    map.plane = 0;
    map.id = -1;


    map.updateMapPath = function () {
        if (map.tile_layer !== undefined) {
            map.removeLayer(map.tile_layer);
        }

        
        map.tile_layer = L.tileLayer('https://raw.githubusercontent.com/mejrs/layers_rs3/master/mapsquares/' + map.id + '/{z}/' + map.plane + '_{x}_{y}.png', {
            minZoom: 4,
            maxZoom: 11,
            attribution: 'Map data',
            plane: 0,
            noWrap: true,
            tms: true
        });
        map.tile_layer.addTo(map);
        map.invalidateSize();
    }

    map.updateMapPath();
    map.getContainer().focus();

    map.addControl(new TitleLabel());
    map.addControl(new CoordinatesControl());
    map.addControl(new RegionBaseCoordinatesControl());
    map.addControl(new LocalCoordinatesControl());
    map.addControl(L.control.zoom());
    map.addControl(new PlaneControl());
    map.addControl(new LocationLookupControl());
    map.addControl(new MapLabelControl());
    map.addControl(new CollectionControl({ position: 'topright' }));
    map.addControl(new RegionLookupControl());
    map.addControl(new GridControl());
    map.addControl(new RegionLabelsControl());

    var prevMouseRect, prevMousePos;
    map.on('mousemove', function (e) {
        var mousePos = Position.fromLatLng(map, e.latlng, map.plane);

        if (prevMousePos !== mousePos) {

            prevMousePos = mousePos;

            if (prevMouseRect !== undefined) {
                map.removeLayer(prevMouseRect);
            }

            prevMouseRect = mousePos.toLeaflet(map);
            prevMouseRect.addTo(map);
        }
    });

    const setUrlParams = () => {
        const mapCentre = map.getBounds().getCenter()
        const centrePos = Position.fromLatLng(map, mapCentre, map.plane);

        const zoom = map.getZoom();

        window.history.replaceState(null, null, `?centreX=${centrePos.x}&centreY=${centrePos.y}&centreZ=${centrePos.z}&zoom=${zoom}`);
    };

    map.on('move', setUrlParams);
    map.on('zoom', setUrlParams);

    let zoom = 7;
    let centreLatLng = [-79, -137]

    if (urlZoom) {
        zoom = urlZoom;
    }

    if (urlCentreX && urlCentreY && urlCentreZ) {
        const centrePos = new Position(Number(urlCentreX), Number(urlCentreY), Number(urlCentreZ));
        centreLatLng = centrePos.toLatLng(map);
    } else if (urlRegionID) {
        const region = new Region(Number(urlRegionID));
        const centrePos = region.toCentrePosition()
        centreLatLng = centrePos.toLatLng(map);
        zoom = urlZoom || 9;
    }

    map.setView(centreLatLng, zoom)

    /*
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
        baseMaps: "https://raw.githubusercontent.com/mejrs/data_rs3/master/basemaps.json",
        loadMapData: true,
        showMapBorder: true,
        enableUrlLocation: true,
    });

    // Map squares layer
    L.tileLayer.main('https://raw.githubusercontent.com/mejrs/layers_rs3/master/mapsquares/{mapId}/{zoom}/{plane}_{x}_{y}.png', {
        minZoom: -4,
        maxNativeZoom: 3,
        maxZoom: 5,
    }).addTo(map).bringToBack();

    // Icons layer
    L.tileLayer.main('https://raw.githubusercontent.com/mejrs/layers_rs3/master/icon_squares/{mapId}/{zoom}/{plane}_{x}_{y}.png', {
        minZoom: -4,
        maxNativeZoom: 3,
        maxZoom: 5,
    }).addTo(map);

    // Zone squares
    // L.tileLayer.main("https://raw.githubusercontent.com/mejrs/layers_rs3/master/zonemap_squares/{mapId}/{zoom}_0_{x}_{y}.png", {
    //     minZoom: -4,
    //     maxNativeZoom: 2,
    //     maxZoom: 4,
    // }).addTo(map);

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
    */
});
