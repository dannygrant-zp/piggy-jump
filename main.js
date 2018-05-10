// Create our 'main' state that will contain the game
class MainState {
    preload() { 
        // Load the piggy sprite
        game.load.image('piggy', 'assets/piggy_small.png'); 

        game.load.image('pipe', 'assets/pipe_berry.png');
    }

    create() { 
        // Change the background color of the game to blue
        game.stage.backgroundColor = '#B3DEF4';

        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the piggy at the position x=100 and y=245
        this.piggy = game.add.sprite(100, 245, 'piggy');

        // Add physics to the piggy
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.piggy);

        // Add gravity to the piggy to make it fall
        this.piggy.body.gravity.y = 1000;  

        this.piggy.anchor.setTo(-0.2, 0.5);

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(
                        Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.pipes = game.add.group();

        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });

        this.gameOver = false;
        this.gameOverScore =game.add.text(game.world.centerX, 400, `Score: ${this.score}`, { font: "40px Arial", fill: "#ffffff", align: "center" });
        this.gameOverScore.visible = false;

    }

    update() {
        // If the piggy is out of the screen (too high or too low)
        // Call the 'restartGame' function
        if (this.piggy.y < 0 || this.piggy.y > 490) {
            return this.gameOver();
        }

        game.physics.arcade.overlap(this.piggy, this.pipes, this.hitPipe, null, this);

        if (this.piggy.angle < 20) {
            this.piggy.angle += 1;
        }
    },

    hitPipe() {
        if (this.piggy.alive === false) { return; }

        this.piggy.alive = false;

        game.time.events.remove(this.timer);

        this.pipes.forEach(p => p.body.velocity.x = 0);
    }

    // Make the piggy jump 
    jump() {
        if (this.piggy.alive == false) { return; }

        // Add a vertical velocity to the piggy
        this.piggy.body.velocity.y = -350;

        var animation = game.add.tween(this.piggy);

        animation.to({angle: -20}, 100);

        animation.start();
    }

    gameOver() {
        this.gameOver = true;
        this.gameOverScore.visible = true;

    }

    // Restart the game
    restartGame() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    }

    addOnePipe(x, y) {
        var pipe = game.add.sprite(x, y, 'pipe');

        this.pipes.add(pipe);

        game.physics.arcade.enable(pipe);

        pipe.body.velocity.x = -200;

        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    }

    addRowOfPipes() {
        if (this.gameOver === true) { return; }
        var hole = Math.floor(Math.random() * 5) + 1;

        for (var i = 0; i < 8; i++) {
            if (i !== hole && i !== hole + 1 && i !== hole + 2) {
                this.addOnePipe(400, i * 60 + 10);
            }
        }

        this.score += 1;
        this.labelScore.text = this.score;
    }
}

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', MainState); 

// Start the state to actually start the game
game.state.start('main');