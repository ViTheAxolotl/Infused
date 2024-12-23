"use strict";
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';

const firebaseApp = initializeApp
({
    apiKey: "AIzaSyArcsmJkXSeuIHMysYtIzRdjIDlKNQA25Y",
    authDomain: "forgottenrealmsmap.firebaseapp.com",
    projectId: "forgottenrealmsmap",
    storageBucket: "forgottenrealmsmap.appspot.com",
    messagingSenderId: "697902154695",
    appId: "1:697902154695:web:ffa5c47817f3097c89cfe2",
    measurementId: "G-Q2W494NRDT"
}); //Connects to database

export let auth = getAuth(); //Logs into accounts
export let database = getDatabase(); //Sets up connection

/**
 * 
 * @param {*} word 
 * @returns 
 * Changes each word into titlecase of word given. (Ex. help me -> Help Me)
 */
export function toTitleCase(word)
{
    let finalWord = "";
    if(word.includes(" ")) //More than one word
    {
        word = word.split(" "); 
        for(let singleWord of word)
        {
            finalWord += `${singleWord[0].toUpperCase() + singleWord.slice(1)} `; //Capitilize each word in the varible
        }
    }

    else //If only one word given
    {
        finalWord = word[0].toUpperCase() + word.slice(1); //Caps the one word
    }

    return finalWord;
}

/**
 * 
 * @param {*} title 
 * @param {*} text 
 * @param {*} location 
 * Creates cards base on their title and text, it places these cards at location given.
 */
export function createCard(title, text, location)
{
    let cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "card .bg-UP-blue notes");
    let cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body notes");
    let cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.innerHTML = title;
    cardBody.appendChild(cardTitle);

    for(let i = 0; i < text.length; i++) //For each sentence in the card
    {
        let cardText = document.createElement("p");
        cardText.setAttribute("class", "card-text");
        cardText.style.margin = "3px";
        cardText.innerHTML = text[i];
        cardBody.appendChild(cardText);
    }
    
    let noteDisplay = document.getElementById(location);
    noteDisplay.appendChild(cardDiv);
    cardDiv.appendChild(cardBody);
}

/**
 * 
 * @param {*} path 
 * @param {*} toChange 
 * Sets the doc at path to the new value toChange
 */
export function setDoc(path, toChange)
{
    set(ref(database, path), toChange); 
}

/**
 * 
 * @param {*} path 
 * Deletes (Sets to null) the doc at path
 */
export function deleteDoc(path)
{
    set(ref(database, path), null);
}

export function returnHpImage(maxHp, tempHp, currentHp)
{
    let fraction = parseInt(currentHp) / parseInt(maxHp);

    if(tempHp != null)
    {
        if(tempHp != "0")
        {
            return "images/map/hpBar/tempHp.png";
        }
    }

    if(maxHp == "0" && currentHp == "0")
    {
        return "images/map/hpBar/invisible.png";
    }

    else if(fraction == 1)
    {
        return "images/map/hpBar/hpBar1.png";
    }

    else if(fraction >= .8)
    {
        return "images/map/hpBar/hpBar2.png";
    }

    else if(fraction >= .6)
    {
        return "images/map/hpBar/hpBar3.png";
    }

    else if(fraction >= .4)
    {
        return "images/map/hpBar/hpBar4.png";
    }

    else if(fraction > 0)
    {
        return "images/map/hpBar/hpBar5.png";
    }

    else if(fraction == 0)
    {
        return "images/map/hpBar/hpBar6.png";
    }  
}

/**
 * Clenses input to stop hackers from gaining control
 * @param {*} toClense 
 * @returns 
 */
export function clenseInput(toClense)
{
    let badChars = ["<", ">", ";", "@", "(", ")"];
    let isOk = true;

    toClense = toClense.replaceAll(" ", "");
    toClense = toClense.replaceAll("\"", "\'");
    toClense = toClense.replaceAll("\`", "\'");

    for(let bad of badChars)
    {
        if(toClense.includes(bad)) //If the input contains a bad char
        {
            alert(`Bad char detected: ${bad}. Please remove the char and try again.`);
            isOk = false;
        }
    }

    if(isOk)
    {
        return toClense;
    }

    else
    {
        return null;
    }
}

/**
 * Refreshes page after the given seconds
 * @param {*} seconds 
 */
export function reload(seconds)
{
    setTimeout(function(){location.reload();}, 1000 * seconds);
}

/**
 * Places the new element elemToPlace before the referenceElement
 * @param {*} elemToPlace 
 * @param {*} referenceElement 
 */
export function placeBefore(elemToPlace, referenceElement)
{ 
    referenceElement.parentElement.insertBefore(elemToPlace, referenceElement);
}

/**
 * Creates the basic label and returns it
 * @param {*} name 
 * @returns 
 */
export function createLabel(name)
{
    let label = document.createElement("h6");
    label.innerHTML = `${name}:`;
    label.style.display = "inline";
    label.classList = "color-UP-yellow";
    return label;
}