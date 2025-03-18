"use strict";
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { toTitleCase, auth, database, setDoc, deleteDoc, returnHpImage, placeBefore, createLabel } from '../js/viMethods.js';

const currentMapRef = ref(database, 'currentMap/');
onValue(currentMapRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeDB = data;
});

const currentTORef = ref(database, 'currentTO/');
onValue(currentTORef, (snapshot) => 
{
    const data = snapshot.val();
    wholeTO = data;
});

const summonsRef = ref(database, 'playerChar/Vi/summons');
onValue(summonsRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeSummons = data;
});

const charRef = ref(database, 'playerChar/');
onValue(charRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeChar = data;
});

const presetRef = ref(database, 'preset/');
onValue(presetRef, (snapshot) => 
{
    const data = snapshot.val();
    wholePre = data;
});

let fiveButtons = [];
let wholeDB = {};
let wholeTO = {};
let wholePre = {};
let wholeSummons = {};
let wholeChar;
let db;
let div = document.getElementById("story");
let preOrSumm;
let editDiv;
let imgs;
let curCharacter;
let temp;
let mode;
let user;
let wholeActions;
let wholeSpells;

function init()
{
    fetch('https://vitheaxolotl.github.io/Infused/src/files.json').then(res => res.json()).then((json) => imgs = json);
    fetch('https://vitheaxolotl.github.io/Infused/src/actions.json').then(res => res.json()).then((json) => wholeActions = json);
    fetch('https://vitheaxolotl.github.io/Infused/src/spells.json').then(res => res.json()).then((json) => wholeSpells = json);
    
    for(let button of document.getElementsByTagName("button"))
    {
        switch(button.id)
        {
            case "add":
                fiveButtons.push(button);
                button.onclick = handleAdd;
                break;

            case "remove":
                fiveButtons.push(button);
                button.onclick = handleRemove;
                break;

            case "pre":
                fiveButtons.push(button);
                button.onclick = handlePreset;
                break;
            
            case "sum":
                fiveButtons.push(button);
                button.onclick = handleSummons;
                break;

            case "quick":
                fiveButtons.push(button);
                button.onclick = handleQuick;
                break;

            case "turnO":
                fiveButtons.push(button);
                button.onclick = handleTurn;
                break;

            case "changeMap":
                fiveButtons.push(button);
                button.onclick = handleChangeMap;
                break;

            case "save":
                fiveButtons.push(button);
                button.onclick = handleSave;
                break;

            case "load":
                fiveButtons.push(button);
                button.onclick = handleLoad;
                break;
            
            case "interactive":
                fiveButtons.push(button);
                button.onclick = handleInteractive;
                break;

            case "generate":
                fiveButtons.push(button);
                button.onclick = handleGenerate;
                break;

            case "openPage":
                fiveButtons.push(button);
                button.onclick = handleOpenPage;
                break;
        }
    }
}

function getUser()
{
    if(auth.currentUser == undefined){alert("Wrong Credentails!!!"); location.reload();}
    else{user = auth.currentUser.email.split("@"); user = toTitleCase(user[0]);}
    if(user != "Vi"){alert("Wrong Credentails!!!"); location.reload();}
}

function handleAdd()
{
    hideButtons();

    mode = "add";
    curCharacter = {border: "invisible", currentHp: "20", map: "", maxHp: "20", tempHp: "0", isSummon : false, name: "invisible-", id: "invisible", title: " ", xPos: "5", yPos: "D", dc: "10"};
    makeToken(curCharacter);
    editDiv = document.getElementById("invisible-div");
    temp = curCharacter.name;
    handleEdit();

    let reset = document.getElementById("reset");
    reset.onclick = handleDone;
}

function makeToken(key)
{
    let token = [document.createElement("div"), document.createElement("img"), document.createElement("img"), document.createElement("img")];
    token[0].id = `${key.id}-div`;
    token[0].classList = "bg-UP-grey objectBorder";
    token[0].style.margin = "5px";
    token[0].style.position = "relative";
    token[0].style.minHeight = "82px";
    token[0].style.minWidth = "82px";
    token[1].src = `images/map/tokens/${key.name}.png`;
    token[1].id = key.name;
    token[1].classList = `tokens ${key.name} char`;
    token[2].src = `images/map/tokens/${key.border}Border.png`;
    token[2].id = key.border;
    token[2].classList = `tokens ${key.id} border_`;
    token[3].src = updateHpPic(key.maxHp, key.currentHp);
    token[3].id = "hp";
    token[3].classList = `tokens ${key.name} hp`;
    token[2].onclick = handleDeleteOrEdit;

    token[0].appendChild(token[1]);
    token[0].appendChild(token[2]);
    token[0].appendChild(token[3])
    div.appendChild(token[0]); 
}

function handleRemove()
{
    hideButtons();

    for(let key of Object.keys(wholeDB))
    {
        if(key != "invisible")
        {
            makeToken(wholeDB[key]);
        }
    }

    addDone();
}

function handleDeleteOrEdit()
{
    let currentDiv = this.parentElement;
    let currentEOrD = document.getElementsByClassName("eOrD");
    let editB = document.createElement("button");
    let deleteB = document.createElement("button");

    if(currentEOrD.length > 0)
    {
        for(let i = 0; i < 2; i++)
        {
            currentEOrD[0].parentElement.removeChild(currentEOrD[0]);
        }
    }

    editDiv = currentDiv;
    editB.innerHTML = "edit";
    editB.onclick = handleEdit;
    temp = this.classList[1];
    editB.classList = `eOrD ${this.classList[1]}`;
    editB.id = "edit";
    editB.style.margin = `5px 5px 5px 79px`;
    deleteB.innerHTML = "delete";
    deleteB.onclick = deleteToken;
    deleteB.classList = `eOrD ${this.classList[1]}`;
    currentDiv.appendChild(editB);
    currentDiv.appendChild(deleteB);
}

function deleteToken()
{
    for(let key of Object.keys(wholeDB))
    {
        if(key == this.classList[1])
        {
            try
            { 
                deleteDoc(`currentMap/${wholeDB[key].id}`);
            }
            
            catch (e) 
            {
                console.error("Error adding document: ", e);
            }
        }
    }
    
    resetDelete();
}
 
function handleEdit()
{
    let names = ["border", "name", "maxHp", "currentHp", "title", "xPos", "yPos", "tempHp", "isSummon", "dc"];
    let txtFeilds = [];
    let buttons = [document.createElement("button"), document.createElement("button")];
    let buttonsName = ["edit", "back"];
    let currentEOrD = document.getElementsByClassName("eOrD");

    if(currentEOrD.length > 0)
    {
        for(let i = 0; i < 2; i++)
        {
            currentEOrD[0].parentElement.removeChild(currentEOrD[0]);
        }
    }

    for(let i = 0; i < 2; i++)
    {
        buttons[i].id = buttonsName[i];
        buttons[i].innerHTML = buttonsName[i];
        buttons[i].style.display = "inline";
        buttons[i].style.width = "80px";
    }

    buttons[0].onclick = addToken;
    buttons[0].style.margin = "5px 2.5px 5px 42%";
    buttons[1].onclick = resetDelete;
    buttons[1].style.margin = "5px 5px 5px 2.5px";
    buttons[1].id = "reset";

    if(temp != undefined)
    {
        if(mode == undefined)
        {
            for(let key of Object.keys(wholeDB))
            {
                if(wholeDB[key].name == temp + "-")
                {
                    curCharacter = wholeDB[key];
                }
            }
        }

        else if(mode == "preset")
        {
            for(let key of Object.keys(db[preOrSumm]))
            {
                if(db[preOrSumm][key].name == temp)
                {
                    curCharacter = db[preOrSumm][key];
                }
            } 

            buttons[0].classList.add(curCharacter.name);
            buttons[0].onclick = function () {let id = this.classList[0].slice(0, this.classList[0].length - 1); setDoc(`currentMap/${id}`, db[preOrSumm][id]);};
            buttons[1].onclick = resetPreset;
        }
    }
    
    for(let i = 0; i < 10; i++)
    {
        let label = createLabel(names[i]);
        
        if(i == 0)
        {
            label.style.margin = `5px 5px 5px 79px`;
            txtFeilds[i] = document.createElement("select");
            txtFeilds[i].name = names[i];

            for(let key of Object.keys(imgs["borders"]))
            {
                let currentBorder = imgs["borders"][key];
                let option = document.createElement("option");
                option.value = key;
                option.text = currentBorder.slice(currentBorder.indexOf("ns/") + 3).replace("Border.png", "");
                txtFeilds[i].appendChild(option);
                txtFeilds[i].onchange = updateBorderPic;
            }
        }

        else if(i == 1)
        {
            txtFeilds[i] = document.createElement("select");
            txtFeilds[i].name = names[i];

            for(let key of Object.keys(imgs["tokens"]))
            {
                let currentBorder = imgs["tokens"][key];
                let option = document.createElement("option");
                option.value = key;
                option.text = currentBorder.slice(currentBorder.indexOf("ns/") + 3).replace(".png", "");
                txtFeilds[i].appendChild(option);
                txtFeilds[i].onchange = updateTokenPic;
            }
        }

        else if(i == 3 || i == 7)
        {
            txtFeilds[i] = document.createElement("input");
            txtFeilds[i].name = names[i];
            txtFeilds[i].type = "number";
            txtFeilds[i].min = "0";
            txtFeilds[i].step = "1";
            txtFeilds[i].onchange = handleChangeCurrent;
        }

        else
        {
            txtFeilds[i] = document.createElement("input");
        }
        
        txtFeilds[i].style.width = "75px";
        txtFeilds[i].id = names[i];
        txtFeilds[i].style.margin = "5px";
        editDiv.appendChild(label);
        editDiv.appendChild(txtFeilds[i]);
    }

    txtFeilds[0].value = curCharacter.border;
    txtFeilds[1].value = curCharacter.name;
    txtFeilds[2].value = curCharacter.maxHp;
    txtFeilds[3].value = curCharacter.currentHp;
    txtFeilds[4].value = curCharacter.title;
    txtFeilds[5].value = curCharacter.xPos;
    txtFeilds[6].value = curCharacter.yPos;
    txtFeilds[7].value = curCharacter.tempHp;
    txtFeilds[8].value = curCharacter.isSummon;
    txtFeilds[9].value = curCharacter.dc;
    editDiv.appendChild(document.createElement("h6"));
    buttons.forEach(em => {editDiv.appendChild(em)});
}

function updateBorderPic()
{
    this.parentNode.childNodes[1].src = imgs["borders"][this[this.selectedIndex].value];
}

function updateTokenPic()
{
    this.parentNode.childNodes[0].src = imgs["tokens"][this[this.selectedIndex].value];
}

function handleChangeCurrent()
{
    let maxHp = document.getElementById("maxHp").value;
    let currentHp = document.getElementById("currentHp").value;;

    if(parseInt(currentHp) > parseInt(maxHp))
    {
        this.value = maxHp;
    }

    this.parentNode.childNodes[2].src = updateHpPic(maxHp, currentHp);
}

function updateHpPic(maxHp, currentHp)
{
    let tempHp = document.getElementById("tempHp");
    return returnHpImage(maxHp, tempHp, currentHp);
}

function resetState()
{
    let aboveDiv = div.parentElement;
    div.remove();
    div = document.createElement("div");
    div.id = "story";
    div.classList = "bg-UP-purple color-UP-black col-md-12 col-sm-12";
    placeBefore(div, aboveDiv.childNodes[1]);
}

function resetDelete()
{
    setTimeout(() => {resetState(); handleRemove();}, 1500);
}

function resetQuick()
{
    setTimeout(() => {resetState(); handleQuick();}, 1500);
}

function resetPreset()
{
    setTimeout(() => {resetState(); handlePreset();}, 1500);
}

function resetSummons()
{
    setTimeout(() => {resetState(); handleSummons();}, 1500);
}

function handleQuick()
{
    hideButtons();

    let curDate = new Date().toLocaleTimeString();
    let date = document.createElement("h3");
    date.innerHTML = `Current Hps at time of ${curDate}`;
    div.appendChild(date);

    for(let key of Object.keys(wholeDB))
    {
        if(key != "invisible" && wholeDB[key].border != "invisible")
        {
            makeToken(wholeDB[key]);
            let currentDiv = document.getElementById(`${wholeDB[key].id}-div`);
            let names = ["xPos", "yPos", "currentHp", "maxHp"];
            let feilds = [document.createElement("h6"), document.createElement("h6"), document.createElement("input"), document.createElement("h6")]
            
            feilds[0].innerHTML = wholeDB[key].xPos;
            feilds[1].innerHTML = wholeDB[key].yPos;
            feilds[2].value = wholeDB[key].currentHp;
            feilds[2].id = "newHp_" + wholeDB[key].id;
            feilds[2].style.width = "3%";
            feilds[3].innerHTML = wholeDB[key].maxHp;

            for(let i = 0; i < 4; i++)
            {
                let label = createLabel(names[i]);

                if(i == 0){label.style.margin = `5px 5px 5px 79px`;}
                else{label.style.margin = `5px`;}

                feilds[i].style.display = "inline";
                currentDiv.appendChild(label);
                currentDiv.appendChild(feilds[i]);
            }

            let upload = document.createElement("button");
            upload.id = wholeDB[key].id;
            upload.onclick = quickUpdate;
            upload.style.margin = "5px";
            upload.style.width = "6%";
            upload.innerHTML = "Upload";
            currentDiv.appendChild(upload);
        }
    }

    addDone();
}

function quickUpdate()
{
    let i = this.id;
    let newHp = document.getElementById('newHp_' + i);

    setDoc(`currentMap/${i}`,
    {
        border : wholeDB[i].border,
        currentHp : newHp.value,
        maxHp : wholeDB[i].maxHp,
        map : "",
        id : i,
        name : wholeDB[i].name,
        title : wholeDB[i].title,
        xPos : wholeDB[i].xPos,
        yPos : wholeDB[i].yPos,
        dc: wholeDB[i].dc
    });

    resetQuick();
}

function handlePreset()
{
    hideButtons();
    if(preOrSumm == undefined){preOrSumm = 0;}
    db = [wholePre, wholeSummons];

    for(let token of Object.keys(db[preOrSumm]))
    {
        if(token == "isSummonOn")
        {
            continue;
        }

        makeToken(db[preOrSumm][token]);
        let currentDiv = document.getElementById(`${db[preOrSumm][token].id}-div`);
        let names = ["Edit", "Delete", "Upload"];
        let feilds = [document.createElement("button"), document.createElement("button"), document.createElement("button")];

        for(let i = 0; i < 3; i++)
        {
            let label = createLabel(names[i]);

            if(i == 0){label.style.margin = `5px 5px 5px 79px`;}
            else{label.style.margin = `5px`;}

            feilds[i].style.display = "inline";
            feilds[i].id = db[preOrSumm][token].name.slice(0, db[preOrSumm][token].name.length - 1);
            feilds[i].style.margin = "5px";
            feilds[i].style.width = "9%";
            feilds[i].innerHTML = names[i];
            currentDiv.appendChild(label);
            currentDiv.appendChild(feilds[i]);
        }

        feilds[0].onclick = addPreset;
        feilds[1].onclick = deletePreset;
        feilds[2].onclick = addToMap;
    }
    
    let addButton = document.createElement("button");
    addButton.innerHTML = "Create New";
    addButton.style.margin = "5px";
    addButton.onclick = function () {addPreset();};
    div.appendChild(addButton);

    addDone();
}

function deletePreset()
{
    if(preOrSumm == 1)
    {
        deleteDoc(`playerChar/Vi/summons/summonPreset/${this.id}`);
        resetSummons();
    }

    else
    {
        deleteDoc(`preset/${this.id}`);
        resetPreset();
    }
}

function addPreset()
{
    let token;
     
    if(this == undefined)
    {
        token = {border : "invisible", currentHp : "20", maxHp : "20", tempHp : "0", isSummon: false, map : "", name : "invisible-", title : " ", xPos : "1", yPos : "A", dc: "10"};
        if(preOrSumm == 1){token["isSummon"] = true};
        db[preOrSumm]["invisible"] = token;
    }
    else{token = db[preOrSumm][this.id]}

    resetState();
    makeToken(token);
    editDiv = document.getElementById(`${token.id}-div`);
    temp = token.name;
    mode = "preset";
    handleEdit();
    mode = "";
    let editBtn = document.getElementById("edit");
    editBtn.onclick = updatePreset;
    editBtn.innerHTML = "Add/Edit";
    document.getElementById("reset").onclick = resetPreset;
    addDone();
}

function updatePreset()
{
    mode = "preset";
    addToken();
    mode = undefined;
    resetPreset();
}

function addToMap()
{
    let id = db[preOrSumm][this.id].id;
    let token = db[preOrSumm][this.id];
    
    if(Object.keys(wholeDB).includes(id))
    {
        id = id + "1";

        while(Object.keys(wholeDB).includes(id))
        {
            id = id.slice(0, id.length - 1) + (parseInt(id.charAt(id.length - 1)) + 1);
        }
    }

    token["id"] = id;
    setDoc(`currentMap/${id}`, token);
}

function handleSummons()
{
    if(preOrSumm == undefined){preOrSumm = 1;}

    let changeIsSummons = document.createElement("button");
    if(wholeSummons["isSummonOn"]){changeIsSummons.innerHTML = "Turn Summon's Off";}
    else{changeIsSummons.innerHTML = "Turn Summon's On";}
    changeIsSummons.onclick = (event) => 
        {
            if(wholeSummons["isSummonOn"]){changeIsSummons.innerHTML = "Turn Summon's On"; setDoc(`playerChar/Vi/summons/isSummonOn`, false);}
            else{changeIsSummons.innerHTML = "Turn Summon's Off"; setDoc(`playerChar/Vi/summons/isSummonOn`, true);}
        };
    div.appendChild(changeIsSummons);
    handlePreset();
}

function makeTORow(key)
{
    let TORow = [document.createElement("div"), ["Name", "Order", "Selected"], [document.createElement("h6"), document.createElement("input"), document.createElement("input"), document.createElement("button")]];
    TORow[0].id = `${key.charName}-div`;
    TORow[0].classList = "bg-UP-grey objectBorder center";
    TORow[0].style.margin = "5px";
    TORow[0].style.position = "relative";
    TORow[0].style.minHeight = "82px";
    TORow[0].style.minWidth = "82px";

    for(let i = 0; i < 3; i++)
    {
        let label = createLabel(TORow[1][i]);
        label.style.margin = `5px`;

        TORow[2][i].style.display = "inline";
        TORow[2][i].id = `${TORow[1][i]}_${key.charName}`;
        TORow[0].appendChild(label);
        TORow[0].appendChild(TORow[2][i]);                
    }

    TORow[2][3].innerHTML = "Remove";
    TORow[2][3].classList = "gridButton";
    TORow[2][3].onclick = removeFromTO;
    TORow[2][3].id = `${key.charName}_Remove`;
    TORow[2][3].style.margin = "5px";
    TORow[0].appendChild(TORow[2][3]);
    placeBefore(TORow[0], div.firstChild);
}

function DeleteKeys(myObj, array) 
{
    for (let index = 0; index < array.length; index++) 
    {
        delete myObj[array[index]];
    }

    return myObj;
}

function removeFromTO()
{
    let nodeName = this.id.replace("_Remove", "");

    if(Object.keys(wholeTO).includes(nodeName))
    {
        wholeTO = DeleteKeys(wholeTO, [nodeName]);
    }

    document.getElementById(`${nodeName}-div`).remove();
}

function addTORow(rowName)
{
    if(wholeTO == null){wholeTO = {};}
    let newRow = {charName : rowName, position : 0, selected : false};
    wholeTO[rowName] = newRow;
    makeTORow(newRow);

    let feilds = [document.getElementById(`Name_${rowName}`), document.getElementById(`Order_${rowName}`), document.getElementById(`Selected_${rowName}`)];
            
    feilds[0].innerHTML = newRow.charName;
    feilds[1].value = newRow.position;
    feilds[2].value = newRow.selected;
}

function handleTurn()
{
    hideButtons();
    setTimeout(() => 
    {
        if(wholeTO != null)
        {
            for(let key of Object.keys(wholeTO))
            {
                makeTORow(wholeTO[key]);
                let feilds = [document.getElementById(`Name_${wholeTO[key].charName}`), document.getElementById(`Order_${wholeTO[key].charName}`), document.getElementById(`Selected_${wholeTO[key].charName}`)]
                
                feilds[0].innerHTML = wholeTO[key].charName;
                feilds[1].value = wholeTO[key].position;
                feilds[2].value = wholeTO[key].selected;
            }
        }
    
        let buttons = [document.createElement("button"), document.createElement("button")];
        let names = ["Add", "Upload"];
        buttons[0].onclick = function () {let txtFeild = document.getElementById("newRow"); addTORow(txtFeild.value); txtFeild.value = "";};
        buttons[1].onclick = uploadTO;

        for(let i = 0; i < 2; i++)
        {
            buttons[i].style.margin = "5px";
            buttons[i].innerHTML = names[i];
            buttons[i].id = `${names[i]}TO`;
            div.appendChild(buttons[i]); 
            
            if(i == 0)
            {
                let rowName = document.createElement("input");

                rowName.id = "newRow";
                rowName.placeholder = "Name of New Row";
                rowName.style.display = "inline";
                buttons[i].style.display = "inline";
                buttons[i].style.width = "80%";
                div.appendChild(rowName);
            }
        }
    
        addDone();
    }, 1500);
}

function uploadTO()
{
    temp = wholeTO;
    emptyTOCollection();
    deleteDoc("currentTO/Var");

    for(let key of Object.keys(temp))
    {   
        setTimeout(() => {uploadRowTO(key)}, 250);
    }

    setDoc(`currentTO/Var/currentTurn`, 1);
    let curDate = new Date().toLocaleTimeString();
    let date = document.createElement("h3");
    date.innerHTML = `Current Turn Order at time of ${curDate}`;
    div.appendChild(date);

}

function uploadRowTO(key)
{
    setDoc(`currentTO/${key}`,
    {
        charName : document.getElementById(`Name_${temp[key].charName}`).innerHTML,
        position : document.getElementById(`Order_${temp[key].charName}`).value,
        selected : document.getElementById(`Selected_${temp[key].charName}`).value
    });

    setDoc(`currentTO/Var/${key}`, {"temp" : "temp"});
}

function handleChangeMap()
{
    hideButtons();

    let select = document.createElement("select");
    select.classList = "center blo";
    select.id = "select";

    for(let keys of Object.keys(imgs["mapName"]))
    {
        let mapImg = imgs["mapName"][keys];
        let option = document.createElement("option");
        option.value = keys;
        option.text = mapImg.slice(mapImg.indexOf("ap/") + 3).replace(".jpg", "");
        select.appendChild(option);
    }

    let button = document.createElement("button");
    button.innerHTML = "Change";
    button.onclick = updateMap;

    div.appendChild(select);
    div.appendChild(button);
    addDone();
}

function updateMap()
{
    let select = document.getElementById("select");
    setDoc(`currentMap/map`, select[select.selectedIndex].value);

    handleDone();
}

function listSelect()
{
    let collectionNames = [];
    const tempRef = ref(database, `lists/`);
    onValue(tempRef, (snapshot) => 
    {
        const data = snapshot.val();
        for(let point of Object.keys(data))
        {
            collectionNames.push(point);
        }
    });

    let selectNames = document.createElement("select");

    setTimeout(() => 
    {
        for(let cName of collectionNames)
        {
            if(cName != "currentMap")
            {
                let option = document.createElement("option");
                option.value = cName;
                option.text = cName;
                selectNames.appendChild(option); 
            }  
        }
    }, 200);

    selectNames.classList = "center blo";
    selectNames.id = "selectNames";

    div.appendChild(selectNames);
}

function handleSave()
{
    hideButtons();
    listSelect();

    let saveName = document.createElement("input");
    let label = createLabel(`Save Name`);
    let button = document.createElement("button");
    
    label.style.margin = "5px 5px 5px 40%";
    saveName.id = "saveName";
    saveName.style.margin = "5px";
    button.innerHTML = "Save";
    button.onclick = handleUploadeSave;
    
    div.appendChild(label);
    div.appendChild(saveName);
    div.appendChild(button);
    addDone();
}

function handleUploadeSave()
{
    let saveName = document.getElementById("saveName");
    let selectNames = document.getElementById("selectNames");
    let cName = saveName.value;

    if(saveName.value == "")
    {
        cName = selectNames[selectNames.selectedIndex].value;
        emptyCollection(cName);
    }

    for(let key of Object.keys(wholeDB))
    {
        setDoc(`${cName}/${key}`, wholeDB[key]);
    }

    setDoc(`${cName}/${Object.keys(wholeDB)[0]}`, wholeDB[Object.keys(wholeDB)[0]]);

    wholeDB[Object.keys(wholeDB)[0]]

    setDoc(`lists/${cName}`, {name : `${cName}`});

    handleDone();
}

function emptyCollection(cName)
{
    deleteDoc(`${cName}/`);
}

function emptyTOCollection()
{
    deleteDoc(`currentTO/`);
}

function handleLoad()
{
    hideButtons();
    listSelect();

    let goButton = document.createElement("button");

    goButton.style.margin = "5px";
    goButton.innerHTML = "Load";
    goButton.onclick = loadMap;
    div.appendChild(goButton);
    addDone();
}

function loadMap()
{
    let selectNames = document.getElementById("selectNames");
    let cName = "";
    cName = selectNames[selectNames.selectedIndex].value;
    emptyCollection("currentMap");

    const tempRef = ref(database, `${cName}/`);
    onValue(tempRef, (snapshot) => 
    {
        const data = snapshot.val();
        wholeDB = data;
    });

    setTimeout(() => 
    {  
        temp = wholeDB;
        for(let key of Object.keys(temp))
        {
            setDoc(`currentMap/${key}`, temp[key]);
        }

        handleDone();
    }, 90);
}

function handleInteractive()
{
    hideButtons();
    let labels = ["iText", "iURL"];
    let elms = [document.createElement("input"), document.createElement("input")];

    for(let i = 0; i < labels.length; i++)
    {
        let divider = document.createElement("span");
        divider.style.display = "block";

        let label = createLabel(labels[i]);
        label.style.padding = "5%";
        elms[i].id = labels[i];
        elms[i].type = "text";
        
        div.appendChild(label);
        div.appendChild(elms[i]);
        div.appendChild(divider);
    }

    let buttons = ["Exit", "Upload"];
    let exitButton;

    for(let i = 0; i < buttons.length; i++)
    {
        let button = document.createElement("button");
        button.innerHTML = buttons[i];
        button.classList.add("gridButton");
        button.style.margin = "5px";

        if(i == 0){button.onclick = handleDone; exitButton = button;}
        else if(i == 1){button.onclick = handleUploadInteractive;}

        div.appendChild(button);
    }

    displayInteractive(exitButton);
}

function displayInteractive(exitButton)
{
    let labels = ["Push"];
    let selects = [document.createElement("div")];
    
    for(let i = 0; i < labels.length; i++)
    {
        let label = createLabel(labels[i]);

        label.style.padding = "5%";
        placeBefore(selects[i], exitButton);
        placeBefore(label, selects[i]);
        selects[i].classList = "ddown ddownHide sDropdown";
        selects[i].id = labels[i];
        selects[i].style.width = "100%";

        let dropBtn = document.createElement("button");
        dropBtn.classList.add("dropbtn");
        dropBtn.classList.add(labels[i]);
        dropBtn.id = `${labels[i]}Button`;
        dropBtn.onclick = handleShowSelect; //
        placeBefore(dropBtn, selects[i]);

        let selectDiv = document.createElement("div");
        selectDiv.classList.add("ddown-content");
        selects[i].appendChild(selectDiv);
        selectDiv.id = `${labels[i]}Select`;

        let sources = [];
        let temp;

        switch(i)
        {
            case 0:
                temp = imgs["push"];
                for(let img of Object.keys(temp)){sources.push(temp[img]);} //Populates Sources with all the selectable images
                break;
        }

        for(let x = 0; x < sources.length; x++)
        {
            let img = document.createElement("img");
            img.src = sources[x];
            img.onclick = changeSourceSelect; 
            img.classList.add(dropBtn.id);
            img.style.width = "20vw";
            img.style.height = "20vw";
            
            temp = img.src;
            temp = temp.split("/");
            temp = temp[temp.length - 1];

            if(temp.includes("Border"))
            {
                temp = temp.slice(0, temp.indexOf("Border"));
            }

            else if(temp.includes("-."))
            {
                temp = temp.slice(0, temp.indexOf("."));
            }

            else
            {
                temp = temp.slice(0, temp.indexOf("."));
            }

            img.classList.add(temp);
            img.classList.add("char");
            selectDiv.appendChild(img); 
        }
    }
}

function changeSourceSelect()
{
    let select = document.getElementById(this.classList[0]);
    select.innerHTML = this.classList[1];
    select.click();
}

function handleShowSelect()
{
    let divs = document.getElementsByClassName("sDropdown");

    for(let div of divs)
    {
        if(div.id == this.classList[1])
        {
            if(div.classList.contains("ddownHide"))
            {
                div.classList.remove("ddownHide");
                div.classList.add("ddownShow");
            }
        
            else if(div.classList.contains("ddownShow"))
            {
                div.classList.remove("ddownShow");
                div.classList.add("ddownHide");
            }
        }

        else
        {
            div.classList.remove("ddownShow");
            div.classList.add("ddownHide");
        }
    }
    
}

function handleUploadInteractive()
{
    let text = document.getElementById("iText");
    let img = document.getElementById("iURL");
    let select = document.getElementById("PushButton");
    let src = img.value;

    if(select.innerHTML != ""){src = imgs["push"][select.innerHTML];}
    let obj = {"image" : `${src}`, "text" : `${text.value}`};

    setDoc("playerChar/Vi/interactive", obj);
    handleDone();
}

function handleGenerate()
{
    hideButtons();
    setDoc("playerChar/Hannah", wholeChar["Garrett"]);

    alert("done");
    handleDone();
}

function backupFavorites()
{
    let classes = ["Artificer", "Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard", "Infused Abilities"];

    for(let player of Object.keys(wholeChar))
    {
        let favoriteSpells = wholeChar[player]["favorites"]["spells"];
        let favoriteActions = wholeChar[player]["favorites"]["actions"];

        for(let spellLv of Object.keys(favoriteSpells))
        {
            for(let spell of Object.keys(favoriteSpells[spellLv]))
            {
                if(spell != "hold"){wholeSpells[spellLv][spell] = favoriteSpells[spellLv][spell]};
            }
        }

        for(let tag of Object.keys(favoriteActions))
        {
            for(let action of Object.keys(favoriteActions[tag]))
            {
                if(action != "hold")
                {
                    if(!classes.includes(tag))
                    {
                        wholeActions["Misc"][action] = favoriteActions[tag][action];
                    }
    
                    else{wholeActions[tag][action] = favoriteActions[tag][action];}
                }
            }
        }
    }

    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(wholeSpells));
    let dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "spells.json");
    dlAnchorElem.click();

    dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(wholeActions));
    dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "actions.json");
    dlAnchorElem.click();
}

function handleOpenPage()
{
    let window = document.createElement("a");
    window.href = "dmSite.html";
    window.target = "_blank";
    window.click();
    handleDone();
}

function handleDone()
{
    setInterval(() => {location.reload();}, 1000);
}

function hideButtons()
{
    getUser(); 

    if(fiveButtons != [])
    {
        for(let button of fiveButtons)
        {
            button.remove();
        }

        fiveButtons = [];
    }
}

function addDone()
{
    let doneButton = document.createElement("button");
    doneButton.id = "done";
    doneButton.innerHTML = "Done";
    doneButton.onclick = handleDone;
    div.appendChild(doneButton);
}

function addToken()
{
    let b = document.getElementById("border").value;
    let c = document.getElementById("currentHp").value;
    let mH = document.getElementById("maxHp").value;
    let tH = document.getElementById("tempHp").value;
    let n = document.getElementById("name").value;
    let t = document.getElementById("title").value;
    let x = document.getElementById("xPos").value;
    let y = document.getElementById("yPos").value;
    let s = document.getElementById("isSummon").value;
    let dc = document.getElementById("dc").value;
    let id = n.slice(0, n.indexOf("-"));
    
    if(Object.keys(wholeDB).includes(id) && mode == "add")
    {
        id = id + "1";

        while(Object.keys(wholeDB).includes(id))
        {
            id = id.slice(0, id.length - 1) + (parseInt(id.charAt(id.length - 1)) + 1);
        }

        mode = "none";
    }

    if(s == true)
    {
        table = `playerChar/Vi/summons/summonPreset/${id}`;
    }

    let table = `currentMap/${id}`;
    if(mode == "preset")
    {
        table = `preset/${id}`;    
    }
 
    setDoc(table,
    {
        border : b,
        currentHp : c,
        maxHp : mH,
        tempHp : tH,
        isSummon : s,
        map : "",
        id : `${id}`,
        name : n,
        title : t,
        xPos : x,
        yPos : y,
        dc : dc
    });

    resetDelete();
}

setTimeout(init(), 1000);
