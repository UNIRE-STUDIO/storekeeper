import UI_Element from "./ui_element.js";

export let UISections = {MENU: 0, LEVEL_SELECTION: 1, PLAY: 2, PAUSE: 3, GAMEOVER: 4, WIN: 5};

export default class UI_Controller
{
    constructor()
    {
        this.currentSection;
        this.ui_elements = [
            new UI_Element([document.getElementById("menu-lable"),  // Меню
                            document.getElementById("menu-wrapper"),
                            document.getElementById("home-button")],true),
            new UI_Element([document.getElementById("game-wrapper"),          // Интерфейс игры
                            document.getElementById("pause-button"),
                            document.getElementById("score-lable")]),
            new UI_Element([document.getElementById("pause-wrapper"),           // Пауза
                            document.getElementById("back-button")]),       
            new UI_Element([document.getElementById("back-button"),           // Проигрышь
                            document.getElementById("game-over-wrapper"),
                            document.getElementById("game-over-lable")])
                                                                        ];                                              

        this.timerBar;
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