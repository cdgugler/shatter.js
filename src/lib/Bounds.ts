import { Coordinate } from '../shatter';

type Bound = {
    min: number;
    max: number;
};

export default class Bounds {
    x: Bound = { min: 0, max: 0 };
    y: Bound = { min: 0, max: 0 };

    constructor(coord: Coordinate) {
        this.x.min = this.x.max = coord[0];
        this.y.min = this.y.max = coord[1];
    }

    update(coord: Coordinate) {
        if (coord[0] > this.x.max) {
            this.x.max = coord[0];
        }
        if (coord[0] < this.x.min) {
            this.x.min = coord[0];
        }
        if (coord[1] > this.y.max) {
            this.y.max = coord[1];
        }
        if (coord[1] < this.y.min) {
            this.y.min = coord[1];
        }
    }
}
