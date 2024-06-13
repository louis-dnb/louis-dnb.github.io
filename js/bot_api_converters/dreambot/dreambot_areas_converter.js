'use strict';

import {Area} from '../../model/Area.js';
import {Position} from '../../model/Position.js';
import {OSBotAreasConverter} from '../osbot/osbot_areas_converter.js';

export class DreamBotAreasConverter extends OSBotAreasConverter {
    constructor() {
        super();
        this.javaArea = "Area";
        this.javaPosition = "Tile";
    }
    
    /*
    API Doc:
        https://dreambot.org/javadocs/org/dreambot/api/methods/map/Area.html
        https://dreambot.org/javadocs/org/dreambot/api/methods/map/Tile.html

    Area(int x1, int y1, int x2, int y2)
    Area(int x1, int y1, int x2, int y2, int z)
    Area(Tile ne, Tile sw)
    
    Tile(int x, int y) 
    Tile(int x, int y, int z)
    */
    fromJava(text, areas) {        
        areas.removeAll();
        text = text.replace(/\s/g, '');

        const areasPattern = `(?:new${this.javaArea}\\((\\d+,\\d+,\\d+,\\d+(?:,\\d+)?)\\)|\\(new${this.javaPosition}\\((\\d+,\\d+(?:,\\d)?)\\),new${this.javaPosition}\\((\\d+,\\d+(?:,\\d)?)\\)\\))`;
        const re = new RegExp(areasPattern, 'mg');
        let match;
        while ((match = re.exec(text))) {
            if (match[1] !== undefined) {
                const values = match[1].split(',');
                const plane = values.length === 4 ? 0 : values[4];
                areas.add(new Area(new Position(values[0], values[1], plane), new Position(values[2], values[3], plane)));
            } else {
                const pos1Values = match[2].split(',');
                const pos1Plane = pos1Values.length === 2 ? 0 : pos1Values[2];

                const pos2Values = match[3].split(',');
                const pos2Plane = pos2Values.length === 2 ? 0 : pos2Values[2];
                areas.add(new Area(new Position(pos1Values[0], pos1Values[1], pos1Plane), new Position(pos2Values[0], pos2Values[1], pos2Plane)));
            }
        }
    }
    
    toJavaSingle(area) {
        if (area.startPosition.plane === 0) {
            return `new ${this.javaArea}(${area.startPosition.x}, ${area.startPosition.y}, ${area.endPosition.x}, ${area.endPosition.y})`;
        }
        return `new ${this.javaArea}(${area.startPosition.x}, ${area.startPosition.y}, ${area.endPosition.x}, ${area.endPosition.y}, ${area.endPosition.plane})`;
    }
}