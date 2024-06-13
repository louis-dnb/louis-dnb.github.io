'use strict';

import {Position} from './Position.js';

export const MIN_X = 0, MAX_X = 6400;
export const MIN_Y = 0, MAX_Y = 12800;
export const REGION_WIDTH = 64;
export const REGION_HEIGHT = 64;

export class Region {
    constructor(id) {
        this.id = id;
    }

	static fromPosition(position) {
	    return Region.fromCoordinates(position.x, position.y);
	}
	
    static fromCoordinates(x, y) {
		const regionID = (x >> 6) * 128 + (y >> 6);
	    return new Region(regionID);
	}
	
    toCentrePosition() {
        const position = this.toPosition();
        position.x += REGION_WIDTH / 2;
        position.y += REGION_HEIGHT / 2;
        return position;
    }
    
	toPosition() {
		const x = (this.id >> 7) << 6;
		const y = (this.id & 0xFF) << 6;
		return new Position(x, y, 0);
	}
}