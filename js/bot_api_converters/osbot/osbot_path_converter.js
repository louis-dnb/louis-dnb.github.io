'use strict';

import {Position} from '../../model/Position.js';
import {OSBotConverter} from './osbot_converter.js';

export class OSBotPathConverter extends OSBotConverter {
    /*
    API Doc:
        https://osbot.org/api/org/osbot/rs07/api/map/Position.html
        
        Position(int x, int y, int z)
    */
    fromJava(text, path) {
        path.removeAll();
        text = text.replace(/\s/g, '');
        const posPattern = `new${this.javaPosition}\\((\\d+,\\d+,\\d)\\)`;
        const re = new RegExp(posPattern, "mg");
        let match;
        while ((match = re.exec(text))) {
            const values = match[1].split(",");
            path.add(new Position(values[0], values[1], values[2]));
        }
    }
    
    toRaw(path) {
        let output = "";
        for (let i = 0; i < path.positions.length; i++) {
            output += `${path.positions[i].x},${path.positions[i].y},${path.positions[i].plane}\n`;
        }
        return output;
    }
    
    toJavaSingle(position) {
        return `${this.javaPosition} position = new ${this.javaPosition}(${position.x}, ${position.y}, ${position.plane});`;
    }
    
    toJavaArray(path) {
        if (path.positions.length === 1) {
            return this.toJavaSingle(path.positions[0]);
        } else if (path.positions.length > 1) {
            let output = `${this.javaPosition}[] path = {\n`;
            for (let i = 0; i < path.positions.length; i++) {
                output += `    new ${this.javaPosition}(${path.positions[i].x}, ${path.positions[i].y}, ${path.positions[i].plane})`;
                if (i !== path.positions.length - 1) output += ",";
                output += "\n";
            }
            output += "};";
            return output;
        }
        return "";
    }
    
    toJavaList(path) {
        if (path.positions.length === 1) {
            return this.toJavaSingle(path.positions[0]);
        } else if (path.positions.length > 1) {
            let output = `List&lt;${this.javaPosition}&gt; path = new ArrayList<>();\n`;
            for (let i = 0; i < path.positions.length; i++) {
                output += `path.add(new ${this.javaPosition}(${path.positions[i].x}, ${path.positions[i].y}, ${path.positions[i].plane}));\n`;
            }
            return output;
        }
        return "";
    }
    
    toJavaArraysAsList(path) {
        if (path.positions.length === 1) {
            return this.toJavaSingle(path.positions[0]);
        } else if (path.positions.length > 1) {
            let output = `List&lt;${this.javaPosition}&gt; path = Arrays.asList(\n    new ${this.javaPosition}[]{\n`;
            for (let i = 0; i < path.positions.length; i++) {
                output += `        new ${this.javaPosition}(${path.positions[i].x}, ${path.positions[i].y}, ${path.positions[i].plane})`;
                if (i !== path.positions.length - 1) output += ",";
                output += "\n";
            }
            output += "    }\n);";
            return output;
        }
        return "";
    }
}