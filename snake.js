  let playerName = prompt("Ingresa tu nombre:");

  if (!playerName) {
    alert("Debes ingresar un nombre para jugar.");   
}  


    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");

    const box = 20; // tamaño de cada cuadrado
    let snake = [{ x: 9 * box, y: 10 * box }]; // posición inicial
    let direction = null;
    let food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
    let score = 0; 

    // detectar teclas
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
      else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
      else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
      else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    });

    function drawGame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // dibujar comida
      ctx.fillStyle = "red";
      ctx.fillRect(food.x, food.y, box, box);

      // dibujar snake
      for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "lime" : "green";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
      }

      // posición de la cabeza
      let snakeX = snake[0].x;
      let snakeY = snake[0].y;

      if (direction === "LEFT") snakeX -= box;
      if (direction === "UP") snakeY -= box;
      if (direction === "RIGHT") snakeX += box;
      if (direction === "DOWN") snakeY += box;

      // comer
      if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
          x: Math.floor(Math.random() * (canvas.width / box)) * box,
          y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
      } else {
        snake.pop(); // quitar cola si no come
      }

      // nueva cabeza
      const newHead = { x: snakeX, y: snakeY };

      // funcion de actualizar tabla de puntajes
      function updateScoreTable() {
    const table = document.getElementById("scoreTable");
    table.innerHTML = "<tr><th>Nombre</th><th>Puntaje</th></tr>";

    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    // Ordenar de mayor a menor puntaje
    scores.sort((a, b) => b.score - a.score);

    scores.forEach(entry => {
        const row = table.insertRow();
        row.insertCell(0).textContent = entry.name;
        row.insertCell(1).textContent = entry.score;
    });
}
      // colisiones
      if (
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= (canvas.width - 1) ||
        snakeY >= (canvas.height - 1) ||
        collision(newHead, snake)
      ) {
        clearInterval(game);
        alert("Game Over! Puntaje: " + score);
        // Guardar puntaje en localStorage
    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push({ name: playerName, score: score });
    localStorage.setItem("scores", JSON.stringify(scores));

      }
updateScoreTable();

      snake.unshift(newHead);

      // mostrar puntaje
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText("Score: " + score, 10, 20);
    }

    function collision(head, array) {
      for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
          return true;
        }
      }
      return false;
    }

    const game = setInterval(drawGame, 100);