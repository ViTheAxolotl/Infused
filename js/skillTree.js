"use strict";
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { toTitleCase, auth, database } from './viMethods.js';

let player;

class ResponsiveImageMap {
    constructor(map, img, width) {
        this.img = img;
        this.originalWidth = width;
        this.areas = [];

        for (const area of map.getElementsByTagName('area')) {
            this.areas.push({
                element: area,
                originalCoords: area.coords.split(',')
            });
        }

        window.addEventListener('resize', e => this.resize(e));
        this.resize();
    }

    resize() 
    {
        const ratio = this.img.offsetWidth / this.originalWidth;

        for (const area of this.areas) 
        {
            const newCoords = [];

            for (const originalCoord of area.originalCoords) 
            {
                newCoords.push(Math.round(originalCoord * ratio));
            }

            area.element.coords = newCoords.join(',');
        }

        return true;
    };
}

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
        document.getElementById("name").innerHTML = `${player}${document.getElementById("name").innerHTML}`;
    }
});

function init()
{
    let map = document.getElementById('tree');
    let tokens = map.children;
    let image = document.getElementById('skillImg');
    new ResponsiveImageMap(map, image, 1920);
    let x;
    let y;
    let radius;

    for(let token of tokens)
    {
        let cords = token.coords.split(",");
        x = cords[0]; y = cords[1]; radius = cords[2];

        var newImage = document.createElement("img");
        newImage.src = 'images/hide.png';
        newImage.style.position = "absolute";
        newImage.width = radius*2;
        newImage.style.left = (x - (newImage.width/2)) + "px";
        newImage.style.top = (y - (newImage.width/2)) + "px";
        document.body.appendChild(newImage);
        newImage.onclick = handleClick;
    }
}

function handleClick()
{
    if(this.className == "selected")
    {
        this.className = ".";
    }

    else
    {
        this.className = "selected";
    }
}

init();