export default class Config 
{
    constructor()
    {
        this.grid = 32;
        this.quarterGrid = this.grid/4;
        this.sizeMap = {x: 14, y: 16}
        this.canvas = document.getElementById('myCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        if (window.innerHeight < 660) this.grid = 24;

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) 
        {
            this.updateForSmartphone();         //  Меняем настройки под мобильный телефон
        }
    }

    updateForSmartphone()
    {
        this.grid = 64;
        this.sizeMap = {x: 11, y: 20}
    }
}