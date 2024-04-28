export default class SaveManager
{
    constructor()
    {
        this.records;
        this.loadSave();
    }

    loadSave()
    {
        if (JSON.parse(localStorage.getItem("mathSave")) == undefined)
        {
            this.records = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            localStorage.setItem("mathSave", JSON.stringify(this.records));
        }
        else
        {
            this.records = JSON.parse(localStorage.getItem("mathSave"));
        }
    }

    saveRecords(newRecords)
    {
        this.records = newRecords;
        localStorage.setItem("mathSave", JSON.stringify(this.records));
    }
}