"use strict"
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, auth, database, createCard, setDoc, deleteDoc } from '../js/viMethods.js';

let wholeNotes = {};
let player;
let notesRef;
let currentTitle;
let currentText;
let isFirstRead = true;

onAuthStateChanged(auth, (user) => 
{
    let user = auth.currentUser.email.split("@");
    player = toTitleCase(user[0]);
    
    notesRef = ref(database, `playerChar/${player}/notes`);
    onValue(notesRef, (snapshot) => 
    {
        const data = snapshot.val();
        wholeNotes = data;
        
        if(isFirstRead)
        {
            readNotes(player);
            createAddButton();
            isFirstRead = false;
        }
    });
});

function init()
{
    let button = document.getElementById("enter");

    button.onclick = handleEnter;
}

function handleEnter()
{
    let title = document.getElementById("searchBar");
    let text = document.getElementById("text");

    if(title.value == null || text.value == null || title.value == "" || text.value == "")
    {
        alert("Please enter both a title and text for your note.");
    }

    else
    {
        addNote(title.value, text.value);
        //setCardScreen(enter, title, text);
    }   
}

function handleAddButton()
{
    let notes = document.getElementsByClassName("notes");
    let addButton = document.getElementById("addButton");

    addButton.parentNode.removeChild(addButton);
    while(notes.length > 0)
    {
        notes[0].parentNode.removeChild(notes[0]);
    }

    setAddScreen();
    createDeleteButton();
}

function handleCardClick()
{
    let children = this.childNodes;

    currentTitle = children[0].innerHTML;
    currentText = children[1].innerHTML;
    handleAddButton();
    
    let title = document.getElementById("searchBar");
    let text = document.getElementById("text");
    title.value = currentTitle;
    text.value = currentText;
}

function handleDeleteButton()
{
    let enter = document.getElementById("enter");
    let title = document.getElementById("searchBar");
    let text = document.getElementById("text");
    let pos = document.getElementById("pos");

    deleteNote();
    setCardScreen(enter, title, pos, text);
}

function setAddScreen()
{
    let text = document.createElement("textarea");
    text.setAttribute("id", "text");
    text.setAttribute("rows", "5");
    text.setAttribute("cols", "50");
    text.placeholder = "Write Text Here";

    let addButton = document.getElementById("enter");
    addButton.innerHTML = "Upload";
    addButton.parentNode.removeChild(addButton);

    let title = document.getElementById("searchBar");
    title.placeholder = "Write Title Here";
    title.parentNode.appendChild(text);
    title.parentNode.appendChild(addButton);

    let pos = document.createElement("input");
    pos.placeholder = "Write Position Order";
    title.parentNode.appendChild(pos);
    pos.id = "pos";
}

function setCardScreen(enter, title, pos, text)
{
    let deleteButton = document.getElementById("deleteButton");
    deleteButton.parentNode.removeChild(deleteButton);
    text.parentNode.removeChild(text);
    pos.parentNode.removeChild(pos);
    enter.innerHTML = "Enter";
    title.placeholder = "";
    title.value = "";
}

function createAddButton()
{
    let addButton = document.createElement("img");
    addButton.setAttribute("src", "images/addIcon.png");
    addButton.setAttribute("id", "addButton");
    addButton.onclick = handleAddButton;

    let instructions = document.createElement("p");
    instructions.setAttribute("id", "instruc");
    instructions.setAttribute("class", "center");
    instructions.innerHTML = "Click a note to edit it, or delete it.";

    let noteDisplay = document.getElementById("notesDisplay");
    noteDisplay.appendChild(addButton);
    noteDisplay.appendChild(instructions);
}

function createDeleteButton()
{
    let deleteButton = document.createElement("img");
    deleteButton.setAttribute("src", "images/trashIcon.png");
    deleteButton.setAttribute("id", "deleteButton");
    deleteButton.onclick = handleDeleteButton;

    let instructions = document.getElementById("instruc");
    instructions.innerHTML = "Type in a title and description for your note. If you change your mind, hit the trash icon.";

    let addButton = document.getElementById("enter");
    addButton.innerHTML = "Upload";
    addButton.parentNode.removeChild(addButton);

    let notes = document.getElementById("notes");
    notes.appendChild(deleteButton);
    notes.appendChild(addButton);
}

async function addNote(title, text, pos)
{
    try 
    {
        if(currentTitle != undefined)
        {
            deleteDoc(`playerChar/${player}/notes/${currentTitle}`);
        }
  
        setDoc(`playerChar/${player}/notes/${title}`, {text, pos});
        setTimeout(() => {location.reload();}, 50);
    } 
    
    catch (e) 
    {
        console.error("Error adding document: ", e);
    }
}

async function readNotes() //Need to do manual
{
    let display = document.getElementById("notesDisplay");
    display.innerHTML = "";

    for(let key of Object.keys(wholeNotes))
    {
        let text = [];
        let slot = Object.keys(wholeNotes).indexOf(slot);
        text.push(wholeNotes[key]);
        
        createCard(key, text, "notesDisplay");
    }

    for(let key of document.getElementsByClassName("card-body")){key.onclick = handleCardClick;}
}

async function deleteNote()
{
    if(currentTitle != undefined)
    {
        deleteDoc(`playerChar/${player}/notes/${currentTitle}`);
        setTimeout(() => {location.reload();}, 50);
    }

    else
    {
        location.reload();
    }
}

window.onload = init;