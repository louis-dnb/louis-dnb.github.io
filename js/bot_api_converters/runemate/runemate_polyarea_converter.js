'use strict';

import {Position} from '../../model/Position.js';
import {OSBotPolyAreaConverter} from '../osbot/osbot_polyarea_converter.js';

export class RuneMatePolyAreaConverter extends OSBotPolyAreaConverter {
    constructor() {
        super();
        this.javaArea = "Area";
        this.javaPosition = "Coordinate";
    }
    
    fromJava(text, polyarea) {
        polyarea.removeAll();
        text = text.replace(/\s/g, '');

        const positionsPattern = `new${this.javaPosition}\\((\\d+,\\d+(?:,\\d)?)\\)`;
        const re = new RegExp(positionsPattern, 'mg');
        let match;
        while ((match = re.exec(text))) {
            const values = match[1].split(',');

            const plane = values.length === 2 ? 0 : values[2];

            polyarea.add(new Position(values[0], values[1], plane));
        }
    }
    
    toJava(polyarea) {
        if (polyarea.positions.length === 0) {
            return "";
        }
        let output = `${this.javaArea} area = new ${this.javaArea}.Polygonal(`;
        for (let i = 0; i < polyarea.positions.length; i++) {
            const position = polyarea.positions[i];
            output += `\n    new ${this.javaPosition}(${position.x}, ${position.y}, ${position.plane})`;
            if (i !== polyarea.positions.length - 1) {
                output += ",";
            }
        }
        output += "\n);";
        return output;
    }
}