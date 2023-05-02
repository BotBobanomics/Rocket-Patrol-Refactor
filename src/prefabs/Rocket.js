// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.sfxRocket = scene.sound.add('sfx_rocket');

        // add object to existing scene
        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = 2;
    }

    update() {
        // left/right movement with both keys and mouse controls
        if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
            this.x -= this.moveSpeed;
        } 
        else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
            this.x += this.moveSpeed;
        } 
        else if (this.x <= game.config.width - borderUISize - this.width && this.x >= borderUISize + this.width){
            if (game.input.mousePointer.x <= game.config.width - borderUISize - this.width && game.input.mousePointer.x >=borderUISize + this.width){
                this.x = game.input.mousePointer.x;
            }
        }

        // fire button
        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.scene.FIREtext.setVisible(false);
            this.isFiring = true;
            this.sfxRocket.play();
        }

        // mouse fire button
        if (mouse.isDown && !this.isFiring){
            this.scene.FIREtext.setVisible(false);
            this.isFiring = true;
            this.sfxRocket.play();
        }

        // if fired, move up
        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }

        // reset on miss
        if (this.y <= borderUISize * 3 + borderPadding) {
            this.scene.FIREtext.setVisible(true);
            this.isFiring = false;
            this.y = game.config.height - borderUISize - borderPadding;
        }

    }

    reset(){
        this.scene.FIREtext.setVisible(true);
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}