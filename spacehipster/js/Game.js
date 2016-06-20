//Aimee Phillips
//https://github.com/Alphillips1016/Mwsu-2D-Gaming-Phillips

//reference for some things: http://jschomay.tumblr.com/post/103568304133/tutorial-building-a-polished-html5-space-shooter




var SpaceHipster = SpaceHipster || {};


//title screen
SpaceHipster.Game = function(){};

SpaceHipster.Game.prototype = {
  create: function() {
      
  	//set world dimensions
    this.game.world.setBounds(0, 0, 1920, 1920);
      
//    var asteroidSize = this.game.rnd.integerInRange(1, 100);
      
      
    //background
    this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');

    //create player
    this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'playership');
    this.player.scale.setTo(2);
    this.player.animations.add('fly', [0, 1, 2, 3], 5, true);
    this.player.animations.play('fly');

    //player initial score of zero
    this.playerScore = 0;

    //enable player physics
    this.game.physics.arcade.enable(this.player);
    this.playerSpeed = 120;
    this.player.body.collideWorldBounds = true;

    //the camera will follow the player in the world
    this.game.camera.follow(this.player);

    //generate game elements
    this.generateCollectables();
    this.generateAsteriods();
      
    //show score
    this.showLabels();

    //sounds
    this.explosionSound = this.game.add.audio('explosion');
    console.log(this.explosionSound);
    this.collectSound = this.game.add.audio('collect');
      
      
//    this.generateBullets();
 //   this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      
  },
    
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      
      this.game.physics.arcade.moveToPointer(this.player, this.playerSpeed);
    }
      this.player.body.drag.x = 20;
      this.player.body.drag.y = 20;

    //collision between player and asteroids
    this.game.physics.arcade.collide(this.player, this.asteroids, this.hitAsteroid, null, this);

    //overlapping between player and collectables
    this.game.physics.arcade.overlap(this.player, this.collectables, this.collect, null, this);
      
      
 //if (player.alive && fireButton.isDown {
 //        fireBullet();
  //}
      
      
  },
    
//  generateBullets: function(){
//      this.bullets = game.add.group();
//      this.bullets.enableBody = true;
 //     this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
  //    this.bullets.createMultiple(30, 'bullet');
  //    this.bullets.setAll('anchor.x', 0.5);
 //     this.bullets.setAll('anchor.y', 1);
 //     this.bullets.setAll('outOfBoundsKill', true);
 //     this.bullets.setAll('checkWorldBounds', true);
 // }
    
//  fireBullet: function() {
//      var BULLET_SPEED = 400;
//      var bullet = bullets.getFirstExists(false);
//
  //    if (bullet){
    //    var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
      //  bullet.reset(player.x + bulletOffset, player.y);
        //bullet.angle = player.angle;
        //game.physics.arcade.velocityFromAngle(bullet.angle - 90, //BULLET_SPEED, bullet.body.velocity);
        //bullet.body.velocity.x += player.body.velocity.x;
    //}
  //},
    
  generateCollectables: function() {
    this.collectables = this.game.add.group();

    //enable physics in them
    this.collectables.enableBody = true;
    this.collectables.physicsBodyType = Phaser.Physics.ARCADE;

    //phaser's random number generator
    var numCollectables = this.game.rnd.integerInRange(100, 150)
    var collectable;

    for (var i = 0; i < numCollectables; i++) {
      //add sprite
      collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'power');
      collectable.animations.add('fly', [0, 1, 2, 3], 5, true);
      collectable.animations.play('fly');
    }

  },
    
  generateAsteriods: function() {
    this.asteroids = this.game.add.group();
    
    //enable physics in them
    this.asteroids.enableBody = true;

    //phaser's random number generator
    var numAsteroids = this.game.rnd.integerInRange(25, 50);
      
    console.log(numAsteroids);
    var asteriod;

    for (var i = 0; i < numAsteroids; i++) {
      //add sprite
      asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
      asteriod.scale.setTo(this.game.rnd.integerInRange(10, 40)/10);
        
      //physics properties
      asteriod.body.velocity.x = this.game.rnd.integerInRange(-20, 20);
      asteriod.body.velocity.y = this.game.rnd.integerInRange(-20, 20);
      asteriod.body.immovable = true;
      asteriod.body.collideWorldBounds = true;
    }
  },
    
  generateAsteriods1: function() {
        
    var text = "Level 2";
    var style = { font: "50px Arial", fill: "#fff", align: "center" };
    this.LevelLabel = this.game.add.text(this.game.width/2, 30, text, style);
    this.LevelLabel.fixedToCamera = true;
        
    this.asteroids = this.game.add.group();
    
    //enable physics in them
    this.asteroids.enableBody = true;

    //phaser's random number generator
    var numAsteroids = this.game.rnd.integerInRange(50, 75);
      
    console.log(numAsteroids);
    var asteriod;

    for (var i = 0; i < numAsteroids; i++) {
      //add sprite
      asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
      asteriod.scale.setTo(this.game.rnd.integerInRange(10, 40)/10);

      //physics properties
      asteriod.body.velocity.x = this.game.rnd.integerInRange(-20, 20);
      asteriod.body.velocity.y = this.game.rnd.integerInRange(-20, 20);
      asteriod.body.immovable = false;
      asteriod.body.collideWorldBounds = true;
    }
  },
    
  generateAsteriods2: function() {
    var text = "Level 3";
    var style = { font: "50px Arial", fill: "#fff", align: "center" };
    this.LevelLabel = this.game.add.text(this.game.width/2, 30, text, style);
    this.LevelLabel.fixedToCamera = true;
    
    this.asteroids = this.game.add.group();
    
    //enable physics in them
    this.asteroids.enableBody = true;

    //phaser's random number generator
    var numAsteroids = this.game.rnd.integerInRange(75, 100);
      
    console.log(numAsteroids);
    var asteriod;

    for (var i = 0; i < numAsteroids; i++) {
      //add sprite
      asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
      asteriod.scale.setTo(this.game.rnd.integerInRange(10, 40)/10);

      //physics properties
      asteriod.body.velocity.x = this.game.rnd.integerInRange(-20, 20);
      asteriod.body.velocity.y = this.game.rnd.integerInRange(-20, 20);
      asteriod.body.immovable = true;
      asteriod.body.collideWorldBounds = true;
    }
  },
     
  hitAsteroid: function(player, asteroid) {
    //play explosion sound
    this.explosionSound.play();

    //make the player explode
    var emitter = this.game.add.emitter(this.player.x, this.player.y, 100);
    emitter.makeParticles('playerParticle');
    emitter.minParticleSpeed.setTo(-200, -200);
    emitter.maxParticleSpeed.setTo(200, 200);
    emitter.gravity = 0;
    emitter.start(true, 1000, null, 100);
    this.player.kill();

    this.game.time.events.add(800, this.gameOver, this);
  },
    
  gameOver: function() {    
    //pass it the score as a parameter 
    this.game.state.start('MainMenu', true, false, this.playerScore);
  },
    
  collect: function(player, collectable) {
    //play collect sound
    this.collectSound.play();

    //update score
    this.playerScore++;
    this.scoreLabel.text = this.playerScore;
      
    if(this.playerScore == 10){
        
        this.generateAsteriods1();
    }
    if(this.playerScore == 20){
        
        this.generateAsteriods2();
    }

    //remove sprite
    collectable.destroy();
  },
    
  showLabels: function() {
    //score text
    var text = "0";
    var style = { font: "20px Arial", fill: "#fff", align: "center" };
    this.scoreLabel = this.game.add.text(this.game.width-50, this.game.height - 50, text, style);
    this.scoreLabel.fixedToCamera = true;
  }
};

/*
TODO

-audio
-asteriod bounch
*/
