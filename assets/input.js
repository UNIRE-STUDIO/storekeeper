//export let GameScreens = {MENU: 0, PLAY: 1, PAUSE: 2, GAMEOVER: 3};

export default class Input
{
    constructor()
    {
        document.getElementById("start-button").onclick = () => this.startGameEvent();
        document.getElementById("back-button").onclick = () => this.backButton_click();
        document.getElementById("pause-button").onclick = () => this.pause_click();
        document.getElementById("continue-button").onclick = () => this.resume_click();

        document.addEventListener('keydown', (e) => this.setKeydown(e)); 
        document.addEventListener('keyup', (e) => this.setKeyup(e));
        
        // Отменяем действие при фокусировке
        //document.getElementById("key-b").addEventListener('keydown', e => {if (e.code == "Enter") e.preventDefault();});
        

        // Pause wrapper ------------------------------------------------
        // document.getElementById("pause-wrapper-resume-button").onclick = () => this.resume_click();
        // document.getElementById("pause-wrapper-levels-button").onclick = () => this.backButton_click();
        // document.getElementById("pause-wrapper-restart-button").onclick = () => this.restart_click();
        // // --------------------------------------------------------------
        // // Game Over wrapper----------------------------------------------
        // document.getElementById("game-over-wrapper-restart-button").onclick = () => this.restart_click();
        // document.getElementById("game-over-wrapper-next-button").onclick = () => this.nextLevelEvent();
        // --------------------------------------------------------------
        
        this.changeScreenEvent;
        this.startGameEvent;
        this.moveXEvent;
        this.rotateEvent;
        this.skipFallEvent;
    }

    backButton_click()
    {
        this.changeScreenEvent(-1);
    }

    pause_click()
    {
        this.changeScreenEvent(2);
    }

    restart_click()
    {
        this.changeScreenEvent(1, 1); // Параметр 1 - начать уровень заново
    }

    resume_click()
    {
        this.changeScreenEvent(1, 2); // Параметр 2 - продолжить игру на уровне с сохранением результата
    }

    setKeydown(e)
    {   
        console.log(e.code);
        if (e.code === "ArrowRight")
        {
            this.moveXEvent(1);
        }
        if (e.code === "ArrowLeft")
        {
            this.moveXEvent(-1);
        }
        if (e.code === "ArrowUp" || e.code === "Space")
        {
            this.rotateEvent();
        }
        if (e.code === "ArrowDown")
        {
            this.skipFallEvent();
        }
    }

    setKeyup(e)
    {

    }
    
}