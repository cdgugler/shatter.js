# Shatter.js

Shatter.js provides simple image shattering by dividing an image (DOM Image element) by an array of coordinates.

It also includes a generator, to generate a random set of coordinates based on a [Voronoi diagram](http://en.wikipedia.org/wiki/Voronoi_diagram). The resulting array of images represents a 'shattered' version of the original image.

## Install

`npm install @cdgugler/shatter`

## Usage

### Shatter

```
import { Shatter } from '@cdgugler/shatter';
const shattered = new Shatter('/img/square.png');

// Set up an array of 'pieces'
// Each piece is an array of [x, y] coordinates
shattered.setPieces([
    [
        [0, 0],
        [50, 0],
        [50, 100],
        [0, 100],
    ],
    [
        [50, 0],
        [100, 0],
        [100, 100],
        [50, 100],
    ],
]);

// .shatter() returns a Promise due to the
// image.src being asynchronous
let result = await shattered.shatter();

// result is an array of image pieces consisting of
// { image: DOMImageElement, x: xOffset, y: yOffset }
result.forEach((res, i) => {
    container.appendChild(res.image);
});
```

## Examples

To run examples, clone repository and run:

```
npm install
npm run buildexample
npx http-server examples/
```

## API

### Constructor

`new Shatter(url)` - optional url of image to load. If not set, must use .setImage(image).

### Methods

| Name              | Description                                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| setImage(image)   | Provide a DOM Image element to shatter. Will override any image loaded from constructor.                                                                                 |
| setPieces(pieces) | Provide an array of segments/pieces to split the image into. Each 'piece' is an array of [x,y] coordinates.                                                              |
| shatter()         | Split the image using the provided coordinates. Returns a Promise that resolves with an array of 'shattered' objects containing the resulting images and additional data |

### Shattered Object

Shatter.shatter() returns an array of objects that contain images and x, y coordinates for each piece.

-   result[i].image - The image segment as a DOM Image element
-   result[i].x - X-offset
-   result[i].y - Y-offset


### Generators

You might not want to manually come up with all the pieces with their individual x & y coordinates to shatter an image.

Included is one generator, which uses [d3-voronoi](https://github.com/d3/d3-voronoi) behind the scenes to split an image into somewhat random pieces.

To use the generator, call it with an options object consisting of the height and width of the image, and the number of pieces to generate.

```

import { VoronoiPieces } from '@cdgugler/shatter';

const voropieces = VoronoiPieces({
    height: original.height,
    width: original.width,
    numPieces: num,
});

```

Then pass the result into the `.setPieces()` method on Shatter.

## Tests

`npm run test` - run unit tests

`npm run e2e` - run end to end tests

## Live Demo

See my post about the [project](https://www.addlime.com/posts/14/shatter-js/).

## License

-   [MIT license](LICENSE.md)
