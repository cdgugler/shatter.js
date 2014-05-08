var image = new Image();
image.src = "img/BlueMarbleNasa.png";

// create shatter object after image has loaded
image.addEventListener("load", function() {
    var div = document.querySelectorAll('.shatter');
    var shatter = new Shatter(image, 14, 1.5);

    // loop through images in shatter object and insert into 
    // dom at correct position
    placeShatter(shatter, div);

    // wait a bit to add dom gravity
    window.setTimeout(function() {
        $('.container').jGravity({
            target: '.shatter img',
            ignoreClass: 'ignoreMe',
            weight: 25,
            depth: 5,
            drag: true
        });
    }, 100);

    // Make new shatter object
    $('.new-shatter').on('click', function() {
        var numPieces = $('#numPieces').val();
        // 4 pieces if none specified
        var shatter = new Shatter(image, numPieces || 4, 1.5);
        placeShatter(shatter, div);


        // clear out the input, otherwise the input box becomes unresponsive
        $('#numPieces').val('');

    // TODO
    // figure out why it freaks out on first new shatter without a short delay before calling jGravity.
    window.setTimeout(function() {
        $('.container').jGravity({
            target: '.shatter img',
            ignoreClass: 'ignoreMe',
            weight: 25,
            depth: 5,
            drag: true
        });
    }, 100);
    });
}, false);

function placeShatter (shatter, domElement) {
        // adjustment to center image on screen
        var adjustment = (window.innerWidth / 2) - image.width / 2;
        for (var i = 0; i < shatter.images.length; i++) {
            shatter.images[i].image.style.position = 'absolute';
            shatter.images[i].image.style.left = shatter.images[i].x + adjustment + 'px';
            shatter.images[i].image.style.top = shatter.images[i].y + 75 + 'px';
            domElement[0].appendChild(shatter.images[i].image);
        }
}
