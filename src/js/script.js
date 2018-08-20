/* eslint no-undef: 0 */

var gameScene
var player
var playerHit
var obstacles
var potions
var line
var wobble
var scoreText
var highScore

const w = 512
const obstacleDamage = 1
const lineDamage = 0.2
const potionHealth = 8
var speed = 4
var score = 0

var g = ga(w, w, setup)
g.start()

function setup() {
  gameScene = g.group()

  g.backgroundColor = 'navajowhite'

  // Create line
  line = g.rectangle(5, g.canvas.height, 'yellowgreen')
  line.x = w / 2 - 5 / 2
  line.y = 0
  gameScene.addChild(line)

  // Create obstacles at random positions
  obstacles = []
  for (let i = 0; i < 5; i++) {
    var o = g.rectangle(g.randomInt(16, 32), g.randomInt(16, 32), 'orange')
    o.y = g.randomInt(-o.halfHeight * 20, -o.halfHeight)
    o.x = g.randomInt(w / 2.5, w - w / 2.5)
    o.vy = speed
    gameScene.addChild(o)
    obstacles.push(o)
  }

  // Create potions at random positions
  potions = []
  for (let i = 0; i < 2; i++) {
    var p = g.rectangle(16, 16, 'dodgerblue')
    p.y = g.randomInt(-p.halfHeight * 20, -p.halfHeight)
    p.x = g.randomInt(w / 4, w - w / 4)
    p.vy = speed
    gameScene.addChild(p)
    potions.push(p)
  }

  // Create the player
  var outerBar = g.rectangle(32, 32, 'black')
  var innerBar = g.rectangle(32, 32, 'dodgerblue')
  // Group the inner and outer bars
  player = g.group(outerBar, innerBar)
  // Set the "innerBar" as a property of the "player"
  player.outer = outerBar
  player.inner = innerBar
  player.x = g.canvas.width / 2 - player.width / 2
  player.y = g.canvas.height - 2 * player.height
  g.fourKeyController(player, speed, 38, 39, 40, 37)
  gameScene.addChild(player)

  // Create score text
  scoreText = g.text("0", "32px Tahoma", "dodgerblue", 20, 20);

  // Check for highscore
  highScore = localStorage.getItem("highScore")
  if (highScore) document.getElementById("debug").innerHTML = highScore

  g.state = play
}

function play() {
  // Speed up the game gradually
  speed = speed * 1.0001
  // document.getElementById('debug').innerHTML = JSON.stringify(speed)

  g.move(player)
  g.contain(player, g.stage.localBounds)

  // Update obstacles
  obstacles.forEach((o) => {
    // Move to the top again if at the bottom
    if (o.y > g.canvas.height + o.height) {
      var w = g.canvas.width
      o.x = g.randomInt(w / 4, w - w / 4)
      o.y = g.randomInt(-o.halfHeight * 20, -o.halfHeight)
    }

    g.move(o)

    // Check for collision between obstacle and player
    if (g.hitTestRectangle(player, o)) {
      playerHit = true
    }

    // Speed up
    o.vy = speed
  })

  // Update potions
  potions.forEach((p) => {
    var w = g.canvas.width

    // Move to the top again if at the bottom
    if (p.y > g.canvas.height + p.height) {
      p.x = g.randomInt(w / 4, w - w / 4)
      p.y = g.randomInt(-p.halfHeight * 20, -p.halfHeight)
    }

    g.move(p)

    // Check for collision between potion and player
    if (g.hitTestRectangle(player, p)) {
      if (wobble) {
        g.tweens = []
        wobble.tweens = []
        player.scaleX = 1
        player.scaleY = 1
      }
      wobble = g.wobble(player, 1.2, 1.2, 10, 10, 10, -10, -10, 0.9, true)

      // Create particles
      particles(p, 'dodgerblue', 20)
      playBubbles()
      // Update healthbar
      if (player.inner.height + potionHealth <= 32) {
        player.inner.y -= potionHealth
        player.inner.height += potionHealth
      } else {
        player.inner.y = 0
        player.inner.height = 32
      }
      p.x = g.randomInt(w / 4, w - w / 4)
      p.y = g.randomInt(-p.halfHeight * 20, -p.halfHeight)
    }

    // Speed up
    p.vy = speed
  })

  if (playerHit) {
    player.inner.fillStyle = 'slateblue'
    player.inner.y += obstacleDamage
    player.inner.height -= obstacleDamage
    particles(player, 'orange', 5)
  } else {
    player.inner.fillStyle = 'dodgerblue'
  }

  playerHit = false

  // Check for collision with line
  if (!g.hitTestRectangle(player, line)) {
    player.inner.y += lineDamage
    player.inner.height -= lineDamage
    player.inner.fillStyle = 'slateblue'
    line.fillStyle = 'slateblue'
  } else {
    line.fillStyle = 'yellowgreen'
    score++
    scoreText.content = Math.floor(score / 10)
  }

  if (player.inner.height <= 0) {
    player.outer.fillStyle = 'tomato'
    particles(player, 'tomato', 20)

    // Check if highscore
    if (score > Number(highScore)) {
      highScore = Math.floor(score / 10)
      localStorage.setItem("highScore", highScore)
      document.getElementById("debug").innerHTML = highScore
    }

    g.state = end
  }
}

function end() {
  g.key.space.press = function () {
    location.reload()
  };
}

function particles(element, color, amount) {
  g.particleEffect(
    element.x + 16, // The particle’s starting x position
    element.y + 16, // The particle’s starting y position
    function () { // Particle function
      return g.rectangle(8, 8, color)
    },
    amount, // Number of particles
    0.1, // Gravity
    true, // Random spacing
    0, 6.28, // Min/max angle
    4, 8, // Min/max size
    1, 2, // Min/max speed
    0.005, 0.01, // Min/max scale speed
    0.005, 0.01, // Min/max alpha speed
    0.05, 0.1 // Min/max rotation speed
  )
}

function playBubbles() {
  g.soundEffect(0, 0.05, 0.05, 'sine', 1, 0, 0, 1000, true, 1000)
  g.soundEffect(250, 0.05, 0.05, 'sine', 1, 0, 0.05, 1000, true, 1000)
  g.soundEffect(500, 0.05, 0.05, 'sine', 1, 0, 0.1, 1000, true, 500)
}
