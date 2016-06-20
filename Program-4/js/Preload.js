var SpaceHipster = SpaceHipster || {};

//loading the game assets
SpaceHipster.Preload = function(){};

SpaceHipster.Preload.prototype = {
  preload: function() {
  	//show loading screen
  	this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.splash.anchor.setTo(0.5);

    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

  	//load game assets
  	this.load.image('space', 'assets/images/space2.png');
  	this.load.image('rock', 'assets/images/Asteroid.png');
    this.game.load.image('bullet', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/bullet.png');
    this.load.spritesheet('playership', 'assets/images/enemy.png', 12, 12);
    this.load.spritesheet('power', 'assets/images/power2.png', 12, 12);
  	this.load.image('playerParticle', 'assets/images/player-particle.png');
    this.load.audio('collect', 'assets/audio/collect.ogg');
    this.load.audio('explosion', 'assets/audio/explosion.ogg');

  },
  create: function() {
  	this.state.start('MainMenu');
  }
};