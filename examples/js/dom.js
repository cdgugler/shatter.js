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
        shatter.images[i][0].style.position = 'absolute';
        shatter.images[i][0].style.left = shatter.images[i][1][0] + adjustment + 'px';
        shatter.images[i][0].style.top = shatter.images[i][1][1] + 75 + 'px';
        div[0].appendChild(shatter.images[i][0]);
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
    }, 1000);

}, false);
