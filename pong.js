const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const WIDTH = canvas.width
const HEIGHT = canvas.height

const PADDING = 10

const BALL_LENGTH = 10
// TODO: variable ball speed
const BALL_SPEED = 5

const PADDLE_WIDTH = 10
const PADDLE_HEIGHT = 50

let playing = false
let newTurn = false
let playerScore = 0
let computerScore = 0

let computerY = (HEIGHT - PADDLE_HEIGHT) / 2
let playerY = (HEIGHT - PADDLE_HEIGHT) / 2
let playerDy = 0

let ballX = (WIDTH + BALL_LENGTH) / 2
let ballY = Math.floor(Math.random() * HEIGHT)
let ballDx = BALL_SPEED * Math.sin(Math.PI * 2 / 3)
let ballDy = BALL_SPEED * Math.cos(Math.PI * 2 / 3)

canvas.onmousedown = canvas.requestPointerLock

document.addEventListener('pointerlockchange', () => {
  playing = document.pointerLockElement === canvas
})

document.addEventListener('mousemove', event => {
  playerDy = event.movementY
})

function update () {
  if (!playing) return

  // TODO: game over state
  if (newTurn) {
    ballX = (WIDTH + BALL_LENGTH) / 2
    ballY = Math.floor(Math.random() * HEIGHT)

    ballDx = BALL_SPEED * Math.sin(Math.PI * 2 / 3)
    ballDy = BALL_SPEED * Math.cos(Math.PI * 2 / 3)
    computerY = (HEIGHT - PADDLE_HEIGHT) / 2

    newTurn = false
    return
  }

  playerY += playerDy
  playerDy = 0
  if (playerY < 0) playerY = 0
  if (playerY > HEIGHT - PADDLE_HEIGHT) playerY = HEIGHT - PADDLE_HEIGHT

  // TODO: computer difficulty
  if (computerY + PADDLE_HEIGHT / 2 < ballY + BALL_LENGTH / 2) computerY += 3
  if (computerY + PADDLE_HEIGHT / 2 > ballY + BALL_LENGTH / 2) computerY -= 3
  if (computerY < 0) computerY = 0
  if (computerY > HEIGHT - PADDLE_HEIGHT) computerY = HEIGHT - PADDLE_HEIGHT

  ballX += ballDx
  ballY += ballDy

  if (ballX <= PADDING + PADDLE_WIDTH) {
    if (ballY + BALL_LENGTH >= computerY && ballY <= computerY + PADDLE_HEIGHT) {
      const collision = -2 * (computerY + (PADDLE_HEIGHT / 2) - (ballY + BALL_LENGTH / 2)) / PADDLE_HEIGHT
      ballDy = Math.sin(collision) * BALL_SPEED
      ballDx = Math.cos(collision) * BALL_SPEED
    } else {
      playerScore += 1
      newTurn = true
      return
    }
  }
  if (ballY <= 0) ballDy *= -1
  if (ballY >= HEIGHT - BALL_LENGTH) ballDy *= -1
  if (ballX + BALL_LENGTH >= WIDTH - PADDING - PADDLE_WIDTH) {
    if (ballY + BALL_LENGTH >= playerY && ballY <= playerY + PADDLE_HEIGHT) {
      const collision = -2 * (playerY + (PADDLE_HEIGHT / 2) - (ballY + BALL_LENGTH / 2)) / PADDLE_HEIGHT
      ballDy = Math.sin(collision) * BALL_SPEED
      ballDx = Math.cos(collision) * BALL_SPEED * -1
    } else {
      computerScore += 1
      newTurn = true
    }
  }
}

function render () {
  window.requestAnimationFrame(render)

  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  ctx.strokeStyle = 'gray'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.setLineDash([10])
  ctx.moveTo(WIDTH / 2, 0)
  ctx.lineTo(WIDTH / 2, HEIGHT)
  ctx.stroke()

  ctx.fillStyle = 'gray'
  ctx.font = '80px Impact'
  ctx.fillText(computerScore, WIDTH / 4 - 80 / 2, 100)
  ctx.fillText(playerScore, 3 * WIDTH / 4 - 80 / 2, 100)

  ctx.fillStyle = 'white'
  ctx.fillRect(PADDING, computerY, PADDLE_WIDTH, PADDLE_HEIGHT)
  ctx.fillRect(WIDTH - PADDING - PADDLE_WIDTH, playerY, PADDLE_WIDTH, PADDLE_HEIGHT)
  ctx.fillRect(ballX, ballY, BALL_LENGTH, BALL_LENGTH)

  if (!playing) {
    const msg = 'CLICK HERE TO PLAY'
    const msgWidth = ctx.measureText(msg).width
    ctx.fillText(msg, (WIDTH - msgWidth) / 2, (HEIGHT + 50) / 2)
  }
}

setInterval(update, 8)
render()
