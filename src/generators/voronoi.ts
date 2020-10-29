import { Piece } from '../shatter';
import { voronoi } from 'd3-voronoi';

export default function VoronoiPieces({
    height = 100,
    width = 100,
    numPieces = 4,
}: {
    height: number;
    width: number;
    numPieces: number;
}): Piece[] {
    const vertices: [number, number][] = Array(numPieces)
        .fill([0, 0])
        .map(() => {
            return [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
        });
    const v = voronoi().extent([
        [0, 0],
        [width, height],
    ]);

    const pieces = v(vertices).polygons();

    return pieces.map((piece) => {
        return piece
            .filter((point) => point !== piece['data'])
            .map((point) => {
                return [Math.ceil(point[0]), Math.ceil(point[1])];
            });
    });
}
