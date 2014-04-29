var image = new Image();
image.src = "img/BlueMarbleNasa.png";
image.addEventListener("load", function() {
    var div = document.querySelectorAll('.shatter');
    // div[0].appendChild(image);
    var shatter = new Shatter(image, 4, 1.5);
    for (var i = 0; i < shatter.images.length; i++) {
        shatter.images[i][0].style.position = 'absolute';
        shatter.images[i][0].style.left = shatter.images[i][1][0] + 'px';
        shatter.images[i][0].style.top = shatter.images[i][1][1] + 'px';
        div[0].appendChild(shatter.images[i][0]);
    }
    $('body').jGravity();
}, false);
