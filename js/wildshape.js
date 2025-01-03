"use strict";

function init()
{
    let img = document.getElementById("stat");
    let url = window.location.href.split("?");
    url = url[1];

    switch(url)
    {
        case "ghost":
            img.src = "images/ghost.png";
            break;
        
        case "pixiu":
            img.src = "images/pixiu.jpg";
            break;

        case "ferret":
            img.src = "images/weasel.png";
            break;
    }
}

init();