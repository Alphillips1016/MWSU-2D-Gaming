var SpaceHipster = SpaceHipster || {};

SpaceHipster.MainMenu = function(){};

SpaceHipster.MainMenu.prototype = {
  init: function(score) {
    var score = score || 0;
    this.highestScore = this.highestScore || 0;

    this.highestScore = Math.max(score, this.highestScore);
   },
  create: function() {
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
    this.background.autoScroll(-20, 0);
    this.game.global = {
    skillLevel: 1,
    Thearray: [3, 4, 5, 6, 7, 8, 9, 10]
	};
     
    //Used Indie Flower Font instead of Ariel
    var text = "Space Hipster";
    var style = { font: "60px Indie Flower", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width/2, this.game.height/2-100, text, style);
    t.anchor.set(0.5);
      
    var text = "Please Click to";
    var style = { font: "30px Indie Flower", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width/2, this.game.height/2-50, text, style);
    t.anchor.set(0.5);
      
    var text = "Choose Level Below...";
    var style = { font: "30px Indie Flower", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width/2, this.game.height/2, text, style);
    t.anchor.set(0.5);
	var onie = this.game.add.button(this.game.width/2 - 200, 
						this.game.height/2 + 50, 'First', 
						this.setLevel, this);	
	var twoie = this.game.add.button(this.game.width/2 -50, 
						this.game.height/2 + 50, 'Second', 
						this.setLevel, this);
	var threeie = this.game.add.button(this.game.width/2 + 110,
						this.game.height/2 + 50, 'Third', 
						this.setLevel, this);			

    //highest score
    text = "Highest score: "+this.highestScore;
    style = { font: "15px Arial", fill: "#fff", align: "center" };
  
    var h = this.game.add.text(this.game.width/2, this.game.height/2 + 200, text, style);
    h.anchor.set(0.5);
  },
  
  update: function() {
  },
  
  setLevel: function(level){
	  if(level.key == "First"){
		this.game.global.skillLevel = 1;
		this.game.state.start('Game')		 
	  }
	  if(level.key == "Second"){
		this.game.global.skillLevel = 2;
		this.game.state.start('Game')
	  }
	  if(level.key == "Third"){
		this.game.global.skillLevel = 3;
		this.game.state.start('Game')		 
	  }
  }
};