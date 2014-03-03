Voronoi = {};

Voronoi.Main = function (game) {
};

var sprites;

Voronoi.Main.prototype = {
    preload: function() {
        this.game.load.image('earth', 'img/BlueMarbleNasa.png');
    },

    create: function() {
        var earth = new Shatter(this.game.cache._images.earth.data, 18);
        this.game.voronoiImages = earth.images;
        var that = this;
        sprites = this.game.add.group();

        this.game.voronoiImages.forEach(function (el, index, arr) {
            var key = 'earth' + index;
            that.game.cache.addImage(key, null, el[0]);
            var sprite = sprites.create(el[1][0], el[1][1], key);
            sprite.body.velocity.x = that.game.rnd.integerInRange(-100, 900);
            sprite.body.velocity.y = that.game.rnd.integerInRange(-500, 900);
            sprite.body.setPolygon(el[2]);
        });

        this.game.cache.addImage('earthseg', null, this.game.voronoiImages[0][0]);
        this.game.input.maxPointers = 1;
        this.game.stage.disableVisibilityChange = true;
        this.game.physics.gravity.y = 500;

        sprites.setAll('body.collideWorldBounds', true);
        sprites.setAll('body.bounce.y', 0.5);
        sprites.setAll('body.bounce.x', 0.5);

        if (this.game.device.desktop) {
            this.game.stage.scale.pageAlignHorizontally = true;
        }
        else {
            this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
            this.game.stage.scale.minWidth = 480;
            this.game.stage.scale.minHeight = 260;
            this.game.stage.scale.maxWidth = 1024;
            this.game.stage.scale.maxHeight = 768;
            this.game.stage.scale.forceLandscape = true;
            this.game.stage.scale.pageAlignHorizontally = true;
            this.game.stage.scale.setScreenSize(true);
        }
    },

    update: function() {
        this.game.physics.collide(sprites);
    }
}
