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
        summonDarkness(map, img)
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
    let image = document.getElementById('skillImg');
    new ResponsiveImageMap(map, image, 1920);
}

function summonDarkness(map, image)
{
    let tokens = map.children;
    let x;
    let y;
    let radius;
    let offSet = 0;
    let ratio = image.offsetWidth / 1920;

    for(let token of tokens)
    {
        let cords = token.coords.split(",");
        for(let i = 0; i < 3; i++){cords[i] = parseInt(cords[i]);}
        x = cords[0] + image.offsetLeft; y = cords[1] + image.offsetTop; radius = cords[2];

        var newImage = document.createElement("img");
        newImage.src = 'images/hide.png';
        newImage.style.width = (radius*2) + "px";
        newImage.style.height = (radius*2) + "px";
        newImage.style.left = (x - radius) + "px";
        newImage.style.top = (y + radius) + "px";
        newImage.style.border = "none";
        newImage.style.margin = "0px";
        newImage.classList = "overlay-image";
        document.getElementById("map").appendChild(newImage);
        newImage.onclick = handleClick;
        offSet += .55;
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