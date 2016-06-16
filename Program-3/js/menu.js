var menuState = {
    create: function() {
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
		
		game.add.tween(startLabel).to({angle: -2}, 500).to({angle: 2}, 1000).to({angle: 0}, 500).loop().start();
		
		
		var tween = game.add.tween(startLabel);
		tween.to({angle: -2}, 500);
		tween.to({angle: 2}, 1000);
		tween.to({angle: 0}, 500);
		tween.loop();
		tween.start();
		
		// Create the tween
		var tween = game.add.tween(nameLabel);
		// Rotate the label to -2 degrees in 500ms
		tween.to({angle: 2}, 500);
		// Then rotate the label to +2 degrees in 1000ms
		tween.to({angle: -2}, 1000);
		// And get back to our initial position in 500ms
		tween.to({angle: 0}, 500);
		// Loop indefinitely the tween
		tween.loop();
		// Start the tween
		tween.start();
		
		// If 'bestScore' is not defined
		// It means that this is the first time the game is played
		if (!localStorage.getItem('bestScore')) {
		// Then set the best score to 0
		localStorage.setItem('bestScore', 0);
		}
		// If the score is higher than the best score
		if (game.global.score > localStorage.getItem('bestScore')) {
		// Then update the best score
		localStorage.setItem('bestScore', game.global.score);
	}
		// Add the button that calls the 'toggleSound' function when pressed
		this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound,this);
    },
	
	// Function called when the 'muteButton' is pressed
toggleSound: function() {
    // Switch the variable from true to false, or false to true
    // When 'game.sound.mute = true', Phaser will mute the game
    game.sound.mute = !game.sound.mute;
    // Change the frame of the button
    this.muteButton.frame = game.sound.mute ? 1 : 0;
},
	
    start: function() {
        // Start the actual game
        game.state.start('play');
    },
}