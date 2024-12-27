"use strict";
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, auth, database } from './viMethods.js';

let player;

onAuthStateChanged(auth, (user) => 
{
    if (!user) 
    {
        alert("You need to login before using this resource. Click Ok and be redirected");
        window.location.href = "loginPage.html?map.html"; 
    } 

    else
    {
        player = auth.currentUser.email.split("@");
        player = toTitleCase(player[0]);
        document.getElementById("name").innerHTML = `${player} ${document.getElementById("name").innerHTML}`;
    }
});

function init()
{
    let tokens = document.getElementById("tree").children;

    for(let token of tokens)
    {
        token.onclick = handleClick;
    }
}

function handleClick()
{
    if(this.classlist.contains("selected"))
    {
        this.classlist.remove("selected");
    }

    else
    {
        this.classlist.add("selected");
    }
}

init();