// SlateGray

var g = ga(512, 512, setup)
g.start()

var gameScene, player, playerHit, obstacles, potions, healthBar, left, right, w

function setup() {
  gameScene = g.group()
  w = g.canvas.width

  g.backgroundColor = "navajowhite"

  //Create the player
  player = g.rectangle(32, 32, "dodgerblue")
  player.x = g.canvas.width / 2 - player.width / 2
  player.y = g.canvas.height - 2 * player.height
  g.fourKeyController(player, 5, 38, 39, 40, 37)
  gameScene.addChild(player)

  //Create left and right
  left = g.rectangle(w / 2.5, g.canvas.height, "orange")
  right = g.rectangle(w / 2.5, g.canvas.height, "orange")
  left.x = 0
  right.x = g.canvas.width - right.width

  //Create obstacles at random positions
  obstacles = []
  for (var i = 0; i < 5; i++) {
    var o = g.rectangle(g.randomInt(16, 32), g.randomInt(16, 32), "orange")
    o.y = g.randomInt(-o.halfHeight * 20, -o.halfHeight)
    o.x = g.randomInt(w / 2.5, w - w / 2.5)
    o.vy = 5
    gameScene.addChild(o)
    obstacles.push(o)
  }

  //Create potions at random positions
  potions = []
  for (var i = 0; i < 2; i++) {
    var p = g.rectangle(16, 16, "yellowgreen")
    p.y = g.randomInt(-p.halfHeight * 20, -p.halfHeight)
    var w = g.canvas.width
    p.x = g.randomInt(w / 4, w - w / 4)
    p.vy = 5
    gameScene.addChild(p)
    potions.push(p)
  }

  //Create the health bar
  var outerBar = g.rectangle(128, 16, "black"),
    innerBar = g.rectangle(128, 16, "yellowgreen");
  //Group the inner and outer bars
  healthBar = g.group(outerBar, innerBar);
  //Set the "innerBar" as a property of the "healthBar"
  healthBar.inner = innerBar;
  //Position the health bar
  healthBar.x = g.canvas.width - 148;
  healthBar.y = 16;
  //Add the health bar to the "gameScene"
  gameScene.addChild(healthBar);

  g.state = play
}

function play() {
  g.move(player)
  g.contain(player, g.stage.localBounds)

  //Update obstacles
  obstacles.forEach(function (o) {

    //Move to the top again if at the bottom
    if (o.y > g.canvas.height + o.height) {
      var w = g.canvas.width
      o.x = g.randomInt(w / 4, w - w / 4)
      o.y = g.randomInt(-o.halfHeight * 20, -o.halfHeight)
    }

    g.move(o)

    //Check for collision between obstacle and player
    if (g.hitTestRectangle(player, o)) {
      playerHit = true
    }
  })

  //Update potions
  potions.forEach(function (p) {
    var w = g.canvas.width

    //Move to the top again if at the bottom
    if (p.y > g.canvas.height + p.height) {
      p.x = g.randomInt(w / 4, w - w / 4)
      p.y = g.randomInt(-p.halfHeight * 20, -p.halfHeight)
    }

    g.move(p)

    //Check for collision between potion and player
    if (g.hitTestRectangle(player, p)) {
      var up = 20

      //Update healthbar
      if (healthBar.inner.width + up <= 128) {
        healthBar.inner.width += up
      } else {
        healthBar.inner.width = 128
      }
      p.x = g.randomInt(w / 4, w - w / 4)
      p.y = g.randomInt(-p.halfHeight * 20, -p.halfHeight)
    }


  })

  if (playerHit) {
    player.fillStyle = "slateblue"
    healthBar.inner.width -= 5;
  } else {
    player.fillStyle = "dodgerblue"
  }

  playerHit = false

  if (healthBar.inner.width < 0) {
    player.fillStyle = "crimson"
    g.state = end;
  }
}

function end() {

}