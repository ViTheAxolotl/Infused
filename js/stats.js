"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, auth, database, setDoc } from './viMethods.js';

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
                stat.value = wholeChar[player]["stats"][stat.id];
            }

            else
            {
                stat.checked = wholeChar[player]["stats"][stat.id];
            }
        }

        stat.onchange = updateStat;
    }
}

function updateStat()
{
    let setTo = this.value;
    if(setTo == "on"){setTo = true;}
    else if(setTo == "off"){setTo = false;}
    setDoc(`playerChar/${player}/stats/${this.id}`, setTo);
}
