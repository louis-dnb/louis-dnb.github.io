'use strict';

import {Position} from '../../model/Position.js';
import {OSBotPolyAreaConverter} from '../osbot/osbot_polyarea_converter.js';

export class TRiBotPolyAreaConverter extends OSBotPolyAreaConverter {
    constructor() {
        super();
        this.javaArea = "RSArea";
        this.javaPosition = "RSTile";
    }
    
    /*
    API Doc:
        https://tribot.org/doc/org/tribot/api2007/types/RSTile.html
        https://tribot.org/doc/org/tribot/api2007/types/RSArea.html
      
        RSArea(Positionable[] tiles)
    */
    fromJava(text, polyarea) {
        polyarea.removeAll();
        text = text.replace(/\s/g, '');

        const positionsPattern = `new${this.javaPosition}\\((\\d+),(\\d+),(\\d)\\)`;
        const re = new RegExp(positionsPattern, 'mg');
        let match;
        while ((match = re.exec(text))) {
            polyarea.add(new Position(match[1], match[2], match[3]));
        }
    }
    
    toJava(polyarea) {
        if (polyarea.positions.length === 0) {
            return "";
        }
        let output = `${this.javaArea} area = new ${this.javaArea}(\n    new ${this.javaPosition}[] {`;
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