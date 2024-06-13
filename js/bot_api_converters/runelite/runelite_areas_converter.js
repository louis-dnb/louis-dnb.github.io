'use strict';

import {Area} from '../../model/Area.js';
import {Position} from '../../model/Position.js';
import {OSBotAreasConverter} from '../osbot/osbot_areas_converter.js';

export class RuneLiteAreasConverter extends OSBotAreasConverter {
    constructor() {
        super();
        this.javaArea = "WorldArea";
        this.javaPosition = "WorldPoint";
    }
    
    fromJava(text, areas) {
        areas.removeAll();
        text = text.replace(/\s/g, '');

        const areasPattern = `(?:new${this.javaArea}\\((\\d+,\\d+,\\d+,\\d+(?:,\\d+)?)\\)|\\(new${this.javaPosition}\\((\\d+,\\d+,\\d)\\),new${this.javaPosition}\\((\\d+,\\d+,\\d)\\)(?:,(\\d))?\\))`;
        const re = new RegExp(areasPattern,"mg");

        let match;
        while ((match = re.exec(text))) {
            if (match[1] !== undefined) {
                const values = match[1].split(",");

                const x = Number(values[0]);
                const y = Number(values[1]);
                const width = Number(values[2]);
                const height = Number(values[3]);

                areas.add(new Area(new Position(x, y + height - 1, values[4]), new Position(x + width - 1, y, values[4])));
            } else {
                const pos1Values = match[2].split(",");
                const pos1Z = match[4] !== undefined ? match[4] : pos1Values[2];

                const pos2Values = match[3].split(",");
                const pos2Z = match[4] !== undefined ? match[4] : pos2Values[2];
                
                areas.add(new Area(new Position(pos1Values[0], pos1Values[1], pos1Z), new Position(pos2Values[0], pos2Values[1], pos2Z)));
            }
        }
    }
    
    toJavaSingle(area) {
        const start = area.startPosition.x < area.endPosition.x ? area.startPosition.x : area.endPosition.x;
        const end = area.startPosition.y < area.endPosition.y ? area.startPosition.y : area.endPosition.y;
        return `new ${this.javaArea}(${start}, ${end}, ${Math.abs(area.startPosition.x - area.endPosition.x) + 1}, ${Math.abs(area.startPosition.y - area.endPosition.y) + 1}, ${area.endPosition.plane})`;
    }
}