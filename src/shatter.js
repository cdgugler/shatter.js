function Shatter (img, numPolys) {
    this.img = img;
    this.numPolys = numPolys;
    this.images = [];

    // Calculate and store minimum and maximum X, Y coords in a polygon
    var calcBoundaries = function (polygon) {
            polygon.minX = img.width;
            polygon.minY = img.height;
            polygon.maxX = 0;
            polygon.maxY = 0;
            polygon.forEach(function(coordinatePair) {
                polygon.minX = coordinatePair[0] < polygon.minX ? coordinatePair[0] : polygon.minX; 
                polygon.minY = coordinatePair[1] < polygon.minY ? coordinatePair[1] : polygon.minY; 
                polygon.maxX = coordinatePair[0] > polygon.maxX ? coordinatePair[0] : polygon.maxX; 
                polygon.maxY = coordinatePair[1] > polygon.maxY ? coordinatePair[1] : polygon.maxY; 
            });
    }

    // scale polygon coordinates
    var adjustedCoordinates = function (polygon) {
            polygon.points = [];
            var scale = 0.9;
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
    }

    // Divides a rectangular area into the specified number
    // of Voronoi cells
    getPolys = function (width, height, numPolys) {
        var vertices = d3.range(numPolys).map(function(d) {
          return [Math.random() * width, Math.random() * height];
        });
        var voronoi = d3.geom.voronoi()
            .clipExtent([[0, 0], [width, height]]);
        var polygons = voronoi(vertices);
        // round all x and y coords and calc min, max values
        polygons.forEach(Shatter.prototype.roundVertices);
        polygons.forEach(calcBoundaries);
        return polygons;
    }

    // Splits the given image into separate segments based on
    // a list of polygons (or Voronoi cells)
    var spliceImage = function (polygonList, img) {
        imageList = [];
        var tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        var tempCtx = tempCanvas.getContext("2d");
        tempCtx.save();
        polygonList.forEach(function (polygon, index, polygonList) {
            polygon.forEach(function (coordinatePair, index, polygon) {
                if (index === 0) {
                    tempCtx.beginPath();
                    tempCtx.moveTo(coordinatePair[0], coordinatePair[1]);
                    return
                }
                tempCtx.lineTo(coordinatePair[0], coordinatePair[1]);
                if (index === polygon.length - 1) {
                    // last coordinate, close polygon
                    tempCtx.lineTo(polygon[0][0], polygon[0][1]);
                    // create clipped canvas with polygon
                    tempCtx.clip();
                    // draw the original image onto the canvas
                    tempCtx.drawImage(img, 0, 0);
                    // save clipped image
                    var tempBigImage = new Image();
                    tempBigImage.src = tempCanvas.toDataURL("image/png");
                    // now crop the image by drawing on a new canvas and saving 
                    // that canvas
                    var imgHeight = polygon.maxY - polygon.minY,
                        imgWidth = polygon.maxX - polygon.minX;
                    var cropCanvas = document.createElement('canvas');
                    cropCanvas.width = imgWidth;
                    cropCanvas.height = imgHeight;
                    cropCtx = cropCanvas.getContext("2d");
                    cropCtx.drawImage(tempBigImage, -polygon.minX, -polygon.minY);
                    var saveImage = new Image();
                    saveImage.src = cropCanvas.toDataURL("image/png");
                    
                    imageList.push([saveImage, [polygon.minX, polygon.minY], polygon.points]);
                    tempBigImage = null, saveImage = null, cropCanvas = null; // clean up
                    tempCtx.restore();
                    tempCtx.clearRect(0,0,250,250);
                    tempCtx.save();
                    return;
                }
            });
        });
        canvas = null;
        return imageList;
    }

    var polygonList = getPolys(img.width, img.height, numPolys);
    polygonList.forEach(adjustedCoordinates);
    this.images = spliceImage(polygonList, img);
}

// Round all vertices in a polygon
Shatter.prototype.roundVertices = function (polygon) {
    polygon.forEach(function(coordinatePair) {
        coordinatePair[0] = Math.round(coordinatePair[0]);
        coordinatePair[1] = Math.round(coordinatePair[1]);
    });
}
