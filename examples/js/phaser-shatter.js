Voronoi = {};

Voronoi.Main = function (game) {
};

var sprites;

Voronoi.Main.prototype = {
    preload: function() {
        this.game.load.image('earth', 'img/BlueMarbleNasa.png');
    },

    create: function() {
        var earth = new Shatter(this.game.cache._images.earth.data, 8);
        var that = this;
        var middleX = this.game.width / 2 - this.game.cache.getImage('earth').width / 2;

        this.game.voronoiImages = earth.images;
        sprites = this.game.add.group();

        this.game.voronoiImages.forEach(function (el, index, arr) {
            var key = 'earth' + index;
            that.game.cache.addImage(key, null, el.image);
            var sprite = sprites.create(el.x + middleX, el.y, key);
            sprite.body.velocity.x = that.game.rnd.integerInRange(200, 900);
            sprite.body.velocity.y = that.game.rnd.integerInRange(-500, 900);
            sprite.body.setPolygon(el.points);
        });

        this.game.cache.addImage('earthseg', null, this.game.voronoiImages[0].image);
        this.game.input.maxPointers = 1;
        this.game.stage.disableVisibilityChange = true;
        this.game.physics.gravity.y = 1500;

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
