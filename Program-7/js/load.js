var loadState = {
    preload: function () {
		
		game.load.image('jumpButton', 'assets/Upie.png');
		game.load.image('rightButton', 'assets/Rightie.png');
		game.load.image('leftButton', 'assets/Leftie.png');
		
        var loadingLabel = game.add.text(game.width/2, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' });
        loadingLabel.anchor.setTo(0.5, 0.5);
        var progressBar = game.add.sprite(game.width/2, 200, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);
		
		game.load.spritesheet('mute', 'assets/muteButton.png', 28, 22);
		
		game.load.image('pixel', 'assets/pixel.png');
		game.load.spritesheet('player', 'assets/TheBunnySheet.png', 42, 43);
		game.load.spritesheet('enemy', 'assets/GhostieSheet2.png', 33, 32);
        game.load.image('coin', 'assets/Carrot.png');
        game.load.image('background', 'assets/background.png');

		game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3']);
		game.load.audio('coin', ['assets/coin.ogg', 'assets/coin.mp3']);
		game.load.audio('dead', ['assets/dead.ogg', 'assets/dead.mp3']);	
		game.load.audio('music', ['assets/Next.mp3', 'assets/Next.ogg']);
		game.load.tilemap('level2map', 'assets/level2map.json',null, Phaser.Tilemap.TILED_JSON);
		game.load.image('tileset', 'assets/tileset.png');
		game.load.tilemap('map', 'assets/map4.json', null, Phaser.Tilemap.TILED_JSON);
		
    },
    create: function() {
        // Go to the menu state
		
        game.state.start('menu');
    }
};