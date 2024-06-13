'use strict';

export class Position {
    constructor(x, y, plane) {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.plane = plane;
    }

    static fromLatLng(latLng, plane) {
        return new Position(latLng.lng, latLng.lat, plane);
    }

    toLatLng() {
        return Position.toLatLng(this.x, this.y);
    }

    toCentreLatLng() {
        return Position.toLatLng(this.x + 0.5, this.y + 0.5);
    }

    static toLatLng(x, y) {
        return L.latLng(y, x);
    }

    getDistance(position) {
        const diffX = Math.abs(this.x - position.x);
        const diffY = Math.abs(this.y - position.y);
        return Math.sqrt((diffX * diffX) + (diffY * diffY));
    }

    toLeaflet() {
        const startLatLng = this.toLatLng();
        const endLatLng = new Position(this.x + 1, this.y + 1, this.plane).toLatLng();

        return L.rectangle(L.latLngBounds(startLatLng, endLatLng), {
            color: '#33b5e5',
            fillColor: '#33b5e5',
            fillOpacity: 1.0,
            weight: 1,
            interactive: false
        });
    }

    getName() {
        return 'Position';
    }

    equals(position) {
        return this.x === position.x && this.y === position.y && this.plane === position.plane;
    }

    toString() {
        return `(${this.x}, ${this.y}, ${this.plane})`;
    }
}