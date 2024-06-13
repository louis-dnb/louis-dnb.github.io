'use strict';

export class Areas {
    constructor() {
        this.featureGroup = new L.FeatureGroup();
        this.areas = [];
        this.rectangles = [];
    }

    add(area) {
        this.areas.push(area);
        const rectangle = area.toLeaflet();
        this.rectangles.push(rectangle);
        this.featureGroup.addLayer(rectangle);
    }

    removeLast() {
        if (this.areas.length > 0) {
            this.areas.pop();
            this.featureGroup.removeLayer(this.rectangles.pop());
        }
    }

    removeAll() {
        while (this.areas.length > 0) {
            this.areas.pop();
            this.featureGroup.removeLayer(this.rectangles.pop());
        }
    }
}