//Aimee Phillips
//https://github.com/Alphillips1016/Mwsu-2D-Gaming-Phillips

//reference for some things: http://jschomay.tumblr.com/post/103568304133/tutorial-building-a-polished-html5-space-shooter
///////////////////////////////////////////////////////

var SpaceHipster = SpaceHipster || {};

///////////////////////////////////////////////////////
SpaceHipster.Game = function(){};
///////////////////////////////////////////////////////
var SkillLevel = SkillLevel || {};
SkillLevel.easy = [25,50];
SkillLevel.medium = [50,150];
SkillLevel.hard = [150,250];
var cursors;
var bullets;
var bulletTime = 0;

///////////////////////////////////////////////////////
//The function for the game play and creation
SpaceHipster.Game.prototype = {

///////////////////////////////////////////////////////
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
      
      
   // this.generateBullets();?
      
	//Generates Bullet group
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(10, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 1);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true); 
      
	this.cursors = this.game.input.keyboard.createCursorKeys();
    this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	  
  },

///////////////////////////////////////////////////////
//The update function that updates the game depending on input
  update: function() {
        if(this.game.input.activePointer.justPressed()) {
      
            this.game.physics.arcade.moveToPointer(this.player, this.playerSpeed); 
   //         this.fireBullet();
        }
        this.player.body.drag.x = 20;
        this.player.body.drag.y = 20;
      
      if (this.game.input.activePointer.isDown)
    {
        this.fireBullet();
    }
      
      
 //   this.fireButton = //this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
 //   this.game.input.keyboard.addKey(Phaser.input.activePointer);
 //     if(this.fireButton.isDown){
//          this.fireBullet();
//      }
      
      
      
    //collision between player and asteroids
    this.game.physics.arcade.collide(this.player, this.asteroids, this.hitAsteroid, null, this);

    //overlapping between player and collectables
    this.game.physics.arcade.overlap(this.player, this.collectables, this.collect, null, this);
      
    //this.game.physics.arcade.collide(this.bullet,this.asteroids, this.BullethitsAsteroid, null, this);
    
  },
    
 ///////////////////////////////////////////////////////
//Supposed to kill the bullet
resetBullets: function(bullets) {
	// Destroy the bullet
	this.bullets.kill();
},
    
///////////////////////////////////////////////////////
 //Supposed to fire the bullet when called upon in update
fireBullet: function() {
//	var bullet = this.bullets.getFirstExists(false);
//	if (this.bullet) {
//		this.bullet.reset(this.player.x, this.player.y - 20);
//		this.bullet.body.velocity.y = -500;
//	}
    
    if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
    {
        nextFire = this.game.time.now + fireRate;

        bullet = bullets.getFirstDead();

        bullet.reset(player.x - 8, player.y - 8);

        this.game.physics.arcade.moveToPointer(bullet, 300);
    }
 
},
///////////////////////////////////////////////////////
      
//When the bullet hits an astroid; want to destroy it here
  BullethitsAsteroid: function(bullet, asteroid) {
    this.explosionSound.play();
    var emitter = this.game.add.emitter(this.player.x, this.player.y, 100);
    emitter.makeParticles('playerParticle');
    emitter.minParticleSpeed.setTo(-200, -200);
    emitter.maxParticleSpeed.setTo(200, 200);
    emitter.gravity = 0;
    emitter.start(true, 1000, null, 100);
    this.asteroids.kill();
    this.bullet.kill();

    this.game.time.events.add(800, this.gameOver, this);
  },

///////////////////////////////////////////////////////
//Where the game generates the collection coin things
  generateCollectables: function() {
    this.collectables = this.game.add.group();
    this.collectables.enableBody = true;
    this.collectables.physicsBodyType = Phaser.Physics.ARCADE;
if(this.skillLevel == 0){
    var numCollectables = this.game.rnd.integerInRange(100, 150)
    var collectable;

    for (var i = 0; i < numCollectables; i++) {
      //add sprite
      collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'power');
      collectable.animations.add('fly', [0, 1, 2, 3], 5, true);
      collectable.animations.play('fly');
     }
   }
      else if (this.skillLevel == 1){
        var numCollectables = this.game.rnd.integerInRange(SkillLevel.easy[0], SkillLevel.easy[1]);
        var collectable;
        for (var i = 0; i < numCollectables; i++) {
            collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'power');
           collectable.animations.add('fly', [0, 1, 2, 3], 5, true);
            collectable.animations.play('fly');
            }
        }
      else {
        var numCollectables = this.game.rnd.integerInRange(SkillLevel.easy[0], SkillLevel.easy[1]);
        var collectable;
        for (var i = 0; i < numCollectables; i++) {
            collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'power');
            collectable.animations.add('fly', [0, 1, 2, 3], 5, true);
            collectable.animations.play('fly');
            }
        }
  },
    
///////////////////////////////////////////////////////
    
//Where the game will call and generate the astroids and their specs 
generateAsteriods: function() {
    this.asteroids = this.game.add.group();
    this.asteroids.enableBody = true;
if (this.skillLevel == 0){
                 var numAsteroids = this.game.rnd.integerInRange(killLevel.easy[0], SkillLevel.easy[1])
                var asteriod;
				//Tried to see how many popped up here
                console.log(this.numAsteroids);
                for (var i = 0; i < numAsteroids; i++) {
                  asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
               asteriod.scale.setTo(this.game.rnd.integerInRange(SkillLevel.easy[0], SkillLevel.easy[1])/40);
                  asteriod.body.velocity.x = this.game.rnd.pick([-20,20]);
                  asteriod.body.velocity.y = this.game.rnd.pick([-20,20]);
                  asteriod.body.immovable = true;
                  asteriod.body.collideWorldBounds = true;
                }
          }
      else if (this.skillLevel == 1){
                 var numAsteroids = this.game.rnd.integerInRange(killLevel.easy[0], SkillLevel.easy[1])
                var asteriod;
                for (var i = 0; i < numAsteroids/2; i++) {
                  asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
				  //Tried to see how many popped up here
				 console.log(this.numAsteroids); asteriod.scale.setTo(this.game.rnd.integerInRange(SkillLevel.medium[0], SkillLevel.medium[1]/30));
                  asteriod.body.velocity.x = this.game.rnd.pick([-40,40]);
                  asteriod.body.velocity.y = this.game.rnd.pick([-40,40]);
                    asteriod.body.bounce.x=.6;
                    asteriod.body.bounce.y=.6;
                  asteriod.body.immovable = true;
                  asteriod.body.collideWorldBounds = true;
                }
                for (var i = 0; i < numAsteroids/2; i++) {
                  asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
                asteriod.scale.setTo(this.game.rnd.integerInRange(SkillLevel.medium[0], SkillLevel.medium[1]/80));
                  asteriod.body.velocity.x = this.game.rnd.pick([-45,45]);
                  asteriod.body.velocity.y = this.game.rnd.pick([-45,45]);
                    asteriod.body.bounce.x=1;
                    asteriod.body.bounce.y=1;
                  asteriod.body.immovable = true;
                  asteriod.body.collideWorldBounds = true;
                }
          }
      else{
                var numAsteroids = this.game.rnd.integerInRange(SkillLevel.easy[0], SkillLevel.easy[1])
                var asteriod;
                console.log(this.numAsteroids);
                for (var i = 0; i < numAsteroids/2; i++) {
                  asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
                  asteriod.scale.setTo(this.game.rnd.integerInRange(SkillLevel.hard[0], SkillLevel.easy[1])/20);
                  asteriod.body.velocity.x = this.game.rnd.pick([-60,60]);
                  asteriod.body.velocity.y = this.game.rnd.pick([-60,60]);
                asteriod.body.bounce.x=1;
                asteriod.body.bounce.y=1;
                  asteriod.body.immovable = true;
                  asteriod.body.collideWorldBounds = true;
                }
              for (var i = 0; i < numAsteroids/2; i++) {
                  asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
                  asteriod.scale.setTo(this.game.rnd.integerInRange(SkillLevel.hard[0], SkillLevel.easy[1])/80);
                  asteriod.body.velocity.x = this.game.rnd.pick([-80,80]);
                  asteriod.body.velocity.y = this.game.rnd.pick([-80,80]);
                 asteriod.body.bounce.x=2;
                 asteriod.body.bounce.y=2;
                  asteriod.body.immovable = true;
                  asteriod.body.collideWorldBounds = true;
                }
          }
  },
    
///////////////////////////////////////////////////////
    
//Function that kills you when you collide with an astroid
  hitAsteroid: function(player, asteroid) {
    this.explosionSound.play();
    var emitter = this.game.add.emitter(this.player.x, this.player.y, 100);
    emitter.makeParticles('playerParticle');
    emitter.minParticleSpeed.setTo(-200, -200);
    emitter.maxParticleSpeed.setTo(200, 200);
    emitter.gravity = 0;
    emitter.start(true, 1000, null, 100);
    this.player.kill();
    this.game.time.events.add(800, this.gameOver, this);
  },
    
///////////////////////////////////////////////////////
    
//Function that is called when you are killed by an astroid in the game and resets
  gameOver: function() {    
    this.game.state.start('MainMenu', true, false, this.playerScore);
  },
    
///////////////////////////////////////////////////////
    
//This is a function with the parameters of the player and the coin
//To collect the coin and add to the score to determine which level you are in
  collect: function(player, collectable) {
    this.collectSound.play();
    this.playerScore++;
    this.scoreLabel.text = this.playerScore;
    collectable.destroy();
  },
    
///////////////////////////////////////////////////////
    
//Funtion to simply show the label
  showLabels: function() {
    var text = "0";
    var style = { font: "20px Arial", fill: "#fff", align: "center" };
    this.scoreLabel = this.game.add.text(this.game.width-50, this.game.height - 50, text, style);
    this.scoreLabel.fixedToCamera = true;
  },
};

//END