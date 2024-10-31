'use strict';

import {Area} from '../../model/Area.js';
import {Position} from '../../model/Position.js';
import {OSBotAreasConverter} from '../osbot/osbot_areas_converter.js';

export class BotWithUsAreasConverter extends OSBotAreasConverter {
    constructor() {
        super();
        this.javaArea = "Area";
        this.javaPosition = "Coordinate";
    }
    
    fromJava(text, areas) {        
        areas.removeAll();
        text = text.replace(/\s/g, '');

        const areasPattern = `(?:` +
                `${this.javaArea}\\.Rectangular` +
                `\\(new${this.javaPosition}\\((\\d+,\\d+(?:,\\d)?)\\),new${this.javaPosition}\\((\\d+,\\d+(?:,\\d)?)\\)(?:,(\\d+))?\\)` +
                `)`;
        const re = new RegExp(areasPattern, 'mg');
        let match;
        while ((match = re.exec(text))) {

            const pos1Values = match[1].split(',');
            let pos1Plane = pos1Values.length === 2 ? 0 : pos1Values[2];

            const pos2Values = match[2].split(',');
            let pos2Plane = pos2Values.length === 2 ? 0 : pos2Values[2];

            if (match[4] !== undefined) {
                pos1Plane = match[4];
                pos2Plane = match[4];
            }
                
            areas.add(new Area(new Position(pos1Values[0], pos1Values[1], pos1Plane), new Position(pos2Values[0], pos2Values[1], pos2Plane)));
        }
    }
    
    toJavaSingle(area) {
        return `new ${this.javaArea}.Rectangular(` +
               `new ${this.javaPosition}(${area.startPosition.x}, ${area.startPosition.y}, ${area.startPosition.plane}), ` +
               `new ${this.javaPosition}(${area.endPosition.x}, ${area.endPosition.y}, ${area.endPosition.plane})` +
               `)`;
    }
}