'use strict';

export class Path {
    constructor() {
        this.featureGroup = new L.FeatureGroup();
        this.positions = [];
        this.lines = [];
        this.rectangles = [];
    }

    add(position) {
        this.positions.push(position);
        const rectangle = position.toLeaflet();
        this.featureGroup.addLayer(rectangle);
        this.rectangles.push(rectangle);

        if (this.positions.length > 1) {
            this.lines.push(this.createPolyline(this.positions[this.positions.length - 2], this.positions[this.positions.length - 1]));
            this.featureGroup.addLayer(this.lines[this.lines.length - 1]);
        }
    }

    removeLast() {
        if (this.positions.length > 0) this.featureGroup.removeLayer(this.positions.pop());
        if (this.lines.length > 0) this.featureGroup.removeLayer(this.lines.pop());
        if (this.rectangles.length > 0) this.featureGroup.removeLayer(this.rectangles.pop());
    }

    removeAll() {
        while (this.positions.length > 0) this.featureGroup.removeLayer(this.positions.pop());
        while (this.rectangles.length > 0) this.featureGroup.removeLayer(this.rectangles.pop());
        while (this.lines.length > 0) this.featureGroup.removeLayer(this.lines.pop());
    }

    createPolyline(startPosition, endPosition) {
        return L.polyline([startPosition.toCentreLatLng(), endPosition.toCentreLatLng()], {clickable: false});
    }
}