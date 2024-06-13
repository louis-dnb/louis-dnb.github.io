'use strict';

import {Position} from '../../model/Position.js';
import {OSBotPolyAreaConverter} from '../osbot/osbot_polyarea_converter.js';

export class RSPeerPolyAreaConverter extends OSBotPolyAreaConverter {
    constructor() {
        super();
        this.javaArea = "Area";
        this.javaPosition = "Position";
    }
    
    /*
    API Doc:
        https://rspeer.org/javadocs/org/rspeer/runetek/api/movement/position/Area.html
        https://rspeer.org/javadocs/org/rspeer/runetek/api/movement/position/Position.html

    Area.polygonal(int floorLevel, Position... tiles) 
    Area.polygonal(Position... tiles) 
    
    Position(int worldX, int worldY)
    Position(int worldX, int worldY, int floorLevel)
    */
    fromJava(text, polyarea) {
        polyarea.removeAll();
        text = text.replace(/\s/g, '');

        const floorLevelPattern = `${this.javaArea}\\.polygonal\\((\\d),`;
        let re = new RegExp(floorLevelPattern, 'mg');
        let match = re.exec(text);

        let floorLevel = undefined;
        if (match) {
            floorLevel = match[1];    
        }

        const positionsPattern = `new${this.javaPosition}\\((\\d+,\\d+(?:,\\d)?)\\)`;
        re = new RegExp(positionsPattern, 'mg');
        while ((match = re.exec(text))) {
            const values = match[1].split(',');

            let plane = values.length === 2 ? 0 : values[2];

            if (floorLevel !== undefined) {
                plane = floorLevel;
            }
            
            polyarea.add(new Position(values[0], values[1], plane));
        }
    }
    
    toJava(polyarea) {
        if (polyarea.positions.length === 0) {
            return "";
        }
        let output = `${this.javaArea} area = ${this.javaArea}.polygonal(\n    new ${this.javaPosition}[] {`;
        for (let i = 0; i < polyarea.positions.length; i++) {
            const position = polyarea.positions[i];
            output += `\n        new ${this.javaPosition}(${position.x}, ${position.y}, ${position.plane})`;
            if (i !== polyarea.positions.length - 1) {
                output += ",";
            }
        }
        output += "\n    }\n);";
        return output;
    }
}