var g = ga(512, 512, setup);

var gameScene, player;

function setup() {
  player = g.rectangle(32, 32, "blue");
  player.x = 68;
  player.y = g.canvas.height / 2 - player.halfHeight;
  g.fourKeyController(player, 5, 38, 39, 40, 37);

  gameScene = g.group();
  gameScene.addChild(player);

  message = g.text("Game Over!", "64px Futura", "black", 20, 20);
  message.content = "You Won!";

  g.state = play;
}

function play() {
  g.move(player);

  g.contain(player, g.stage.localBounds);

  if (g.hitTestRectangle(player, enemy)) {
    playerHit = true;
  }

  player.alpha = 0.5;
}