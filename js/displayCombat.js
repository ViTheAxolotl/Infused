"use strict";
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, auth, database, setDoc, deleteDoc, returnHpImage } from '../js/viMethods.js';

let display = document.getElementById("siteList");
let wholeDisplay = {};

const displayRef = ref(database, 'display/');
onValue(displayRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeDisplay = data;
    showDisplay();
});

function showDisplay()
{
    display.innerHTML = "<ul>";
    let current = wholeDisplay["current"];
    let tempCurrent = current;

    for(let i = 0; i < 10; i++)
    {
        display.innerHTML += `<li>${wholeDisplay[tempCurrent]}</li>`;

        if(tempCurrent == "9"){tempCurrent = "0";}
        else{tempCurrent = `${parseInt(tempCurrent) + 1}`;}
    }

    display.innerHTML += "</ul>";
}