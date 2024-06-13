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
    L.TileLayer.Main = L.TileLayer.extend({
        initialize(url, options) {
            this._url = url;
            L.setOptions(this, options);
        },

        getTileUrl(coords) {
            return L.Util.template(this._url, {
                source: this.options.source,
                mapId: this._map._mapId,
                zoom: coords.z,
                plane: this._map._plane || 0,
                x: coords.x,
                y: -(1 + coords.y),
            });
        },

        // Suppress 404 errors for loading tiles
        // These are expected as trivial tiles are not included to save on storage space
        createTile(coords, done) {
            let tile = L.TileLayer.prototype.createTile.call(this, coords, done);
            tile.onerror = error => error.preventDefault();
            return tile;
        },

        // "fix" for flickering:
        //
        // https://github.com/Leaflet/Leaflet/issues/6659
        // using impl from https://gist.github.com/barryhunter/e42f0c4756e34d5d07db4a170c7ec680
        _refreshTileUrl: function(layer, tile, url, sentinel1, sentinel2) {
            return new Promise((resolve, _reject) => {
                //use a image in background, so that only replace the actual tile, once image is loaded in cache!
                let img = new Image();

                img.onload = () => {
                    L.Util.requestAnimFrame(() => {
                        if (sentinel1 === sentinel2) {
                            let el = tile.el;
                            el.onload = resolve;
                            el.onerror = resolve;

                            el.src = url;
                        } else {
                            resolve();
                            // a newer map is already loading, do nothing
                        }
                    });
                };
                img.onerror = () => {
                    L.Util.requestAnimFrame(() => {
                        if (sentinel1 === sentinel2 && tile.el.src !== this.options.resolved_error_url) {
                            let el = tile.el;
                            el.onload = resolve;
                            el.onerror = resolve;

                            el.src = layer.errorTileUrl;
                        } else {
                            resolve();
                            // a newer map is already loading, do nothing
                        }
                    });
                };
                img.src = url;
            });
        },

        refresh: async function(sentinel) {
            let sentinel_ref = `${sentinel}`;

            let pending_states = [];

            for (let tile of Object.values(this._tiles)) {
                if (tile.current && tile.active) {
                    let newsrc = this.getTileUrl(tile.coords);
                    let state = this._refreshTileUrl(this, tile, newsrc, sentinel, sentinel_ref);
                    pending_states.push(state);
                }
            }

            await Promise.allSettled(pending_states);
        },
    });

    L.tileLayer.main = (url, options) => new L.TileLayer.Main(url, options);
}, window));