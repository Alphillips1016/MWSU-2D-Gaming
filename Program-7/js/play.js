/////////////////////////////////////////////////////////////
//Aimee Phillips - No Group - Roster 19
//				Versions
//http://107.170.128.7/Mwsu-2D-Gaming-Phillips/First_Project/
//http://107.170.128.7/Mwsu-2D-Gaming-Phillips/Program-2/
//http://107.170.128.7/Mwsu-2D-Gaming-Phillips/Program-3/

//				GitHub
//https://github.com/Alphillips1016/Mwsu-2D-Gaming-Phillips
//Roster 19

//////////////////////////////////////////////////////////////

//The play state functin where everything in this state is ran

var playState = {
    
	create: function() {
		this.createWorld();

		var sound = game.sound.volume =0.5;
		this.music = game.add.audio('music'); // Add the music
		this.music.loop = true; // Make it loop
		this.music.play(); // Start the music
		game.stage.backgroundColor = '#AB5BA4';
		
		var me = this;
		me.startTime = new Date();
		me.totalTime = 120;
		me.timeElapsed = 0;
		me.createTimer();
		me.gameTimer = game.time.events.loop(100, function(){
			me.updateTimer();
		});

		this.jumpSound = game.add.audio('jump');
		this.coinSound = game.add.audio('coin');
		this.deadSound = game.add.audio('dead');
	
        this.cursor = game.input.keyboard.createCursorKeys();
        this.wasd = {
			up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
			down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
			left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
		};
		
		
        this.player = game.add.sprite(game.width/2, game.height/2, 'player');
		
        game.physics.arcade.enable(this.player);
		this.player.anchor.setTo(0.5, 0.5);
        
        this.player.body.gravity.y = 500;

        this.coin = game.add.sprite(60, 140, 'coin');
        game.physics.arcade.enable(this.coin); 
        this.coin.anchor.setTo(0.5, 0.5);

        this.scoreLabel = game.add.text(30, 30, 'Score: 0', { font: '18px Arial', fill: '#ffffff' });
        game.global.score = 0;

        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');
        game.time.events.loop(2200, this.addEnemy, this);
	
		this.emitter = game.add.emitter(0, 0, 15);
		this.emitter.makeParticles('pixel');
		this.emitter.setYSpeed(-150, 150);
		this.emitter.setXSpeed(-150, 150);
		this.emitter.setScale(2, 0, 2, 0, 800);
		this.emitter.gravity = 0;
		
		this.player.animations.add('right', [3, 4], 8, true);
		this.player.animations.add('left', [1, 2], 8, true);
    
		if (!game.device.desktop) {
			this.addMobileInputs();
		}
		
		if(!game.device.desktop){
			game.scale.onOrientationChange.add(this.orientationChange, this);
			this.rotateLabel = game.add.text(game.width/2, game.height/2, '',
			{ font: '30px Arial', fill: '#fff', backgroundColor: '#000' });
			this.rotateLabel.anchor.setTo(0.5, 0.5);
			this.orientationChange();
		}
		
	},
	
	
    update: function() {
		
        game.physics.arcade.collide(this.player, this.layer);
        game.physics.arcade.collide(this.enemies, this.layer);
        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
		
        this.movePlayer(); 
		
//If the player goes out of the world bounds then instead of restarting the game i threw in the previous added 
//function to update the location of the player randomly
        if (!this.player.inWorld) {
			this.deadSound.play();
			game.camera.flash(0xffffff, 300);
            this.UpdatePlayerLocation();
        }
		
		if (!this.player.alive) {
			return;
		}
		
    },
	
//This is the function to decide the actions of the movement of the player and what happens
    movePlayer: function() {
		
		if (game.input.totalActivePointers == 0) {
			this.moveLeft = false;
			this.moveRight = false;
		}

        if (this.cursor.left.isDown || this.wasd.left.isDown ||  this.moveLeft) {
            this.player.body.velocity.x = -200;
			this.player.animations.play('left'); // Left animation
			this.player.scale.x=1;
        }
        else if (this.cursor.right.isDown || this.wasd.right.isDown || this.moveRight) {
            this.player.body.velocity.x = 200;
			this.player.animations.play('left'); // Right animation
			this.player.scale.x=-1;
        }
        else {
            this.player.body.velocity.x = 0;
			this.player.animations.stop(); // Stop animations
			this.player.frame = 0; // Change frame (stand still)
        }

        if ((this.cursor.up.isDown || this.wasd.up.isDown) && this.player.body.onFloor()) {
			this.jumpPlayer();
			this.jumpSound.play();
			this.player.body.velocity.y = -320;
		}
    },
	
//This is the function where the player will take a coin and this will spawn another and add
//to the score
    takeCoin: function(player, coin) {
		game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 100).yoyo(true).start();
		this.coin.scale.setTo(0, 0);
		game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();
		this.coinSound.play();
        game.global.score += 5;
        this.scoreLabel.text = 'score: ' + game.global.score;
        this.updateCoinPosition();
    },
	
//Used in the previous, this changes the coin location to random spots
    updateCoinPosition: function() {
        var coinPosition = [
            {x: 140, y: 60}, {x: 360, y: 60}, 
            {x: 60, y: 140}, {x: 440, y: 140}, 
            {x: 130, y: 300}, {x: 370, y: 300} 
        ];

        for (var i = 0; i < coinPosition.length; i++) {
            if (coinPosition[i].x == this.coin.x) {
                coinPosition.splice(i, 1);
            }
        }

        var newPosition = game.rnd.pick(coinPosition);
        this.coin.reset(newPosition.x, newPosition.y);
    },
	
//This is to add enemies to the world if dead or anything else with their physics
    addEnemy: function() {
        var enemy = this.enemies.getFirstDead();

        if (!enemy) {
            return;
        }
		enemy.tint = Math.random() * 0xffffff;
        enemy.anchor.setTo(0.5, 1);
        enemy.reset(game.width/2, 0);
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 100 * game.rnd.pick([-1, 1]);
        enemy.body.bounce.x = 1;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
    },
	
	
//This is the function to create the world and walls in it
    createWorld: function() {
    this.map = game.add.tilemap('map');
    this.map.addTilesetImage('tileset');
    this.layer = this.map.createLayer('Tile Layer 1');
    this.layer.resizeWorld();
    this.map.setCollision(1);
	},
	
//This is the player death function; music stops,player dies with sound and ends the game
	playerDie: function() {
		this.music.stop();
		this.player.kill();
		this.deadSound.play();
		this.emitter.x = this.player.x;
		this.emitter.y = this.player.y;
		this.emitter.start(true, 800, null, 15);
		game.camera.shake(0.02, 300);		
		game.time.events.add(1000, this.startMenu, this);	
		
    },
	
//This is to update the player location when one drops out of the world
	UpdatePlayerLocation: function() {
        var PlayerPosition = [
            {x: 120, y: 60}, {x: 320, y: 60}, 
            {x: 40, y: 140}, {x: 420, y: 140}, 
            {x: 110, y: 300}, {x: 340, y: 300},
			{x: 180, y: 140}, {x: 200, y: 140},
			{x: 150, y: 40}, {x: 20, y:140}
        ];

        for (var i = 0; i < PlayerPosition.length; i++) {
            if (PlayerPosition[i].x == this.player.x) {
                PlayerPosition.splice(i, 1);
            }
        }

        var newPosition = game.rnd.pick(PlayerPosition);
        this.player.reset(newPosition.x, newPosition.y);
	},
	
	jumpPlayer: function() {
		if (this.player.body.onFloor()) {
			this.player.body.velocity.y = -320;
			this.jumpSound.play();
		}
	},
	
	addMobileInputs: function() {

		var jumpButton = game.add.sprite(350, 240, 'jumpButton');
		jumpButton.inputEnabled = true;
		jumpButton.alpha = 0.5;
		jumpButton.events.onInputDown.add(this.jumpPlayer, this);
		
		this.moveLeft = false;
		this.moveRight = false;

		var leftButton = game.add.sprite(50, 240, 'leftButton');
		leftButton.inputEnabled = true;
		leftButton.alpha = 0.5;
		leftButton.events.onInputOver.add(this.setLeftTrue, this);
		leftButton.events.onInputOut.add(this.setLeftFalse, this);
		leftButton.events.onInputDown.add(this.setLeftTrue, this);
		leftButton.events.onInputUp.add(this.setLeftFalse, this);

		var rightButton = game.add.sprite(130, 240, 'rightButton');
		rightButton.inputEnabled = true;
		rightButton.alpha = 0.5;
		rightButton.events.onInputOver.add(this.setRightTrue, this);
		rightButton.events.onInputOut.add(this.setRightFalse, this);
		rightButton.events.onInputDown.add(this.setRightTrue, this);
		rightButton.events.onInputUp.add(this.setRightFalse, this);
	},

// Basic functions that are used in our callbacks
	setLeftTrue: function() {
		this.moveLeft = true;
	},
	
	setLeftFalse: function() {
		this.moveLeft = false;
	},
	
	setRightTrue: function() {
		this.moveRight = true;
	},
	
	setRightFalse: function() {
		this.moveRight = false;
	},
	
//This is the function used to create the timer
	createTimer: function(){
 
		var me = this;
 
		me.timeLabel = me.game.add.text(440,30, '', {font: '18px Arial', fill: '#ffffff' }); 
		me.timeLabel.anchor.setTo(0.5, 0);
		me.timeLabel.align = 'center';
 
	},
	
//This is the funnction used to update the timer that is running in the top corner
	updateTimer: function(){
    var me = this;
    var currentTime = new Date();
    var timeDifference = me.startTime.getTime() - currentTime.getTime();
    me.timeElapsed = Math.abs(timeDifference / 1000);
    var timeRemaining = me.totalTime - me.timeElapsed; 
    var minutes = Math.floor(timeRemaining / 60);
    var seconds = Math.floor(timeRemaining) - (60 * minutes);
    var result = (minutes < 10) ? "0" + minutes : minutes; 
    result += (seconds < 10) ? ":0" + seconds : ":" + seconds; 
    me.timeLabel.text = result;
	if(me.timeElapsed >= me.totalTime){
    game.lockRender = true;
	};
},

	orientationChange: function() {
		if (game.scale.isPortrait) {
			game.paused = true;
			this.rotateLabel.text = 'rotate your device in landscape';
		}
		else {
			game.paused = false;
			this.rotateLabel.text = '';
		}
},

startMenu: function() {
    game.state.start('menu');
},
};