'use strict';

import {Area} from '../../model/Area.js';
import {Position} from '../../model/Position.js';
import {OSBotConverter} from './osbot_converter.js';

export class OSBotAreasConverter extends OSBotConverter {
    constructor() {
        super();
    }
    
    /*
    API Doc:
        https://osbot.org/api/org/osbot/rs07/api/map/Position.html
        https://osbot.org/api/org/osbot/rs07/api/map/Area.html
        
        Area(int x1, int y1, int x2, int y2)
        Area(Position southWest, Position northEast)
        
        Position(int x, int y, int z)
    */
    fromJava(text, areas) {        
        areas.removeAll();
        text = text.replace(/\s/g, '');
        const areasPattern = `(?:new${this.javaArea}\\((\\d+,\\d+,\\d+,\\d+)\\)|\\(new${this.javaPosition}\\((\\d+,\\d+,\\d)\\),new${this.javaPosition}\\((\\d+,\\d+,\\d)\\)\\))(?:.setPlane\\((\\d)\\))?`;
        const re = new RegExp(areasPattern, 'mg');
        let match;
        while ((match = re.exec(text))) {
            if (match[1] !== undefined) {
                const plane = match[4] !== undefined ? match[4] : 0;
                const values = match[1].split(',');
                areas.add(new Area(new Position(values[0], values[1], plane), new Position(values[2], values[3], plane)));
            } else {
                const pos1Values = match[2].split(',');
                const pos1Plane = match[4] !== undefined ? match[4] : pos1Values[2];

                const pos2Values = match[3].split(',');
                const pos2Plane = match[4] !== undefined ? match[4] : pos2Values[2];
                areas.add(new Area(new Position(pos1Values[0], pos1Values[1], pos1Plane), new Position(pos2Values[0], pos2Values[1], pos2Plane)));
            }
        }
    }
    
    toRaw(areas) {
        let output = '';
        for (let i = 0; i < areas.areas.length; i++) {
            output += `${areas.areas[i].startPosition.x},${areas.areas[i].startPosition.y},${areas.areas[i].endPosition.x},${areas.areas[i].endPosition.y}\n`;
        }
        return output;
    }
    
    toJavaSingle(area) {
        let areaDef = `new ${this.javaArea}(${area.startPosition.x}, ${area.startPosition.y}, ${area.endPosition.x}, ${area.endPosition.y})`;
        if (area.startPosition.plane > 0) {
            areaDef += `.setPlane(${area.startPosition.plane})`;
        }
        return areaDef;
    }
    
    toJavaArray(areas) {
        if (areas.areas.length === 1) {
            return `${this.javaArea} area = ` + this.toJavaSingle(areas.areas[0]) + `;`;
        } else if (areas.areas.length > 1) {
            let output = `${this.javaArea}[] area = {\n`;
            for (let i = 0; i < areas.areas.length; i++) {
                output += "    " + this.toJavaSingle(areas.areas[i]);
                if (i !== areas.areas.length - 1) {
                    output += ",";
                }
                output += "\n";
            }
            output += "};";
            return output;
        }
        return "";
    }
    
    toJavaList(areas) {
        if (areas.areas.length === 1) {
            return `${this.javaArea} area = ` + this.toJavaSingle(areas.areas[0]) + ";";
        } else if (areas.areas.length > 1) {
            let output = `List&lt;${this.javaArea}&gt; area = new ArrayList<>();\n`;
            for (let i = 0; i < areas.areas.length; i++) {
                output += "area.add(" + this.toJavaSingle(areas.areas[i]) + ");\n";
            }
            return output;
        }
        return "";
    }
    
    toJavaArraysAsList(areas) {
        if (areas.areas.length === 1) {
            return `${this.javaArea} area = ` + this.toJavaSingle(areas.areas[0]) + ";";
        } else if (areas.areas.length > 1) {
            let output = `List&lt;${this.javaArea}&gt; area = Arrays.asList(\n` +
                    `    new ${this.javaArea}[]{\n`;

            for (let i = 0; i < areas.areas.length; i++) {
                output += "        " + this.toJavaSingle(areas.areas[i]);
                if (i !== areas.areas.length - 1) {
                    output += ",";
                }
                output += "\n";
            }
            
            output += "    }\n";
            output += ");";
            return output;
        }
        return "";
    }
}