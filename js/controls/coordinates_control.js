'use strict';

import {Position} from '../model/Position.js';

export const CoordinatesControl = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        container.id = 'coordinates-container';
        container.style.height = 'auto';
        L.DomEvent.disableClickPropagation(container);

        const coordinatesForm = L.DomUtil.create('form', 'leaflet-bar leaflet-control leaflet-control-custom form-inline', container);
        const formGroup = L.DomUtil.create('div', 'form-group', coordinatesForm);
        this._xCoordInput = this._createInput("xCoord", "x", formGroup);
        this._yCoordInput = this._createInput("yCoord", "y", formGroup);
        this._planeCoordInput = this._createInput("planeCoord", "plane", formGroup);

        L.DomEvent.on(this._map, 'mousemove', this._setMousePositionCoordinates, this);

        return container;
    },

    _createInput: function(id, title, container, keyupFunc) {
        const coordInput = L.DomUtil.create('input', 'form-control coord', container);
        coordInput.type = 'text';
        coordInput.id = id;

        L.DomEvent.disableClickPropagation(coordInput);
        L.DomEvent.on(coordInput, 'keyup', this._goToCoordinates, this);
        return coordInput;
    },

    _goToCoordinates: function() {
        const x = this._xCoordInput.value;
        const y = this._yCoordInput.value;
        const plane = this._planeCoordInput.value;

        if (!$.isNumeric(x) || !$.isNumeric(y) || !$.isNumeric(plane)) {
            return;
        }

        if (this._searchMarker !== undefined) {
            this._map.removeLayer(this._searchMarker);
        }

        this._searchMarker = new L.marker(new Position(x, y, plane).toCentreLatLng());
		this._searchMarker.once('click', (e) => this._map.removeLayer(this._searchMarker));
		
        this._searchMarker.addTo(this._map);

        this._map.panTo(this._searchMarker.getLatLng());
        this._map.setPlane(plane);
    },

    _setMousePositionCoordinates: function(e) {
		if (this._map.getContainer() !== document.activeElement) {
			return;
		}
		
        const mousePos = Position.fromLatLng(e.latlng, this._map.getPlane());
        this._xCoordInput.value = mousePos.x;
        this._yCoordInput.value = mousePos.y;
        this._planeCoordInput.value = mousePos.plane;
    }
});