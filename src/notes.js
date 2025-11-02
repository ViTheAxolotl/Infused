"use strict"
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, auth, database, setDoc, deleteDoc, returnHpImage } from '../js/viMethods.js';

let wholeNotes = {};
let player;
let notesRef;
let currentTitle;
let currentText;
let isFirstRead = true;
let display = document.getElementById("notesDisplay");

onAuthStateChanged(auth, (user) => 
{
    user = auth.currentUser.email.split("@");
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
}

function handleEnter()
{
    let title = document.getElementById("searchBar");
    let text = document.getElementById("text");
    let pos = document.getElementById("pos");

    if(title.value == null || text.value == null || title.value == "" || text.value == "")
    {
        alert("Please enter both a title and text for your note.");
    }

    else
    {
        addNote(title.value, text.value, pos.value);
        //setCardScreen(enter, title, text);
    }   
}

function handleAddButton()
{
    let notes = document.getElementsByClassName("notes");
    let addButton = document.getElementById("AddButton");

    /**addButton.parentNode.removeChild(addButton);
    while(notes.length > 0)
    {
        notes[0].parentNode.removeChild(notes[0]);
    }**/

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
    let pos = document.getElementById("pos")
    title.value = currentTitle;
    text.value = currentText;
    pos.value = wholeNotes[title.value]["pos"];
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
    for(let child of display.children)
    {
        if(child.tagName != 'DIV'){continue;}

        let title = child.id.slice(0, child.id.indexOf("-"));
        let text = wholeNotes[title]["desc"];
        let pos = wholeNotes[title]["pos"];
        let display = child.children[0];

        while(display.children.length > 0)
        {
            display.children[0].remove();
        }

        let cardTitle = document.createElement("input");
        cardTitle.setAttribute("class", "card-title");
        cardTitle.value = title;
        display.appendChild(cardTitle);

        let cardText = document.createElement("textarea");
        cardText.setAttribute("class", "card-text");
        cardText.style.margin = "3px";
        cardText.value = text;
        display.appendChild(cardText);

        let cardPos = document.createElement("select");
        for(let i = 1; i < Object.keys(wholeNotes).length + 1; i++)
        {
            let option = document.createElement("option");
            option.value = i;
            cardPos.appendChild(option);
        }
        cardPos.value = pos;
        display.appendChild(cardPos);
    }
    /**let text = document.createElement("textarea");
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
    pos.id = "pos"
    **/
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

function createNoteCard(title, text)
{
    let cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "card .bg-UP-blue notes");
    cardDiv.id = `${title}-div`;
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
    
    cardDiv.appendChild(cardBody);
    return cardDiv;
}

function createAddButton()
{
    let addButton = document.createElement("button");
    addButton.setAttribute("id", "AddButton");
    addButton.innerHTML = "Edit/Add Notes";
    addButton.style.height = "75px";
    addButton.onclick = handleAddButton;

    let noteDisplay = document.getElementById("notesDisplay");
    noteDisplay.appendChild(addButton);
}

function createDeleteButton()
{
    let deleteButton = document.createElement("img");
    deleteButton.setAttribute("src", "images/trashIcon.png");
    deleteButton.setAttribute("id", "deleteButton");
    deleteButton.onclick = handleDeleteButton;

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
    display = document.getElementById("notesDisplay");
    display.innerHTML = "";
    let orderedNotes = {};

    for(let key of Object.keys(wholeNotes))
    {
        let text = [];
        let pos;
        text.push(wholeNotes[key]["desc"]);
        pos = wholeNotes[key]["pos"];
        
        orderedNotes[pos] = createNoteCard(key, text);
    }

    for(let noteNumber = 1; noteNumber < Object.keys(orderedNotes).length + 1; noteNumber++)
    {display.appendChild(orderedNotes[noteNumber]);}

    //for(let key of document.getElementsByClassName("card-body")){key.onclick = handleCardClick;}
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