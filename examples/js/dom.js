var image = new Image(),
    shattered = [],
    YLOC = 75;

image.src = "img/BlueMarbleNasa.png";

// jGravity seems to disable input even though ignored
// a simulated click seems to fix it
$('#numPieces').click();

// create shatter object after image has loaded
image.addEventListener("load", function() {
    var div = document.querySelectorAll('.shatter');
    var shatter = new Shatter(image, 10);
    shattered.push(shatter);

    // loop through images in shatter object and insert into 
    // dom at correct position
    placeShatter(shatter, div[0]);

    // wait a bit to add dom gravity
    window.setTimeout(function() {
        $('.container').jGravity({
            target: '.shatter img',
            ignoreClass: 'ignore',
            weight: 25,
            depth: 5,
            drag: true
        });
    }, 100);

    // Make new shatter object
    $('.new-shatter').on('click', function() {
        var debug = document.getElementsByClassName('debug')[0].checked;
        var numPieces = $('#numPieces').val();
        // 10 pieces if none specified
        var shatter = new Shatter(image, numPieces || 10, 1, debug);
        shattered.push(shatter);

        placeShatter(shatter, div[0]);
        // place debug
        if (debug) {
            var center = (window.innerWidth / 2) - image.width / 2;
            placeImageAbsolute(shatter.debug, div[0], center, YLOC);
            shattered.push(shatter.debug);
        }

        // clear out the input, otherwise the input box becomes unresponsive
        $('#numPieces').val('');

        if (!document.getElementsByClassName('shatter-check')[0].checked) {
            // TODO
            // figure out why it freaks out on first new shatter without a short delay before calling jGravity.
            window.setTimeout(function() {
                $('.container').jGravity({
                    target: '.shatter img',
                    ignoreClass: 'ignore',
                    weight: 25,
                    depth: 5,
                    drag: true
                });
            }, 100);
        }
        $('.shatter img').click(function() {
            $('.container').jGravity({
                target: '.shatter img',
                ignoreClass: 'ignore',
                weight: 25,
                depth: 5,
                drag: true
            });
            $('.shatter img').off('click');
        });
    });
}, false);

// clear out all shattered images
$('.remove-all').on('click', function() {
    shattered.forEach(function(shatter) {
        if (shatter.src) {
            shatter.remove();
        } else {
            shatter.images.forEach(function(image) {
                // box2d remove method
                image.image.remove();
            });
        }
    });
    shattered = [];
});

/**
 * Places given shatter objects images into the specified dom element
 *
 * @param {object} shatter - Shatter object
 * @param {object} domElement - The dom element to append images to
 */
function placeShatter (shatter, domElement) {
    // adjustment to center image on screen
    var adjustment = (window.innerWidth / 2) - image.width / 2;
    for (var i = 0; i < shatter.images.length; i++) {
        placeImageAbsolute(shatter.images[i].image,
                           domElement, 
                           shatter.images[i].x, 
                           shatter.images[i].y,
                           adjustment,
                           YLOC);
    }
}

/**
 * Places an image into dom element and absolutely positions
 *
 * @param {object} image - image to append to dom
 * @param {object} domElement - dom element to append image 
 * @param {number} x - x coordinate to position image at
 * @param {number} y - y coordinate to position image at
 * @param {number} xOff - x offset added to x coordinate
 * @param {number} yOff - y offset added to x coordinate
 */
function placeImageAbsolute (image, domElement, x, y, xOff, yOff) {
    var xOff = xOff || 0;
    var yOff = yOff || 0;
    image.style.position = 'absolute';
    image.style.left = x + xOff + 'px';
    image.style.top = y + yOff + 'px';
    domElement.appendChild(image);
}
