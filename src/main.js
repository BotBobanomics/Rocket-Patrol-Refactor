// Brennen Tsang
// Rocket Patrol: Modded
// 6 hours
//--------------------------------------------------------------------------------
// Mods added:
// Track a high score that persists across scenes and display it in the UI (5)
// Implement the 'FIRE' UI text from the original game (5)
// Implement the speed increase that happens after 30 seconds in the original game (5)
// Allow the player to control the Rocket after it's fired (5)
// Display the time remaining (in seconds) on the screen (10)
// Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (15)
// Implement a new timing/scoring mechanism that adds time to the clock for successful hits (15)
// Implement mouse control for player movement and mouse click to fire (15)
//--------------------------------------------------------------------------------
// Sources:
// https://michael-karen.medium.com/how-to-save-high-scores-in-local-storage-7860baca9d68 (Used as reference for high score)
// https://phaser.discourse.group/t/countdown-timer/2471/4 (Used as reference for displaying Timer)

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

//set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyF, keyR, keyM, keyLEFT, keyRIGHT, mouse;
