'use strict';

import {Position} from '../../model/Position.js';
import {OSBotConverter} from './osbot_converter.js';

export class OSBotPolyAreaConverter extends OSBotConverter {
    /*
    API Doc:
        https://osbot.org/api/org/osbot/rs07/api/map/Area.html
        
        Area(int[][] positions)
        Area(Position[] positions)
    */
    fromJava(text, polyarea) {
        polyarea.removeAll();
        text = text.replace(/\s/g, '');

        const planePattern = /.setPlane\(\d\)/mg;
        const planeMatch = planePattern.exec(text);
        const plane = planeMatch ? planeMatch[1] : 0;

        const positionsPattern = /{(\d+),(\d+)}/mg;
        let match;
        while ((match = positionsPattern.exec(text))) {
            polyarea.add(new Position(match[1], match[2], plane));
        }
    }
    
    toRaw(polyarea) {
        let output = '';
        for (let i = 0; i < polyarea.positions.length; i++) {
            output += `${polyarea.positions[i].x},${polyarea.positions[i].y}\n`;
        }
        return output;
    }
    
    toJava(polyarea) {
        if (polyarea.positions.length === 0) {
            return "";
        }
        let output = `${this.javaArea} area = new ${this.javaArea}(\n    new int[][]{`;
        for (let i = 0; i < polyarea.positions.length; i++) {
            output += `\n        { ${polyarea.positions[i].x}, ${polyarea.positions[i].y} }`;
            if (i !== polyarea.positions.length - 1) {
                output += ",";
            }
        }
        output += "\n    }\n)";
        if (polyarea.positions.length > 0 && polyarea.positions[0].plane > 0) {
            output += `.setPlane(${polyarea.positions[0].plane})`;
        }
        output += ";";
        return output;
    }
}