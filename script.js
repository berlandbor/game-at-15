// Генерирует случайное булево значение
function getRandomBool() {
  if (Math.floor(Math.random() * 2) === 0) {
    return true;
  }
}

// Конструктор объекта игры
function Game(context, cellSize) {
  // Начальное состояние игрового поля
  this.state = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0]
  ];

  // Цвет ячеек
  this.color = "#ffffff";

  // Контекст рисования
  this.context = context;

  // Размер ячейки
  this.cellSize = cellSize;

  // Счетчик ходов
  this.clicks = 0;
}

// Возвращает количество сделанных ходов
Game.prototype.getClicks = function () {
  return this.clicks;
};

// Отрисовывает ячейку игрового поля по указанным координатам
Game.prototype.cellView = function (x, y) {
  this.context.fillStyle = this.color;
  this.context.fillRect(
    x + 1,
    y + 1,
    this.cellSize - 2,
    this.cellSize - 2
  );
};

// Настраивает отображение номера внутри ячейки
Game.prototype.numView = function () {
  this.context.font = "bold " + (this.cellSize / 2) + "px Sans";
  this.context.textAlign = "center";
  this.context.textBaseline = "middle";
  this.context.fillStyle = "#222222";
};
// Отрисовывает текущее состояние игрового поля
Game.prototype.draw = function () {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (this.state[i][j] > 0) {
        // Отрисовка ячейки
        this.cellView(
          j * this.cellSize,
          i * this.cellSize
        );

        // Настройка отображения номера в ячейке
        this.numView();

        // Вывод номера в центре ячейки
        this.context.fillText(
          this.state[i][j],
          j * this.cellSize + this.cellSize / 2,
          i * this.cellSize + this.cellSize / 2
        );
      }
    }
  }
};

// Возвращает координаты пустой ячейки
Game.prototype.getNullCell = function () {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (this.state[j][i] === 0) {
        return { x: i, y: j };
      }
    }
  }
};

// Перемещает ячейку в указанные координаты, увеличивает счетчик ходов
Game.prototype.move = function (x, y) {
  let nullCell = this.getNullCell();
  let canMoveVertical = (x - 1 == nullCell.x || x + 1 == nullCell.x) && y == nullCell.y;
  let canMoveHorizontal = (y - 1 == nullCell.y || y + 1 == nullCell.y) && x == nullCell.x;

  // Проверка возможности хода и осуществление хода
  if (canMoveVertical || canMoveHorizontal) {
    this.state[nullCell.y][nullCell.x] = this.state[y][x];
    this.state[y][x] = 0;
    this.clicks++;
  }
};

// Проверяет, достигнуто ли победное состояние
Game.prototype.victory = function () {
  let combination = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];
  let res = true;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // Сравнение текущего состояния с победным
      if (combination[i][j] != this.state[i][j]) {
        res = false;
        break;
      }
    }
  }
  return res;
};
// Мешает игровое поле, выполняя заданное количество случайных ходов
Game.prototype.mix = function (count) {
  let x, y;
  for (let i = 0; i < count; i++) {
    let nullCell = this.getNullCell();

    // Определение направления и направления хода случайным образом
    let verticalMove = getRandomBool();
    let upLeft = getRandomBool();

    if (verticalMove) {
      x = nullCell.x;
      if (upLeft) {
        y = nullCell.y - 1;
      } else {
        y = nullCell.y + 1;
      }
    } else {
      y = nullCell.y;
      if (upLeft) {
        x = nullCell.x - 1;
      } else {
        x = nullCell.x + 1;
      }
    }

    // Проверка допустимости хода и осуществление хода
    if (0 <= x && x <= 3 && 0 <= y && y <= 3) {
      this.move(x, y);
    }
  }

  // Сброс счетчика ходов
  this.clicks = 0;
};

// Инициализация игры при загрузке страницы
window.onload = function () {
  // Получение элемента Canvas
  let canvas = document.getElementById("canvas");

  // Установка размеров Canvas
  canvas.width = 320;
  canvas.height = 320;

  // Получение контекста рисования
  let context = canvas.getContext("2d");

  // Заполнение Canvas цветом
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Размер ячейки
  let cellSize = canvas.width / 4;

  // Создание объекта Game
  let game = new Game(context, cellSize);

  // Перемешивание и отрисовка поля
  game.mix(300);
  game.draw();

  // Обработчик событий для кликов
  canvas.onclick = function (e) {
    // Определение координат клика
    let x = (e.pageX - canvas.offsetLeft) / cellSize | 0;
    let y = (e.pageY - canvas.offsetTop) / cellSize | 0;

    // Обработка события
    onEvent(x, y);
  };

  // Обработчик событий для касаний
  canvas.ontouchend = function (e) {
    // Определение координат касания
    let x = (e.touches[0].pageX - canvas.offsetLeft) / cellSize | 0;
    let y = (e.touches[0].pageY - canvas.offsetTop) / cellSize | 0;

    // Обработка события
    onEvent(x, y);
  };

  // Функция обработки события
  function onEvent(x, y) {
    // Выполнение хода игрока
    game.move(x, y);

    // Заполнение Canvas цветом
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Отрисовка обновленного поля
    game.draw();

    // Проверка на победу
    if (game.victory()) {
      // Вывод сообщения о победе
      alert("Собрано за " + game.getClicks() + " касание!");

      // Перемешивание и отрисовка поля
      game.mix(300);
      context.fillRect(0, 0, canvas.width, canvas.height);
      game.draw(context, cellSize);
    }
  }
};