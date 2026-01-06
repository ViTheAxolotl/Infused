"use strict";
import { toTitleCase, setDoc, statFormat, skillDecrypt, reload, deleteDoc, sendDiscordMessage } from './viMethods.js';

let stats;
let firstRun = true;

init();

function init()
{
    let display = document.getElementById("story");
    let stats = document.getElementsByClassName("stat");
    let viewButtons = document.getElementsByClassName("viewSpell");
    let exitBtn = document.getElementById("exitIframe");
    exitBtn.onclick = handleExit;

    for(let stat of stats)
    {
        if(window.top.parent.wholeChar[window.top.parent.player] == undefined)
        {
            location.reload();
        }

        else if(window.top.parent.wholeChar[window.top.parent.player]["stats"][stat.id] || window.top.parent.wholeChar[window.top.parent.player]["stats"][stat.id] == "")
        {
            if(!window.top.parent.wholeChar[window.top.parent.player]["stats"][stat.id]){setDoc(`playerChar/${window.top.parent.player}/stats/${stat.id}`, "");}
            if(typeof window.top.parent.wholeChar[window.top.parent.player]["stats"][stat.id] == "string")
            {
                if(stat.id == "spellBonus"){let bonus = statFormat(parseInt(window.top.parent.wholeChar[window.top.parent.player]["stats"][window.top.parent.wholeChar[window.top.parent.player]["stats"]["spellAbility"]]) + parseInt(window.top.parent.wholeChar[window.top.parent.player]["stats"]["proficiency"])); stat.innerHTML = bonus; setDoc(`playerChar/${window.top.parent.player}/stats/spellBonus`, bonus);}
                else if(stat.id == "spellDC"){let dc = statFormat(parseInt(window.top.parent.wholeChar[window.top.parent.player]["stats"][window.top.parent.wholeChar[window.top.parent.player]["stats"]["spellAbility"]]) + parseInt(window.top.parent.wholeChar[window.top.parent.player]["stats"]["proficiency"]) + 8); stat.innerHTML = dc; setDoc(`playerChar/${window.top.parent.player}/stats/spellDC`, dc);}
                else if(stat.id == "proficiency"){let prof = statFormat(Math.ceil(parseInt(window.top.parent.wholeChar[window.top.parent.player]["stats"]["lv"])/4)+1); setDoc(`playerChar/${window.top.parent.player}/stats/proficiency`, prof); stat.innerHTML = prof;}
                else if(stat.id == "name"){stat.innerHTML = window.top.parent.player;}
                else if(stat.id == "totalHitDice"){for(let i = 0; i < stat.length; i++){stat[i].innerHTML = `${window.top.parent.wholeChar[window.top.parent.player]["stats"]["lv"]}${stat[i].value}`; stat.value = window.top.parent.wholeChar[window.top.parent.player]["stats"][stat.id];}}
                else if(stat.id == "currentHitDice"){let max = window.top.parent.wholeChar[window.top.parent.player]["stats"]["totalHitDice"]; stat.innerHTML = ""; for(let i = parseInt(window.top.parent.wholeChar[window.top.parent.player]["stats"]["lv"]); i >= 0; i--){let option = document.createElement("option"); option.innerHTML = `${i}${max}`; option.value = `${i}`; stat.appendChild(option);} stat.value = window.top.parent.wholeChar[window.top.parent.player]["stats"][stat.id];}
                else if(stat.id.includes("Save")){continue;}
                else if(["spellAbility", "lv"].includes(stat.id)){stat.value = window.top.parent.wholeChar[window.top.parent.player]["stats"][stat.id];}
                else if(stat.value == ""){stat.value = window.top.parent.wholeChar[window.top.parent.player]["stats"][stat.id]; if(!["profAndLang", "infusion", "feats", "equipment", "apperance", "characterBackstory", "ally1", "ally2", "additionalFeat&Traits", "treasure"].includes(stat.id)){stat.style.minWidth = stat.value.length + 2 + "ch";}}
                else{stat.innerHTML = window.top.parent.wholeChar[window.top.parent.player]["stats"][stat.id];}
            }

            else
            {
                stat.checked = window.top.parent.wholeChar[window.top.parent.player]["stats"][stat.id];
                setStats(stat);
            }
        }

        else
        {
            if(stat.id.includes("-btn") && !stat.id.includes("lvl")){setDoc(`playerChar/${window.top.parent.player}/stats/${stat.id}`, false); }
            else{setDoc(`playerChar/${window.top.parent.player}/stats/${stat.id}`, "");}
            setStats(stat);
        }

        stat.onchange = updateStat;
    }

    for(let viewButton of viewButtons)
    {
        viewButton.onclick = showSpell;
        if(document.getElementById(viewButton.id.slice(0, viewButton.id.length - 4)).value == "")
        {
            viewButton.classList.add("invisible");
        }
    }

    for(let stat of document.getElementsByClassName("expertise")){stat.onclick = handleExpertise; stat.oncontextmenu = function(e) {e.preventDefault(); handleRightClickRoll(e, "stat");};}
    
    document.getElementById("Initiative").oncontextmenu = function(e) {e.preventDefault(); handleRightClickRoll(e, "init");};
    document.getElementById("initLabel").oncontextmenu = function(e) {e.preventDefault(); handleRightClickRoll(e, "init");};
}

function setStats(stat)
{
    if(stat.id.includes("-btn") && !stat.id.includes("lvl"))
    {
        let display;
        let skill;
        let modifier;
        let exper;

        if(stat.id.includes("Save-btn"))
        {
            skill = stat.id.slice(0, stat.id.length-8);
            modifier = window.top.parent.wholeChar[window.top.parent.player]["stats"][skill];
            display = document.getElementById(skill + "Save");
            exper = skill + "Save";
        }

        else
        {
            skill = stat.id.slice(0, stat.id.length-4);
            let base6 = skillDecrypt[skill];
            modifier = window.top.parent.wholeChar[window.top.parent.player]["stats"][base6];
            display = document.getElementById(skill);
            exper = skill;
        }

        if(stat.checked)
        {
            modifier = parseInt(modifier) + parseInt(window.top.parent.wholeChar[window.top.parent.player]["stats"]["proficiency"]);

            if(window.top.parent.wholeChar[window.top.parent.player]["stats"][`${exper}-expertise`]){modifier += parseInt(window.top.parent.wholeChar[window.top.parent.player]["stats"]["proficiency"]);}
        }
        
        else if(!stat.checked && window.top.parent.wholeChar[window.top.parent.player]["stats"]["class"] == "Bard")
        {
            modifier = parseInt(modifier) + Math.floor(parseInt(window.top.parent.wholeChar[window.top.parent.player]["stats"]["proficiency"]) / 2);
        }

        modifier = statFormat(modifier);
        setDoc(`playerChar/${window.top.parent.player}/stats/${stat.id.slice(0, stat.id.length-4)}`, modifier);
        display.innerHTML = toTitleCase(skill + ": " + modifier);
        if(window.top.parent.wholeChar[window.top.parent.player]["stats"][`${exper}-expertise`]){display.innerHTML += " <strong>(Expertise)</strong>"}
    }
}

function handleExpertise()
{
    let stat = this.id;
    let button = document.getElementById(stat + "-btn");

    if(button.checked)
    {
        if(window.top.parent.wholeChar[window.top.parent.player]["stats"][`${stat}-expertise`])
        {
            deleteDoc(`playerChar/${window.top.parent.player}/stats/${stat}-expertise`);
        }

        else
        {
            setDoc(`playerChar/${window.top.parent.player}/stats/${stat}-expertise`, true);
        }

        setTimeout(init, 1000);
    }
}

function updateStat()
{
    let setTo = this.value;

    if(setTo == "on")
    {
        setTo = this.checked;
        setStats(this);
    }

    else if(setTo.includes("\n"))
    {
        setTo = setTo.split("\n");

        for(let i = 0; i < setTo.length; i++)
        {
            if(setTo[i][0] != "•" && setTo[0] != " " && setTo[i][0] != " "){setTo[i] = "•   " + setTo[i];} 
            if(setTo[i] == "•   "){setTo[i] = "";}
        }

        setTo = setTo.join("\n");

        this.value = setTo;
    }

    else if(this.classList.contains("base6"))
    {
        let full = this.value;
        let smaller;
        let ref = document.getElementById(this.id.slice(0, this.id.length-4));

        full = parseInt(full);
        smaller = (full - 10) / 2;
        smaller = statFormat(Math.floor(smaller));
        ref.innerHTML = smaller;
        setDoc(`playerChar/${window.top.parent.player}/stats/${this.id.slice(0, this.id.length-4)}`, smaller);
        setTimeout(init, 1000);
    }

    else if(["lv", "spellAbility", "totalHitDice"].includes(this.id)){setTimeout(init, 1000);}

    else if(["AC", "currentHp", "maxHp", "tempHp"].includes(this.id))
    {
        setDoc(`playerChar/${window.top.parent.player}/token/${this.id}`, setTo);
        setDoc(`currentMap/${window.top.parent.player}/${this.id}`, setTo);
        this.style.minWidth = this.value.length + 2 + "ch";
    }

    else
    {
        if(!["profAndLang", "infusion", "feats", "equipment", "apperance", "characterBackstory", "ally1", "ally2", "additionalFeat&Traits", "treasure"].includes(this.id)){this.style.minWidth = this.value.length + 2 + "ch";}
    }

    setDoc(`playerChar/${window.top.parent.player}/stats/${this.id}`, setTo);

    if(this.id.includes("lvl") || this.id.includes("can"))
    {
        if(setTo != "")
        {
            document.getElementById(this.id + "-See").classList.remove("invisible");
        }

        else
        {
            document.getElementById(this.id + "-See").classList.add("invisible");
        }
    }
}

function showSpell()
{
    let spellName = toTitleCase(document.getElementById(this.id.slice(0, this.id.length - 4)).value);
    let link;

    if(spellName != "")
    {
        spellName.replaceAll(" ", "%20");
        link = `https://roll20.net/compendium/dnd5e/${spellName}`;
        document.getElementById("spellLookup").src = link;
        document.getElementById("spellFrame").classList.remove("invisible");
    }
}

function handleExit()
{
    document.getElementById("spellFrame").classList.add("invisible");
}

function handleRightClickRoll(e, type)
{
    let clicked = e.currentTarget.id
    let modifier;
    let mod;

    switch(type)
    {
        case "stat": 
            if(e.currentTarget.innerHTML.includes("+"))
            {
                modifier = e.currentTarget.innerHTML.slice(e.currentTarget.innerHTML.indexOf("+"));
            }
            
            else
            {
                modifier = e.currentTarget.innerHTML.slice(e.currentTarget.innerHTML.indexOf("-"));
            }
            break;

        case "init":
            modifier = document.getElementById("Initiative").value;
            clicked = "Initiative";
            break;
    }

    mod = parseInt(modifier);
    let random = Math.random();
    let roll = Math.floor(random * (20)) + mod; //Gives random roll
    let message = `${window.top.parent.player} had rolled a ${roll} for ${toTitleCase(clicked)}. (${roll-mod} + ${mod})`;

    sendDiscordMessage(message);
    alert(message);

    return false;
}