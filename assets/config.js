export default class Config 
{
    constructor()
    {
        this.grid = 32;
        this.sizeMap = {x: 14, y: 16}
        this.canvas = document.getElementById('myCanvas');
        this.ctx = this.canvas.getContext('2d');
    }
}