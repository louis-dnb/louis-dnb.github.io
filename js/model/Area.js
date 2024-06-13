'use strict';

import {Position} from './Position.js';

export class Area {
    constructor(startPosition, endPosition) {
        this.startPosition = startPosition;
        this.endPosition = endPosition;
    }

    static fromBounds(bounds) {
        return new Area(
            Position.fromLatLng(bounds.getSouthWest()),
            Position.fromLatLng(bounds.getNorthEast())
        );
    }

    toLeaflet() {
        const newStartPosition = new Position(this.startPosition.x, this.startPosition.y, this.startPosition.plane);
        const newEndPosition = new Position(this.endPosition.x, this.endPosition.y, this.startPosition.plane);

        if (this.endPosition.x >= this.startPosition.x) {
            newEndPosition.x += 1;
        } else {
            newStartPosition.x += 1;
        }

        if (this.endPosition.y >= this.startPosition.y) {
            newEndPosition.y += 1;
        } else {
            newStartPosition.y += 1;
        }

        return L.rectangle(
            L.latLngBounds(
                newStartPosition.toLatLng(),
                newEndPosition.toLatLng()
            ), {
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