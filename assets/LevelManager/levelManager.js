import { randomRange, getTimeFormat, drawRect } from "../general.js";
import SaveManager from "../saveManager.js";

export default class LevelManager
{
    constructor(input, config)
    {
        this.config = config;
        this.score = 0;
        this.isPause = false;

        // Присваивает класс Game
        this.gameOverEvent;
        this.saveManager;

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
            position: {x: 0, y: 0},
            active: false
        };
        this.glass = [];

        input.moveXEvent = this.moveX.bind(this);
        input.rotateEvent = this.rotateShape.bind(this);
        input.skipFallEvent = this.skipFall.bind(this);
        input.extraEvent = this.spawnShape.bind(this);
    }

    
    setPause()
    {
        this.isPause = true;
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
        console.log("game-over");
        
        this.gameOverEvent();
    }    
    
    start()
    {
        this.score = 0;
        this.isPause = false;
        for (let i = 0; i < this.config.sizeMap.y; i++) {
            this.glass[i] = [];
            for (let j = 0; j < this.config.sizeMap.x; j++) {
                this.glass[i][j] = 0;
            }
        }
        this.spawnShape();
    }

    moveX(dir)
    {
        if (dir < 0 && this.targetShape.position.x == 0
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
                if (this.targetShape.position.x + j >= this.glass[0].length
                    || this.targetShape.position.x + j < 0) return; // проверка пересечения границ стакана
                if (this.targetShape.position.y + i < 0) continue;
                if (this.glass[this.targetShape.position.y + i][this.targetShape.position.x + j] == 1) return;
            }
        }
        this.targetShape.shape = rotatedShape;
    }

    
    skipFall()
    {
        if (this.targetShape.position.y < 0) return;
        for (let i = this.targetShape.position.y; i < this.glass.length; i++) 
        {
            if (this.targetShape.position.y + i < 0) continue;
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
        if (!this.targetShape.active) return;
        this.targetShape.active = false;
        for (let i = 0; i < this.targetShape.shape.length; i++) {
            for (let j = 0; j < this.targetShape.shape[i].length; j++) {
                if (this.targetShape.position.y < 0)
                {
                    this.gameOver();
                    return;
                }
                this.glass[this.targetShape.position.y + i][this.targetShape.position.x + j] = 1;
                console.log("addShapeInGlass"); // Проблема не тут
            }
        }

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
                        this.glass[k] = this.glass[k-1]; // Проблема не тут
                    }
                }
            }
        }
        this.spawnShape();
        // Выполняется один раз
    }

    spawnShape()
    {
        this.targetShape.position = {x:7, y: -3}
        this.targetShape.shape = this.shapes[randomRange(0,this.shapes.length)];
        this.targetShape.active = true;
    }

    checkCollisionShapes()
    {
        if (!this.targetShape.active) return;
        for (let i = 0; i < this.targetShape.shape.length; i++) {
            for (let j = 0; j < this.targetShape.shape[i].length; j++) {
                if (this.targetShape.shape[i][j] == 0 
                    || this.targetShape.position.y + i < 0) continue;
                if (this.glass[this.targetShape.position.y + i + 1][this.targetShape.position.x + j] == 1)
                {
                    this.addShapeInGlass();
                    return true;
                }
            }
        }
    }


    update(lag)
    {
        if (this.checkCollisionShapes()) return; // Проверяем колизию перед движения вниз (так-как мы могли двигать фигуру по горизонтали)

        this.targetShape.position.y++;
        if (this.targetShape.position.y + this.targetShape.shape.length == this.glass.length) // Проверка касания дна стакана
        {
            this.addShapeInGlass();
            return;
        }
    }

    render()
    {
        // Активная фигура
        for (let i = 0; i < this.targetShape.shape.length; i++) {
            for (let j = 0; j < this.targetShape.shape[i].length; j++) {
                if (this.targetShape.shape[i][j] == 0) continue;                    // +2 Что-бы образовать отступ
                let drawPos = { x: this.targetShape.position.x * this.config.grid + j * this.config.grid, 
                                y: this.targetShape.position.y * this.config.grid + i * this.config.grid};
                drawRect(this.config.ctx, drawPos, {x: this.config.grid-1, y: this.config.grid-1}, "#f33");
            }
        }

        // Статичный стакан
        for (let i = 0; i < this.glass.length; i++) {
            for (let j = 0; j < this.glass[i].length; j++) {
                if (this.glass[i][j] == 0) continue;
                let drawPos = { x: j * this.config.grid, y: i * this.config.grid};
                drawRect(this.config.ctx, drawPos, {x: this.config.grid-1, y: this.config.grid-1}, "#fff");
            }
        }
    }
}