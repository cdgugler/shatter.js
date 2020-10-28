import { Shatter } from "../../src/index";

var image = new Image();
image.src = "img/BlueMarbleNasa.png";
var shattered = [];

// jGravity seems to disable input even though ignored
// a simulated click seems to fix it
// $('#numPieces').click();

// create shatter object after image has loaded
image.addEventListener("load", async function() {
    var div = document.querySelectorAll('.shatter');
    var shatter = new Shatter('img/BlueMarbleNasa.png');

    let img = await shatter.shatter();
    console.log('Img is: ', img);
    document.body.appendChild(img);
    let img2 = await shatter.shatter();
    console.log('Img2 is: ', img);
    document.body.appendChild(img);
    document.body.appendChild(img2);

    return;
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
        var numPieces = $('#numPieces').val();
        // 10 pieces if none specified
        var shatter = new Shatter(image, numPieces || 10);
        shattered.push(shatter);

        placeShatter(shatter, div[0]);
        // clear out the input, otherwise the input box becomes unresponsive
        $('#numPieces').val('');

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
    });
}, false);

// clear out all shattered images
/*
$('.remove-all').on('click', function() {
    shattered.forEach(function(shatter) {
        shatter.images.forEach(function(image) {
            // box2d remove method
            image.image.remove();
        });
    });
});
*/

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
            shatter.images[i].image.style.position = 'absolute';
            shatter.images[i].image.style.left = shatter.images[i].x + adjustment + 'px';
            shatter.images[i].image.style.top = shatter.images[i].y + 75 + 'px';
            domElement.appendChild(shatter.images[i].image);
        }
}
