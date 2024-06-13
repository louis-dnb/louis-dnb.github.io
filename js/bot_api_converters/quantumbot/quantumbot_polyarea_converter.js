'use strict';

import {Position} from '../../model/Position.js';
import {OSBotPolyAreaConverter} from '../osbot/osbot_polyarea_converter.js';

export class QuantumBotPolyAreaConverter extends OSBotPolyAreaConverter {
    constructor() {
        super();
        this.javaArea = "Area";
        this.javaPosition = "Tile";
    }
    
    /*
    API Doc:
        https://quantumbot.org/javadocs/org/quantumbot/api/map/Area.html
        https://quantumbot.org/javadocs/org/quantumbot/api/map/Tile.html

    Area(int[][] points)
    Area(int[][] points, int plane) 
    */
    fromJava(text, polyarea) {
        polyarea.removeAll();
        text = text.replace(/\s/g, '');
        
        const planePattern = /},(\d)\)/mg;
        const planeMatch = planePattern.exec(text);
        const plane = planeMatch ? planeMatch[1] : 0;

        const positionsPattern = /{(\d+),(\d+)}/mg;
        let match;
        while ((match = positionsPattern.exec(text))) {
            polyarea.add(new Position(match[1], match[2], plane));
        }
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
        output += "\n    }";
        if (polyarea.positions.length > 0 && polyarea.positions[0].plane > 0) {
            output += `, ${polyarea.positions[0].plane}`;
        }
        output += "\n);";
        return output;
    }
}