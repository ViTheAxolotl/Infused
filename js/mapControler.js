"use strict";

import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { toTitleCase, database, createCard, setDoc, deleteDoc, placeBefore, createLabel, clenseInput, reload, setMapValue, quickAction, setQuickAction, skillDecrypt} from './viMethods.js';

export function setWholeInteractive(data)
{ 
    if(!firstRun)
    {
        displayInteractive();
    }
}

export function setWholeCharCont(data)
{
    let infusedRate = document.getElementById("infusionRate");
    infusedRate.innerHTML = `${infusedRate.title} ${data[player]["stats"]["InfusedRate"]}%`;

    if(firstRun) //The first time it loads
    {
        firstRun = false;
        init();
    }

    if(window.wholeChar[player]["bardicInspo"])
    {
        let inspo = document.getElementById("inspo");
        inspo.style.display = "block";
        inspo.innerHTML = `${inspo.title} 1`;
    }

    else
    {
        let inspo = document.getElementById("inspo");
        inspo.style.display = "none";
        inspo.innerHTML = `${inspo.title} 0`;
    }

    if(window.wholeChar[player]["zoomLevel"])
    {
        zoomLevel = window.wholeChar[player]["zoomLevel"];
        document.getElementById("gridMap").style.zoom = `${zoomLevel}%`;
    }

    if(window.wholeChar[player]["zoomSheetLevel"])
    {
        //document.getElementById("statSheet").style.zoom = `${window.wholeChar[player]["zoomSheetLevel"]}%`;
        document.getElementById("statSheet").style.transform = `scale(${window.wholeChar[player]["zoomSheetLevel"]/100})`;
        document.getElementById("statSheet").style.width = `${100/(window.wholeChar[player]["zoomSheetLevel"]/100)}%`;
        document.getElementById("statSheet").style.marginBottom = `${((window.wholeChar[player]["zoomSheetLevel"]/100)-1)*70*9.4}px`;
        document.getElementById("statSheet").style.height = `${((100/window.wholeChar[player]["zoomSheetLevel"]))*50+40}vh`;
    }
}

export function setWholeQuests(data)
{
    let questTitle = document.getElementById("questTitle");
    let questText = document.getElementById("questText");
    
    for(let quest of Object.keys(window.wholeQuests))
    {
        if(window.wholeQuests[quest]["activeQuest"])
        {
            questTitle.innerHTML = window.wholeQuests[quest]["name"];
            questText.innerHTML = window.wholeQuests[quest]["Desc"];
        }
    }
}

let map = setMapValue();
let currentPos;
let currentCharacter;
let playerName = document.getElementById("name");
let key;
let keyControl;
let arrows = [];
let currentHp = document.getElementById("current");
let maxHp = document.getElementById("max");
let tempHp = document.getElementById("temp");
let buttons;
let player = window.player;
let bounds;
let firstRun = true;
let firstMenu;
let secondMenu;
let spellBtn;
let rollDiceBtn;
let actionBtn;
let wholeRoles = {};
let currentLv;
let spellLevel;
let curClass;
let searchBar = document.getElementsByName("search");
let upper = document.getElementById("cards");
let favorite = false;
let db;
let lastSpell;
let lastAbility;
let changeTokenBtn;
let currentAction;
let zoomLevel = 100;
let grid = document.getElementById("grid");
let discription;
let currentToken;
let favoriteRef;

/**
 * Runs when JS opens
 */
function init()
{
    arrows.push(document.getElementById("up"));
    arrows.push(document.getElementById("left"));
    arrows.push(document.getElementById("right"));
    arrows.push(document.getElementById("down"));
    
    currentHp.onchange = updateHp;
    tempHp.onchange = tempHpUpdate;
    maxHp.innerHTML = "/ " + window.wholeChar[player]["stats"]["maxHp"];
    searchBar[0].onchange = handleSearch;

    for(let arrow of arrows)
    {
        arrow.onclick = handleArrow;
        arrow.touchstart = handleArrow;
    }

    document.addEventListener("keydown", (ev) => {key = ev.key.slice(ev.key.indexOf("w") + 1).toLowerCase(); keyControl = ev; let keyValues = ["left", "right", "down", "up"]; if(keyValues.includes(key) && ev.ctrlKey) {handleArrow();}}); //If control is held down and an arrow
    setMainVaribles();
    grid.onclick = function(e){handleGridClick(e);};
    currentLv = window.wholeChar[player]["stats"]["lv"] + "th level";
    currentToken = window.wholeChar[player]["currentToken"];

    for(let diceSelect of document.getElementsByClassName("diceSelect")){diceSelect.onclick = handleDiceSelect;}
    document.getElementById("questCard").onclick = handleLoadQuests;
}

/**
 * Sets the varibles for the map
 */
function setMainVaribles()
{   
    changeTokenBtn = document.getElementById("changeTokenBtn");
    changeTokenBtn.onclick = handleChangeToken;
    buttons = document.getElementsByClassName("inOrDe");
    playerName.innerHTML = toTitleCase(window.wholeChar[player]["currentToken"]);
    currentCharacter = document.getElementsByClassName(window.wholeChar[player]["currentToken"]);
    let hiddenVi = document.getElementsByClassName("isVi");
    firstMenu = document.getElementsByClassName("firstMenu");
    for(let fButton of firstMenu){fButton.onclick = handleChangeFirstDisplay;} //for each of the first row
    secondMenu = document.getElementsByClassName("secondMenu");
    for(let sButton of secondMenu){sButton.onclick = handleChangeSecondDisplay;} //for each of the second row
    spellBtn = document.getElementsByClassName("spell");
    for(let sButton of spellBtn){sButton.onclick = handleShowSpells;} //for each of the spells row
    actionBtn = document.getElementsByClassName("action");
    for(let aButton of actionBtn){aButton.onclick = handleShowActions;} //for each of the actions row
    rollDiceBtn = document.getElementById("rollDice").onclick = handleDiceRoll;
    document.getElementById("quickAction").onclick = handleQuickAction;

    if(player != "Vi") //If player isn't me
    {
        for(let elem of hiddenVi) //Hides the controls to change turn order
        {
            elem.style.display = "none";
        }
    }

    map = setMapValue();
    
    bounds = [map.pos[0], map.pos[25]]; //Left, Right, Up, and Down walls

    for(let button of buttons) //All + and - buttons
    {
        button.onclick = changeValue;
    }
}

 /**
  * Sends message into the discord using a webhook
  * @param {*} message 
  */
function sendDiscordMessage(message)
{
    sendMessageToDisplay(message);
    message = message + "\n\n ||                ||"; //Makes message seperating bars
    let webhook = window.wholeChar["Vi"]["testingWebhook"]; //Which channel it goes to by webhook
    const contents = `${message}`;
    const request = new XMLHttpRequest();
    request.open("POST", webhook); //Opens the webhook
    request.setRequestHeader("Content-type", "application/json"); //Gives json header
    const prams = 
    {
        content: contents
    } 
    request.send(JSON.stringify(prams)); //Sends message
}

function sendMessageToDisplay(message)
{
    let current = parseInt(window.wholeDisplay["current"]);

    if(current + 1 > 9)
    {
        setDoc("display/current", "0");
        current = 0;
    }

    else
    {
        setDoc("display/current", `${current + 1}`);
        current++;
    }

    setDoc(`display/${current}`, message);
}

function handleGridClick(e)
{
    let bubbleDB = {id : `${player}-bubble`, x : (e.offsetX * (100/zoomLevel) - map.bubble), y : (e.offsetY * (100/zoomLevel) - map.bubble), size : 1, src : imgs["borders"][window.wholeDB[window.wholeChar[player]["currentToken"]].border]};
    if(bubbleDB.src.includes("invisible")){bubbleDB.src = imgs["borders"]["blue"];}
    setDoc(`bubbles/${bubbleDB.id}`, bubbleDB);
}

function handleQuickAction()
{
    let viewDiv = document.getElementById("cover");

    setQuickAction(true);
    handleFavoriteSelect();

    document.getElementById("quickDiv").children[0].classList = "center";

    for(let elm of viewDiv.children[0].children)
    {
        if(elm.id != "hideCover")
        {
            elm.classList = `invisible ${elm.classList[0]}`;
            elm.style.zIndex = "0";
        }
    }
}

/**
 * Rolls number of base dice with no modifier
 * @param {*} amount 
 * @param {*} dice 
 * @returns 
 */
function basicRoll(amount, dice)
{
    let rolls = [];

    for(let i = 0; i < amount; i++) //Rolls for each dice needed
    {
        let random = Math.random();
        let roll = Math.floor(random * (parseInt(dice))) + 1; //Gives random roll
        rolls.push(roll);
    }

    return rolls; //Returns all rolls
}

/**
 * Rolls the amount of dice * d(dice) + modifier. If description is needed ifName is true
 * @param {*} amount 
 * @param {*} dice 
 * @param {*} modifier 
 * @param {*} ifName 
 * @returns 
 */
function diceRoller(amount, dice, modifier, ifName)
{
    let rolls = basicRoll(amount, dice); //rolls each die
    let sum = 0;
    let inspo = false;
    let viewMod = `${modifier}`;
    if(modifier >= 0 && !viewMod.includes("+")){viewMod = "+" + modifier;} //Adds the + if the modifier is positive
    let message = ""; 
    if(ifName == "discord"){message = `${player} rolled `;} //Creates the message for discord
    message += ` *${amount}d${dice}${viewMod}* : *(`;
    
    for(let roll of rolls) //For each die that was rolled
    {
        sum += roll; //Adds the result to the sum
        message += `${roll}+`; //Adds the number to the message
    }

    if(message[message.length-1] == "+") //If the last thing in the message is +
    {
        message = message.slice(0, message.length - 1); //Removes the +
    }
    
    let finalResult = sum + parseInt(modifier); //Adds the sum and modifier
    
    if(window.wholeChar[player]["bardicInspo"] && dice == "20")
    {
        inspo = confirm(`You have rolled a ${finalResult} on your d20. You do have a Bardic Inspiration Die, would you like to roll it and add it to the total?`);
    }

    if(inspo)
    {
        let iDice = basicRoll("1", "6");

        finalResult += parseInt(iDice);
        message += `)${viewMod}+${iDice} (Inspiration)=* **${finalResult}** `;
        deleteDoc(`playerChar/${player}/bardicInspo`);

        let vis = document.getElementById("inspo");
        vis.style.display = "none";
    }

    else{message += `)${viewMod}=* **${finalResult}** `;}

    if(ifName == "finalResult"){message = `${finalResult}`;}

    return message;
}

/**
 * Once the roll dice button is clicked
 */
function handleDiceRoll()
{
    let modifier = document.getElementById("diceMod").innerHTML;
    modifier = modifier.split(": ");

    switch(document.getElementsByClassName("selected-dice")[0].innerHTML)
    {
        case "Basic":
            let amount = parseInt(document.getElementById("diceToRoll").value);
            let dice = parseInt(document.getElementById("sides").value);
            modifier = parseInt(document.getElementById("modifier").value);
        
            if(!Number.isNaN(amount) && !Number.isNaN(dice) && !Number.isNaN(modifier)) //If all three values are given
            {
                sendDiscordMessage(diceRoller(amount, dice, modifier, "discord") + "."); //Rolls the dice given and send the result to discord
            }

            else{alert("Need input in all 3 inputs.");} //If one or more of the values are missed
        break;

        case "Saves":
            if(modifier[0] == "InfusedRate")
            {
                let dc = parseInt(modifier[1]);
                let roll = diceRoller("1", "100", "0");
                roll = roll.slice(roll.indexOf("**") + 2);
                roll = roll.slice(0, roll.indexOf("**"));
                alert(roll);
                roll = parseInt(roll);

                if(roll <= dc)
                {
                    sendDiscordMessage(`${player} has failed their infusion save, with a roll of ${roll}, needed at least ${dc}.`);
                }

                else
                {
                    sendDiscordMessage(`${player} has succeeded their infusion save, with a roll of ${roll}, got above ${dc}.`);
                }
                break;
            }
    
        default:
            sendDiscordMessage(`${diceRoller("1", "20", modifier[1], "discord")} on their ${modifier[0]}.`);
            break;
    }
}

/**
 * When one of the buttons in the first list is clicked
 */
function handleChangeFirstDisplay()
{
    if(!this.classList.contains("Selected")) //If they have clicked a new button
    {
        emptyCards(); 
        document.getElementById("searchDiv").style.display = "none"; //Makes sure the search bar is hidden.

        for(let fButton of firstMenu) //For each button in the first list
        {
            let prop;
            favorite = false; 

            if(this.name != fButton.name) //If current button isn't the button that was clicked
            {
                prop = document.getElementById(fButton.name);
                prop.style.display = "none"; //Hide's the div associated
                
                if(fButton.classList.contains("selected")) //If it was the button selected last
                {
                    fButton.classList.remove("selected");
                }
            }

            else //If this is the button that was clicked
            {
                prop = document.getElementById(this.name);
                prop.style.display = "block"; //Make it's div visible
                this.classList.add("selected");
            }
        }

        if(this.name == "favorites") //If the button clicked was the favorite button
        {
            handleFavoriteSelect();
        }
    }
}

/**
 * Displays the favored spells and actions
 */
function handleFavoriteSelect()
{
    favorite = true;
    favoriteRef = ref(database, `playerChar/${player}/favorites/`); //Connects the the favorites database
    onValue(favoriteRef, (snapshot) => 
    { //Every time something changes in the database
        const data = snapshot.val();
        window.wholeFavorite = data;
        let spellDiv = document.getElementById("spellsF");
        let actionDiv = document.getElementById("abilityF");

        if(quickAction == true)
        {
            spellDiv = document.getElementById("spellsFQ");
            actionDiv = document.getElementById("abilityFQ");
        }

        while(spellDiv.children.length > 0) //Until the div is empty
        {
            spellDiv.removeChild(spellDiv.lastChild); 
        }


        while(actionDiv.children.length > 0) //Until the div is empty
        {
            actionDiv.removeChild(actionDiv.lastChild);
        }

        spellDiv.classList.add("center"); //Centers the spells
        actionDiv.classList.add("center"); //Centers the actions
        
        if(window.wholeFavorite["spells"]) //The spell btn is active
        {
            for(let spellLv of Object.keys(window.wholeFavorite["spells"])) //For each spell in the favorite of the player
            {
                let lvlBtn = document.createElement("button"); //Creates the button
                lvlBtn.name = spellLv;
                lvlBtn.classList = "gridButton spell";
                lvlBtn.innerHTML = `Lvl ${spellLv}`;
                lvlBtn.onclick = handleShowSpells;
                if(spellLv == "0"){lvlBtn.innerHTML = "Cantrips";} //If the spell level is 0 change the name to cantrips
                else if(spellLv == "hold"){if(!quickAction){lvlBtn.innerHTML = "Create New Spell"; lvlBtn.onclick = handleCreateNew;} else{continue;}} //After they reach the last button make it the create new button
                spellDiv.appendChild(lvlBtn); //Adds the buttons to the div
            }
        }

        if(window.wholeFavorite["actions"]) //If the action btn is active
        {
            for(let actionTag of Object.keys(window.wholeFavorite["actions"])) //For each spell in the favorite of the player
            {
                let tagBtn = document.createElement("button"); //Creates the button
                tagBtn.name = actionTag;
                tagBtn.classList = "gridButton action";
                tagBtn.innerHTML = `${actionTag}`;
                tagBtn.onclick = handleShowActions;
                if(actionTag == "hold"){if(!quickAction){tagBtn.innerHTML = "Create New Ability"; tagBtn.onclick = handleCreateNew;} else{continue;}} //After they reach the last button make it the create new button
                actionDiv.appendChild(tagBtn); //Adds the buttons to the div
            }
        }
    });
}

/**
 * When one of the buttons in the second list is clicked
 */
function handleChangeSecondDisplay()
{
    if(!this.classList.contains("Selected"))
    {
        emptyCards();

        spellLevel = undefined;
        curClass = undefined;
        document.getElementById("searchDiv").style.display = "block"; //Displays search bar

        for(let sButton of secondMenu) //For each button in the second list
        {
            let prop;

            if(this.name != sButton.name) //If button isn't the one that was clicked
            {
                prop = document.getElementById(sButton.name);
                prop.style.display = "none"; //Hides associated div
                
                if(sButton.classList.contains("selected")) //If button was last one clicked
                {
                    sButton.classList.remove("selected");
                }
            }

            else //If button is the one that was clicked
            {
                prop = document.getElementById(this.name);
                prop.style.display = "block"; //Shows the correct div
                this.classList.add("selected");
            }
        }

        for(let spell of spellBtn){if(spell.classList.contains("selected")){spell.classList.remove("selected");}} //Unselects buttons if they were previously clicked
        for(let action of actionBtn){if(action.classList.contains("selected")){action.classList.remove("selected");}} //Unselects buttons if they were previously clicked
    }
}

/**
 * When the temp hp is changed
 */
function tempHpUpdate()
{
    let tHp = parseInt(tempHp.value);
    
    if(tHp < 0) //If the hp was decreased into the negatives
    {
        tempHp.value = "0";
    }

    setDoc(`currentMap/${currentCharacter[0].classList[1]}/tempHp`, tempHp.value);

    if(player == currentCharacter[0].classList[1]){setDoc(`playerChar/${player}/token/tempHp`, tempHp.value);}
    if(window.wholeDB[currentCharacter[0].classList[1]]["isSummon"]){setDoc(`playerChar/Vi/summons/${currentCharacter[0].classList[1]}/tempHp`, tempHp.value);}
}

/**
 * When either the + or - button is clicked, it will change the variable associated with it
 * @returns 
 */
function changeValue()
{
    let cHp = parseInt(currentHp.value);
    let mHp = parseInt(maxHp.value);
    let tHp = parseInt(tempHp.value);
    let modifier = this.innerHTML;

    switch(this.name) //Checks case on the property of which name was clicked
    {
        case "current": 
            if(modifier == "+") //If plus button is clicked
            {
                if(!(cHp + 1 > mHp)) //If the current hp + 1 isn't higher then the max hp can go
                {
                    currentHp.value = `${cHp + 1}`; //Adds one to the current hp
                }
            }

            else //minus button is clicked
            {
                if(!(cHp - 1 < 0)) //If current hp - 1 isn't in the negatives
                {
                    currentHp.value = `${cHp - 1}`; //Minus one from the current hp
                }
            }

            updateHp();
            break;
        
        case "temp":
            if(modifier == "+") //If plus button is clicked
            {
                tempHp.value = `${tHp + 1}`; //Increases your temp hp by one
            }

            else //minus button is clicked
            {
                if(tHp > 0) //If temp hp - 1 isn't in the negatives
                {
                    tempHp.value = `${tHp - 1}`; //Minus one from the temp hp
                }
            }

            tempHpUpdate();
            break; 

        case "zoom":
            let zoomLevel = 100; if(window.wholeChar[player]["zoomLevel"]){zoomLevel = window.wholeChar[player]["zoomLevel"];}
            if(modifier == "+") //If plus button is 
            {
                if(zoomLevel < 170){zoomLevel += 10;}
            }

            else //minus button is clicked
            {
                zoomLevel -= 10;
                if (zoomLevel < 70){zoomLevel = 70;}
            }

            setDoc(`playerChar/${player}/zoomLevel`, zoomLevel);
            break;

        case "zoomSheet":
            let zoomSheetLevel = 100; if(window.wholeChar[player]["zoomSheetLevel"]){zoomSheetLevel = window.wholeChar[player]["zoomSheetLevel"];}
            if(modifier == "+") //If plus button is 
            {
                if(zoomSheetLevel < 100){zoomSheetLevel += 10;}
            }

            else //minus button is clicked
            {
                zoomSheetLevel -= 10;
                if (zoomSheetLevel < 30){zoomSheetLevel = 30;}
            }

            setDoc(`playerChar/${player}/zoomSheetLevel`, zoomSheetLevel);
            break;
        
        case "title":
            let title = document.getElementById("title");
            let status = document.getElementById("status");

            if(modifier == "+") //If plus button is clicked
            {
                title.innerHTML += ` ${toTitleCase(status.value)},`; //Adds the key word written to your title
            }

            else //minus button is clicked
            {
                title.innerHTML = title.innerHTML.replace(` ${toTitleCase(status.value)},`, ""); //Removes the given keyword from the title
            }

            title = title.innerHTML.slice(title.innerHTML.indexOf(": ") + 2).trim();
            setDoc(`currentMap/${currentToken}/title`, title);
            if(currentToken == player){setDoc(`playerChar/${player}/token/title`, title);}
            if(window.wholeDB[currentCharacter[0].classList[1]]["isSummon"]){setDoc(`playerChar/Vi/summons/${currentCharacter[0].classList[1]}/title`, title);}
            break;
        
        case "turn":
            if(modifier == "↓") //If plus button is clicked
            {
                handleChangeInTurn("up");
            }

            else //minus button is clicked
            {
                handleChangeInTurn("down");
            }
            return;
    }
}

/**
 * Changes the selected field to true if isSet == set or false for anything else
 * @param {*} data 
 * @param {*} isSet 
 */
function changeTOValue(data, isSet)
{
    let sel = "false"; //Assume that we are unsetting selected
    
    if(isSet == "set") //If we are setting selected
    {
        sel = "true";
    }

    setDoc(`currentTO/${data.charName}`,
    {
        charName : data.charName,
        position : data.position,
        selected : sel
    }); //Updates the data
}

/**
 * Moves the current turn up or down based on direction
 * @param {*} direction 
 */
function handleChangeInTurn(direction)
{
    let curSelected;
    let newSelected;
    let newPosition;
    let currentTurn = window.wholeTO["Var"]["currentTurn"];

    for(let key of Object.keys(window.wholeTO)) //For each turn of the turn order
    {
        if(window.wholeTO[key].selected == "true") //If the current turn is this turn
        {
            curSelected = key; 
            break;
        }
    }

    if(direction == "up") //If the + button is hit
    {
        if(window.wholeTO[curSelected].position == Object.keys(window.wholeTO).length - 1){newPosition = "1"; setDoc("currentTO/Var/currentTurn", currentTurn + 1);} //If the selected is the last one in the order move to the beginning
        else{newPosition = `${parseInt(window.wholeTO[curSelected].position) + 1}`} //Else move down one in the order
    }
        
    else if(direction == "down") //If the - button is hit
    {
        if(window.wholeTO[curSelected].position == "1"){newPosition = `${Object.keys(window.wholeTO).length - 1}`; setDoc("currentTO/Var/currentTurn", currentTurn - 1);} //If the selected is the first one in the order move to the end
        else{newPosition = `${parseInt(window.wholeTO[curSelected].position) - 1}`} //Else move up one in the order
    }

    for(let key of Object.keys(window.wholeTO)) //For each turn in the turn order
    {
        if(direction == "up" && window.wholeTO[key].position == newPosition){newSelected = key; break;} //If we are moving up in turn order and the current turn is the new turn
        else if(direction == "down" && window.wholeTO[key].position == newPosition){newSelected = key; break;} //If we are moving down in turn order and the current turn is the new turn
    }

    if(document.getElementById(`${curSelected}-div`)) //If the turns are currently visible
    {
        document.getElementById(`${curSelected}-div`).classList.remove("selected"); //Removes selected class from last turn
        document.getElementById(`${newSelected}-div`).classList.add("selected"); //Adds selected class to the new turn
    }

    changeTOValue(window.wholeTO[curSelected], "unset");
    changeTOValue(window.wholeTO[newSelected], "set");
}

/**
 * Moves current token to the given X and Y locations from xPos and yPos
 * @param {*} xPos 
 * @param {*} yPos 
 */
function moveChar(xPos, yPos)
{
    let x, y;

    x = map.xPos[map.pos.indexOf(xPos)];
    y = map.yPos[map.pos.indexOf(yPos)];

    setDoc(`currentMap/${currentCharacter[0].classList[1]}/xPos`, x);
    setDoc(`currentMap/${currentCharacter[0].classList[1]}/yPos`, y);

    if(currentCharacter[0].classList[1] == player)
    {
        setDoc(`playerChar/${player}/token/xPos`, x);
        setDoc(`playerChar/${player}/token/yPos`, y);
    }

    if(window.wholeDB[currentCharacter[0].classList[1]]["isSummon"])
    {
        setDoc(`playerChar/Vi/summons/${currentCharacter[0].classList[1]}/xPos`, x);
        setDoc(`playerChar/Vi/summons/${currentCharacter[0].classList[1]}/yPos`, y);
    }

}

/**
 * Changes the hp image of the token then makes sure update class is added
 */
function updateHp()
{
    let current = document.getElementById("current");

    setDoc(`currentMap/${currentCharacter[0].classList[1]}/currentHp`, `${current.value}`);

    if(currentCharacter[0].classList[1] == player)
    {
        setDoc(`playerChar/${player}/token/currentHp`, `${current.value}`);
    }

    if(window.wholeDB[currentCharacter[0].classList[1]]["isSummon"]){setDoc(`playerChar/Vi/summons/${currentCharacter[0].classList[1]}/currentHp`, `${current.value}`);}
}

/**
 * When the player hits the arrow button or types an arrow with cntl button moves the tokens
 */
function handleArrow()
{
    let direction = "";
    currentPos = [parseInt(currentCharacter[1].style.left.replace("px", "")), parseInt(currentCharacter[1].style.top.replace("px", ""))]; //Gets both X and Y location of token

    for(let token of currentCharacter) //For each image in the current character
    {
        let title = token.title;

        if(title != undefined) //If token has keywords in their title
        {
            if(title.includes("Large")) //If the token is 3X3
            {
                bounds = [map.pos[0], map.pos[24]]; //Stops the token from moving outside the borders
                break;
            }

            else if(title.includes("Huge")) //If the token is 4x4
            {
                bounds = [map.pos[0], map.pos[23]]; //Stops the token from moving outside the borders
                break;
            }

            else if (title.includes("Gargantuan")) //If the token is 5x5
            {
                bounds = [map.pos[0], map.pos[22]]; //Stops the token from moving outside the borders
                break;
            }

            else //If token is 2x2
            {
                bounds = [map.pos[0], map.pos[25]]; //Sets normal borders
            }
        }
    }

    if(key != undefined) //If the arrow key was hit
    {
        keyControl.preventDefault(); //Stops page from moving 
        direction = key;
    }

    if (this != undefined) //If dPad button is hit
    {
        direction = this.id;
    }

    switch(direction) //Switch on which direction their trying to move
    {
        case "up":
            if(bounds[0] < currentPos[1]) //If they are not on the top border
            {
                moveChar(currentPos[0], currentPos[1] - map.movement);
            }  
            break;
        
        case "down":
            if(bounds[1] > currentPos[1]) //If they are not on the bottom border
            {
                moveChar(currentPos[0], currentPos[1] + map.movement);
            }    
            break;

        case "left": 
            if(bounds[0] < currentPos[0]) //If they are not on the left border
            {
                moveChar(currentPos[0] - map.movement, currentPos[1]);
            }
            break;

        case "right":
            if(bounds[1] > currentPos[0]) //If they are not on the right border
            {
                moveChar(currentPos[0] + map.movement, currentPos[1]);
            } 
            break;
    }
}

/**
 * Remove all cards displayed
 */
function emptyCards()
{
    if(quickAction)
    {
        upper = document.getElementById("qaCards");
    }

    else
    {
        upper = document.getElementById("cards");
    }

    while(upper.children.length > 0) //While cards are still present
    {
        upper.removeChild(upper.lastChild); //Removes the last card there
    }
}

/**
 * Show spells when a level is clicked
 */
function handleShowSpells()
{
    spellLevel = this.name;
    curClass = undefined;
    db = window.wholeSpells;
    if(favorite){db = window.wholeFavorite["spells"];} //If spell level from player's favorite was clicked change databases
    let spells = db[spellLevel];
    
    for(let spell of spellBtn) //For each spell button
    {
        if(spell.classList.contains("selected")) //If this button was selected last
        {
            spell.classList.remove("selected"); 
        }
    }

    this.classList.add("selected");

    emptyCards()

    if(searchBar[0].value != "") //If there is something in hte search bar
    {
        handleSearch();
    }

    else //If nothing is in the search bar
    {
        document.getElementById("searchDiv").style.display = "block"; //Makes search bar visible

        for(let spell of Object.keys(spells)) //For spells in the spell level
        {
            let location = "cards";
            if(quickAction){location = "qaCards"; setQuickAction(false); emptyCards(); setQuickAction(true);}

            createCard(spell, setUpText(spell, spells), location);
        }

        for(let key of document.getElementsByClassName("card-body")){key.onclick = handleCardClick;} //For each spell created change it's on click
    }
}

/**
 * Shows actions when a action tag is clicked
 */
function handleShowActions()
{
    spellLevel = undefined;
    curClass = this.name;
    db = window.wholeActions;
    if(favorite){db = window.wholeFavorite["actions"];} //If the favorite action tag was clicked change databases
    let actions = db[curClass];

    for(let action of actionBtn) //For each action buttons
    {
        if(action.classList.contains("selected")) //If the button was selected last
        {
            action.classList.remove("selected");
        }
    }

    this.classList.add("selected");

    emptyCards();

    if(searchBar[0].value != "") //If search bar has something in it
    {
        handleSearch();
    }

    else //If the user wants to see all actions
    {
        document.getElementById("searchDiv").style.display = "block"; //Makes search bar visible

        for(let action of Object.keys(actions)) //For each action in the tag
        {
            let location = "cards";
            if(quickAction){location = "qaCards"; setQuickAction(false); emptyCards(); setQuickAction(true);}

            createCard(action, setUpText(action, actions), location);
        }

        for(let key of document.getElementsByClassName("card-body")){key.onclick = handleCardClick;} //Changes onclick for the new cards created
    }
}

/**
 * Sets up text to show spells and actions info, from lst (spells or actions database) and current (level or tag)
 * @param {*} current 
 * @param {*} lst 
 * @returns 
 */
function setUpText(current, lst)
{
    let txt = [""];
    
    if(spellLevel) //If it is a spell create fields to show all of them
    {
        txt = [`Casting Time: ${toTitleCase(lst[current]["castTime"])}`, `Range: ${toTitleCase(lst[current]["range"])}`, `Components: ${lst[current]["components"]}`, `Duration: ${toTitleCase(lst[current]["duration"])}`];
        if(lst[current]["concentration"] == "true"){txt.push(`Concentration`);}
        txt.push(" ");
    }

    let lineNum = txt.length - 1; //Keep track of line number when list is involved.
    
    if(JSON.stringify(lst[current]["description"]))
    {
        let temp = JSON.stringify(lst[current]["description"]).replaceAll("\"", "").split("\\n"); //gets rid of \ and splits it by paragraphs

        for(let t in temp) //For each line in the description
        {
            if(temp[t].includes("{@Choice}")) //If its is a list
            {
                txt.push(temp[t].replace("{@Choice}", "<li>") + "</li>"); //Makes the choice into a list
                lineNum++;
            }

            else //If the line isn't apart of the list
            {
                if(lineNum > 0 && txt[`${lineNum}`].includes("<li>")) //If the last line was apart of the list
                {
                    lineNum++;
                    txt.push("");
                }

                txt[`${lineNum}`] = txt[`${lineNum}`] + ` ${temp[t]}`; //Adds the sentence to the text
            }
        }
        
        return txt;
    }
    
    else
    {
        return [""];
    }
}

/**
 * When the search bar text changes, it will show cards matching it
 */
function handleSearch()
{
    let search = searchBar[0].value; //Gets what is written
    let listOf;

    if(spellLevel) //If we are viewing spells
    {
        listOf = db[spellLevel];
    }

    else //If we are viewing actions
    {
        listOf = db[curClass];
    }

    emptyCards();
    
    for(let elm of Object.keys(listOf)) //For each spell/action in the db
    {
        if(elm.toLowerCase().includes(search.toLowerCase())) //If the spell has any of the search term in it
        {
            createCard(elm, setUpText(elm, listOf), "cards"); //Add it to the cards
        }
    }

    for(let key of document.getElementsByClassName("card-body")){key.onclick = handleCardClick;} //Changes onclick to what it needs to be
}

/**
 * When someone clicks the card, gives button options of Favorite button, Cast Button and upcast, or edit for favored cards
 */
function handleCardClick()
{
    let children = this.childNodes; 
    let currentTitle = children[0].innerHTML; //Get title from card
    
    if(currentTitle == undefined)
    {
        currentTitle = this.innerHTML;
    }

    for(let card of this.parentNode.children)
    {
        card.classList.remove("selected");
    }

    this.classList.add("selected");
    
    let temp = document.getElementById("optionDiv");
    if(temp){temp.remove();} //Removes other cards options that was visible

    let favBtn = document.getElementById("favBtn");
    if(favBtn){favBtn.remove();} //Removes other cards options that was visible

    let anchor = document.createElement("a");
    if(!quickAction)
    {
        anchor.href = "#searchDiv";
        anchor.click();
    }

    else
    {

    }

    if(lastAbility != currentTitle && lastSpell != currentTitle) //If they didn't click the same card twice
    {
        if(searchBar[0].value != "" || quickAction)
        {
            let optionDiv = document.createElement("div");
            optionDiv.classList.add("center");
            optionDiv.id = "optionDiv";

            let favoriteBtn = document.createElement("img");
            favoriteBtn.setAttribute("id", "favoriteBtn");
            favoriteBtn.classList.add(currentTitle.replaceAll(" ", "_"));
            favoriteBtn.style.height = "20px";
            favoriteBtn.style.width = "20px";
            favoriteBtn.setAttribute("src", "images/unFavorite.png");

            let wrapper = document.createElement("button");
            wrapper.classList.add("gridButton");
            wrapper.classList.add("center");
            wrapper.onclick = handleFavoriteBtn;
            wrapper.id = "favBtn";
            if(!quickAction){wrapper.appendChild(favoriteBtn);}

            let castBtn = document.createElement("button");
            castBtn.classList.add("gridButton");
            castBtn.onclick = displaySelect;
            if(quickAction){castBtn.onclick = useAbility;}
            castBtn.innerHTML = "Cast Spell";
            castBtn.name = currentTitle;
            castBtn.style.margin = "0px 5px";

            let individual = ["Advantage/Disadvantage", "Advantage", "Disadvantage"];
            let slotSelect = document.createElement("select");
            slotSelect.name = "advantage";
            slotSelect.id = "advantage";
            slotSelect.style.margin = "0px 5px";

            for(let i = 0; i < individual.length; i++)
            {
                let option = document.createElement("option");
                option.value = individual[i];
                option.text = individual[i];
                slotSelect.appendChild(option);
            }

            slotSelect.selectedIndex = "0";

            let sneak = ["Sneak-Attack?", "Sneak-Attack!"];
            let sneakSelect = document.createElement("select");
            sneakSelect.name = "sneak";
            sneakSelect.id = "sneak";
            sneakSelect.style.margin = "0px 5px";

            for(let i = 0; i < sneak.length; i++)
            {
                let option = document.createElement("option");
                option.value = sneak[i];
                option.text = sneak[i];
                sneakSelect.appendChild(option);
            }

            sneakSelect.selectedIndex = "0";

            if(spellLevel) //If it was a spell clicked
            {
                lastSpell = currentTitle;
                let spellDisc = db[spellLevel][currentTitle]["description"];
                if(favorite){spellDisc = window.wholeFavorite["spells"][spellLevel][currentTitle]["description"]}

                if(window.wholeChar[player]["favorites"]["spells"][spellLevel])
                {
                    if(window.wholeChar[player]["favorites"]["spells"][spellLevel][currentTitle])
                    {
                        favoriteBtn.setAttribute("src", "images/favorited.png");
                    }
                }

                if(spellDisc.includes("spell slot") && spellDisc.includes("scaledamage"))
                {
                    let scale = spellDisc.slice(spellDisc.indexOf("scaledamage"), spellDisc.indexOf("} for each slot"));
                    let individual = scale.split(" ");
                    individual = individual[1].split("|");
                    let slotSelect = document.createElement("select");
                    slotSelect.name = "upcast";
                    slotSelect.id = individual[0] + "|" + individual[2];
                    slotSelect.style.margin = "0px 5px";

                    for(let i = parseInt(spellLevel); i < 10; i++)
                    {
                        let option = document.createElement("option");
                        let suff = ["st", "nd", "rd", "th"];
                        if(i > 3){suff = suff[3];}
                        else{suff = suff[i - 1];}
                        option.value = individual[0];
                        if(i > parseInt(spellLevel))
                        {
                            let inisal = individual[0].split("d");
                            let multiplier = individual[2].split("d");
                            let total = parseInt(inisal[0]) + parseInt(multiplier[0]) * (i - parseInt(spellLevel));
                            option.value = `${total}d${inisal[1]}`;
                        }
                        option.text = `${i}${suff} Level Slot (${option.value})`;
                        slotSelect.appendChild(option);
                    }

                    optionDiv.appendChild(slotSelect);
                }
            }

            else
            {
                lastAbility = currentTitle;
                let abilityDisc = db[curClass][currentTitle]["description"];
                if(favorite){abilityDisc = window.wholeFavorite["actions"][curClass][currentTitle]["description"];}

                if(window.wholeChar[player]["favorites"]["actions"][curClass])
                {
                    if(window.wholeChar[player]["favorites"]["actions"][curClass][currentTitle])
                    {
                        favoriteBtn.setAttribute("src", "images/favorited.png");
                    }
                }

                if(abilityDisc.includes("{@absorb}"))
                {
                    let dice = 4;
                    let lvlSelect = document.createElement("select");
                    lvlSelect.name = "upcast";
                    lvlSelect.style.margin = "0px 5px";

                    for(let i = 1; i < 10; i++)
                    {
                        let option = document.createElement("option");
                        let suff = ["st", "nd", "rd", "th"];
                        if(i > 3){suff = suff[3];}
                        else{suff = suff[i - 1];}

                        option.value = `1d${dice}`;
                        dice = dice + 2;
                        option.text = `${i}${suff} Level Slot (1 on ${option.value})`;
                        lvlSelect.appendChild(option);
                    }

                    optionDiv.appendChild(lvlSelect);
                }

                castBtn.innerHTML = "Use Ability";
            }

            if(favorite) 
            {
                let edit = document.createElement("button");
                edit.classList.add("gridButton");
                edit.onclick = handleEditCard;
                edit.innerHTML = "Edit";
                edit.name = currentTitle;
                edit.style.margin = "0px 5px";
                if(!quickAction){optionDiv.appendChild(edit);}
            }

            optionDiv.appendChild(slotSelect);
            if(window.wholeChar[player]["stats"]["class"].includes("Rogue")){optionDiv.appendChild(sneakSelect);}
            optionDiv.appendChild(castBtn);
            
            if(!quickAction)
            {
                document.getElementById("cards").childNodes[0].appendChild(wrapper);
                if(this.parentNode.nextSibling != null){placeBefore(optionDiv, this.parentNode.nextSibling);}
                else{document.getElementById("cards").appendChild(optionDiv);}
            }

            else
            {
                document.getElementById("qaCards").appendChild(optionDiv);
            }
        }

        else
        {
            searchBar[0].value = currentTitle;
            handleSearch();
            this.click();
        }
        
    }

    else
    {
        searchBar[0].value = "";
        lastSpell = "";
        lastAbility = "";
        handleSearch();
    }
}

function handleUseAction(targets)
{
    let display;
    let useInfo;
    let damage;
    let upcast = document.getElementsByName("upcast");
    let listOf;
    let lastUse;

    if(spellLevel){listOf = db[spellLevel]; lastUse = lastSpell;}
    else{listOf = db[curClass]; lastUse = lastAbility;}

    let description = listOf[lastUse]["description"];
    discription = description;
    
    useInfo = setUpText(lastUse, listOf);
    useInfo = useInfo.join("\n");

    if(upcast[0])
    {
        if(description.includes("{@scaledamage")){if(!description.includes("{@save") && description.includes("{@damage")){description = `{@damage ${upcast[0].value}}`;} else if (!description.includes("{@save") && description.includes("{@sDice")){description = `{@sDice ${upcast[0].value}}`;}}
        else if(description.includes("{@absorb")){description = `{@sDice ${upcast[0].value}}`}
    }

    if(description.includes("Bardic Inspiration die"))
    {
        display += "Giving Bardic Die to: "

        for(key in Object.keys(targets))
        {
            let target = toTitleCase(targets[key].classList[1]);

            if(window.wholeChar[target])
            {
                setDoc(`playerChar/${target}/bardicInspo`, true);
            }

            else
            {
                setDoc(`playerChar/Vi/bardicInspo`, true);
            }

            display += target;
        }
    }

    if(description.includes("$"))
    {
        let stat;
        let isDollar = true;
        let mod;

        while(isDollar)
        {
            stat = description.slice(description.indexOf("$")+1);
            stat = stat.slice(0, stat.indexOf("$"));
            mod = parseInt(window.wholeChar[player]["stats"][stat]) + "";
            description = description.replaceAll(`$${stat}$`, mod);

            if(!description.includes("$")){isDollar = false;}
        }
    }

    if(description.includes("{@"))
    {
        if(description.includes("{@Choice"))
        {
            display = `${window.wholeChar[player]["charName"]} cast:\n${lastUse} on `;
            for(key in Object.keys(targets)){display += `${toTitleCase(targets[key].classList[1])}, `;}
            display = display.slice(0, display.length - 2);
            display += `\n${useInfo}`;
            if(curClass){display = display.replaceAll("cast", "use the ability");}
        }

        if(description.includes("{@save")) 
        {
            let skill = "unknown";
            let toBeat = parseInt(spellOrAttackBonus("@save"));
            let isSpell = true;
            let ind;
            let castUp = false;

            if(curClass){isSpell = false; ind = curClass;}
            else{ind = spellLevel;}
            if(upcast[0]){castUp = `{@save ${upcast[0].value}}`;}

            if(description.includes("{@skill")) //Get the skill check
            {
                skill = description.slice(description.indexOf("{@skill"));
                skill = skill.slice(7, skill.indexOf("}"));
            }

            else //search for what to check
            {
                let abilityNames = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];

                for(let save in abilityNames)
                {
                    if(description.includes(abilityNames[save]))
                    {
                        skill = abilityNames[save] + "Save";
                        break;
                    }
                }
            }

            setDoc(`playerChar/Vi/responses`, {"ability" : skill, "currentResponse" : lastUse, "toBeat" : toBeat, "castBy" : window.wholeChar[player]["charName"], "isSpell" : isSpell, "ind" : ind, "castUp" : castUp});

            display = `${toTitleCase(window.wholeChar[player]["currentToken"])} cast,\n${lastUse} on `;
            for(key in Object.keys(targets)){display += `${toTitleCase(targets[key].classList[1])}, `}
            display = display.slice(0, display.length - 2);
            display += `\n${useInfo}\nPlease roll ${skill}, DC: ${toBeat} or use the Response option under Misc...`;

            if(!spellLevel){display = display.replaceAll("cast", "used the ability");} //At the end
        }

        if(description.includes("{@respond}")) //Needs to check if half damage if sucess
        {
            let wholeRespone = window.wholeChar["Vi"]["responses"];
            let usersRoll;
            let userAddTo;
            if(window.wholeChar[player]["stats"][window.wholeRespone["ability"]]){userAddTo = window.wholeChar[player]["stats"][window.wholeRespone["ability"]];}
            else{userAddTo = prompt(`The Current Response is to ${window.wholeRespone["currentResponse"]}, cast by ${window.wholeRespone["castBy"]}. This check is checking for ${window.wholeRespone["ability"]} stat. What is your Modifier? (+/-)`, window.wholeChar[player]["stats"][window.wholeRespone["ability"]]);}
            userAddTo = userAddTo.replaceAll(" ", "");
            let abilityDisc;
            let abilityName;
            let ad_dis = "";
            if(window.wholeRespone["isSpell"]){abilityDisc = window.wholeSpells[window.wholeRespone["ind"]][window.wholeRespone["currentResponse"]]["description"];}
            else{abilityDisc = db[window.wholeRespone["ind"]][window.wholeRespone["currentResponse"]]["description"];}

            if(window.wholeRespone["currentResponse"] == "Toll the Dead")
            {
                if(parseInt(window.wholeDB[targets[0].classList[1]]["currentHp"]) < parseInt(window.wholeDB[targets[0].classList[1]]["maxHp"]))
                {
                    abilityDisc = abilityDisc.replaceAll("d8", "d12");
                }
            }
            
            setDoc(`playerChar/${player}/stats/${window.wholeRespone["ability"]}`, userAddTo);
            usersRoll = diceRoller("1", "20", userAddTo, "finalResult");
            ad_dis += " Rolling d12's instead, since they were hurt.";

            if(document.getElementById("advantage").value != "Advantage/Disadvantage")
            {
                let take = usersRoll;
                let take2 = diceRoller("1", "20", userAddTo, "finalResult");

                switch(document.getElementById("advantage").value)
                {
                    case "Advantage":
                        if(take > take2){usersRoll = take;} else {usersRoll = take2;}
                        break;

                    case "Disadvantage":
                        if(take < take2){usersRoll = take;} else {usersRoll = take2;}
                        break;
                }

                ad_dis += ` First Roll: ${take}, Second Roll: ${take2}.`;
            }

            if(abilityDisc.includes("{@save "))
            {
                let damage;
                let token = window.wholeDB[window.wholeChar[player]["currentToken"]];
                damage = splitRoll(abilityDisc, "@save");
                if(abilityDisc.includes("{@scaledamage")){damage = splitRoll(window.wholeRespone["castUp"], "@save")}
                else if(abilityDisc.includes(currentLv)){damage = splitRoll(abilityDisc.slice(`${abilityDisc.indexOf(currentLv)}`), "@save");}
                damage = diceRoller(damage[0], damage[1], damage[2], "finalResult");

                if(parseInt(usersRoll) >= parseInt(window.wholeRespone["toBeat"])) 
                {
                    if(abilityDisc.includes("half damage"))
                    {
                        display = `${window.wholeChar[player]["charName"]} has succeded the ${window.wholeRespone["ability"]} check/save for ${window.wholeRespone["currentResponse"]}, (${parseInt(usersRoll) + (-1 * parseInt(userAddTo))} + ${userAddTo} = **${usersRoll}** ) taking half of the damage. (${damage} / 2) = **${parseInt(damage) / 2}** .`;
                        if(parseInt(token.currentHp) - (parseInt(damage) / 2) > 0){token.currentHp = `${parseInt(token.currentHp) - (parseInt(damage) / 2)}`;}
                        else{token.currentHp = "0";}
                    }

                    else
                    {
                        display = `${window.wholeChar[player]["charName"]} has succeded the ${window.wholeRespone["ability"]} check/save for ${window.wholeRespone["currentResponse"]}. With the roll of ${parseInt(usersRoll) + (-1 * parseInt(userAddTo))} + ${userAddTo} = **${usersRoll}** .`
                    }
                }
                
                else
                {
                    display = `${window.wholeChar[player]["charName"]} has failed the ${window.wholeRespone["ability"]} check/save for ${window.wholeRespone["currentResponse"]}, (${parseInt(usersRoll) + (-1 * parseInt(userAddTo))} + ${userAddTo} = **${usersRoll}** ) taking the **${damage}** damage.`;
                    if(parseInt(token.currentHp) - parseInt(damage) > 0){token.currentHp = `${parseInt(token.currentHp) - parseInt(damage)}`;}
                    else{token.currentHp = "0";}
                }
            }

            else
            {
                display = `${window.wholeChar[player]["charName"]} has failed the ${window.wholeRespone["ability"]} check/save for ${window.wholeRespone["currentResponse"]}, ${parseInt(usersRoll) + (-1 * parseInt(userAddTo))} + ${userAddTo} = **${usersRoll}** .`;

                if(parseInt(usersRoll) >= parseInt(window.wholeRespone["toBeat"])) 
                {
                    display = display.replace("failed", "succeded");
                }
            } 

            display += ad_dis;
        }

        if(discription.includes("{@Summon"))
        {
            let token = {border : "blue", currentHp : `0`, maxHp : `0`, tempHp : "0", map : "", id : "", name : "", title : ` ${player}, `, xPos : "1", yPos : "A", isSummon : false, AC : "10"};
            let info = discription.slice(discription.indexOf("{@Summon"));
            info = info.slice(info.indexOf(" ") + 1, info.indexOf("}"));
            info = info.split(":"); 
            token.title += `${info[3]}, `;
            let currentToken = window.wholeDB[window.wholeChar[player]["currentToken"]];

            if(!currentToken["title"].includes(player))
            {
                let t = document.getElementById("title");
                currentToken.title = ` ${player}, ${currentToken["title"]}`; 
                t.innerHTML = "Status: " + currentToken.title; 

                setDoc(`currentMap/${player}/title`, currentToken.title);
                setDoc(`playerChar/${player}/token/title`, currentToken.title);
            }
            
            token.name = info[0] + "-";
            let id = info[0];

            if(Object.keys(window.wholeDB).includes(id))
            {
                id = id + "1";
        
                while(Object.keys(window.wholeDB).includes(id))
                {
                    id = id.slice(0, id.length - 1) + (parseInt(id.charAt(id.length - 1)) + 1);
                }
            }

            token.id = id;

            let fin;
            if(info[1].includes("currentLv"))
            {
                let operation = info[1].replace("currentLv", "");
                operation = operation.charAt(0);
                let cL = parseInt(currentLv.charAt(0));
                let num = parseFloat(info[1].slice(info[1].indexOf(operation) + 1));

                switch(operation)
                {
                    case "+":
                        fin = cL + num;
                        break;
                    
                    case "-":
                        fin = cL - num;
                        break;

                    case "*":
                        fin = cL * num;
                        break;

                    case "/":
                        fin = cL / num;
                        break;
                }
            }
            else{fin = parseFloat(info[1]);}
            token.maxHp = `${fin}`;
            token.currentHp = `${fin}`;
            token.border = info[2];

            setDoc(`currentMap/${token.id}`, token);
        }

        if(description.includes("{@Rage"))
        {
            setDoc(`playerChar/${player}/rage`, true);
        }
        
        if(description.includes("{@damage"))
        {
            let userAddTo = "";
            let fail = true;
            if(description.includes("toHit}"))
            {
                let toHit = description.slice(0, description.indexOf("toHit}"));
                toHit = toHit.slice(toHit.lastIndexOf("{") + 1);
                
                if(toHit.length > 2)
                {
                    toHit = toHit.replaceAll("+", "/");
                    toHit = toHit.replaceAll("-", "/-");
                    if(toHit[0]=="/"){toHit = toHit.slice(1);}
                    toHit = toHit.split("/");
                    let total = 0;

                    for(let hit in toHit)
                    {
                        total += parseInt(toHit[hit]);
                    }

                    if(total >= 0){toHit = `+${total}`;}
                }
                
                userAddTo = toHit;
            }
            else{userAddTo = spellOrAttackBonus("@damage")}
            let accurcy = diceRoller(1, 20, userAddTo, "false");
            let ending = "Damage";
            let ad_dis = "";

            if(document.getElementById("advantage").value != "Advantage/Disadvantage")
            {
                let rollOne = accurcy;
                let take = accurcy;
                take = take.slice(take.indexOf("**") + 2);
                take = parseInt(take.slice(0, take.indexOf("**")));
                let rollTwo = diceRoller(1, 20, userAddTo, "false");
                let take2 = rollTwo;
                take2 = take2.slice(take2.indexOf("**") + 2);
                take2 = parseInt(take2.slice(0, take2.indexOf("**")));

                switch(document.getElementById("advantage").value)
                {
                    case "Advantage":
                        if(take > take2){accurcy = rollOne;} else {accurcy = rollTwo;}
                        break;

                    case "Disadvantage":
                        if(take < take2){accurcy = rollOne;} else {accurcy = rollTwo;}
                        break;
                }

                ad_dis = ` <strong>First Roll: ${take}, Second Roll: ${take2}.</strong>`;
            }
            
            if(spellLevel == "0")
            {
                if(parseInt(window.wholeChar[player]["stats"]["lv"]) >= 17)
                {
                    description = description.slice(description.indexOf("17th level"));
                }

                else if(parseInt(window.wholeChar[player]["stats"]["lv"]) >= 11)
                {
                    description = description.slice(description.indexOf("11th level"));
                }

                else if(parseInt(window.wholeChar[player]["stats"]["lv"]) >= 5)
                {
                    description = description.slice(description.indexOf("5th level"));
                }
            }

            damage = splitRoll(description, "@damage");
            if(accurcy.includes("(20)")){damage[0] = `${parseInt(damage[0]) * 2}`}

            if(damage[2].length > 2)
                {
                    damage[2] = damage[2].replaceAll("+", "/");
                    damage[2] = damage[2].replaceAll("-", "/-");
                    if(damage[2][0]=="/"){damage[2] = damage[2].slice(1);}
                    damage[2] = damage[2].split("/");
                    let total = 0;

                    for(let hit in damage[2])
                    {
                        total += parseInt(damage[2][hit]);
                    }

                    if(total >= 0){damage[2] = `+${total}`;}
                }

            
            damage = diceRoller(damage[0], damage[1], damage[2], "false");

            if(window.wholeChar[player]["rage"] && !description.includes("{noRage"))
            {
                let dealt = damage.slice(damage.indexOf("**") + 2);
                dealt = dealt.slice(0, dealt.indexOf("**"));
                damage = damage.replace("=", "+2(Rage)="); 
                damage = damage.replace(dealt, `${parseInt(dealt) + 2}`);
            }

            if(display)
            {
                display += `\nAccurcy: ${accurcy} to Hit.\n`;
                let roll = accurcy.split("**")[1];

                for(let key in Object.keys(targets))
                {
                    let ac = window.wholeDB[targets[key].title.split(":")[0]].AC;

                    if(display.includes("regain"))
                    {
                        fail = false;
                        handleChangeHp(damage.split("**")[1], window.wholeDB[targets[key].title.split(":")[0]], "+");
                        display = display.split("Accurcy:")[0];
                        ending = "Healing";
                    }

                    else if(parseInt(roll) >= parseInt(ac))
                    {
                        display += `(Success Hit) ${targets[key].title.split(":")[0]} (${ac}), `;
                        fail = false; 
                        let hp = damage.split("**")[1];
                        if(window.wholeChar[targets[key].title.split(":")[0]]){let targe = targets[key].title.split(":")[0]; if(window.wholeChar[targe]["rage"] && !description.includes("{noRage") && !spellLevel){let past = damage.slice(damage.indexOf("**") + 2); past = past.slice(0, damage.indexOf("**")); let hp = parseInt(past)/2; damage = damage.replace(past, `${hp}** (1/2 Rage)`);}}
                        handleChangeHp(hp, window.wholeDB[targets[key].title.split(":")[0]], "-");
                        if(document.getElementById("sneak").value != "Sneak-Attack?"){description += `{@sDice ${Math.floor(parseInt(window.wholeChar[player]["stats"]["lv"])/2)}d6} Sneak Attack.`;}
                    }

                    else
                    {
                        display += `(Fail Hit) ${targets[key].title.split(":")[0]} (${ac}), `;
                    }

                }

                display = display.slice(0, display.length - 2);
                if(fail == false){display += `Dealing: ${damage} ${ending}.\n`;}
            }
            else
            {
                display = `${toTitleCase(window.wholeChar[player]["currentToken"])} cast, ${lastUse} on `;
                for(key in Object.keys(targets)){display += `${toTitleCase(targets[key].title.split(":")[0])}, `;}
                display = display.slice(0, display.length - 2);
                display += `\n${useInfo}\nAccurcy: ${accurcy} to Hit.\n`;
                let roll = accurcy.split("**")[1];

                for(let key in Object.keys(targets))
                {
                    let ac = window.wholeDB[targets[key].title.split(":")[0]].AC;
                    
                    if(display.includes("regains"))
                    {
                        fail = false;
                        handleChangeHp(damage.split("**")[1], window.wholeDB[targets[key].title.split(":")[0]], "+");
                        display = display.split("Accurcy:")[0];
                        ending = "Healing";
                    }

                    else if(parseInt(roll) >= parseInt(ac))
                    {
                        display += `(Success Hit) ${targets[key].title.split(":")[0]} (${ac}), `;
                        fail = false; 
                        if(window.wholeChar[targets[key].title.split(":")[0]]){let targe = targets[key].title.split(":")[0]; if(window.wholeChar[targe]["rage"] && !description.includes("{noRage") && !spellLevel){let past = damage.slice(damage.indexOf("**") + 2); past = past.slice(0, damage.indexOf("**")); let hp = parseInt(past)/2; damage = damage.replace(past, `${hp}** (1/2 Rage)`);}}
                        handleChangeHp(damage.split("**")[1], window.wholeDB[targets[key].title.split(":")[0]], "-");
                        if(document.getElementById("sneak")){if(document.getElementById("sneak").value != "Sneak-Attack?"){description += `{@sDice ${Math.floor(parseInt(window.wholeChar[player]["stats"]["lv"])/2)}d6} Sneak Attack.`;}}
                    }

                    else
                    {
                        display += `(Fail Hit) ${targets[key].title.split(":")[0]} (${ac}), `;
                    }
                }

                display = display.slice(0, display.length - 2);
                if(fail == false){display += `\nDealing: ${damage} ${ending}.\n`;}
            }
            if(!spellLevel){display = display.replaceAll("cast", "used the ability");}

            display += ad_dis;
        }
        
        if(description.includes("{@sDice"))
        {
            let sDices = description.split("{@sDice");

            if(description.includes("Sneak Attack"))
            {
                display += "\nRolling Sneak Attack at end!";
            }

            for(let i = 0; i < sDices.length; i++)
            {
                if(i == 0){continue;}
                let sDice = "{@sDice" + sDices[i];

                damage = splitRoll(sDice, "@sDice");
                damage = diceRoller(damage[0], damage[1], damage[2], "false");
                for(let key in Object.keys(targets)){handleChangeHp(damage.split("**")[1], window.wholeDB[targets[key].title.split(":")[0]], "-");}
            
                if(display){display += `\nResult: ${damage}. \n`;}
                else{display = `${window.wholeChar[player]["charName"]} used the ability, ${lastUse}:\n${useInfo}\n\nResult: ${damage}. \n`;}
            }
        }

        if(description.includes("{@infuseRate"))
        {
            let rate = parseInt(window.wholeChar[player]["infusedRate"]);
            let roll = diceRoller("1", "100", "0");
            let result;

            roll = roll.slice(roll.indexOf("**") + 2);
            roll = parseInt(roll.slice(0, roll.indexOf("**")));

            if(rate <= roll)//Succeded
            {
                result = "Succeded";
            }

            else //Failure
            {
                result = "Failed";
            }

            if(display){display += `\nInfusion Check: ${result}, rolled ${roll}, needs to be above ${rate}. \n`;}
            else{display = `${window.wholeChar[player]["charName"]} used the ability, ${lastUse}:\n${useInfo}\n\nInfusion Check: ${result}, rolled ${roll}, needs to be above ${rate}.\n`;}
        }

        if(description.includes("{@sneak"))
        {
            let lvl = currentLv.charAt(0);
            damage = [`${Math.ceil(parseInt(lvl) / 2)}`, "6", "0"];
            damage = diceRoller(damage[0], damage[1], damage[2], "false");
    
            if(display){display += `nResult: ${damage}. \n`;}
            else{display = `${window.wholeChar[player]["charName"]} used the ability, ${lastUse}:\n${useInfo}\n\nResult: ${damage}. \n`;}
        }

        setDoc("currentMap/", window.wholeDB);
    }

    else
    {
        display = `${toTitleCase(window.wholeChar[player]["currentToken"])} cast: ${lastUse}\n${useInfo}`;
        if(curClass){display = display.replaceAll("cast", "use the ability");}
    }

    let timeActive = "0";

    if(listOf[lastUse]["duration"]) //spell set turn count down
    {
        let time = listOf[lastUse]["duration"].split(" ");
        
        switch(time[1])
        {
            case "hour":
                timeActive = parseInt(time[0]) * 514;
                break;

            case "minute":
                timeActive = parseInt(time[0]) * 9;
                break;

            case "round":
                timeActive = parseInt(time[0]);
                break;
        }
    }

    else if(useInfo.toLowerCase().includes("hour") || useInfo.toLowerCase().includes("minute") || useInfo.toLowerCase().includes("turns") || useInfo.toLowerCase().includes("round"))
    {
        let usedInfo = useInfo.toLowerCase();
        let cut;

        if(usedInfo.includes("hour")){cut = "hour";}
        else if(usedInfo.includes("minute")){cut = "minute";}
        else if(usedInfo.includes("turns")){cut = "turns";}
        else if(usedInfo.includes("round")){cut = "round";}

        usedInfo = usedInfo.slice(0, usedInfo.indexOf(cut) - 1);
        usedInfo = usedInfo.slice(usedInfo.lastIndexOf(" ") + 1);
        let remove = 0;

        for(let char of usedInfo)
        {
            if(!isNaN(Number(char)))
            {
                break;
            }

            else
            {
                remove++;
            }
        }

        usedInfo = usedInfo.slice(remove)

        switch(cut)
        {
            case "hour":
                timeActive = parseInt(usedInfo) * 514;
                break;

            case "minute":
                timeActive = parseInt(usedInfo) * 9;
                break;

            case "turns":
            case "round":
                timeActive = parseInt(usedInfo);
                break;
        }
    }

    if(timeActive != "0")
    {
        if(player != "Vi"){setDoc(`currentTO/Var/${window.wholeChar[player]["charName"]}/${lastUse}`, {"expires" : window.wholeTO["Var"]["currentTurn"] + timeActive, "castOn": window.wholeTO["Var"]["currentTurn"], "id" : lastUse});}
        else{setDoc(`currentTO/Var/Enemy/${lastUse}`, {"expires" : window.wholeTO["Var"]["currentTurn"] + timeActive, "castOn": window.wholeTO["Var"]["currentTurn"], "id" : lastUse});}
    }

    display = display.replaceAll("<li>", "\n- ");
    display = display.replaceAll("</li>", "");
    sendDiscordMessage(display);
}

function spellOrAttackBonus(usage)
{
    let userAddTo;

    if(player == "Vi")
    {
        if(usage == "@damage")
        {
            if(spellLevel){userAddTo = prompt("What is your Spell Attack Bonus?", window.wholeChar[player]["stats"]["addToSpell"]);}
            else{userAddTo = prompt("What is your Attack Bonus?", window.wholeChar[player]["stats"]["attackBonus"]);}
            userAddTo = userAddTo.replaceAll(" ", "");
    
            if(spellLevel){setDoc(`playerChar/${player}/stats/addToSpell`, userAddTo);}
            else{setDoc(`playerChar/${player}/stats/attackBonus`, userAddTo);}
        }
        
        else if(usage == "@save")
        {
            userAddTo = prompt("What is the DC to beat (Spell DC)?", window.wholeChar[player]["stats"]["spellDC"]);
            setDoc(`playerChar/${player}/stats/spellDC`, userAddTo);
        }
    }

    else
    {
        if(usage == "@damage")
        {
            if(spellLevel){if(!window.wholeChar[player]["stats"]["spellBonus"]){userAddTo = prompt("What is your Spell Attack Bonus?", window.wholeChar[player]["stats"]["spellBonus"]);} else{userAddTo = window.wholeChar[player]["stats"]["spellBonus"];}}
            else{userAddTo = `${parseInt(window.wholeChar[player]["stats"]["proficiency"]) + parseInt(window.wholeChar[player]["stats"]["Strength"])}`;}
            userAddTo = userAddTo.replaceAll(" ", "");
        }
        
        else if(usage == "@save")
        {
            if(!window.wholeChar[player]["stats"]["spellDC"]){userAddTo = prompt("What is the DC to beat (Spell DC)?", window.wholeChar[player]["stats"]["spellDC"]);}
            else{userAddTo = window.wholeChar[player]["stats"]["spellDC"];}
            setDoc(`playerChar/${player}/stats/spellDC`, userAddTo);
        }
    }

    return userAddTo;
}

function splitRoll(discription, splitValue)
{[].join()
    let damage;
    damage = discription.slice(discription.indexOf(splitValue));
    damage = damage.slice(splitValue.length + 1, damage.indexOf("}"));
    damage = damage.split("d");
    if(damage[1].includes("+")){let temp = damage[1].split("+"); damage[1] = temp[0]; temp[0] = ""; temp = temp.join("+"); damage.push(temp);}
    else if(damage[1].includes("-")){let temp = damage[1].split("-"); damage[1] = temp[0]; temp[0] = ""; temp = temp.join("-"); damage.push(temp);}
    else{damage.push("0");}
    return damage;
}

function handleCreateNew()
{
    if(this.innerHTML == "Create New Spell")
    {
        spellLevel = "0";
        lastSpell = "Sacred Flame";
        setDoc(`playerChar/${player}/favorites/spells/${spellLevel}/${lastSpell}`, window.wholeSpells[spellLevel][lastSpell]);
    }

    else if(this.innerHTML == "Create New Ability")
    {
        curClass = "Artificer";
        lastAbility = "Magical Tinkering";
        setDoc(`playerChar/${player}/favorites/actions/${curClass}/${lastAbility}`, window.wholeActions[curClass][lastAbility]);
    }

    handleEditCard();
}

function handleEditCard()
{
    emptyCards();

    let cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "card .bg-UP-blue notes");
    let cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body notes");
    let cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title");
    cardBody.appendChild(cardTitle);
    let text;
    let temp;

    if(spellLevel)
    {
        let spell = lastSpell;
        text = ["Name:", "Level:", "Casting Time:", "Range:", "Components:", "Duration:", "Concentration:", "Description:"];
        temp = [`${toTitleCase(window.wholeFavorite["spells"][spellLevel][spell]["name"])}`, `${spellLevel}`, `${toTitleCase(window.wholeFavorite["spells"][spellLevel][spell]["castTime"])}`, `${toTitleCase(window.wholeFavorite["spells"][spellLevel][spell]["range"])}`, `${window.wholeFavorite["spells"][spellLevel][spell]["components"]}`, `${toTitleCase(window.wholeFavorite["spells"][spellLevel][spell]["duration"])}`, `${window.wholeFavorite["spells"][spellLevel][spell]["concentration"]}`, `${window.wholeFavorite["spells"][spellLevel][spell]["description"]}`];
    }

    else
    {
        let action = lastAbility;
        text = ["Name:", "Tag:", "Description:"];
        temp = [`${toTitleCase(window.wholeFavorite["actions"][curClass][action]["name"])}`, `${curClass}`, `${window.wholeFavorite["actions"][curClass][action]["description"]}`];
    }

    for(let i = 0; i < text.length; i++)
    {
        editCardSetup(text, temp, cardBody, i);
    }

    cardTitle.innerHTML = temp[0];
    let cardText = document.createElement("p");
    cardText.setAttribute("class", "card-text");
    cardText.style.margin = "3px";
    cardText.style.display = "inline";
    cardText.innerHTML = "<li>{@save} : makes it able to use the save/check rolls. Can use {@save 2d6} to have it roll damage as well, for the skill you need to write strength (etc.) or use {@skill Perception} to show.</li> <li>{@damage 3d4} will roll accuracy then damage of 3d4. Or if it has the word regains in the description, then it will heal instead.</li><li>{@scaledamage 1d8+4|1-9|1d8} will allow you to cast spells at higher levels. The base level is the first one at first level it does 1d8 + 4, the second column says it can be cast as a lvl 1 spell all the way up to 9th level. The third one give how much it goes up by each level.</li><li>{+3toHit} will add 3 to the accuracy roll.</li><li>{@Choice} will make a bullet point.</li><li>{@sDice 2d4} Will just roll 2d4 not accuracy</li><li>{@Summon pictureName:Hp:border:modifiers} Picture name decides which picture and id it will have, ask me for an exact one a universal one is 'genericA-'. Hp is the max and current hp the token will have. Border is the color border it will have.</li><li>$Strength$ will use your strength stat. Use surround the stat name with $ to use it from your character sheet.</li>";
    cardBody.appendChild(cardText);
    cardBody.appendChild(document.createElement("br"));

    let btnDiv = document.createElement("div");
    btnDiv.style.textAlign = "center";

    let uploadBtn = document.createElement("button");
    uploadBtn.classList.add("gridButton");
    uploadBtn.classList.add("center");
    uploadBtn.onclick = uploadEdit;
    uploadBtn.innerHTML = "Upload";

    let cancelBtn = document.createElement("button");
    cancelBtn.classList.add("gridButton");
    cancelBtn.classList.add("center");
    cancelBtn.onclick = cancelEdit;
    cancelBtn.innerHTML = "Cancel";
    cancelBtn.style.marginLeft = "5px";
    
    let noteDisplay = document.getElementById("cards");
    noteDisplay.appendChild(cardDiv);
    cardDiv.appendChild(cardBody);
    btnDiv.appendChild(uploadBtn);
    btnDiv.appendChild(cancelBtn);
    cardDiv.appendChild(btnDiv);
}

function editCardSetup(text, temp, cardBody, i)
{
    let cardText = document.createElement("p");
    cardText.setAttribute("class", "card-text");
    cardText.style.margin = "3px";
    cardText.style.display = "inline";
    cardText.innerHTML = text[i];
    let cardInput = document.createElement("input");
    if(text[i] == "Description:"){cardInput = document.createElement("textarea"); cardInput.rows = "8"; cardInput.style.width = "80%";}
    cardInput.setAttribute("class", "card-text");
    cardInput.classList.add("spellDisc");
    cardInput.style.margin = "3px";
    cardInput.style.display = "inline";
    cardInput.value = temp[i];
    cardInput.id = text[i].replace(" ", "");
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardInput);
    cardBody.appendChild(document.createElement("br"));
}

function cancelEdit()
{
    if(spellLevel)
    {
        if(lastSpell == "Sacred Flame")
        {
            deleteDoc(`playerChar/${player}/favorites/spells/${spellLevel}/${lastSpell}`);
        }
    }

    else
    {
        if(lastAbility == "Magical Tinkering")
        {
            deleteDoc(`playerChar/${player}/favorites/actions/${curClass}/${lastAbility}`);
        }   
    }

    emptyCards();
    firstMenu[2].click();
}

function uploadEdit()
{
    let spellDisc = document.getElementsByClassName("spellDisc");

    if(spellLevel)
    {
        deleteDoc(`playerChar/${player}/favorites/spells/${spellLevel}/${lastSpell}`);

        setDoc(`playerChar/${player}/favorites/spells/${spellDisc[1].value.trim()}/${spellDisc[0].value.trim()}`,
        {
            castTime : spellDisc[2].value.trim(),
            components : spellDisc[4].value.trim(),
            concentration : spellDisc[6].value.trim(),
            description : spellDisc[7].value.trim(),
            duration : spellDisc[5].value.trim(),
            level : spellDisc[1].value.trim(),
            name : spellDisc[0].value.trim(),
            range : spellDisc[3].value.trim()
        });
    }

    else
    {
        deleteDoc(`playerChar/${player}/favorites/actions/${curClass}/${lastAbility}`);

        setDoc(`playerChar/${player}/favorites/actions/${spellDisc[1].value.trim()}/${spellDisc[0].value.trim()}`,
        {
            description : spellDisc[2].value.trim(),
            level : spellDisc[1].value.trim(),
            name : spellDisc[0].value.trim(),
        });
    }

    emptyCards();
}

function handleFavoriteBtn()
{
    let cardName = this.lastChild.classList[0].replaceAll("_", " ");
    let titleName = cardName.replaceAll("/", " or ");

    if(this.lastChild.src.includes("images/unFavorite.png")) //Add to favrites
    {
        this.lastChild.src = "images/favorited.png";
        
        if(spellLevel)
        {
            setDoc(`playerChar/${player}/favorites/spells/${spellLevel}/${titleName}`, window.wholeSpells[spellLevel][cardName]);
        }

        else
        {
            setDoc(`playerChar/${player}/favorites/actions/${curClass}/${titleName}`, window.wholeActions[curClass][cardName]);
        }
    }

    else //Remove from favorites
    {
        this.lastChild.src = "images/unFavorite.png";
        
        if(spellLevel)
        {
            deleteDoc(`playerChar/${player}/favorites/spells/${spellLevel}/${titleName}`);
        }

        else
        {
            deleteDoc(`playerChar/${player}/favorites/actions/${curClass}/${titleName}`);
        }
        
        emptyCards();
    }
}

function handleChangeToken()
{
    changeTokenBtn.innerHTML = "Submit";
    changeTokenBtn.onclick = handleUpdateToken;

    let labels = ["Character", "Border"];
    let selects = [document.createElement("div"), document.createElement("div")];

    let cancelBtn = document.createElement("button");
    cancelBtn.innerHTML = "Cancel";
    cancelBtn.onclick = handleCancelTokenChange;

    let customsBtn = document.createElement("button");
    customsBtn.innerHTML = "Manage Custom Images";
    customsBtn.onclick = handleCustomsButton;
    
    for(let i = 0; i < labels.length; i++)
    {
        let label = createLabel(labels[i]);

        label.style.padding = "5%";
        placeBefore(selects[i], changeTokenBtn);
        placeBefore(label, selects[i]);
        selects[i].classList = "ddown ddownHide sDropdown";
        selects[i].id = labels[i];
        selects[i].style.width = "100%";

        let dropBtn = document.createElement("button");
        dropBtn.classList = `color-I-button dropbtn ${labels[i]}`;
        dropBtn.id = `${labels[i]}Button`;
        dropBtn.onclick = handleShowSelect;
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
                temp = window.wholeCustom;
                for(let token of Object.keys(temp)){if(token != "hold"){sources.push(temp[token]["src"]);}} //Populates Sources with all the selectable token images
                temp = imgs["tokens"];
                for(let token of Object.keys(temp)){if(token != "invisible-"){sources.push(temp[token]);}} //Populates Sources with all the selectable token images
                dropBtn.innerHTML = window.wholeDB[currentCharacter[0].id]["name"];
                break;
            
            case 1:
                temp = imgs["borders"];
                for(let border of Object.keys(temp)){if(border != "invisible"){sources.push(temp[border]);}} //Populates Sources with all the selectable border images
                dropBtn.innerHTML = window.wholeDB[currentCharacter[0].id]["border"];
                break;
        }

        for(let x = 0; x < sources.length; x++)
        {
            let img = document.createElement("img");
            img.src = sources[x];
            img.onclick = changeSourceSelect;
            img.classList.add(dropBtn.id);
            
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
                for(let token of Object.keys(window.wholeCustom))
                {
                    if(window.wholeCustom[token]["src"] == img.src){temp = window.wholeCustom[token]["name"];}
                }
            }

            img.classList.add(temp);
            img.classList.add("char");
            selectDiv.appendChild(img); 
        }
    }

    document.getElementById("changeToken").appendChild(cancelBtn);
    placeBefore(customsBtn, changeTokenBtn);
}

function changeSourceSelect()
{
    let select = document.getElementById(this.classList[0]);
    select.innerHTML = this.classList[1];
    select.click();
}

function handleUpdateToken()
{
    let name = document.getElementById("name").innerHTML;
    let toUpdate = name[0].toLowerCase() + name.slice(1);
    let fields = window.wholeDB[toUpdate];

    fields.border = `${document.getElementById("BorderButton").innerHTML}`;
    fields.name = `${document.getElementById("CharacterButton").innerHTML}`;

    setDoc(`currentMap/${toUpdate}/`, fields);
    handleCancelTokenChange();
}

function handleCancelTokenChange()
{
    let elements = changeTokenBtn.parentNode;
    let delPoint = "first";

    while(elements.childNodes.length > 1)
    {   
        switch(delPoint)
        {
            case "first":
                if(elements.firstChild.id == changeTokenBtn.id)
                {
                    delPoint = "last";
                }

                else{elements.removeChild(elements.firstChild)}
                break;
            
            case "last":
                if(elements.lastChild.id == changeTokenBtn.id)
                {
                    delPoint = "first";
                }

                else{elements.removeChild(elements.lastChild)}
                break;
        }
    }

    changeTokenBtn.innerHTML = "Change Token";
    changeTokenBtn.onclick = handleChangeToken;
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

function handleCustomsButton()
{
    handleCancelTokenChange();

    for(let custom of Object.keys(window.wholeCustom))
    {
        if(window.wholeCustom[custom]["player"] == player)
        {
            let personDiv = document.createElement("div");
            personDiv.classList.add("center");
            
            let person = document.createElement("img");
            person.id = window.wholeCustom[custom]["name"];
            person.src = window.wholeCustom[custom]["src"];
            person.classList = "char customImg";
            person.style.width = "73px";
            person.style.height = "73px";
            personDiv.appendChild(person);
            person.style.margin = "10px";

            let deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = "Delete Custom Img";
            deleteBtn.onclick = handleDeleteCustom;
            deleteBtn.id = window.wholeCustom[custom]["name"];
            personDiv.appendChild(deleteBtn);
            placeBefore(personDiv, changeTokenBtn);
            deleteBtn.style.margin = "10px";
            deleteBtn.style.display = "inline";
            deleteBtn.style.width = "auto";
        }
    }

    let names = ["Url", "Nickname"];
    let objects = [document.createElement("input"), document.createElement("input")];
    let newDiv = document.createElement("div");
    newDiv.classList.add("center");

    for(let i = 0; i < names.length; i++)
    {
        let span = document.createElement("span");
        span.style.display = "block";

        let label = document.createElement("h6");
        label.innerHTML = `${names[i]}:`;
        label.style.display = "inline";
        label.classList = "color-UP-yellow";
        label.style.margin = "5px";

        objects[i].id = names[i];
        objects[i].style.margin = "5px";
        objects[i].style.width = "40%";
        newDiv.appendChild(label);
        newDiv.appendChild(objects[i]);
        newDiv.appendChild(span);
    }

    changeTokenBtn.onclick = handleCreateCustom;
    let cancelBtn = document.createElement("button");
    cancelBtn.innerHTML = "Cancel";
    cancelBtn.onclick = handleCancelTokenChange;
    placeBefore(newDiv, changeTokenBtn);
    placeBefore(cancelBtn, changeTokenBtn);
}

function handleDeleteCustom()
{
    deleteDoc(`customImages/${this.id}`);
    
    for(let tokens of Object.keys(window.wholeDB))
    {
        if(window.wholeDB[tokens]["name"] == this.id)
        {
            let access = document.getElementById("name").innerHTML.toLowerCase();
            let newToken = window.wholeDB[access];

            newToken.name = `${newToken.id}-`;
            setDoc(`currentMap/${access}`, newToken);
        }
    }   

    reload(.5);
}

function handleCreateCustom()
{
    let url = document.getElementById("Url").value;
    let nickname = document.getElementById("Nickname").value;
    
    url = clenseInput(url);
    nickname = clenseInput(nickname);
    nickname = "custom-" + nickname;

    setDoc(`customImages/${nickname}`, {"name" : nickname, "player" : player, "src" : url});
    reload(.5);
}

function displayInteractive()
{
    let image = document.getElementById("viewToken");
    let text = document.getElementById("viewTitle");
    let viewDiv = document.getElementById("cover");
    document.getElementById("hideCover").classList.remove("invisible");
    viewDiv.classList = "";
    viewDiv.style.zIndex = "1011";
    viewDiv.style.opacity = .95;
    text.classList.remove("invisible");

    if(window.wholeInteractive["image"] != "")
    {
        image.classList.remove("invisible");
        image.src = window.wholeInteractive["image"];
    }
    
    text.innerHTML = window.wholeInteractive["text"];
}

function displaySelect()
{
    alert("Tap on the targets for this action/spell. Then when finished click 'Cast Spell' or 'Use Ability' again.");
    this.onclick = useAbility;
    setDoc(`playerChar/${player}/mode`, "using");
    let otherCast = document.createElement("button");
    otherCast.classList = this.classList;
    otherCast.innerHTML = this.innerHTML;
    otherCast.onclick = useAbility;
    otherCast.id = "otherCast";
    placeBefore(otherCast, document.getElementById("grid"));
}

function useAbility()
{
    let targets = document.getElementsByClassName("selected-temp");
    
    if(targets.length < 1)
    {
        let awnser = confirm("You need to select your targets before using this. If the target is yourself, tap 'OK'.");

        if(awnser)
        {
            let tokens = document.getElementsByClassName(window.wholeChar[player]["currentToken"]);

            for(let token of tokens)
            {
                if(token.id == window.wholeDB[window.wholeChar[player]["currentToken"]].border)
                {
                    token.classList.add("selected-temp");
                    this.click();
                }
            }
        }
    }

    else
    {
        this.onclick = displaySelect;
        setDoc(`playerChar/${player}/mode`, "waiting");
        handleUseAction(targets);
        emptyCards();
        document.getElementById("hideCover").click();
        emptyCards();
        for(let key = 0; key < targets.length; key++){targets[key].classList.remove("selected-temp");}
        if(targets[0]){targets[0].classList.remove("selected-temp");}
        searchBar[0].value = "";
        searchBar[0].innerHTML = "";
        for(let btn of document.getElementsByClassName("spell")){btn.classList.remove("selected");}
        for(let btn of document.getElementsByClassName("action")){btn.classList.remove("selected");}
        document.getElementById("otherCast").remove();
    }
}

function handleDiceSelect()
{
    let selects = document.getElementsByClassName("diceSelect");
    let display = document.getElementById("diceRoller");

    for(let select of selects){select.classList = "gridButton diceSelect";}
    this.classList = "gridButton diceSelect selected-dice";

    display.innerHTML = "";

    switch(this.innerHTML)
    {
        case "Basic":
            let numOfDice = document.createElement("input");
            numOfDice.id = "diceToRoll"; numOfDice.placeholder = "1"; display.appendChild(numOfDice);
            display.innerHTML += '<p>d</p>';
            
            let sides = document.createElement("input");
            sides.id = "sides"; sides.placeholder = "20"; display.appendChild(sides);
            display.innerHTML += '<p>+/-</p>';
            
            let modifier = document.createElement("input");
            modifier.id = "modifier"; modifier.placeholder = "0"; display.appendChild(modifier);
            
            for(let elm of display.childNodes){elm.style.display = "inline"; elm.style.margin = "5px"; if(elm.placeholder != ""){elm.value = elm.placeholder;}}
            break;
        
        case "Checks":
        case "Saves":
        case "Misc":
            let select = document.createElement("select");
            select.id = "statChoice";
            select.innerHTML = `<option value="none">${this.innerHTML}</option>`;
            select.onchange = updateStat;
            select.style.margin = "10px";
            select.style.display = "inline";

            for(let roll of window.wholeRoles["rolls"][this.innerHTML])
            {
                select.innerHTML += `<option value="${roll}">${toTitleCase(roll)}</option>`;
            }

            let mod = document.createElement("h6");
            mod.id = "diceMod";
            mod.style.display = "inline";
            mod.innerHTML = "+0";
            mod.style.margin = "10px";

            display.appendChild(select);
            display.appendChild(mod);
            break;
    }
}

function handleLoadQuests()
{
    let questDiv = document.getElementById("quest");
    
    document.getElementById("questInstructions").innerHTML="<em><b>Click To Hide Other Quests...</b></em>";
    this.onclick = handleDeleteQuests;

    for(let quest of Object.keys(window.wholeQuests))
    {
        let questTitle, questText;

        if(!window.wholeQuests[quest]["activeQuest"]){ questTitle = window.wholeQuests[quest]["name"]; questText = window.wholeQuests[quest]["Desc"]; }
        else { continue; }

        let card = document.createElement("div");
        let cardBody = document.createElement("div");
        let title = document.createElement("h5");
        let text = document.createElement("p");
        
        card.classList = "card temp-Card";
        cardBody.classList = "card-body";
        title.classList = "card-title color-UP-black";
        title.innerHTML = questTitle;
        text.innerHTML = questText;
        text.classList = "card-text";
        card.appendChild(cardBody);
        cardBody.appendChild(title);
        cardBody.appendChild(text);

        if(window.wholeQuests[quest]["status"] == "incomplete")
        {
            card.classList.add("incomplete");
            cardBody.classList.add("incomplete");
            text.classList.add("incomplete");
            questDiv.appendChild(card);
        }

        else if (window.wholeQuests[quest]["status"] == "complete")
        {
            card.classList.add("complete");
            cardBody.classList.add("complete");
            text.classList.add("complete");
            placeBefore(card, this);
        }
    }
}

function handleDeleteQuests()
{
    document.getElementById("questInstructions").innerHTML="<em><b>Click To See All Quest...</b></em>";
    this.onclick = handleLoadQuests;
    let temp = document.getElementsByClassName("temp-Card");

    while(true)
    {
        if(temp.length > 0)
        {
            temp[0].remove();
        }

        else
        {
            break;
        }
    }

}

function updateStat()
{
    let diceMod = document.getElementById("diceMod");
    let stat = document.getElementById("statChoice").value;
    
    if(!["deathSave", "Misc", "Saves", "Checks", "Basic"].includes(stat)){diceMod.innerHTML = `${toTitleCase(stat)}: ${window.wholeChar[player]["stats"][stat]}`;}
    else{diceMod.innerHTML = `${toTitleCase(stat)}: +0`;}
}

function handleChangeHp(damage, token, modifier)
{
    if(discription.includes("temporary hit point"))
    {
        let total = parseInt(token.tempHp);
        total += parseInt(damage);
        token.tempHp = `${total}`;
    }

    else
    {
        switch(modifier)
        {
            case "+":
                if(parseInt(token.currentHp) + parseInt(damage) <= token.maxHp)
                {
                    token.currentHp = `${parseInt(token.currentHp) + parseInt(damage)}`;
                }
                
                else
                {
                    token.currentHp = token.maxHp;
                }
                break;

            case "-":
                if(parseInt(token.tempHp) > 0)
                {
                    let full = parseInt(token.tempHp) + parseInt(token.currentHp);
                    full -= parseInt(damage);

                    if(full-parseInt(token.currentHp) < 0) 
                    {
                        token.tempHp = "0";
                        token.currentHp = `${full-parseInt(token.tempHp)}`;
                        break;
                    }

                    else
                    {
                        token.tempHp = `${full-parseInt(token.currentHp)}`;
                        break;
                    }
                }

                if(parseInt(token.currentHp) - parseInt(damage) >= 0)
                {
                    token.currentHp = `${parseInt(token.currentHp) - parseInt(damage)}`;
                }
                
                else
                {
                    token.currentHp = "0";
                }
                break;
        }
    }
}
