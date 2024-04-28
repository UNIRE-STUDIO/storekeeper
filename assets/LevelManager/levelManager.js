import { randomRange, getTimeFormat, drawRect } from "../general.js";
import SaveManager from "../saveManager.js";

export default class LevelManager
{
    constructor(input)
    {
        this.score = 0;

        this.isPause = false;

        // Присваивает класс Game
        this.gameOverEvent;
        this.saveManager;

        this.shapes = [
            [[1,1],
             [1,1]], 
            [[1,1,1]],
            [[1,1,1]
             [1,1,1]]
        ];
        this.targetShape = 
        {
            shape: [],
            position: {x: 7, y: -3}
        };

        // куда-то
        this.canvas = document.getElementById('myCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.timeUpdate = 0;
        
        // config
        this.grid = 32;
        this.sizeGrid = {x: this.canvas.width/this.grid, y: this.canvas.height/this.grid}

        input.moveXEvent = this.moveX.bind(this);
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
        this.targetShape.position.x += dir;
    }

    start()
    {
        this.score = 0;
        this.isPause = false;
        this.targetShape.shape = this.shapes[randomRange(0,2)];
    }

    update(lag)
    {
        this.timeUpdate += lag;
        if (this.timeUpdate > 250) // Раз в ??? мс происходит действие
        {
            this.targetShape.position.y++;
            this.timeUpdate -= 250;
            if (this.targetShape.position.y == this.sizeGrid.y)
            {
                this.targetShape.position = {x:7, y: -2}
                this.targetShape.shape = this.shapes[randomRange(0,2)];
            }
        }
        
    }

    render()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);   // Убрать
        for (let i = 0; i < this.targetShape.shape.length; i++) {
            for (let j = 0; j < this.targetShape.shape[i].length; j++) {
                if (this.targetShape.shape[i][j] == 0) continue;                    // Что-бы образовать отступ
                let drawPos = { x: this.targetShape.position.x * this.grid + j * (this.grid + 2), 
                                y: this.targetShape.position.y * this.grid + i * (this.grid + 2)};
                drawRect(this.ctx, drawPos, {x: this.grid, y: this.grid}, "#fff");
            }
        }
    }
}