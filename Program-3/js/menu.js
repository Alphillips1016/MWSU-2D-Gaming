var menuState = {
    create: function() {
		
		var text;
		if (game.device.desktop) {
			text = 'press the up arrow key to start';
		}
		else {
			text = 'touch the screen to start';
		}

		var startLabel = game.add.text(game.width/2, game.height-80, text, { font: '25px Arial', fill: '#ffffff' });
		
        game.add.image(0, 0, 'background');
		
        var nameLabel = game.add.text(game.width/2, 80, 'Lil Bunny', { font: '50px Arial', fill: '#ffffff' });
		
        nameLabel.anchor.setTo(0.5, 0.5);
		
        var text = 'score: ' + game.global.score + '\nbest score: ' + localStorage.getItem('bestScore');
		
		var scoreLabel = game.add.text(game.width/2, game.height/2, text, { font: '25px Arial', fill: '#ffffff', align: 'center' });
        
		scoreLabel.anchor.setTo(0.5, 0.5);
		
        var startLabel = game.add.text(game.width/2, game.height-80,
            'press the up arrow key to start',
            { font: '25px Arial', fill: '#ffffff' });
        
		startLabel.anchor.setTo(0.5, 0.5);
        
		var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		upKey.onDown.add(this.start, this);
		
		if (!game.device.desktop) {
			game.input.onDown.add(this.start, this);
		}
		
		game.add.tween(startLabel).to({angle: -2}, 500).to({angle: 2}, 1000).to({angle: 0}, 500).loop().start();
		
		
		var tween = game.add.tween(startLabel);
		tween.to({angle: -2}, 500);
		tween.to({angle: 2}, 1000);
		tween.to({angle: 0}, 500);
		tween.loop();
		tween.start();
		
		var tween = game.add.tween(nameLabel);
		tween.to({angle: 2}, 500);
		tween.to({angle: -2}, 1000);
		tween.to({angle: 0}, 500);
		tween.loop();
		tween.start();
		
		if (!localStorage.getItem('bestScore')) {
			localStorage.setItem('bestScore', 0);
		}
		
		if (game.global.score > localStorage.getItem('bestScore')) {
			localStorage.setItem('bestScore', game.global.score);
		}
	
		this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound,this);
   
		if (!game.device.desktop && game.input.y < 50 && game.input.x < 60) {
			return;
		}

   },
	
	
	
	// Function called when the 'muteButton' is pressed
toggleSound: function() {
    game.sound.mute = !game.sound.mute;
    this.muteButton.frame = game.sound.mute ? 1 : 0;
},
	
    start: function() {
        // Start the actual game
        game.state.start('play');
    },
}