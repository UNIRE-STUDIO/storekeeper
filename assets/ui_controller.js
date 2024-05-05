import UI_Element from "./ui_element.js";

export let UISections = {MENU: 0, LEVEL_SELECTION: 1, PLAY: 2, PAUSE: 3, GAMEOVER: 4, WIN: 5};

export default class UI_Controller
{
    constructor(config)
    {
        this.currentSection;
        this.ui_elements = [
            new UI_Element([document.getElementById("menu-wrapper"),            // Меню
                            document.getElementById("home-button")],true),
            new UI_Element([document.getElementById("game-wrapper"),          // Интерфейс игры
                            document.getElementById("pause-button")]),
            new UI_Element([document.getElementById("pause-wrapper"),           // Пауза
                            document.getElementById("back-button")]),       
            new UI_Element([document.getElementById("back-button"),           // Проигрышь
                            document.getElementById("game-over-wrapper")])
                            ];                                              
        
        this.config = config;
        this.canvas = document.getElementById('myCanvas');
        this.canvas.width = this.config.grid * this.config.sizeMap.x;
        this.canvas.height = this.config.grid * this.config.sizeMap.y;
        document.getElementById('size-map').innerHTML = this.config.sizeMap.x + "x" + this.config.sizeMap.y; 
        document.getElementById('content-center-wrapper').style.height = this.canvas.height;
        document.getElementById('central-part').style.width = this.canvas.width;
}

    turnOnSection(section)
    {
        if (this.currentSection == section) return;
        this.ui_elements.forEach(element => {
            element.turnOff();
        });
        this.ui_elements[section].turnOn();
        this.currentSection = section;
    }
}