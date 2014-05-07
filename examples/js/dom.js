var image = new Image();
image.src = "img/BlueMarbleNasa.png";

// create shatter object after image has loaded
image.addEventListener("load", function() {
    var div = document.querySelectorAll('.shatter');
    var shatter = new Shatter(image, 14, 1.5);
    // adjustment to center image on screen
    var adjustment = (window.innerWidth / 2) - image.width / 2;

    // loop through images in shatter object and insert into 
    // dom at correct position
    for (var i = 0; i < shatter.images.length; i++) {
        shatter.images[i].image.style.position = 'absolute';
        shatter.images[i].image.style.left = shatter.images[i].x + adjustment + 'px';
        shatter.images[i].image.style.top = shatter.images[i].y + 75 + 'px';
        div[0].appendChild(shatter.images[i].image);
    }

    // wait a bit to add dom gravity
    window.setTimeout(function() {
        $('body').jGravity({
            target: 'everything',
            ignoreClass: 'ignoreMe',
            weight: 25,
            depth: 5,
            drag: true
        });
    }, 100);

}, false);
