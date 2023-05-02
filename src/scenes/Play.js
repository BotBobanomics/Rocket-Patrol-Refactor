class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/title sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        this.ship04 = new Spaceship(this, game.config.width, borderUISize*5 + borderPadding*2.5, 'spaceship', 0, 50).setOrigin(0,0);

        // define keys
        mouse = this.input.mousePointer;
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate:30
        });
        // initialize score
        this.p1Score = 0;
        if (localStorage.getItem("score") == undefined){
            this.HiScore = 0;
        }
        else {
            this.HiScore = localStorage.getItem("score");
        }

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        // display FIRE text
        let FireConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);
        this.scoreRight = this.add.text(borderUISize + borderPadding * 12, borderUISize + borderPadding * 2, 'HI:' + this.HiScore, scoreConfig);
        this.FIREtext = this.add.text(270, borderUISize + borderPadding * 2, 'FIRE', FireConfig)
        // GAME OVER flag
        this.gameOver = false;
        
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or (M) for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        // Display clock
        this.TimeTicking = game.settings.gameTimer;
        this.TimeLeft = this.add.text(470 - (borderUISize + borderPadding), borderUISize + borderPadding * 2, 'Time: ' + this.formatTime(this.TimeTicking), scoreConfig);
        this.timedEvent = this.time.addEvent({delay: 1000, callback: () => {
            this.TimeTicking = this.TimeTicking - 1000;
            this.TimeLeft.text = 'Time: ' + this.formatTime(this.TimeTicking);
        }, scope: this, loop: true});

        // Speedup Ship Timer
        this.Faster = game.settings.spaceshipSpeed;
        this.smallFaster = game.settings.spaceshipSpeed + 2;
        //this.OG_speedup_Time = (game.settings.gameTimer - 30000);
        this.SpeedUp_Timer = this.time.delayedCall(30000, () => {
            this.Faster = game.settings.spaceshipSpeed * 1.5;
            this.smallFaster = game.settings.spaceshipSpeed * 1.5;
        }, null, this);
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyM)) {
            this.scene.start("menuScene");
        }
        
        this.starfield.tilePositionX -= 4;
        
        if (!this.gameOver) {
            this.p1Rocket.update();
            this.ship01.update(this.Faster);
            this.ship02.update(this.Faster);
            this.ship03.update(this.Faster);
            this.ship04.update(this.smallFaster);
        }

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship04)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
            this.TimeTicking += 2000;
            game.settings.gameTimer += 2000;
        }

        if (this.checkCollision(this.p1Rocket, this.ship03)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
            this.TimeTicking += 2000;
            game.settings.gameTimer += 2000;
        }

        if (this.checkCollision(this.p1Rocket, this.ship02)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
            this.TimeTicking += 3000;
            game.settings.gameTimer += 3000;
        }

        if (this.checkCollision(this.p1Rocket, this.ship01)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
            this.TimeTicking += 4000;
            game.settings.gameTimer += 4000;
        }
    }

    checkCollision(rocket, ship){
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y){
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship){
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        if (this.p1Score > this.HiScore){
            this.HiScore = this.p1Score;
            localStorage.setItem("score", this.HiScore);
        }
        this.scoreRight.text = "HI:" + this.HiScore;
        this.sound.play('sfx_explosion');
    }

    formatTime(ms){
        // convert milisecond to seconds
        let seconds = ms/1000;
        // convert seconds to minute
        let minutes = Math.floor(seconds/60);
        // Amount of seconds left
        let partInSeconds = seconds%60;
        if (ms < 0){
            minutes = 0;
            partInSeconds = 0;
        }
        partInSeconds = partInSeconds.toString().padStart(2,'0');
        return `${minutes}:${partInSeconds}`
    }
}