//Aimee Phillips
//https://github.com/Alphillips1016/Mwsu-2D-Gaming-Phillips

//reference for some things: http://jschomay.tumblr.com/post/103568304133/tutorial-building-a-polished-html5-space-shooter
///////////////////////////////////////////////////////

var SpaceHipster = SpaceHipster || {};


///////////////////////////////////////////////////////
SpaceHipster.Game = function(){};

///////////////////////////////////////////////////////
//The function for the game play and creation
SpaceHipster.Game.prototype = {

///////////////////////////////////////////////////////
  create: function() {
      
      var SkillLevel={};
      this.SkillLevel.easy = [25,50];
      this.SkillLevel.medium = [50,150];
      this.SkillLevel.hard = [150,250];
      
      
      this.cursors;
      this.bulletTime=0;
      
  	//set world dimensions
      
    this.game.world.setBounds(0, 0, 1920, 1920);
      
    //background
    this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');

    //create player
    this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'playership');
    this.player.scale.setTo(1);

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
      
	//Generates Bullet group
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
      
    for (var i = 0; i < 20; i++)
        {
            var b = this.bullets.create(0, 0, 'bullet');
            b.name = 'bullet' + i;
            b.exists = false;
            b.visible = false;
            b.checkWorldBounds = true;
            b.events.onOutOfBounds.add(this.resetBullet, this);
        }
        
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
	  
  },

///////////////////////////////////////////////////////
//The update function that updates the game depending on input
  update: function() {
        if(this.game.input.activePointer.justPressed()) {
      
            this.game.physics.arcade.moveToPointer(this.player, this.playerSpeed); 
        }
        this.player.body.drag.x = 20;
        this.player.body.drag.y = 20;
        
        
        this.player.rotation = this.player.body.angle;
        

        
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            this.fireBullet();
        }
        
         if (this.bullet){
            if(this.bullet.body.x > this.game.world.width){                     
                this.bullet.body.velocity.x = this.bullet.body.velocity.x * -1;   
                this.bullet.body.rotation += 90;
            }

            if(this.bullet.body.x < 0){           
                this.bullet.body.velocity.x = this.bullet.body.velocity.x * -1;   
                this.bullet.body.rotation -= 90;
            }

            if(this.bullet.body.y > this.game.world.height){                                          
                this.bullet.body.velocity.y = this.bullet.body.velocity.y * -1;
                this.bullet.body.rotation += 90;
            }

            if(this.bullet.body.y < 0){          
                this.bullet.body.velocity.y = this.bullet.body.velocity.y * -1;
                this.bullet.body.rotation -= 90;
            }
        }
      
      
    //collision between player and asteroids
    this.game.physics.arcade.collide(this.player, this.asteroids, this.hitAsteroid, null, this);

    //overlapping between player and collectables
    this.game.physics.arcade.overlap(this.player, this.collectables, this.collect, null, this);
      
    this.game.physics.arcade.collide(this.bullet,this.asteroids, this.BullethitsAsteroid, null, this);
    
  },
    
 ///////////////////////////////////////////////////////
//Supposed to kill the bullet
resetBullet: function(bullet) {
            bullet.kill();
 },
    
///////////////////////////////////////////////////////
 //Supposed to fire the bullet when called upon in update
fireBullet: function () {
        console.log(this.game.time.now);
        console.log(this.bulletTime);
        if (this.game.time.now > this.bulletTime)
        {
            console.log('fire');
            this.bullet = this.bullets.getFirstExists(false);

            if (this.bullet)
            {
                this.bullet.rotation = this.player.rotation + Math.PI/2;
                var bs = this.bulletStart(40);
                this.bullet.reset(bs.dx,bs.dy);
                //this.bullet.angularVelocity = 300;
                this.game.physics.arcade.velocityFromRotation(this.player.rotation, 700, this.bullet.body.velocity);
                this.bulletTime = this.game.time.now + 150;
            }
        }

    },
        
///////////////////////////////////////////////////////

bulletStart: function(d){
        return{
            "dx":this.player.x + d * Math.cos(this.player.body.angle),
            "dy":this.player.y + d * Math.sin(this.player.body.angle)
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
    this.asteroid.kill();
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
    if (this.skillLevel == 2){
                var numAsteroids = this.game.rnd.integerInRange(SkillLevel.hard[0], SkillLevel.hard[1])
                var asteriod;
                console.log(this.numAsteroids);
                for (var i = 0; i < numAsteroids/2; i++) {
                  asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
                  asteriod.scale.setTo(this.game.rnd.integerInRange(SkillLevel.hard[0], SkillLevel.hard[1])/20);
                  asteriod.body.velocity.x = this.game.rnd.pick([-60,60]);
                  asteriod.body.velocity.y = this.game.rnd.pick([-60,60]);
                asteriod.body.bounce.x=1;
                asteriod.body.bounce.y=1;
                  asteriod.body.immovable = true;
                  asteriod.body.collideWorldBounds = true;
                }
              for (var i = 0; i < numAsteroids/2; i++) {
                  asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
                  asteriod.scale.setTo(this.game.rnd.integerInRange(SkillLevel.hard[0], SkillLevel.hard[1])/80);
                  asteriod.body.velocity.x = this.game.rnd.pick([-80,80]);
                  asteriod.body.velocity.y = this.game.rnd.pick([-80,80]);
                 asteriod.body.bounce.x=2;
                 asteriod.body.bounce.y=2;
                  asteriod.body.immovable = true;
                  asteriod.body.collideWorldBounds = true;
                }
          }
      else if (this.SkillLevel == 1){
                var numAsteroids = this.game.rnd.integerInRange(SkillLevel.medium[0], SkillLevel.medium[1])
                var asteriod;

                for (var i = 0; i < numAsteroids/2; i++) {
                  //add sprite
                  asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
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
                for (var i = 0; i < numAsteroids; i++) {
                  asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
                  asteriod.scale.setTo(this.game.rnd.integerInRange(SkillLevel.easy[0], SkillLevel.easy[1])/40);
                  asteriod.body.velocity.x = this.game.rnd.pick([-20,20]);
                  asteriod.body.velocity.y = this.game.rnd.pick([-20,20]);
                  asteriod.body.immovable = true;
                  asteriod.body.collideWorldBounds = true;
          }
      }
    console.log(this.skillLevel);
},
    
///////////////////////////////////////////////////////
    
//Function that kills you when you collide with an astroid
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
    
///////////////////////////////////////////////////////
    
//Function that is called when you are killed by an astroid in the game and resets
  gameOver: function() {    
    //pass it the score as a parameter 
    this.game.state.start('MainMenu', true, false, this.playerScore);
  },
    
///////////////////////////////////////////////////////
    
//This is a function with the parameters of the player and the coin
//To collect the coin and add to the score to determine which level you are in
  collect: function(player, collectable) {
    //play collect sound
    this.collectSound.play();

    //update score
    this.playerScore++;
    this.scoreLabel.text = this.playerScore;

    //remove sprite
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
