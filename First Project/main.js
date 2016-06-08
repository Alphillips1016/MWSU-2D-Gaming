var mainState = {
    preload: function() {
        // Load the image
        game.load.image('logo', 'logo.png');
    },
    create: function() {
        // Display the image on the screen
        this.sprite = game.add.sprite(200, 150, 'logo');
    },
    update: function() {
        // Increment the angle of the sprite by 1, 60 times per seconds
        this.sprite.angle += 1;
    }
};
var game = new Phaser.Game(400, 300, Phaser.AUTO, 'gameDiv');
game.state.add('main', mainState);
game.state.start('main');