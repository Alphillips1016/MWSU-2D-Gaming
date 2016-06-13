//Aimee Phillips - No Group - Roster 19
//http://107.170.128.7/Mwsu-2D-Gaming-Phillips/First_Project/
//Aimee Phillips/First_Project/
//http://107.170.128.7/Mwsu-2D-Gaming-Phillips/First_Project/
//Roster 19
//This is the first assigned project of playing with the game functions and physics

//This is the main state of the game
var mainState = {

    preload: function() {
        game.load.image('player', 'assets/Bunny.png');
        game.load.image('wallV', 'assets/wallVertical.png');
        game.load.image('wallH', 'assets/wallHorizontal.png');
        game.load.image('coin', 'assets/Carrot.png');
        game.load.image('enemy', 'assets/Ghost.png');
    },
	
    create: function() { 
	//This is to create the Timer in the top right corner
		var me = this;
 
		me.startTime = new Date();
		me.totalTime = 120;
		me.timeElapsed = 0;
 
		me.createTimer();
 
		me.gameTimer = game.time.events.loop(100, function(){
			me.updateTimer();
		});
	//=============================================
	
	//Given code, and changed the background color here
        game.stage.backgroundColor = '#CC99CC';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.renderer.renderSession.roundPixels = true;

        this.cursor = game.input.keyboard.createCursorKeys();
        
        this.player = game.add.sprite(game.width/2, game.height/2, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500;

        this.createWorld();

        this.coin = game.add.sprite(60, 140, 'coin');
        game.physics.arcade.enable(this.coin); 
        this.coin.anchor.setTo(0.5, 0.5);
		
	//This is for the deathcount added to the bottom right corner of the game
		this.deathcount = game.add.text(390,300, 'Deaths: 0', {font: '18px Arial', fill: '#ffffff' });
		this.deaths = 0;
	//This is the score in the top left corner of the game
        this.scoreLabel = game.add.text(30, 30, 'Score: 0', { font: '18px Arial', fill: '#ffffff' });
        this.score = 0;

        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');
        game.time.events.loop(2200, this.addEnemy, this);
    },
	
    update: function() {
        game.physics.arcade.collide(this.player, this.walls);
        game.physics.arcade.collide(this.enemies, this.walls);
        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
		
        this.movePlayer(); 
		
//If the player goes out of the world bounds then instead of restarting the game i threw in the previous added 
//function to update the location of the player randomly
        if (!this.player.inWorld) {
            this.UpdatePlayerLocation();
        }
    },
	
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
	
//Creates and runs the timer here in the top right corner of the screen
//========================================
	createTimer: function(){
 
    var me = this;
 
    me.timeLabel = me.game.add.text(440,30, '', {font: '18px Arial', fill: '#ffffff' }); 
    me.timeLabel.anchor.setTo(0.5, 0);
    me.timeLabel.align = 'center';
 
},
	
	updateTimer: function(){
 
    var me = this;
 
    var currentTime = new Date();
    var timeDifference = me.startTime.getTime() - currentTime.getTime();
 
    //Time elapsed in seconds
    me.timeElapsed = Math.abs(timeDifference / 1000);
 
    //Time remaining in seconds
    var timeRemaining = me.totalTime - me.timeElapsed; 
 
    //Convert seconds into minutes and seconds
    var minutes = Math.floor(timeRemaining / 60);
    var seconds = Math.floor(timeRemaining) - (60 * minutes);
 
    //Display minutes, add a 0 to the start if less than 10
    var result = (minutes < 10) ? "0" + minutes : minutes; 
 
    //Display seconds, add a 0 to the start if less than 10
    result += (seconds < 10) ? ":0" + seconds : ":" + seconds; 
 
    me.timeLabel.text = result;
 
	if(me.timeElapsed >= me.totalTime){
    game.lockRender = true;
	};
},
//================================================
	
//This moces the player and sets the velocity and game physics
    movePlayer: function() {
        if (this.cursor.left.isDown) {
            this.player.body.velocity.x = -200;
        }
        else if (this.cursor.right.isDown) {
            this.player.body.velocity.x = 200;
        }
        else {
            this.player.body.velocity.x = 0;
        }

        if (this.cursor.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -320;
        }      
    },

//This is what happens when a coin is taken, which updates the score counter
    takeCoin: function(player, coin) {
        this.score += 5;
        this.scoreLabel.text = 'Score: ' + this.score;

        this.updateCoinPosition();
    },
	
//This update the coins position after it is already taken by the player
//It has positions already set to be selected randomly
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

//This adds the enemy and creates one after one has died as well off the screen
//Also changed the tint of the enemies
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

//This creates the world, adding the walls and sprites
    createWorld: function() {
        this.walls = game.add.group();
        this.walls.enableBody = true;

        game.add.sprite(0, 0, 'wallV', 0, this.walls); 
        game.add.sprite(480, 0, 'wallV', 0, this.walls); 
        game.add.sprite(0, 0, 'wallH', 0, this.walls); 
        game.add.sprite(300, 0, 'wallH', 0, this.walls);
        game.add.sprite(0, 320, 'wallH', 0, this.walls); 
        game.add.sprite(300, 320, 'wallH', 0, this.walls); 
        game.add.sprite(-100, 160, 'wallH', 0, this.walls); 
        game.add.sprite(400, 160, 'wallH', 0, this.walls); 
        var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
        middleTop.scale.setTo(1.5, 1);
        var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
        middleBottom.scale.setTo(1.5, 1);

        this.walls.setAll('body.immovable', true);
    },

//This is the function for when the player dies, it is set to count the deaths and
//I just made the player respawn back but not reset the score as assigned
    playerDie: function() {
		this.deaths += 1;
		this.deathcount.text = 'Deaths: ' + this.deaths;
		this.UpdatePlayerLocation();
    },
};

var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');
game.state.add('main', mainState);
game.state.start('main');
