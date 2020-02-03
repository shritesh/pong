const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const WIDTH = canvas.width
const HEIGHT = canvas.height

const PADDING = 30

const BALL_LENGTH = 10
const BALL_SPEED = 5

const PADDLE_WIDTH = 10
const PADDLE_HEIGHT = 50

const computerY = (HEIGHT - PADDLE_HEIGHT) / 2
let playerY = (HEIGHT - PADDLE_HEIGHT) / 2
let playerDy = 0

let running = false
let ballX = 0
let ballY = 0
let ballDx = BALL_SPEED
let ballDy = BALL_SPEED

canvas.onclick = canvas.requestPointerLock

document.addEventListener('pointerlockchange', () => {
  running = document.pointerLockElement === canvas
})

document.addEventListener('mousemove', event => {
  playerDy = event.movementY
})

function update () {
  if (!running) return

  playerY += playerDy
  playerDy = 0
  if (playerY < 0) playerY = 0
  if (playerY > HEIGHT - PADDLE_HEIGHT) playerY = HEIGHT - PADDLE_HEIGHT

  ballX += ballDx
  ballY += ballDy

  if (ballX <= 0) ballDx *= -1
  if (ballY <= 0) ballDy *= -1
  if (ballY >= HEIGHT - BALL_LENGTH) ballDy *= -1
  if (ballX >= WIDTH - BALL_LENGTH) ballDx *= -1
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

  ctx.fillStyle = 'white'
  ctx.fillRect(PADDING, computerY, PADDLE_WIDTH, PADDLE_HEIGHT)
  ctx.fillRect(WIDTH - PADDING - PADDLE_WIDTH, playerY, PADDLE_WIDTH, PADDLE_HEIGHT)
  ctx.fillRect(ballX, ballY, BALL_LENGTH, BALL_LENGTH)

  if (!running) {
    ctx.font = '50px Impact'
    const msg = 'CLICK HERE TO PLAY'
    const msgWidth = ctx.measureText(msg).width
    ctx.fillText(msg, (WIDTH - msgWidth) / 2, (HEIGHT + 50) / 2)
  }
}

setInterval(update, 8)
render()
