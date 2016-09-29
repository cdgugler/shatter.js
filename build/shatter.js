var Shatter =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _d3Array = __webpack_require__(1);

	var _d3Voronoi = __webpack_require__(2);

	/*!
	 * Shatter.js: JavaScript image shattering
	 * @version 0.1.3
	 * @license MIT License https://github.com/cdgugler/shatter.js/raw/dev/LICENSE.md
	 * @author Cory Gugler - cory@addlime.com
	 */

	exports.Shatter = function (opts, cb) {
	    return new Shatter(opts, cb);
	};
	/**
	 * Creates a new Shatter object.
	 * @constructor
	 * @param {object} img - The image to shatter.
	 * @param {number} numPolys - The number to pieces (polygons) to split the image into.
	 * @param {number} scale [multiplier=1] - The amount to scale resulting pieces coordinates.
	 * @param {boolean} debug - Adds debug image to returned Shatter object if true
	 */
	function Shatter(opts, cb) {
	    this.opts = {
	        numPolys: opts.numPolys || 2,
	        scale: opts.scale || 1,
	        debug: opts.debug || false
	    };
	    this.img = opts.img;
	    this.images = [];
	    this.cb = cb;

	    this.init();
	};

	Shatter.prototype.init = function () {
	    var _this = this;

	    var polygons = this.getPolys(this.img.width, this.img.height, this.opts.numPolys);
	    this.roundVertices(polygons);
	    this.calcBoundaries(polygons, this.img);
	    this.scaleCoordinates(polygons, this.opts.scale);
	    this.images = this.spliceImage(polygons, this.img, function () {
	        if (_this.opts.debug) {
	            _this.debug = _this.getDebugImage(polygons, '#fff');
	        }
	        _this.cb(_this);
	    });
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
	    var vertices = (0, _d3Array.range)(numPolys).map(function (d) {
	        return [Math.random() * width, Math.random() * height];
	    });
	    var shatterVoronoi = (0, _d3Voronoi.voronoi)().extent([[0, 0], [width, height]]);
	    var polygons = shatterVoronoi.polygons(vertices);

	    return polygons;

	    return polygons.cells.map(function (cell) {
	        return cell.site;
	    });
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
	    var imageList = [];

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

	        imageList.push({ image: croppedImage,
	            x: polygon.minX,
	            y: polygon.minY,
	            points: polygon.points });
	        croppedImage = null; // clean up
	        tempCtx.restore();
	        tempCtx.clearRect(0, 0, 250, 250);
	        tempCtx.save();
	        return;
	    });
	    tempCanvas = null;
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
	Shatter.prototype.getClippedImage = function (polygon, ctx, tempCanvas, img) {
	    // loop through each pair of coordinates
	    polygon.forEach(function (coordinatePair, index, polygon) {
	        // check if first pair of coordinates and start path
	        if (index === 0) {
	            ctx.beginPath();
	            ctx.moveTo(coordinatePair[0], coordinatePair[1]);
	            return;
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
	    var tempBigImage = img.cloneNode();
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
	    var cropCtx = cropCanvas.getContext("2d");
	    cropCtx.drawImage(tempBigImage, -polygon.minX, -polygon.minY);
	    var saveImage = tempBigImage.cloneNode();
	    saveImage.src = cropCanvas.toDataURL("image/png");
	    cropCanvas = null;

	    return saveImage;
	};

	/**
	 * Draw voronoi and return as image
	 * @param {object} polygon - An object containing points and min and max vals
	 * @param {string} color - The color to draw the outline
	 *
	 * @returns {object} - The debug image
	 */
	Shatter.prototype.getDebugImage = function (polygons, color) {
	    // create a temporary canvas so we can reuse it for each polygon
	    var tempCanvas = document.createElement('canvas');
	    tempCanvas.width = this.img.width;
	    tempCanvas.height = this.img.height;
	    var ctx = tempCanvas.getContext("2d");
	    var color = color || '#fff';

	    // loop through each polygon
	    polygons.forEach(function (polygon) {
	        // loop through each pair of coordinates
	        polygon.forEach(function (coordinatePair, index, polygon) {
	            // check if first pair of coordinates and start path
	            if (index === 0) {
	                ctx.beginPath();
	                ctx.moveTo(coordinatePair[0], coordinatePair[1]);
	                return;
	            }
	            // draw line to next coordinate
	            ctx.lineTo(coordinatePair[0], coordinatePair[1]);

	            // last coordinate, close polygon
	            if (index === polygon.length - 1) {
	                ctx.lineTo(polygon[0][0], polygon[0][1]);
	            }
	        });
	        ctx.closePath();
	        ctx.strokeStyle = color;
	        ctx.stroke();

	        return;
	    });
	    // save clipped image
	    var debugImage = this.img.cloneNode();
	    debugImage.src = tempCanvas.toDataURL("image/png");

	    return debugImage;
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-array/ Version 1.0.1. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, function (exports) { 'use strict';

	  function ascending(a, b) {
	    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	  }

	  function bisector(compare) {
	    if (compare.length === 1) compare = ascendingComparator(compare);
	    return {
	      left: function(a, x, lo, hi) {
	        if (lo == null) lo = 0;
	        if (hi == null) hi = a.length;
	        while (lo < hi) {
	          var mid = lo + hi >>> 1;
	          if (compare(a[mid], x) < 0) lo = mid + 1;
	          else hi = mid;
	        }
	        return lo;
	      },
	      right: function(a, x, lo, hi) {
	        if (lo == null) lo = 0;
	        if (hi == null) hi = a.length;
	        while (lo < hi) {
	          var mid = lo + hi >>> 1;
	          if (compare(a[mid], x) > 0) hi = mid;
	          else lo = mid + 1;
	        }
	        return lo;
	      }
	    };
	  }

	  function ascendingComparator(f) {
	    return function(d, x) {
	      return ascending(f(d), x);
	    };
	  }

	  var ascendingBisect = bisector(ascending);
	  var bisectRight = ascendingBisect.right;
	  var bisectLeft = ascendingBisect.left;

	  function descending(a, b) {
	    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
	  }

	  function number(x) {
	    return x === null ? NaN : +x;
	  }

	  function variance(array, f) {
	    var n = array.length,
	        m = 0,
	        a,
	        d,
	        s = 0,
	        i = -1,
	        j = 0;

	    if (f == null) {
	      while (++i < n) {
	        if (!isNaN(a = number(array[i]))) {
	          d = a - m;
	          m += d / ++j;
	          s += d * (a - m);
	        }
	      }
	    }

	    else {
	      while (++i < n) {
	        if (!isNaN(a = number(f(array[i], i, array)))) {
	          d = a - m;
	          m += d / ++j;
	          s += d * (a - m);
	        }
	      }
	    }

	    if (j > 1) return s / (j - 1);
	  }

	  function deviation(array, f) {
	    var v = variance(array, f);
	    return v ? Math.sqrt(v) : v;
	  }

	  function extent(array, f) {
	    var i = -1,
	        n = array.length,
	        a,
	        b,
	        c;

	    if (f == null) {
	      while (++i < n) if ((b = array[i]) != null && b >= b) { a = c = b; break; }
	      while (++i < n) if ((b = array[i]) != null) {
	        if (a > b) a = b;
	        if (c < b) c = b;
	      }
	    }

	    else {
	      while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = c = b; break; }
	      while (++i < n) if ((b = f(array[i], i, array)) != null) {
	        if (a > b) a = b;
	        if (c < b) c = b;
	      }
	    }

	    return [a, c];
	  }

	  var array = Array.prototype;

	  var slice = array.slice;
	  var map = array.map;

	  function constant(x) {
	    return function() {
	      return x;
	    };
	  }

	  function identity(x) {
	    return x;
	  }

	  function range(start, stop, step) {
	    start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

	    var i = -1,
	        n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
	        range = new Array(n);

	    while (++i < n) {
	      range[i] = start + i * step;
	    }

	    return range;
	  }

	  var e10 = Math.sqrt(50);
	  var e5 = Math.sqrt(10);
	  var e2 = Math.sqrt(2);
	  function ticks(start, stop, count) {
	    var step = tickStep(start, stop, count);
	    return range(
	      Math.ceil(start / step) * step,
	      Math.floor(stop / step) * step + step / 2, // inclusive
	      step
	    );
	  }

	  function tickStep(start, stop, count) {
	    var step0 = Math.abs(stop - start) / Math.max(0, count),
	        step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
	        error = step0 / step1;
	    if (error >= e10) step1 *= 10;
	    else if (error >= e5) step1 *= 5;
	    else if (error >= e2) step1 *= 2;
	    return stop < start ? -step1 : step1;
	  }

	  function sturges(values) {
	    return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
	  }

	  function histogram() {
	    var value = identity,
	        domain = extent,
	        threshold = sturges;

	    function histogram(data) {
	      var i,
	          n = data.length,
	          x,
	          values = new Array(n);

	      for (i = 0; i < n; ++i) {
	        values[i] = value(data[i], i, data);
	      }

	      var xz = domain(values),
	          x0 = xz[0],
	          x1 = xz[1],
	          tz = threshold(values, x0, x1);

	      // Convert number of thresholds into uniform thresholds.
	      if (!Array.isArray(tz)) tz = ticks(x0, x1, tz);

	      // Remove any thresholds outside the domain.
	      var m = tz.length;
	      while (tz[0] <= x0) tz.shift(), --m;
	      while (tz[m - 1] >= x1) tz.pop(), --m;

	      var bins = new Array(m + 1),
	          bin;

	      // Initialize bins.
	      for (i = 0; i <= m; ++i) {
	        bin = bins[i] = [];
	        bin.x0 = i > 0 ? tz[i - 1] : x0;
	        bin.x1 = i < m ? tz[i] : x1;
	      }

	      // Assign data to bins by value, ignoring any outside the domain.
	      for (i = 0; i < n; ++i) {
	        x = values[i];
	        if (x0 <= x && x <= x1) {
	          bins[bisectRight(tz, x, 0, m)].push(data[i]);
	        }
	      }

	      return bins;
	    }

	    histogram.value = function(_) {
	      return arguments.length ? (value = typeof _ === "function" ? _ : constant(_), histogram) : value;
	    };

	    histogram.domain = function(_) {
	      return arguments.length ? (domain = typeof _ === "function" ? _ : constant([_[0], _[1]]), histogram) : domain;
	    };

	    histogram.thresholds = function(_) {
	      return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant(slice.call(_)) : constant(_), histogram) : threshold;
	    };

	    return histogram;
	  }

	  function quantile(array, p, f) {
	    if (f == null) f = number;
	    if (!(n = array.length)) return;
	    if ((p = +p) <= 0 || n < 2) return +f(array[0], 0, array);
	    if (p >= 1) return +f(array[n - 1], n - 1, array);
	    var n,
	        h = (n - 1) * p,
	        i = Math.floor(h),
	        a = +f(array[i], i, array),
	        b = +f(array[i + 1], i + 1, array);
	    return a + (b - a) * (h - i);
	  }

	  function freedmanDiaconis(values, min, max) {
	    values = map.call(values, number).sort(ascending);
	    return Math.ceil((max - min) / (2 * (quantile(values, 0.75) - quantile(values, 0.25)) * Math.pow(values.length, -1 / 3)));
	  }

	  function scott(values, min, max) {
	    return Math.ceil((max - min) / (3.5 * deviation(values) * Math.pow(values.length, -1 / 3)));
	  }

	  function max(array, f) {
	    var i = -1,
	        n = array.length,
	        a,
	        b;

	    if (f == null) {
	      while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
	      while (++i < n) if ((b = array[i]) != null && b > a) a = b;
	    }

	    else {
	      while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = b; break; }
	      while (++i < n) if ((b = f(array[i], i, array)) != null && b > a) a = b;
	    }

	    return a;
	  }

	  function mean(array, f) {
	    var s = 0,
	        n = array.length,
	        a,
	        i = -1,
	        j = n;

	    if (f == null) {
	      while (++i < n) if (!isNaN(a = number(array[i]))) s += a; else --j;
	    }

	    else {
	      while (++i < n) if (!isNaN(a = number(f(array[i], i, array)))) s += a; else --j;
	    }

	    if (j) return s / j;
	  }

	  function median(array, f) {
	    var numbers = [],
	        n = array.length,
	        a,
	        i = -1;

	    if (f == null) {
	      while (++i < n) if (!isNaN(a = number(array[i]))) numbers.push(a);
	    }

	    else {
	      while (++i < n) if (!isNaN(a = number(f(array[i], i, array)))) numbers.push(a);
	    }

	    return quantile(numbers.sort(ascending), 0.5);
	  }

	  function merge(arrays) {
	    var n = arrays.length,
	        m,
	        i = -1,
	        j = 0,
	        merged,
	        array;

	    while (++i < n) j += arrays[i].length;
	    merged = new Array(j);

	    while (--n >= 0) {
	      array = arrays[n];
	      m = array.length;
	      while (--m >= 0) {
	        merged[--j] = array[m];
	      }
	    }

	    return merged;
	  }

	  function min(array, f) {
	    var i = -1,
	        n = array.length,
	        a,
	        b;

	    if (f == null) {
	      while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
	      while (++i < n) if ((b = array[i]) != null && a > b) a = b;
	    }

	    else {
	      while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = b; break; }
	      while (++i < n) if ((b = f(array[i], i, array)) != null && a > b) a = b;
	    }

	    return a;
	  }

	  function pairs(array) {
	    var i = 0, n = array.length - 1, p = array[0], pairs = new Array(n < 0 ? 0 : n);
	    while (i < n) pairs[i] = [p, p = array[++i]];
	    return pairs;
	  }

	  function permute(array, indexes) {
	    var i = indexes.length, permutes = new Array(i);
	    while (i--) permutes[i] = array[indexes[i]];
	    return permutes;
	  }

	  function scan(array, compare) {
	    if (!(n = array.length)) return;
	    var i = 0,
	        n,
	        j = 0,
	        xi,
	        xj = array[j];

	    if (!compare) compare = ascending;

	    while (++i < n) if (compare(xi = array[i], xj) < 0 || compare(xj, xj) !== 0) xj = xi, j = i;

	    if (compare(xj, xj) === 0) return j;
	  }

	  function shuffle(array, i0, i1) {
	    var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
	        t,
	        i;

	    while (m) {
	      i = Math.random() * m-- | 0;
	      t = array[m + i0];
	      array[m + i0] = array[i + i0];
	      array[i + i0] = t;
	    }

	    return array;
	  }

	  function sum(array, f) {
	    var s = 0,
	        n = array.length,
	        a,
	        i = -1;

	    if (f == null) {
	      while (++i < n) if (a = +array[i]) s += a; // Note: zero and null are equivalent.
	    }

	    else {
	      while (++i < n) if (a = +f(array[i], i, array)) s += a;
	    }

	    return s;
	  }

	  function transpose(matrix) {
	    if (!(n = matrix.length)) return [];
	    for (var i = -1, m = min(matrix, length), transpose = new Array(m); ++i < m;) {
	      for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
	        row[j] = matrix[j][i];
	      }
	    }
	    return transpose;
	  }

	  function length(d) {
	    return d.length;
	  }

	  function zip() {
	    return transpose(arguments);
	  }

	  exports.bisect = bisectRight;
	  exports.bisectRight = bisectRight;
	  exports.bisectLeft = bisectLeft;
	  exports.ascending = ascending;
	  exports.bisector = bisector;
	  exports.descending = descending;
	  exports.deviation = deviation;
	  exports.extent = extent;
	  exports.histogram = histogram;
	  exports.thresholdFreedmanDiaconis = freedmanDiaconis;
	  exports.thresholdScott = scott;
	  exports.thresholdSturges = sturges;
	  exports.max = max;
	  exports.mean = mean;
	  exports.median = median;
	  exports.merge = merge;
	  exports.min = min;
	  exports.pairs = pairs;
	  exports.permute = permute;
	  exports.quantile = quantile;
	  exports.range = range;
	  exports.scan = scan;
	  exports.shuffle = shuffle;
	  exports.sum = sum;
	  exports.ticks = ticks;
	  exports.tickStep = tickStep;
	  exports.transpose = transpose;
	  exports.variance = variance;
	  exports.zip = zip;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-voronoi/ Version 1.0.2. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, function (exports) { 'use strict';

	  function constant(x) {
	    return function() {
	      return x;
	    };
	  }

	  function x(d) {
	    return d[0];
	  }

	  function y(d) {
	    return d[1];
	  }

	  function RedBlackTree() {
	    this._ = null; // root node
	  }

	  function RedBlackNode(node) {
	    node.U = // parent node
	    node.C = // color - true for red, false for black
	    node.L = // left node
	    node.R = // right node
	    node.P = // previous node
	    node.N = null; // next node
	  }

	  RedBlackTree.prototype = {
	    constructor: RedBlackTree,

	    insert: function(after, node) {
	      var parent, grandpa, uncle;

	      if (after) {
	        node.P = after;
	        node.N = after.N;
	        if (after.N) after.N.P = node;
	        after.N = node;
	        if (after.R) {
	          after = after.R;
	          while (after.L) after = after.L;
	          after.L = node;
	        } else {
	          after.R = node;
	        }
	        parent = after;
	      } else if (this._) {
	        after = RedBlackFirst(this._);
	        node.P = null;
	        node.N = after;
	        after.P = after.L = node;
	        parent = after;
	      } else {
	        node.P = node.N = null;
	        this._ = node;
	        parent = null;
	      }
	      node.L = node.R = null;
	      node.U = parent;
	      node.C = true;

	      after = node;
	      while (parent && parent.C) {
	        grandpa = parent.U;
	        if (parent === grandpa.L) {
	          uncle = grandpa.R;
	          if (uncle && uncle.C) {
	            parent.C = uncle.C = false;
	            grandpa.C = true;
	            after = grandpa;
	          } else {
	            if (after === parent.R) {
	              RedBlackRotateLeft(this, parent);
	              after = parent;
	              parent = after.U;
	            }
	            parent.C = false;
	            grandpa.C = true;
	            RedBlackRotateRight(this, grandpa);
	          }
	        } else {
	          uncle = grandpa.L;
	          if (uncle && uncle.C) {
	            parent.C = uncle.C = false;
	            grandpa.C = true;
	            after = grandpa;
	          } else {
	            if (after === parent.L) {
	              RedBlackRotateRight(this, parent);
	              after = parent;
	              parent = after.U;
	            }
	            parent.C = false;
	            grandpa.C = true;
	            RedBlackRotateLeft(this, grandpa);
	          }
	        }
	        parent = after.U;
	      }
	      this._.C = false;
	    },

	    remove: function(node) {
	      if (node.N) node.N.P = node.P;
	      if (node.P) node.P.N = node.N;
	      node.N = node.P = null;

	      var parent = node.U,
	          sibling,
	          left = node.L,
	          right = node.R,
	          next,
	          red;

	      if (!left) next = right;
	      else if (!right) next = left;
	      else next = RedBlackFirst(right);

	      if (parent) {
	        if (parent.L === node) parent.L = next;
	        else parent.R = next;
	      } else {
	        this._ = next;
	      }

	      if (left && right) {
	        red = next.C;
	        next.C = node.C;
	        next.L = left;
	        left.U = next;
	        if (next !== right) {
	          parent = next.U;
	          next.U = node.U;
	          node = next.R;
	          parent.L = node;
	          next.R = right;
	          right.U = next;
	        } else {
	          next.U = parent;
	          parent = next;
	          node = next.R;
	        }
	      } else {
	        red = node.C;
	        node = next;
	      }

	      if (node) node.U = parent;
	      if (red) return;
	      if (node && node.C) { node.C = false; return; }

	      do {
	        if (node === this._) break;
	        if (node === parent.L) {
	          sibling = parent.R;
	          if (sibling.C) {
	            sibling.C = false;
	            parent.C = true;
	            RedBlackRotateLeft(this, parent);
	            sibling = parent.R;
	          }
	          if ((sibling.L && sibling.L.C)
	              || (sibling.R && sibling.R.C)) {
	            if (!sibling.R || !sibling.R.C) {
	              sibling.L.C = false;
	              sibling.C = true;
	              RedBlackRotateRight(this, sibling);
	              sibling = parent.R;
	            }
	            sibling.C = parent.C;
	            parent.C = sibling.R.C = false;
	            RedBlackRotateLeft(this, parent);
	            node = this._;
	            break;
	          }
	        } else {
	          sibling = parent.L;
	          if (sibling.C) {
	            sibling.C = false;
	            parent.C = true;
	            RedBlackRotateRight(this, parent);
	            sibling = parent.L;
	          }
	          if ((sibling.L && sibling.L.C)
	            || (sibling.R && sibling.R.C)) {
	            if (!sibling.L || !sibling.L.C) {
	              sibling.R.C = false;
	              sibling.C = true;
	              RedBlackRotateLeft(this, sibling);
	              sibling = parent.L;
	            }
	            sibling.C = parent.C;
	            parent.C = sibling.L.C = false;
	            RedBlackRotateRight(this, parent);
	            node = this._;
	            break;
	          }
	        }
	        sibling.C = true;
	        node = parent;
	        parent = parent.U;
	      } while (!node.C);

	      if (node) node.C = false;
	    }
	  };

	  function RedBlackRotateLeft(tree, node) {
	    var p = node,
	        q = node.R,
	        parent = p.U;

	    if (parent) {
	      if (parent.L === p) parent.L = q;
	      else parent.R = q;
	    } else {
	      tree._ = q;
	    }

	    q.U = parent;
	    p.U = q;
	    p.R = q.L;
	    if (p.R) p.R.U = p;
	    q.L = p;
	  }

	  function RedBlackRotateRight(tree, node) {
	    var p = node,
	        q = node.L,
	        parent = p.U;

	    if (parent) {
	      if (parent.L === p) parent.L = q;
	      else parent.R = q;
	    } else {
	      tree._ = q;
	    }

	    q.U = parent;
	    p.U = q;
	    p.L = q.R;
	    if (p.L) p.L.U = p;
	    q.R = p;
	  }

	  function RedBlackFirst(node) {
	    while (node.L) node = node.L;
	    return node;
	  }

	  function createEdge(left, right, v0, v1) {
	    var edge = [null, null],
	        index = edges.push(edge) - 1;
	    edge.left = left;
	    edge.right = right;
	    if (v0) setEdgeEnd(edge, left, right, v0);
	    if (v1) setEdgeEnd(edge, right, left, v1);
	    cells[left.index].halfedges.push(index);
	    cells[right.index].halfedges.push(index);
	    return edge;
	  }

	  function createBorderEdge(left, v0, v1) {
	    var edge = [v0, v1];
	    edge.left = left;
	    return edge;
	  }

	  function setEdgeEnd(edge, left, right, vertex) {
	    if (!edge[0] && !edge[1]) {
	      edge[0] = vertex;
	      edge.left = left;
	      edge.right = right;
	    } else if (edge.left === right) {
	      edge[1] = vertex;
	    } else {
	      edge[0] = vertex;
	    }
	  }

	  // Liang–Barsky line clipping.
	  function clipEdge(edge, x0, y0, x1, y1) {
	    var a = edge[0],
	        b = edge[1],
	        ax = a[0],
	        ay = a[1],
	        bx = b[0],
	        by = b[1],
	        t0 = 0,
	        t1 = 1,
	        dx = bx - ax,
	        dy = by - ay,
	        r;

	    r = x0 - ax;
	    if (!dx && r > 0) return;
	    r /= dx;
	    if (dx < 0) {
	      if (r < t0) return;
	      if (r < t1) t1 = r;
	    } else if (dx > 0) {
	      if (r > t1) return;
	      if (r > t0) t0 = r;
	    }

	    r = x1 - ax;
	    if (!dx && r < 0) return;
	    r /= dx;
	    if (dx < 0) {
	      if (r > t1) return;
	      if (r > t0) t0 = r;
	    } else if (dx > 0) {
	      if (r < t0) return;
	      if (r < t1) t1 = r;
	    }

	    r = y0 - ay;
	    if (!dy && r > 0) return;
	    r /= dy;
	    if (dy < 0) {
	      if (r < t0) return;
	      if (r < t1) t1 = r;
	    } else if (dy > 0) {
	      if (r > t1) return;
	      if (r > t0) t0 = r;
	    }

	    r = y1 - ay;
	    if (!dy && r < 0) return;
	    r /= dy;
	    if (dy < 0) {
	      if (r > t1) return;
	      if (r > t0) t0 = r;
	    } else if (dy > 0) {
	      if (r < t0) return;
	      if (r < t1) t1 = r;
	    }

	    if (!(t0 > 0) && !(t1 < 1)) return true; // TODO Better check?

	    if (t0 > 0) edge[0] = [ax + t0 * dx, ay + t0 * dy];
	    if (t1 < 1) edge[1] = [ax + t1 * dx, ay + t1 * dy];
	    return true;
	  }

	  function connectEdge(edge, x0, y0, x1, y1) {
	    var v1 = edge[1];
	    if (v1) return true;

	    var v0 = edge[0],
	        left = edge.left,
	        right = edge.right,
	        lx = left[0],
	        ly = left[1],
	        rx = right[0],
	        ry = right[1],
	        fx = (lx + rx) / 2,
	        fy = (ly + ry) / 2,
	        fm,
	        fb;

	    if (ry === ly) {
	      if (fx < x0 || fx >= x1) return;
	      if (lx > rx) {
	        if (!v0) v0 = [fx, y0];
	        else if (v0[1] >= y1) return;
	        v1 = [fx, y1];
	      } else {
	        if (!v0) v0 = [fx, y1];
	        else if (v0[1] < y0) return;
	        v1 = [fx, y0];
	      }
	    } else {
	      fm = (lx - rx) / (ry - ly);
	      fb = fy - fm * fx;
	      if (fm < -1 || fm > 1) {
	        if (lx > rx) {
	          if (!v0) v0 = [(y0 - fb) / fm, y0];
	          else if (v0[1] >= y1) return;
	          v1 = [(y1 - fb) / fm, y1];
	        } else {
	          if (!v0) v0 = [(y1 - fb) / fm, y1];
	          else if (v0[1] < y0) return;
	          v1 = [(y0 - fb) / fm, y0];
	        }
	      } else {
	        if (ly < ry) {
	          if (!v0) v0 = [x0, fm * x0 + fb];
	          else if (v0[0] >= x1) return;
	          v1 = [x1, fm * x1 + fb];
	        } else {
	          if (!v0) v0 = [x1, fm * x1 + fb];
	          else if (v0[0] < x0) return;
	          v1 = [x0, fm * x0 + fb];
	        }
	      }
	    }

	    edge[0] = v0;
	    edge[1] = v1;
	    return true;
	  }

	  function clipEdges(x0, y0, x1, y1) {
	    var i = edges.length,
	        edge;

	    while (i--) {
	      if (!connectEdge(edge = edges[i], x0, y0, x1, y1)
	          || !clipEdge(edge, x0, y0, x1, y1)
	          || !(Math.abs(edge[0][0] - edge[1][0]) > epsilon
	              || Math.abs(edge[0][1] - edge[1][1]) > epsilon)) {
	        delete edges[i];
	      }
	    }
	  }

	  function createCell(site) {
	    return cells[site.index] = {
	      site: site,
	      halfedges: []
	    };
	  }

	  function cellHalfedgeAngle(cell, edge) {
	    var site = cell.site,
	        va = edge.left,
	        vb = edge.right;
	    if (site === vb) vb = va, va = site;
	    if (vb) return Math.atan2(vb[1] - va[1], vb[0] - va[0]);
	    if (site === va) va = edge[1], vb = edge[0];
	    else va = edge[0], vb = edge[1];
	    return Math.atan2(va[0] - vb[0], vb[1] - va[1]);
	  }

	  function cellHalfedgeStart(cell, edge) {
	    return edge[+(edge.left !== cell.site)];
	  }

	  function cellHalfedgeEnd(cell, edge) {
	    return edge[+(edge.left === cell.site)];
	  }

	  function sortCellHalfedges() {
	    for (var i = 0, n = cells.length, cell, halfedges, j, m; i < n; ++i) {
	      if ((cell = cells[i]) && (m = (halfedges = cell.halfedges).length)) {
	        var index = new Array(m),
	            array = new Array(m);
	        for (j = 0; j < m; ++j) index[j] = j, array[j] = cellHalfedgeAngle(cell, edges[halfedges[j]]);
	        index.sort(function(i, j) { return array[j] - array[i]; });
	        for (j = 0; j < m; ++j) array[j] = halfedges[index[j]];
	        for (j = 0; j < m; ++j) halfedges[j] = array[j];
	      }
	    }
	  }

	  function clipCells(x0, y0, x1, y1) {
	    var nCells = cells.length,
	        iCell,
	        cell,
	        site,
	        iHalfedge,
	        halfedges,
	        nHalfedges,
	        start,
	        startX,
	        startY,
	        end,
	        endX,
	        endY,
	        cover = true;

	    for (iCell = 0; iCell < nCells; ++iCell) {
	      if (cell = cells[iCell]) {
	        site = cell.site;
	        halfedges = cell.halfedges;
	        iHalfedge = halfedges.length;

	        // Remove any dangling clipped edges.
	        while (iHalfedge--) {
	          if (!edges[halfedges[iHalfedge]]) {
	            halfedges.splice(iHalfedge, 1);
	          }
	        }

	        // Insert any border edges as necessary.
	        iHalfedge = 0, nHalfedges = halfedges.length;
	        while (iHalfedge < nHalfedges) {
	          end = cellHalfedgeEnd(cell, edges[halfedges[iHalfedge]]), endX = end[0], endY = end[1];
	          start = cellHalfedgeStart(cell, edges[halfedges[++iHalfedge % nHalfedges]]), startX = start[0], startY = start[1];
	          if (Math.abs(endX - startX) > epsilon || Math.abs(endY - startY) > epsilon) {
	            halfedges.splice(iHalfedge, 0, edges.push(createBorderEdge(site, end,
	                Math.abs(endX - x0) < epsilon && y1 - endY > epsilon ? [x0, Math.abs(startX - x0) < epsilon ? startY : y1]
	                : Math.abs(endY - y1) < epsilon && x1 - endX > epsilon ? [Math.abs(startY - y1) < epsilon ? startX : x1, y1]
	                : Math.abs(endX - x1) < epsilon && endY - y0 > epsilon ? [x1, Math.abs(startX - x1) < epsilon ? startY : y0]
	                : Math.abs(endY - y0) < epsilon && endX - x0 > epsilon ? [Math.abs(startY - y0) < epsilon ? startX : x0, y0]
	                : null)) - 1);
	            ++nHalfedges;
	          }
	        }

	        if (nHalfedges) cover = false;
	      }
	    }

	    // If there weren’t any edges, have the closest site cover the extent.
	    // It doesn’t matter which corner of the extent we measure!
	    if (cover) {
	      var dx, dy, d2, dc = Infinity;

	      for (iCell = 0, cover = null; iCell < nCells; ++iCell) {
	        if (cell = cells[iCell]) {
	          site = cell.site;
	          dx = site[0] - x0;
	          dy = site[1] - y0;
	          d2 = dx * dx + dy * dy;
	          if (d2 < dc) dc = d2, cover = cell;
	        }
	      }

	      if (cover) {
	        var v00 = [x0, y0], v01 = [x0, y1], v11 = [x1, y1], v10 = [x1, y0];
	        cover.halfedges.push(
	          edges.push(createBorderEdge(site = cover.site, v00, v01)) - 1,
	          edges.push(createBorderEdge(site, v01, v11)) - 1,
	          edges.push(createBorderEdge(site, v11, v10)) - 1,
	          edges.push(createBorderEdge(site, v10, v00)) - 1
	        );
	      }
	    }

	    // Lastly delete any cells with no edges; these were entirely clipped.
	    for (iCell = 0; iCell < nCells; ++iCell) {
	      if (cell = cells[iCell]) {
	        if (!cell.halfedges.length) {
	          delete cells[iCell];
	        }
	      }
	    }
	  }

	  var circlePool = [];

	  var firstCircle;

	  function Circle() {
	    RedBlackNode(this);
	    this.x =
	    this.y =
	    this.arc =
	    this.site =
	    this.cy = null;
	  }

	  function attachCircle(arc) {
	    var lArc = arc.P,
	        rArc = arc.N;

	    if (!lArc || !rArc) return;

	    var lSite = lArc.site,
	        cSite = arc.site,
	        rSite = rArc.site;

	    if (lSite === rSite) return;

	    var bx = cSite[0],
	        by = cSite[1],
	        ax = lSite[0] - bx,
	        ay = lSite[1] - by,
	        cx = rSite[0] - bx,
	        cy = rSite[1] - by;

	    var d = 2 * (ax * cy - ay * cx);
	    if (d >= -epsilon2) return;

	    var ha = ax * ax + ay * ay,
	        hc = cx * cx + cy * cy,
	        x = (cy * ha - ay * hc) / d,
	        y = (ax * hc - cx * ha) / d;

	    var circle = circlePool.pop() || new Circle;
	    circle.arc = arc;
	    circle.site = cSite;
	    circle.x = x + bx;
	    circle.y = (circle.cy = y + by) + Math.sqrt(x * x + y * y); // y bottom

	    arc.circle = circle;

	    var before = null,
	        node = circles._;

	    while (node) {
	      if (circle.y < node.y || (circle.y === node.y && circle.x <= node.x)) {
	        if (node.L) node = node.L;
	        else { before = node.P; break; }
	      } else {
	        if (node.R) node = node.R;
	        else { before = node; break; }
	      }
	    }

	    circles.insert(before, circle);
	    if (!before) firstCircle = circle;
	  }

	  function detachCircle(arc) {
	    var circle = arc.circle;
	    if (circle) {
	      if (!circle.P) firstCircle = circle.N;
	      circles.remove(circle);
	      circlePool.push(circle);
	      RedBlackNode(circle);
	      arc.circle = null;
	    }
	  }

	  var beachPool = [];

	  function Beach() {
	    RedBlackNode(this);
	    this.edge =
	    this.site =
	    this.circle = null;
	  }

	  function createBeach(site) {
	    var beach = beachPool.pop() || new Beach;
	    beach.site = site;
	    return beach;
	  }

	  function detachBeach(beach) {
	    detachCircle(beach);
	    beaches.remove(beach);
	    beachPool.push(beach);
	    RedBlackNode(beach);
	  }

	  function removeBeach(beach) {
	    var circle = beach.circle,
	        x = circle.x,
	        y = circle.cy,
	        vertex = [x, y],
	        previous = beach.P,
	        next = beach.N,
	        disappearing = [beach];

	    detachBeach(beach);

	    var lArc = previous;
	    while (lArc.circle
	        && Math.abs(x - lArc.circle.x) < epsilon
	        && Math.abs(y - lArc.circle.cy) < epsilon) {
	      previous = lArc.P;
	      disappearing.unshift(lArc);
	      detachBeach(lArc);
	      lArc = previous;
	    }

	    disappearing.unshift(lArc);
	    detachCircle(lArc);

	    var rArc = next;
	    while (rArc.circle
	        && Math.abs(x - rArc.circle.x) < epsilon
	        && Math.abs(y - rArc.circle.cy) < epsilon) {
	      next = rArc.N;
	      disappearing.push(rArc);
	      detachBeach(rArc);
	      rArc = next;
	    }

	    disappearing.push(rArc);
	    detachCircle(rArc);

	    var nArcs = disappearing.length,
	        iArc;
	    for (iArc = 1; iArc < nArcs; ++iArc) {
	      rArc = disappearing[iArc];
	      lArc = disappearing[iArc - 1];
	      setEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);
	    }

	    lArc = disappearing[0];
	    rArc = disappearing[nArcs - 1];
	    rArc.edge = createEdge(lArc.site, rArc.site, null, vertex);

	    attachCircle(lArc);
	    attachCircle(rArc);
	  }

	  function addBeach(site) {
	    var x = site[0],
	        directrix = site[1],
	        lArc,
	        rArc,
	        dxl,
	        dxr,
	        node = beaches._;

	    while (node) {
	      dxl = leftBreakPoint(node, directrix) - x;
	      if (dxl > epsilon) node = node.L; else {
	        dxr = x - rightBreakPoint(node, directrix);
	        if (dxr > epsilon) {
	          if (!node.R) {
	            lArc = node;
	            break;
	          }
	          node = node.R;
	        } else {
	          if (dxl > -epsilon) {
	            lArc = node.P;
	            rArc = node;
	          } else if (dxr > -epsilon) {
	            lArc = node;
	            rArc = node.N;
	          } else {
	            lArc = rArc = node;
	          }
	          break;
	        }
	      }
	    }

	    createCell(site);
	    var newArc = createBeach(site);
	    beaches.insert(lArc, newArc);

	    if (!lArc && !rArc) return;

	    if (lArc === rArc) {
	      detachCircle(lArc);
	      rArc = createBeach(lArc.site);
	      beaches.insert(newArc, rArc);
	      newArc.edge = rArc.edge = createEdge(lArc.site, newArc.site);
	      attachCircle(lArc);
	      attachCircle(rArc);
	      return;
	    }

	    if (!rArc) { // && lArc
	      newArc.edge = createEdge(lArc.site, newArc.site);
	      return;
	    }

	    // else lArc !== rArc
	    detachCircle(lArc);
	    detachCircle(rArc);

	    var lSite = lArc.site,
	        ax = lSite[0],
	        ay = lSite[1],
	        bx = site[0] - ax,
	        by = site[1] - ay,
	        rSite = rArc.site,
	        cx = rSite[0] - ax,
	        cy = rSite[1] - ay,
	        d = 2 * (bx * cy - by * cx),
	        hb = bx * bx + by * by,
	        hc = cx * cx + cy * cy,
	        vertex = [(cy * hb - by * hc) / d + ax, (bx * hc - cx * hb) / d + ay];

	    setEdgeEnd(rArc.edge, lSite, rSite, vertex);
	    newArc.edge = createEdge(lSite, site, null, vertex);
	    rArc.edge = createEdge(site, rSite, null, vertex);
	    attachCircle(lArc);
	    attachCircle(rArc);
	  }

	  function leftBreakPoint(arc, directrix) {
	    var site = arc.site,
	        rfocx = site[0],
	        rfocy = site[1],
	        pby2 = rfocy - directrix;

	    if (!pby2) return rfocx;

	    var lArc = arc.P;
	    if (!lArc) return -Infinity;

	    site = lArc.site;
	    var lfocx = site[0],
	        lfocy = site[1],
	        plby2 = lfocy - directrix;

	    if (!plby2) return lfocx;

	    var hl = lfocx - rfocx,
	        aby2 = 1 / pby2 - 1 / plby2,
	        b = hl / plby2;

	    if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;

	    return (rfocx + lfocx) / 2;
	  }

	  function rightBreakPoint(arc, directrix) {
	    var rArc = arc.N;
	    if (rArc) return leftBreakPoint(rArc, directrix);
	    var site = arc.site;
	    return site[1] === directrix ? site[0] : Infinity;
	  }

	  var epsilon = 1e-6;
	  var epsilon2 = 1e-12;
	  var beaches;
	  var cells;
	  var circles;
	  var edges;

	  function triangleArea(a, b, c) {
	    return (a[0] - c[0]) * (b[1] - a[1]) - (a[0] - b[0]) * (c[1] - a[1]);
	  }

	  function lexicographic(a, b) {
	    return b[1] - a[1]
	        || b[0] - a[0];
	  }

	  function Diagram(sites, extent) {
	    var site = sites.sort(lexicographic).pop(),
	        x,
	        y,
	        circle;

	    edges = [];
	    cells = new Array(sites.length);
	    beaches = new RedBlackTree;
	    circles = new RedBlackTree;

	    while (true) {
	      circle = firstCircle;
	      if (site && (!circle || site[1] < circle.y || (site[1] === circle.y && site[0] < circle.x))) {
	        if (site[0] !== x || site[1] !== y) {
	          addBeach(site);
	          x = site[0], y = site[1];
	        }
	        site = sites.pop();
	      } else if (circle) {
	        removeBeach(circle.arc);
	      } else {
	        break;
	      }
	    }

	    sortCellHalfedges();

	    if (extent) {
	      var x0 = +extent[0][0],
	          y0 = +extent[0][1],
	          x1 = +extent[1][0],
	          y1 = +extent[1][1];
	      clipEdges(x0, y0, x1, y1);
	      clipCells(x0, y0, x1, y1);
	    }

	    this.edges = edges;
	    this.cells = cells;

	    beaches =
	    circles =
	    edges =
	    cells = null;
	  }

	  Diagram.prototype = {
	    constructor: Diagram,

	    polygons: function() {
	      var edges = this.edges;

	      return this.cells.map(function(cell) {
	        var polygon = cell.halfedges.map(function(i) { return cellHalfedgeStart(cell, edges[i]); });
	        polygon.data = cell.site.data;
	        return polygon;
	      });
	    },

	    triangles: function() {
	      var triangles = [],
	          edges = this.edges;

	      this.cells.forEach(function(cell, i) {
	        var site = cell.site,
	            halfedges = cell.halfedges,
	            j = -1,
	            m = halfedges.length,
	            s0,
	            e1 = edges[halfedges[m - 1]],
	            s1 = e1.left === site ? e1.right : e1.left;

	        while (++j < m) {
	          s0 = s1;
	          e1 = edges[halfedges[j]];
	          s1 = e1.left === site ? e1.right : e1.left;
	          if (i < s0.index && i < s1.index && triangleArea(site, s0, s1) < 0) {
	            triangles.push([site.data, s0.data, s1.data]);
	          }
	        }
	      });

	      return triangles;
	    },

	    links: function() {
	      return this.edges.filter(function(edge) {
	        return edge.right;
	      }).map(function(edge) {
	        return {
	          source: edge.left.data,
	          target: edge.right.data
	        };
	      });
	    }
	  }

	  function voronoi() {
	    var x$$ = x,
	        y$$ = y,
	        extent = null;

	    function voronoi(data) {
	      return new Diagram(data.map(function(d, i) {
	        var s = [Math.round(x$$(d, i, data) / epsilon) * epsilon, Math.round(y$$(d, i, data) / epsilon) * epsilon];
	        s.index = i;
	        s.data = d;
	        return s;
	      }), extent);
	    }

	    voronoi.polygons = function(data) {
	      return voronoi(data).polygons();
	    };

	    voronoi.links = function(data) {
	      return voronoi(data).links();
	    };

	    voronoi.triangles = function(data) {
	      return voronoi(data).triangles();
	    };

	    voronoi.x = function(_) {
	      return arguments.length ? (x$$ = typeof _ === "function" ? _ : constant(+_), voronoi) : x$$;
	    };

	    voronoi.y = function(_) {
	      return arguments.length ? (y$$ = typeof _ === "function" ? _ : constant(+_), voronoi) : y$$;
	    };

	    voronoi.extent = function(_) {
	      return arguments.length ? (extent = _ == null ? null : [[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]], voronoi) : extent && [[extent[0][0], extent[0][1]], [extent[1][0], extent[1][1]]];
	    };

	    voronoi.size = function(_) {
	      return arguments.length ? (extent = _ == null ? null : [[0, 0], [+_[0], +_[1]]], voronoi) : extent && [extent[1][0] - extent[0][0], extent[1][1] - extent[0][1]];
	    };

	    return voronoi;
	  }

	  exports.voronoi = voronoi;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ }
/******/ ]);