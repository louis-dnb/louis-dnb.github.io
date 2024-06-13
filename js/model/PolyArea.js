'use strict';

export class PolyArea {
    constructor() {
        this.positions = [];
        this.polygon = undefined;
        this.featureGroup = new L.FeatureGroup();
    }

    add(position) {
        this.positions.push(position);
        this.featureGroup.removeLayer(this.polygon);
        this.polygon = this.toLeaflet();
        this.featureGroup.addLayer(this.polygon);
    }
    
    addAll(positions) {
        for (let i = 0; i < positions.length; i ++) {
            this.positions.push(positions[i]);
        }
        this.featureGroup.removeLayer(this.polygon);
        this.polygon = this.toLeaflet();
        this.featureGroup.addLayer(this.polygon);
    }

    removeLast() {
        if (this.positions.length > 0) {
            this.positions.pop();
            this.featureGroup.removeLayer(this.polygon);
        }

        if (this.positions.length === 0) {
            this.polygon = undefined;
        } else {
            this.polygon = this.toLeaflet();
            this.featureGroup.addLayer(this.polygon);
        }
    }

    removeAll() {
        this.positions = [];
        this.featureGroup.removeLayer(this.polygon);
        this.polygon = undefined;
    }
    
    isEmpty() {
        return this.positions.length === 0;
    }

    toLeaflet() {
        const latLngs = [];
        for (let i = 0; i < this.positions.length; i++) {
            latLngs.push(this.positions[i].toCentreLatLng());
        }
        return L.polygon(
            latLngs, {
                color: "#33b5e5",
                weight: 1,
                interactive: false
            }
        );
    }
    
    getName() {
        return "Area";
    }
}