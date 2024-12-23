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
    stats = wholeChar[player]["stats"];
    let display = document.getElementById("story");

    for(let stat of Object.keys(stats))
    {
        let elem = [document.createElement("h6"), document.createElement("input"), document.createElement("div")];
        elem[0].innerHTML = `${stat}:`;
        elem[0].style.display = "inline";
        elem[0].classList = "color-UP-yellow";
        elem[1].style.width = "75px";
        elem[1].id = stat;
        elem[1].style.marginLeft = "5%";
        elem[1].value = stats[stat]
        elem[2].appendChild(elem[0]);
        elem[2].appendChild(elem[1]);
        display.appendChild(elem[2]);
    }

    let submitBtn = document.createElement("button");
    submitBtn.innerHTML = "Submit Changes"
    submitBtn.onclick = submitChanges;
    display.appendChild(submitBtn);
}

function submitChanges()
{
    for(let stat of Object.keys(stats))
    {
        let value = document.getElementById(stat).value;
        if(value == ""){value = "0";}
        stats[stat] = value;
    }

    setDoc(`playerChar/${player}/stats`, stats)
    alert("Stats have been changed.");
    location.reload();
}