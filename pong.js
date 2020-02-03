const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const WIDTH = canvas.width
const HEIGHT = canvas.height

const PADDING = 30

const PADDLE_WIDTH = 10
const PADDLE_HEIGHT = 50

const computerPosition = (HEIGHT - PADDLE_HEIGHT) / 2
let playerPosition = (HEIGHT - PADDLE_HEIGHT) / 2

document.addEventListener('mousemove', event => {
  if (document.pointerLockElement === canvas) {
    playerPosition += event.movementY
    if (playerPosition < 0) playerPosition = 0
    if (playerPosition > HEIGHT - PADDLE_HEIGHT) playerPosition = HEIGHT - PADDLE_HEIGHT
  }
})

canvas.onclick = canvas.requestPointerLock

function render () {
  window.requestAnimationFrame(render)

  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  ctx.fillStyle = 'white'
  ctx.fillRect(PADDING, computerPosition, PADDLE_WIDTH, PADDLE_HEIGHT)
  ctx.fillRect(WIDTH - PADDING - PADDLE_WIDTH, playerPosition, PADDLE_WIDTH, PADDLE_HEIGHT)
}

render()
