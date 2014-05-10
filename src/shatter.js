/**
 * Shatter.js: JavaScript image shattering
 * @version 0.1.2
 * @license MIT License https://github.com/cdgugler/shatter.js/raw/dev/LICENSE.md
 * @author Cory Gugler - cory@addlime.com
 */

/**
 * Creates a new Shatter object.
 * @constructor
 * @param {object} img - The image to shatter.
 * @param {number} numPolys - The number to pieces (polygons) to split the image into.
 * @param {number} scale [multiplier=1] - The amount to scale resultings pieces coordinates.
 */
function Shatter (img, numPolys, scale) {
    this.img = img;
    this.numPolys = numPolys;
    this.images = [];
    var polygons;
    var scale = scale || 1;

    // Init shattered image
    polygons = this.getPolys(img.width, img.height, numPolys);
    this.roundVertices(polygons);
    this.calcBoundaries(polygons, this.img);
    this.scaleCoordinates(polygons, scale);
    this.images = this.spliceImage(polygons, img);
};

/**
 * Divides a rectangular area into Voronoi cells
 * @param {number} width - Width of area
 * @param {number} height - Height of area
 * @param {number} numPolys - Number of Voronoi cells to split area
 *
 * @returns {array} polygons
 *                  each polygon is {array} coordinatePairs
 *                  each coordinatePair is {array} points (2)
 */
Shatter.prototype.getPolys = function (width, height, numPolys) {
    var vertices = d3.range(numPolys).map(function (d) {
      return [Math.random() * width, Math.random() * height];
    });
    var voronoi = d3.geom.voronoi()
        .clipExtent([[0, 0], [width, height]]);
    var polygons = voronoi(vertices);
    return polygons;
};

/**
 * Rounds all vertices in a list of polygons
 * @param {array} polygons - List of polygons
 *
 * Mutates original array
 */
Shatter.prototype.roundVertices = function (polygons) {
    polygons.forEach(function (polygon) {
        polygon.forEach(function (coordinatePair) {
            coordinatePair[0] = Math.round(coordinatePair[0]);
            coordinatePair[1] = Math.round(coordinatePair[1]);
        });
    });
};

/**
 * Scale all coordinates in a list of polygons
 * @param {array} polygons - List of polygons
 * @param {number} scale - Factor to scale coordinates by.
 *
 * Mutates original array
 */
Shatter.prototype.scaleCoordinates = function (polygons, scale) {
    var scale = scale;
    polygons.forEach(function (polygon) {
        polygon.points = [];
        var xCenter = (polygon.maxX + polygon.minX) / 2;
        var yCenter = (polygon.maxY + polygon.minY) / 2;
        polygon.forEach(function (coordinatePair) {
            var x = coordinatePair[0] - polygon.minX;
            var y = coordinatePair[1] - polygon.minY;
            // scale points in for collision bounds
            x = Math.round(scale * (x - xCenter) + xCenter);
            y = Math.round(scale * (y - yCenter) + yCenter);
            polygon.points.push(x, y);
        });
    });
};

/**
 * Determine minimum and maximum X & Y coords of each polygon in a list of polygons
 * @param {array} polygons - List of polygons
 * @param {object} img - Original image
 *
 * Mutates original array
 * Adds minX, minY, maxX, maxY properties to each polygon
 */
Shatter.prototype.calcBoundaries = function (polygons, img) {
    polygons.forEach(function (polygon) {
        polygon.minX = img.width;
        polygon.minY = img.height;
        polygon.maxX = 0;
        polygon.maxY = 0;
        polygon.forEach(function (coordinatePair) {
            polygon.minX = coordinatePair[0] < polygon.minX ? coordinatePair[0] : polygon.minX; 
            polygon.minY = coordinatePair[1] < polygon.minY ? coordinatePair[1] : polygon.minY; 
            polygon.maxX = coordinatePair[0] > polygon.maxX ? coordinatePair[0] : polygon.maxX; 
            polygon.maxY = coordinatePair[1] > polygon.maxY ? coordinatePair[1] : polygon.maxY; 
        });
    });
};

/**
 * Split an image into separate segments based on list of polygons
 * @param {array} polygons - List of polygons
 * @param {object} img - Image to split
 *
 * @returns {array} imageList - {array} [{object} image, {array} [minX, minY], {array} [polygon.points]]
 * 
 */
Shatter.prototype.spliceImage = function (polygons, img) {
    imageList = [];

    // create a temporary canvas so we can reuse it for each polygon
    var tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    var tempCtx = tempCanvas.getContext("2d");
    tempCtx.save();

    // loop through each polygon
    polygons.forEach(function (polygon) {
        // Draw clipping path for the current polygon on the 2d context
        var tempBigImage = Shatter.prototype.getClippedImage(polygon, tempCtx, tempCanvas, img);
        var croppedImage = Shatter.prototype.getCroppedImage(polygon, tempBigImage);
        
        imageList.push({image: croppedImage,
                        x: polygon.minX, 
                        y: polygon.minY,
                        points: polygon.points});
        croppedImage = null; // clean up
        tempCtx.restore();
        tempCtx.clearRect(0,0,250,250);
        tempCtx.save();
        return;
    });
    canvas = null;
    return imageList;
};

/**
 * Draw an image clipped to the provided polygon coordinates
 * @param {object} polygon - An object containing points and min and max vals
 * @param {object} ctx - The canvas 2d drawing context to draw to
 * @param {object} img - The original image
 *
 * @returns {object} - The clipped image
 */
Shatter.prototype.getClippedImage = function(polygon, ctx, tempCanvas, img) {
    // loop through each pair of coordinates
    polygon.forEach(function (coordinatePair, index, polygon) {
        // check if first pair of coordinates and start path
        if (index === 0) {
            ctx.beginPath();
            ctx.moveTo(coordinatePair[0], coordinatePair[1]);
            return
        }
        // draw line to next coordinate
        ctx.lineTo(coordinatePair[0], coordinatePair[1]);

        // last coordinate, close polygon
        if (index === polygon.length - 1) {
            ctx.lineTo(polygon[0][0], polygon[0][1]);
        }
    });
    // create clipped canvas with polygon
    ctx.clip();
    // draw the original image onto the canvas
    ctx.drawImage(img, 0, 0);
    // save clipped image
    var tempBigImage = new Image();
    tempBigImage.src = tempCanvas.toDataURL("image/png");

    return tempBigImage;
};

/**
 * Crop an image using the given polygon
 * @param {object} polygon - An object containing points and min and max vals
 * @param {object} img - An image that has been clipped to only show the desired part
 *
 * @returns {object} - The cropped image
 */
Shatter.prototype.getCroppedImage = function (polygon, tempBigImage) {
        // now crop the image by drawing on a new canvas and saving it
        var imgHeight = polygon.maxY - polygon.minY,
            imgWidth = polygon.maxX - polygon.minX;
        var cropCanvas = document.createElement('canvas');
        cropCanvas.width = imgWidth;
        cropCanvas.height = imgHeight;
        cropCtx = cropCanvas.getContext("2d");
        cropCtx.drawImage(tempBigImage, -polygon.minX, -polygon.minY);
        var saveImage = new Image();
        saveImage.src = cropCanvas.toDataURL("image/png");
        cropCanvas = null;

        return saveImage;
};
