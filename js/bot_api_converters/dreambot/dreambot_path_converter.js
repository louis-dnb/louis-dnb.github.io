'use strict';

import {Position} from '../../model/Position.js';
import {OSBotPathConverter} from '../osbot/osbot_path_converter.js';

export class DreamBotPathConverter extends OSBotPathConverter {
    constructor() {
        super();
        this.javaArea = "Area";
        this.javaPosition = "Tile";
    }
    
    /*
    API Doc:
        https://dreambot.org/javadocs/org/dreambot/api/methods/map/Tile.html

    Tile(int x, int y) 
    Tile(int x, int y, int z)
    */
    fromJava(text, path) {
        path.removeAll();
        text = text.replace(/\s/g, '');
        const posPattern = `new${this.javaPosition}\\((\\d+,\\d+(?:,\\d)?)\\)`;
        const re = new RegExp(posPattern, "mg");
        let match;
        while ((match = re.exec(text))) {
            const values = match[1].split(",");
            const plane = values.length === 2 ? 0 : values[2];
            path.add(new Position(values[0], values[1], plane));
        }
    }
}