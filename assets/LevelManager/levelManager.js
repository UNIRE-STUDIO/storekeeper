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
            position: {x: 0, y: 0}
        };
        this.glass = [];
        for (let i = 0; i < this.config.sizeMap.y; i++) {
            this.glass[i] = [];
            for (let j = 0; j < this.config.sizeMap.x; j++) {
                this.glass[i][j] = 0;
            }
        }

        this.timeUpdate = 0;

        input.moveXEvent = this.moveX.bind(this);
        input.rotateEvent = this.rotateShape.bind(this);
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
        this.startLevel(this.currentLevel);
    }

    gameOver()
    {
        console.log("game-over");
        
        this.gameOverEvent();
    }

    moveX(dir)
    {
        if (dir < 0 && this.targetShape.position.x == 0
            || dir > 0 && this.targetShape.position.x + this.targetShape.shape[0].length == this.glass[0].length) return; // Если делать тетрис с классическими фигурами, нужно переделать
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
        this.targetShape.shape = rotatedShape;
    }

    start()
    {
        this.score = 0;
        this.isPause = false;
        this.spawnShape();
    }

    spawnShape()
    {
        this.targetShape.position = {x:7, y: -3}
        this.targetShape.shape = this.shapes[randomRange(0,this.shapes.length)];
    }

    update(lag)
    {
        this.timeUpdate += lag;
        if (this.timeUpdate > 250) // Раз в ??? мс происходит действие
        {
            this.targetShape.position.y++;
            this.timeUpdate = 0;
            for (let i = 0; i < this.targetShape.shape.length; i++) {
                for (let j = 0; j < this.targetShape.shape[i].length; j++) {
                    if (this.targetShape.shape[i][j] == 0 
                        || this.targetShape.position.y + this.targetShape.shape.length < 0) continue;
                    if (this.targetShape.position.y + this.targetShape.shape.length == this.glass.length)
                    {
                        for (let k = 0; k < this.targetShape.shape.length; k++) {
                            for (let l = 0; l < this.targetShape.shape[k].length; l++) {
                                this.glass[this.targetShape.position.y + k][this.targetShape.position.x + l] = 1;
                            }
                        }
                        this.spawnShape();
                        return;
                    }
                    if (this.glass[this.targetShape.position.y + this.targetShape.shape.length][this.targetShape.position.x + this.targetShape.shape.length] == 1)
                    {
                        for (let k = 0; k < this.targetShape.shape.length; k++) {
                            for (let l = 0; l < this.targetShape.shape[k].length; l++) {
                                this.glass[this.targetShape.position.y + k][this.targetShape.position.x + l] = 1;
                            }
                        }
                        this.spawnShape();
                        return;
                    }
                }
            }
        }
        
    }

    render()
    {
        // Активная фигура
        for (let i = 0; i < this.targetShape.shape.length; i++) {
            for (let j = 0; j < this.targetShape.shape[i].length; j++) {
                if (this.targetShape.shape[i][j] == 0) continue;                    // +2 Что-бы образовать отступ
                let drawPos = { x: this.targetShape.position.x * this.config.grid + j * (this.config.grid + 2), 
                                y: this.targetShape.position.y * this.config.grid + i * (this.config.grid + 2)};
                drawRect(this.config.ctx, drawPos, {x: this.config.grid, y: this.config.grid}, "#ff" + j);
            }
        }

        // Статичный стакан
        for (let i = 0; i < this.glass.length; i++) {
            for (let j = 0; j < this.glass[i].length; j++) {
                if (this.glass[i][j] == 0) continue;
                let drawPos = { x: j * this.config.grid + 2, y: i * this.config.grid + 2};
                drawRect(this.config.ctx, drawPos, {x: this.config.grid, y: this.config.grid}, "#fff");
            }
        }

    }
}