"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, auth, database, setDoc, statFormat, skillDecrypt, reload } from './viMethods.js';

let player;
let wholeChar = {};
let stats;
let firstRun = true;

const charRef = ref(database, 'playerChar/');
onValue(charRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeChar = data;

    if(firstRun)
    {
        firstRun = false;
        init();
    }
});

onAuthStateChanged(auth, (user) => 
{
    if (user) 
    {
        player = auth.currentUser.email.split("@");
        player = toTitleCase(player[0]);
    } 
});

function init()
{
    let display = document.getElementById("story");
    let stats = document.getElementsByClassName("stat");

    for(let stat of stats)
    {
        if(wholeChar[player]["stats"][stat.id])
        {
            if(typeof wholeChar[player]["stats"][stat.id] == "string")
            {
                if(stat.id.includes("Save")){continue;}
                if(stat.value == ""){stat.value = wholeChar[player]["stats"][stat.id];}
                else{stat.innerHTML = wholeChar[player]["stats"][stat.id];}
            }

            else
            {
                stat.checked = wholeChar[player]["stats"][stat.id];
                setStats(stat);
            }
        }

        else
        {
            setStats(stat);
        }

        stat.onchange = updateStat;
    }
}

function setStats(stat)
{
    if(stat.id.includes("-btn")){
    if(stat.id.includes("Save-btn"))
    {
        let skill = stat.id.slice(0, stat.id.length-8);
        let modifier = wholeChar[player]["stats"][skill];

        if(stat.checked)
        {
            modifier = parseInt(modifier) + parseInt(wholeChar[player]["stats"]["proficiency"]);
        }

        modifier = statFormat(modifier);
        setDoc(`playerChar/${player}/stats/${stat.id.slice(0, stat.id.length-4)}`, modifier);
        
        document.getElementById(skill + "Save").innerHTML = toTitleCase(skill + ": " + modifier);
    }

    else
    {
        let skill = stat.id.slice(0, stat.id.length-4);
        let base6 = skillDecrypt[skill];
        let modifier = wholeChar[player]["stats"][base6];

        if(stat.checked)
        {
            modifier = parseInt(modifier) + parseInt(wholeChar[player]["stats"]["proficiency"]);
        }

        modifier = statFormat(modifier);
        setDoc(`playerChar/${player}/stats/${stat.id.slice(0, stat.id.length-4)}`, modifier);
        
        document.getElementById(skill).innerHTML = toTitleCase(skill + ": " + modifier);
    }
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
            if(setTo[i][0] != "•" && setTo[0] == " "){setTo[i] = "•   " + setTo[i];}
        }

        setTo = setTo.filter(item => item !== '•   ');
        setTo = setTo.join("\n");

        setTo = setTo.split("    ");
 
        for(let i = 0; i < setTo.length - 1; i++)
        {
            if(setTo[i][setTo[i].length - 1] != "\n"){setTo[i] += "\n";}
        }

        setTo = setTo.join("    ");

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
        setDoc(`playerChar/${player}/stats/${this.id.slice(0, this.id.length-4)}`, smaller);
        setTimeout(init, 1000);
    }

    else if(this.id == "proficiency"){setTimeout(init, 1000);}

    else if(["AC", "currentHp", "maxHp", "tempHp"].includes(this.id))
    {
        setDoc(`playerChar/${player}/token/${this.id}`, setTo);
        setDoc(`currentMap/${player}/${this.id}`, setTo);
    }

    setDoc(`playerChar/${player}/stats/${this.id}`, setTo);
}
