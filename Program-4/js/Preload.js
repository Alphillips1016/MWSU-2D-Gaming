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

    this.load.image('First', 'assets/images/First.png');
	this.load.image('Second', 'assets/images/Second.png');
	this.load.image('Third', 'assets/images/Third.png');
     
	 
    this.load.setPreloadSprite(this.preloadBar);

  	this.load.audio('collect', 'assets/audio/collect.ogg');
      
    //Used the same explosion sound for when player is hit and the asteroid as well, didn't put any music
    this.load.audio('explosion', 'assets/audio/explosion.ogg');
  	this.load.image('space', 'assets/images/space2.png');
  	this.load.image('rock', 'assets/images/Asteroid.png');
      this.load.image('bullet', 'assets/images/bullet.png');
    this.load.image('playership', 'assets/images/ship.png');
    this.load.spritesheet('power', 'assets/images/power2.png', 12, 12);
      
    //Used the player particle for all the explosion instead of adding another
  	this.load.image('playerParticle', 'assets/images/player-particle.png');
	
  },
  create: function() {
  	this.state.start('MainMenu');
  }
};