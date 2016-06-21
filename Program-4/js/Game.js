//Aimee Phillips
//https://github.com/Alphillips1016/Mwsu-2D-Gaming-Phillips

//reference for some things: http://jschomay.tumblr.com/post/103568304133/tutorial-building-a-polished-html5-space-shooter
//And phaser examples from github

//Modified space hipster game for learning purposes only!
///////////////////////////////////////////////////////

var SpaceHipster = SpaceHipster || {};

///////////////////////////////////////////////////////
//title screen
///////////////////////////////////////////////////////
SpaceHipster.Game = function(){};


///////////////////////////////////////////////////////
//The function for the game play and creation
///////////////////////////////////////////////////////
SpaceHipster.Game.prototype = {
	create: function() {
        
      //var SkillLevel={};
      //this.SkillLevel.easy = [25,50];
      //this.SkillLevel.medium = [50,150];
      //this.SkillLevel.hard = [150,250];
      //this.cursors;
      //this.bulletTime=0;
        
		//set world dimensions
		this.game.world.setBounds(0, 0, 1920, 1920);

		//background
		this.background = this.game.add.tileSprite(0, 
												0, 
												this.game.world.width, 
												this.game.world.height, 
												'space');

		//create player
		this.player = this.game.add.sprite(this.game.world.centerX, 
										this.game.world.centerY, 
										'playership');
		this.player.scale.setTo(1);
		this.player.anchor.setTo(0.5, 0.5);

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

		//create bullets, the group of them here
		this.bullets = this.game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.createMultiple(30, 'bullet');
		this.bullets.setAll('anchor.x', 0.5);
		this.bullets.setAll('anchor.y', 1);
		this.bullets.setAll('outOfBoundsKill', true);
		this.bullets.setAll('checkWorldBounds', true);
		this.bulletTime = 0;
		this.cursors = this.game.input.keyboard.createCursorKeys(); 
		this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.fireButton.onDown.add(this.fireBullet, this);
		this.wasd = {
			up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
			left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
		};
        
        //sounds
		this.explosionSound = this.game.add.audio('explosion');
		this.collectSound = this.game.add.audio('collect');

	},
    
    
    ///////////////////////////////////////////////////////
    //The update function that updates the game depending on input
    ///////////////////////////////////////////////////////
	update: function() {
		if (this.cursors.up.isDown || this.wasd.up.isDown){
			this.game.physics.arcade.accelerationFromRotation(this.player.rotation,200,this.player.body.acceleration);
		}
		else{
			this.player.body.acceleration.set(0);
		}

		if (this.cursors.left.isDown || this.wasd.left.isDown){
			this.player.body.angularVelocity = -300;
		}
		else if (this.cursors.right.isDown || this.wasd.right.isDown){
			this.player.body.angularVelocity = 300;
		}
		else{
			this.player.body.angularVelocity = 0;
		}

		//collision between player and asteroids or asteroids and other asteroids
		this.game.physics.arcade.overlap(this.player, this.asteroids, this.hitAsteroid, null, this);
		this.game.physics.arcade.collide(this.asteroids, this.asteroids);	

		//overlapping between player and collectables
		this.game.physics.arcade.overlap(this.player, this.collectables, this.collect, null, this);
		this.game.physics.arcade.overlap(this.bullets, this.asteroids, 
										this.explodeAsteroid, null, this);

        //Commented out for the moment; Only if needed
        //if (this.bullet){
        //    if(this.bullet.body.x > this.game.world.width){                     
        //        this.bullet.body.velocity.x = this.bullet.body.velocity.x * -1;   
        //        this.bullet.body.rotation += 90;
        //    }

         //   if(this.bullet.body.x < 0){           
         //       this.bullet.body.velocity.x = this.bullet.body.velocity.x * -1;   
         //       this.bullet.body.rotation -= 90;
          //  }

          //  if(this.bullet.body.y > this.game.world.height){                                          
          //      this.bullet.body.velocity.y = this.bullet.body.velocity.y * -1;
          //      this.bullet.body.rotation += 90;
         //   }

         //   if(this.bullet.body.y < 0){          
         //       this.bullet.body.velocity.y = this.bullet.body.velocity.y * -1;
         //       this.bullet.body.rotation -= 90;
          //  }
       // }
        
        
	},

    ///////////////////////////////////////////////////////
    //Part of the generation of the astroids used to have the random specs like the scale and velocity and spawn points; added bounce
    ///////////////////////////////////////////////////////
	generateAsteroid: function(){
			var spawn = {
				x: this.game.world.randomX,
				y: this.game.world.randomY
			};
            var modder = this.game.rnd.weightedPick(this.game.global.Thearray);
            var Gap = this.game.global.skillLevel * 75;
			while ((spawn.x >= (this.game.world.centerX - Gap) && 
				spawn.x <= (this.game.world.centerX + Gap)) &&
				(spawn.y >= (this.game.world.centerY - Gap) && 
				spawn.y <= (this.game.world.centerY + Gap))){
					spawn.x = this.game.world.randomX;
					spawn.y = this.game.world.randomY;
				}
			var asteriod = this.asteroids.create(spawn.x, spawn.y, 'rock');
			asteriod.scale.setTo(modder / 5);
			asteriod.body.velocity.x = (100 / modder) * this.game.rnd.integerInRange(-2, 2);
			asteriod.body.velocity.y = (100 / modder) * this.game.rnd.integerInRange(-2, 2);
			asteriod.enableBody = true;
            asteriod.body.bounce.x = 1;
			asteriod.body.bounce.y = 1;	
			asteriod.body.collideWorldBounds = true;		
		
	},
    
    
    ///////////////////////////////////////////////////////
    //Supposed to kill the bullet
    ///////////////////////////////////////////////////////
    resetBullet: function(bullet) {
            bullet.kill();
    },
    
    
    ///////////////////////////////////////////////////////
	//Where the game will call and generate the astroids and their specs 
    ///////////////////////////////////////////////////////
	generateAsteriods: function() {
		this.asteroids = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
		var minimum;
		var maximum;
		if (this.game.global.skillLevel == 1){
			minimum = 25;
			maximum = 50;
		}
		else if (this.game.global.skillLevel == 2){
			minimum = 50;
			maximum = 150;
		}
		else{
			minimum = 150;
			maximum = 250;		
		}
		var numAsteroids = this.game.rnd.integerInRange(minimum, maximum);
		for (var i = 0; i < numAsteroids; i++){
			this.generateAsteroid();
		}
    },
    
    ///////////////////////////////////////////////////////
	//Function that kills you when you collide with an astroid
    ///////////////////////////////////////////////////////
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
    //Where the game generates the collection coin things
    ///////////////////////////////////////////////////////
    generateCollectables: function() {
		this.collectables = this.game.add.group();
		this.collectables.enableBody = true;
		this.collectables.physicsBodyType = Phaser.Physics.ARCADE;
		var numCollectables = this.game.rnd.integerInRange(100, 150)
		var collectable;
		for (var i = 0; i < numCollectables; i++) {
			collectable = this.collectables.create(this.game.world.randomX, 
												this.game.world.randomY, 
												'power');
			collectable.animations.add('fly', [0, 1, 2, 3], 5, true);
			collectable.animations.play('fly');
		}
	},
    
    ///////////////////////////////////////////////////////
	//Function that is called when you are killed by an astroid in the game and resets
    ///////////////////////////////////////////////////////
	gameOver: function() {    
	//pass it the score as a parameter 
	this.game.state.start('MainMenu', true, false, this.playerScore);
	},
	
    ///////////////////////////////////////////////////////
    //This is a function with the parameters of the player and the coin
    //To collect the coin and add to the score to determine which level you are in
    ///////////////////////////////////////////////////////
	collect: function(player, collectable) {
	   this.collectSound.play();
	   this.playerScore++;
        this.scoreLabel.text = this.playerScore;
	   collectable.destroy();
	},
    
    ///////////////////////////////////////////////////////
	//Funtion to simply show the label
    ///////////////////////////////////////////////////////
	showLabels: function() {
	//score text
	var text = "0";
	var style = { font: "20px Arial", fill: "#fff", align: "center" };
	this.scoreLabel = this.game.add.text(this.game.width-50, this.game.height - 50, text, style);
	this.scoreLabel.fixedToCamera = true;
	},
    
	///////////////////////////////////////////////////////
	//Supposed to fire the bullet when called upon in update
    ///////////////////////////////////////////////////////
	fireBullet: function(){
		if (this.game.time.now > this.bulletTime)
        {
            this.bullet = this.bullets.getFirstExists(false);

            if (this.bullet)
            {
                this.bullet.rotation = this.player.rotation + Math.PI/2;
                var bs = this.bulletStart(40);
                this.bullet.reset(bs.dx, bs.dy);
                //this.bullet.angularVelocity = 300;
                this.game.physics.arcade.velocityFromRotation(this.player.rotation, 700, this.bullet.body.velocity);
                this.bulletTime = this.game.time.now + 150;
            }
			this.explosionSound.play();
		}
	},
    
	
    ///////////////////////////////////////////////////////
    //Given; Using angle to get the bullet to be at the right angle
    ///////////////////////////////////////////////////////
    bulletStart: function(d){
        return{
            "dx":this.player.x + d * Math.cos(this.player.body.angle),
            "dy":this.player.y + d * Math.sin(this.player.body.angle)
        }
    },
    
    ///////////////////////////////////////////////////////
	//When the bullet hits an astroid; want to destroy it here
    //Have to kill both the bullet and the astroid here
    ///////////////////////////////////////////////////////
	explodeAsteroid: function (bullet, asteriod){
		bullet.kill();
		this.explosionSound.play();
		var emitter2 = this.game.add.emitter(asteriod.x, asteriod.y, 100);
		emitter2.makeParticles('playerParticle');
		emitter2.minParticleSpeed.setTo(-200, -200);
		emitter2.maxParticleSpeed.setTo(200, 200);
		emitter2.gravity = 0;
		emitter2.start(true, 1000, null, 100);
		asteriod.kill();
	},
	
};
///////////////////////////////////////////////////////
//END