'use strict';

export const PlaneControl = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control noselect');
        container.style.background = 'none';
        container.style.width = '70px';
        container.style.height = 'auto';

        const incrementPlaneButton = L.DomUtil.create('a', 'leaflet-bar leaflet-control leaflet-control-custom', container);
        incrementPlaneButton.id = 'increase-level';
        incrementPlaneButton.innerHTML = 'Plane +';
        L.DomEvent.on(incrementPlaneButton, 'click', this._increasePlane, this);

        const decrementPlaneButton = L.DomUtil.create('a', 'leaflet-bar leaflet-control leaflet-control-custom', container);
        decrementPlaneButton.id = 'decrease-level';
        decrementPlaneButton.innerHTML = 'Plane -';
        L.DomEvent.on(decrementPlaneButton, 'click', this._decreasePlane, this);

        L.DomEvent.disableClickPropagation(container);
        return container;
    },

    _increasePlane: function() {
        this._map.setPlane(this._map.getPlane() + 1);
    },

    _decreasePlane: function() {
        this._map.setPlane(this._map.getPlane() - 1);
    },
});