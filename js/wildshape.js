"use strict";

function init()
{
    let img = document.getElementById("stat");
    let url = window.location.href.split("?");
    url = url[1];

    switch(url)
    {
        case "scorpion":
            img.src = "images/scorpion.png";
            break;
        
        case "pixiu":
            img.src = "images/pixiu.jpg";
            break;

        case "ferret":
            img.src = "images/ferret.jpg";
            break;

        case "basilisk":
            img.src = "images/basilisk.png";
            break;

        case "vSquid":
            img.src = "images/vSquid.jpg";
            break;

        case "hydra":
            img.src = "images/hydra.jpg";
            break;
    }
}

init();