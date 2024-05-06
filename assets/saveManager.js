export default class SaveManager
{
    constructor()
    {
        this.record;
        this.loadSave();
    }

    loadSave()
    {
        if (JSON.parse(localStorage.getItem("storekeeperSave")) == undefined)
        {
            this.record = 0;
            localStorage.setItem("storekeeperSave", 0);
        }
        else
        {
            this.record = localStorage.getItem("storekeeperSave");
        }
    }

    saveRecord(newRecord)
    {
        this.record = newRecord;
        localStorage.setItem("storekeeperSave", this.record);
    }
}