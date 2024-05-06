import { randomRange, getTimeFormat, drawRect } from "../general.js";
import SaveManager from "../saveManager.js";

export default class LevelManager
{
    constructor(input, config)
    {
        this.currentScreen;
        this.config = config;
        this.score = 0;
        this.amountLine = 0;
        this.isPause = false;

        // Присваивает класс Game
        this.gameOverEvent;
        this.saveManager;
        this.setMsPerUpdate;

        this.shapes = [
            [[1,1],
             [1,1]], 
            [[1,1,1]],
            [[1,1,1,1]],
            [[1,1,1],
             [1,1,1]],
             [[1,1,1],
              [1,1,1],
              [1,1,1]]
        ];
        this.targetShape = 
        {
            shape: [],
            nextShape: [],
            position: {x: 0, y: 0},
            active: false
        };
        this.glass = [];
        this.levels = [
            [10, 250],      // Кол-во убраных линий, ms_per_update
            [30, 230],
            [40, 210]
        ];
        this.currentLevel = -1;

        input.moveXEvent = this.moveX.bind(this);
        input.rotateEvent = this.rotateShape.bind(this);
        input.skipFallEvent = this.skipFall.bind(this);
        input.extraEvent = this.spawnShape.bind(this);

        this.nextShapeParent = document.getElementById("next-shape");
        this.amountLineLabel = document.getElementById("amount-line-label");
        this.scoreLabel = document.getElementById("score-label");
    }

    
    setPause()
    {
        this.isPause = true;
    }

    setReset()
    {
        this.score = 0;
        for (let i = 0; i < this.config.sizeMap.y; i++) {
            this.glass[i] = [];
            for (let j = 0; j < this.config.sizeMap.x; j++) {
                this.glass[i][j] = 0;
            }
        }
        this.nextShapeParent.innerHTML = "";
        this.targetShape.shape = [];
        this.addAmountLine(0);
    }

    setResume()
    {
        this.isPause = false;
    }

    setRestart()
    {
        this.start();
    }

    gameOver()
    {
        this.gameOverEvent();
    }    
    
    start()
    {
        this.setReset();
        this.isPause = false;
        this.targetShape.nextShape = this.shapes[randomRange(0,this.shapes.length)].slice();
        this.spawnShape();
    }

    addAmountLine(amount)
    {                       // За одну линию 10 * 1 * 1 = 10 // За две линии 10 * 2 * 2 = 40
        let added = (amount - this.amountLine) < 0 ? 0 : (amount - this.amountLine);
        this.score += 10 * added * added;
        this.scoreLabel.innerHTML = "" + this.score;

        this.amountLine = amount;
        this.amountLineLabel.innerHTML = "" + amount;
        
        for (let i = this.levels.length-1; i >= 0; i--) {
            if (this.levels[i][0] <= amount && i > this.currentLevel){
                this.setMsPerUpdate(this.levels[i][1]);
                this.currentLevel = i;
                break;
            }
        }
    }

    moveX(dir)
    {
        if (this.isPause 
            || dir < 0 && this.targetShape.position.x == 0
            || dir > 0 && this.targetShape.position.x + this.targetShape.shape[0].length == this.glass[0].length) return; // Если делать тетрис с классическими фигурами, нужно переделать
            
            for (let i = 0; i < this.targetShape.shape.length; i++) {
                for (let j = 0; j < this.targetShape.shape[i].length; j++) {
                    if (this.targetShape.position.y + i < 0) continue;
                    if (this.glass[this.targetShape.position.y + i][this.targetShape.position.x + j + dir] == 1) return;
            }
        }
        this.targetShape.position.x += dir;
    }

    rotateShape()
    {
        if (this.isPause) return;
        let rotatedShape = [];
        for (let i = 0; i < this.targetShape.shape.length; i++) 
        {                                                               //        [[1,1,1] [1,1,1]]
            for (let j = 0; j < this.targetShape.shape[i].length; j++)  //        [[1,1] [1,1] [1,1]]
            {
                rotatedShape[j] = [];
                rotatedShape[j][i] = this.targetShape.shape[i][j];
            }
        }
        // Проверка возможности поворота
        for (let i = 0; i < rotatedShape.length; i++) {
            for (let j = 0; j < rotatedShape[i].length; j++) {
                if (this.targetShape.position.x + j >= this.glass[0].length || this.targetShape.position.x + j < 0) return; // проверка пересечения границ стакана
                if (this.targetShape.position.y + i < 0) continue;
                if (this.glass[this.targetShape.position.y + i][this.targetShape.position.x + j] == 1) return;
            }
        }
        this.targetShape.shape = rotatedShape.slice();
    }
    
    skipFall()
    {
        if (this.isPause || this.targetShape.position.y < 0) return;

        for (let i = this.targetShape.position.y; i < this.glass.length; i++) 
        {
            for (let j = 0; j < this.targetShape.shape[0].length; j++) {
                if (this.glass[i][this.targetShape.position.x + j] == 1)
                {
                    this.targetShape.position.y = i - this.targetShape.shape.length;
                    this.addShapeInGlass();
                    return;
                }
            }
        }
        this.targetShape.position.y = this.glass.length - this.targetShape.shape.length;
        this.addShapeInGlass();
    }

    addShapeInGlass()
    {
        for (let i = 0; i < this.targetShape.shape.length; i++) {
            for (let j = 0; j < this.targetShape.shape[i].length; j++) {
                if (this.targetShape.position.y < 0)
                {
                    this.gameOver();
                    return;
                }
                this.glass[this.targetShape.position.y + i][this.targetShape.position.x + j] = 1;
            }
        }

        let amountLinePerMove = 0;
        checki: for (let i = this.targetShape.position.y; i < this.glass.length; i++) { //Удалениие линии и перемещения линий на одну позицию вниз
            for (let j = 0; j < this.glass[0].length; j++) {
                if (this.glass[i][j] == 0){
                    continue checki;
                }
                if (j == this.glass[0].length-1) {
                    for (let k = 0; k < this.glass[0].length; k++) 
                    {
                        this.glass[i][k] = 0;
                    }
                    for (let k = i; k > 0; k--) {
                        this.glass[k] = this.glass[k-1].slice(); // <---- Проблема была тут 
                    }
                    amountLinePerMove++;
                }
            }
        }

        this.addAmountLine(this.amountLine + amountLinePerMove);
        this.spawnShape();
    }

    spawnShape()
    {
        this.targetShape.position = {x:7, y: -3};
        this.targetShape.shape = this.targetShape.nextShape.slice();
        this.targetShape.nextShape = this.shapes[randomRange(0,this.shapes.length)].slice();

        this.nextShapeParent.innerHTML = "";
        for (let i = 0; i < this.targetShape.nextShape.length; i++) {
            let hor = document.createElement('div');
            hor.className = "next-shape-horizontal";
            for (let j = 0; j < this.targetShape.nextShape[i].length; j++) {
                let element = document.createElement('div');
                element.className = "next-shape-elements";
                hor.append(element);
            }
            this.nextShapeParent.append(hor);
        }
    }

    checkCollisionShapes()
    {
        for (let i = 0; i < this.targetShape.shape.length; i++) {
            for (let j = 0; j < this.targetShape.shape[i].length; j++) {
                if (this.targetShape.position.y + i + 1 < 0 || this.targetShape.position.y + i + 1 >= this.glass.length) continue;
                if (this.glass[this.targetShape.position.y + i + 1][this.targetShape.position.x + j] == 1)
                {
                    this.addShapeInGlass();
                    return true;
                }
            }
        }
    }

    checkCollisionBottom()
    {
        if (this.targetShape.position.y + this.targetShape.shape.length == this.glass.length) // Проверка касания дна стакана
        {
            this.addShapeInGlass();
        }
    }


    update(lag)
    {
        if (this.checkCollisionShapes()) return; // Проверяем колизию перед движения вниз (так-как мы могли двигать фигуру по горизонтали)
        this.checkCollisionBottom();
        this.targetShape.position.y++;
    }

    render()
    {
        let mainPartPos = [];
        let upPartPos = [];
        let sidePartPos = [];

        // Статичный стакан
        for (let i = 0; i < this.glass.length; i++) {
           for (let j = 0; j < this.glass[i].length; j++) {
                if (this.glass[i][j] == 0) continue;
                let drawPos = { x: j * this.config.grid, y: i * this.config.grid};
                mainPartPos.push(drawPos);

                let drawPosExtra = Object.assign({}, drawPos); // Пеовый параметр не предотвращает мутацию, поэтому используем второй
                drawPosExtra.x += this.config.grid;
                drawPosExtra.y += drawPosExtra.x;
                sidePartPos.push(drawPosExtra);

                if (i-1 >= 0 && this.glass[i-1][j] == 1) continue;
                drawPosExtra = Object.assign({}, drawPos);
                drawPosExtra.x += drawPosExtra.y;
                drawPosExtra.y -= 8;
                upPartPos.push(drawPosExtra);
            }
        }

        // Активная фигура
        for (let i = 0; i < this.targetShape.shape.length; i++) {
            for (let j = 0; j < this.targetShape.shape[i].length; j++) {
                if (this.targetShape.shape[i][j] == 0) continue;
                let drawPos = { x: this.targetShape.position.x * this.config.grid + j * this.config.grid, 
                                y: this.targetShape.position.y * this.config.grid + i * this.config.grid};
                mainPartPos.push(drawPos);
                
                let drawPosExtra = Object.assign({}, drawPos); // Пеовый параметр не предотвращает мутацию, поэтому используем второй
                drawPosExtra.x += this.config.grid;
                drawPosExtra.y += drawPosExtra.x;
                sidePartPos.push(drawPosExtra);
                
                if (i > 0) continue; // Крышки отображаем только на верхних объектах
                drawPosExtra = Object.assign({}, drawPos);
                drawPosExtra.x += drawPosExtra.y;
                drawPosExtra.y -= 8;
                upPartPos.push(drawPosExtra);
            }
        }
        for (let i = 0; i < sidePartPos.length; i++) { // Рисуем правую боковинку
            this.config.ctx.save();
            this.config.ctx.transform(1, -1, 0, 1, 0, 0); 
            drawRect(this.config.ctx, sidePartPos[i], {x: 8, y: this.config.grid}, "#B96D5F");
            this.config.ctx.restore();
        }
        for (let i = 0; i < upPartPos.length; i++) { // Рисуем верхнюю крышку
            this.config.ctx.save();
            this.config.ctx.transform(1, 0, -1, 1, 0, 0); //this.config.ctx.transform(1, 0, 0, 1, 0, 0); - "Положение по умолчанию"
            drawRect(this.config.ctx, upPartPos[i], {x: this.config.grid, y: 8}, "#E9AEA4");
            this.config.ctx.restore();
        }
        for (let i = 0; i < mainPartPos.length; i++) { // Рисуем основную часть
            drawRect(this.config.ctx, mainPartPos[i], {x: this.config.grid, y: this.config.grid}, "#D69389");
        }
    }
    //this.config.ctx.globalCompositeOperation = "destination-over"; // Отображает позади других фигур
    //this.config.ctx.transform(1, 0, 0, 1, 0, 0); - "Положение по умолчанию"

}