const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const WIDTH = canvas.width
const HEIGHT = canvas.height
const PADDING = 10
const BALL_LENGTH = 10
const PADDLE_WIDTH = 10
const PADDLE_HEIGHT = 50

class Game {
  constructor () {
    this.newGame()

    this.playing = false

    canvas.onmousedown = () => {
      if (this.gameOver) {
        this.newGame()
      }
      canvas.requestPointerLock()
    }

    document.addEventListener('pointerlockchange', () => {
      this.playing = document.pointerLockElement === canvas
    })
    document.addEventListener('mousemove', event => {
      this.playerDy = event.movementY
    })
  }

  newGame () {
    this.playerScore = 0
    this.computerScore = 0
    this.turn = 1
    this.gameOver = false
    this.ballSpeed = 5
    this.newTurn()
  }

  newTurn () {
    this.ballX = (WIDTH + BALL_LENGTH) / 2
    this.ballY = Math.floor(Math.random() * (HEIGHT - BALL_LENGTH))

    this.ballDx = this.ballSpeed * Math.sin(Math.PI * 2 / 3) * this.turn
    this.ballDy = this.ballSpeed * Math.cos(Math.PI * 2 / 3)

    this.computerY = (HEIGHT - PADDLE_HEIGHT) / 2
    this.playerY = (HEIGHT - PADDLE_HEIGHT) / 2
    this.playerDy = 0

    this.turn *= -1
    this.ballSpeed += 0.5
    this.computerTarget = Math.random() * PADDLE_HEIGHT

    if (this.computerScore >= 10 || this.playerScore >= 10) {
      this.gameOver = true
      document.exitPointerLock()
    }
  }

  update () {
    if (!this.playing || this.gameOver) return

    this.playerY += this.playerDy
    this.playerDy = 0
    if (this.playerY < 0) this.playerY = 0
    if (this.playerY > HEIGHT - PADDLE_HEIGHT) this.playerY = HEIGHT - PADDLE_HEIGHT

    if (this.computerY + this.computerTarget < this.ballY + BALL_LENGTH / 2) this.computerY += this.ballSpeed - 3
    if (this.computerY + this.computerTarget > this.ballY + BALL_LENGTH / 2) this.computerY -= this.ballSpeed - 3
    if (this.computerY < 0) this.computerY = 0
    if (this.computerY > HEIGHT - PADDLE_HEIGHT) this.computerY = HEIGHT - PADDLE_HEIGHT

    this.ballX += this.ballDx
    this.ballY += this.ballDy

    if (this.ballX <= PADDING + PADDLE_WIDTH) {
      if (this.ballY + BALL_LENGTH >= this.computerY && this.ballY <= this.computerY + PADDLE_HEIGHT) {
        const collision = -2 * (this.computerY + (PADDLE_HEIGHT / 2) - (this.ballY + BALL_LENGTH / 2)) / PADDLE_HEIGHT
        this.ballDy = Math.sin(collision) * this.ballSpeed
        this.ballDx = Math.cos(collision) * this.ballSpeed
        this.computerTarget = Math.random() * PADDLE_HEIGHT
      } else {
        this.playerScore += 1
        this.newTurn()
        return
      }
    }
    if (this.ballY <= 0) this.ballDy *= -1
    if (this.ballY >= HEIGHT - BALL_LENGTH) this.ballDy *= -1
    if (this.ballX + BALL_LENGTH >= WIDTH - PADDING - PADDLE_WIDTH) {
      if (this.ballY + BALL_LENGTH >= this.playerY && this.ballY <= this.playerY + PADDLE_HEIGHT) {
        const collision = -2 * (this.playerY + (PADDLE_HEIGHT / 2) - (this.ballY + BALL_LENGTH / 2)) / PADDLE_HEIGHT
        this.ballDy = Math.sin(collision) * this.ballSpeed
        this.ballDx = Math.cos(collision) * this.ballSpeed * -1
      } else {
        this.computerScore += 1
        this.newTurn()
      }
    }
  }

  loop () {
    window.requestAnimationFrame(() => this.loop())

    this.update()

    ctx.clearRect(0, 0, WIDTH, HEIGHT)

    ctx.strokeStyle = 'gray'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.setLineDash([10])
    ctx.moveTo(WIDTH / 2, 0)
    ctx.lineTo(WIDTH / 2, HEIGHT)
    ctx.stroke()

    ctx.fillStyle = 'gray'
    ctx.font = '80px Impact, Charcoal, sans-serif'
    ctx.fillText(this.computerScore, WIDTH / 4 - 80 / 2, 100)
    ctx.fillText(this.playerScore, 3 * WIDTH / 4 - 80 / 2, 100)

    ctx.fillStyle = 'white'
    ctx.fillRect(PADDING, this.computerY, PADDLE_WIDTH, PADDLE_HEIGHT)
    ctx.fillRect(WIDTH - PADDING - PADDLE_WIDTH, this.playerY, PADDLE_WIDTH, PADDLE_HEIGHT)

    if (!this.gameOver) ctx.fillRect(this.ballX, this.ballY, BALL_LENGTH, BALL_LENGTH)

    ctx.font = '50px Impact, Charcoal, sans-serif'
    if (!this.playing && !this.gameOver) {
      const msg = 'CLICK HERE TO PLAY'
      const msgWidth = ctx.measureText(msg).width
      ctx.fillText(msg, (WIDTH - msgWidth) / 2, (HEIGHT + 50) / 2)
    }

    if (this.gameOver) {
      const msg = 'GAME OVER'
      const msgWidth = ctx.measureText(msg).width
      ctx.fillText(msg, (WIDTH - msgWidth) / 2, (HEIGHT + 50) / 2)
    }
  }
}

const game = new Game()
game.loop()
