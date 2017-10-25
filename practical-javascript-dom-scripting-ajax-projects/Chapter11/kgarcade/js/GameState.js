function GameState() {

  // The main timer, 24 frames a second.
  this.gameTimer = null;

  // Count of how many frames have elapsed since the lights last changed.
  this.lightChangeCounter = null;

  // This is essentially a pointer to the current game.  Note that the term
  // "game" is a little loose here because the title screen and the game
  // selection screen are also "games", as far as the code is concerned.
  this.currentGame = new Title();
  this.score = 0;

  // Mode the game is currently in: "title", "gameSelection" or "miniGame".
  this.currentMode = null;

  // Flag variables for player movement.
  this.playerDirectionUp = false;
  this.playerDirectionDown = false;
  this.playerDirectionRight = false;
  this.playerDirectionLeft = false;
  this.playerAction = false;

} // End GameState class.
