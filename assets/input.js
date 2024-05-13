//export let GameScreens = {MENU: 0, PLAY: 1, PAUSE: 2, GAMEOVER: 3};

export default class Input
{
    constructor()
    {
        document.getElementById("start-button").onclick = () => this.startGameEvent();
        document.getElementById("back-button").onclick = () => this.backButton_click();
        document.getElementById("pause-button").onclick = () => this.pause_click();
        document.getElementById("continue-button").onclick = () => this.resume_click();
        document.getElementById("restart-button").onclick = () => this.restart_click();

        document.addEventListener('keydown', (e) => this.setKeydown(e)); 
        document.addEventListener('keyup', (e) => this.setKeyup(e));

        document.getElementById('home-button').onclick = () => window.location.href = "http://unire.su";
        
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

        this.skipButtonClick = false;

        document.addEventListener('touchstart', (e) => {
            let xTouchPos = e.changedTouches[0].clientX;
            let yTouchPos = e.changedTouches[0].clientY;

            if (yTouchPos < window.innerHeight/3*2) return;
            if (xTouchPos < window.innerWidth / 3) // Левая треть экрана
            {
                this.moveXEvent(-1);
            }
            else if (xTouchPos > window.innerWidth / 3 * 2) // Правая треть экрана
            {
                this.moveXEvent(1);
            }
            else if (xTouchPos > window.innerWidth / 3 && yTouchPos > window.innerHeight/6*5)
            {
                this.skipFallEvent();
            }
            else if (xTouchPos > window.innerWidth / 3 && yTouchPos > window.innerHeight/6*4)
            {
                this.rotateEvent();
            }
        });
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
        //console.log(e.code);
        if (e.code === "ArrowRight" || e.code === "KeyD")
        {
            this.moveXEvent(1);
        }
        if (e.code === "ArrowLeft" || e.code === "KeyA")
        {
            this.moveXEvent(-1);
        }
        if (e.code === "ArrowUp" || e.code === "Space" || e.code === "KeyW")
        {
            this.rotateEvent();
        }
        if ((e.code === "ArrowDown" || e.code === "KeyS") && !this.skipButtonClick)
        {
            this.skipButtonClick = true;
            this.skipFallEvent();
        }
    }

    setKeyup(e)
    {
        if (e.code === "ArrowDown")
        {
            this.skipButtonClick = false;
        }
    }
    
}