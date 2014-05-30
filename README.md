# Shatter.js

Shatter.js provides simple image shattering by dividing a given 
image with a [Voronoi diagram](http://en.wikipedia.org/wiki/Voronoi_diagram).

Uses a custom build of [D3.js](https://github.com/mbostock/d3) to generate the Voronoi diagram used to split up the given image.

## Install

Get dependencies:

    $ bower install && npm install

This will install d3.js (required for Voronoi generation) and 
smash (to build custom d3.js with Voronoi specific functions only).

## Build

Build with grunt.

    $ grunt build

This will create three files in ./build:
- d3voronoi.js: d3 built specifically for voronoi generation
- shatter.js: Includes Shatter and d3voronoi.js
- shatter.min.js: Minified shatter.js.

## Documentation

Include shatter.min.js in your project.

Create a new Shatter object. Pass in the image to shatter and the number of segments to split it into.

    var image = new Image();
    image.src = "aPictureOfSomethingCool.png";
    var shattered = new Shatter(image, 10);

Your new shattered object will contain images and x, y coordinates for each segment.
shattered.images will be an array of objects (10 in this example) containing each segment and the x, y offsets.

Each segment (i) will contain these useful properties:
- shattered.images[i].image - The image segment
- shattered.images[i].x     - X-offset
- shattered.images[i].y     - Y-offset

See the examples for more details!


## Examples

See the [project page](http://cdgugler.github.io/shatter.js/).

## License

- [MIT license](LICENSE.md)

## Credits

Shatter.js is created and maintained by [Cory Gugler](http://www.addlime.com)
