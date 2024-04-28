export default class UI_Element
{
    constructor(elements, isActiveStart = false)
    {
        this.elements = elements;
        this.isActiveStart = isActiveStart;
        this.isActive = !isActiveStart;
        if (this.isActiveStart)
        {
            this.turnOn();
        }
        else
        {
            this.turnOff();
        }
    }

    turnOn()
    {
        if (this.isActive == true) return;
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].style.display = "";
        }
        this.isActive = true;
    }

    turnOff()
    {
        if (this.isActive == false) return;
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].style.display = "none";
        }
        this.isActive = false;
    }
}