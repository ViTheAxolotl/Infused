"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, auth, database, setDoc, statFormat, skillDecrypt } from './viMethods.js';

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
                
                if(stat.id.includes("Save"))
                {
                    let skill = stat.id.slice(0, stat.id.length-8);
                    let modifier = wholeChar[player]["stats"][skill];

                    if(stat.checked)
                    {
                        modifier = parseInt(modifier) + parseInt(wholeChar[player]["stats"]["proficiency"]);
                    }

                    modifier = statFormat(modifier);
                    
                    document.getElementById(skill + "Save").innerHTML = skill + ": " + modifier;
                }
            }
        }

        stat.onchange = updateStat;
    }
}

function updateStat()
{
    let setTo = this.value;

    if(setTo == "on")
    {
        setTo = this.checked;

        if(this.id.includes("Save"))
        {
            let skill = this.id.slice(0, this.id.length-8);
            let modifier = wholeChar[player]["stats"][skill];

            if(this.checked)
            {
                modifier = parseInt(modifier) + parseInt(wholeChar[player]["stats"]["proficiency"]);
            }

            modifier = statFormat(modifier);
            
            document.getElementById(skill + "Save").innerHTML = skill + ": " + modifier;
            setDoc(`playerChar/${player}/stats/${skill}Save`, modifier);
        }
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

    if(this.classList.contains("base6"))
    {
        let full = this.value;
        let smaller;
        let ref = document.getElementById(this.id.slice(0, this.id.length-4));

        full = parseInt(full);
        smaller = (full - 10) / 2;
        smaller = statFormat(Math.floor(smaller));
        ref.innerHTML = smaller;
        setDoc(`playerChar/${player}/stats/${this.id.slice(0, this.id.length-4)}`, smaller);
    }
    setDoc(`playerChar/${player}/stats/${this.id}`, setTo);
}
