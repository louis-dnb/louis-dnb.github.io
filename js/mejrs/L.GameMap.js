'use strict';

// From https://github.com/Leaflet/Leaflet/blob/main/PLUGIN-GUIDE.md#module-loaders
(function(factory, window) {
    // define an AMD module that relies on 'leaflet'
    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], factory);

        // define a Common JS module that relies on 'leaflet'
    } else if (typeof exports === 'object') {
        module.exports = factory(require('leaflet'));
    }

    // attach your plugin to the global 'L' variable
    if (typeof window !== 'undefined' && window.L) {
        factory(L);
    }
}(function(L) {
    L.Map.GameMap = L.Map.extend({
        initialize: function(id, options) { // (HTMLElement or String, Object)
            // Parse URL for search
            let parsedUrl = new URL(window.location.href);
            options.zoom = Number(parsedUrl.searchParams.get('zoom') || parsedUrl.searchParams.get('z') || this._limitZoom(options.zoom) || 0);
            this._plane = Number(parsedUrl.searchParams.get('plane') || parsedUrl.searchParams.get('p') || this._limitPlane(options.plane) || 0);
            this._mapId = Number(parsedUrl.searchParams.get('mapId') || parsedUrl.searchParams.get('mapid') || parsedUrl.searchParams.get('m') || options.initialMapId || -1);
            options.x = Number(parsedUrl.searchParams.get('x')) || options.x || 3232;
            options.y = Number(parsedUrl.searchParams.get('y')) || options.y || 3232;
            options.center = [options.y, options.x];
            options.crs = L.CRS.Simple;

            // Call parent constructor
            L.Map.prototype.initialize.call(this, id, options);

            // Update url once we move, change plane or change map id
            this.on('moveend planechange mapidchange', this.setSearchParams);

            // Fetch base maps and use it to add a border around the current map id
            if (this.options.baseMaps) {
                fetch(this.options.baseMaps).then(response => response.json()).then(data => {
                    this._baseMaps = Array.isArray(data) ? this.createBaseMapsObject(data) : data;
                    this._allowedMapIds = Object.keys(this._baseMaps).map(Number);
                    let bounds = this.getMapIdBounds(this._mapId);

                    if (options.showMapBorder) {
                        this.boundsRect = L.rectangle(bounds, {
                            color: '#ffffff',
                            weight: 1,
                            fill: false,
                            smoothFactor: 1,
                        }).addTo(this);
                    }

                    let paddedBounds = bounds.pad(0.1);
                    this.setMaxBounds(paddedBounds);
                });
            }
        },

        createBaseMapsObject: function(data) {
            let baseMaps = {};
            for (let i in data) {
                baseMaps[data[i].mapId] = data[i];
            }
            return baseMaps;
        },

        setSearchParams: function(e, parameters = {
            m: this._mapId,
            z: this._zoom,
            p: this._plane,
            x: Math.round(this.getCenter().lng),
            y: Math.round(this.getCenter().lat),
        }) {
            let url = new URL(window.location.href);
            let params = url.searchParams;

            for (const param in ['mapId', 'mapid', 'zoom', 'plane']) {
                params.delete(param);
            }

            for (let [key, value] of Object.entries(parameters)) {
                params.set(key, value);
            }
            url.search = params;
            history.replaceState(0, 'Location', url);
        },

        _limitPlane: function(plane) {
            var min = this.getMinPlane();
            var max = this.getMaxPlane();
            return Math.max(min, Math.min(max, plane));
        },

        _validateMapId: function(_mapId) {
            const parsedMapId = parseInt(_mapId);
            if (!this._allowedMapIds) {
                console.error('No basemaps found');
                return this._mapId;
            } else if (this._allowedMapIds.includes(parsedMapId)) {
                return parsedMapId;
            } else {
                console.warn('Not a valid mapId');
                return this._mapId;
            }
        },

        getPlane: function() {
            return this._plane;
        },

        getMapId: function() {
            return this._mapId;
        },

        getMinPlane: function() {
            return this.options.minPlane || 0;
        },

        getMaxPlane: function() {
            return this.options.maxPlane || 3;
        },

        setPlane: function(_plane) {
            let newPlane = this._limitPlane(_plane);
            let oldPlane = this._plane;
            if (oldPlane !== newPlane) {
                this.fire('preplanechange', {
                    oldPlane: oldPlane,
                    newPlane: newPlane,
                });
                this.fire('viewprereset');
                this._plane = newPlane;
                this.fire('viewreset');
                this.fire('planechange', {
                    oldPlane: oldPlane,
                    newPlane: newPlane,
                });
                return this;
            }
        },

        setMapId: function(_mapId) {
            let newMapId = this._validateMapId(_mapId);
            let oldMapId = this._mapId;
            if (oldMapId !== newMapId) {

                this.fire('premapidchange', {
                    oldMapId: oldMapId,
                    newMapId: newMapId,
                });
                this.fire('viewprereset');
                this._mapId = newMapId;

                this.fire('viewreset');
                this.fire('mapidchange', {
                    oldMapId: oldMapId,
                    newMapId: newMapId,
                });
                this.setMapIdBounds(newMapId);

                return this;
            }
        },

        getMapIdBounds: function(mapId) {
            let [[west, south], [east, north]] = this._baseMaps[mapId].bounds;
            return L.latLngBounds([[south, west], [north, east]]);
        },

        setMapIdBounds: function(newMapId) {
            let bounds = this.getMapIdBounds(newMapId);

            if (this.options.showMapBorder) {
                this.boundsRect.setBounds(bounds);
            }

            let paddedBounds = bounds.pad(0.1);
            this.setMaxBounds(paddedBounds);

            this.fitWorld(bounds);
        },
    });

    L.map.gameMap = function(id, options) {
        return new L.Map.GameMap(id, options);
    };
}, window));
