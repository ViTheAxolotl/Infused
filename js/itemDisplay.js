"use strict";
import { reload } from '../js/viMethods.js';

/**
 * Runs after the webpage loads
 */
function init()
{ 
    document.getElementById("searchItem").onclick = handleSearch;
    document.getElementById("backToTopItem").onclick = handleBringToTop;
    document.getElementById("resetItem").onclick = handleReset;
}

/**
 * When they click submit button
 */
function handleSearch()
{
    let txtBox = document.getElementById("searchTxt");
    let display = document.getElementById("description");
    let image = document.getElementById("itemImg");

    display.innerHTML = window.top.parent.imgs["items"][txtBox.value]["desc"]; //Changes display to show the item's descriptions
    image.classList = ""; //Makes the image visible
    image.src = window.top.parent.imgs["items"][txtBox.value]["img"]; //Adds the image of the item
    document.getElementById("display").scrollIntoView({behavior: 'smooth'}); //Moves the view to the item's description
}

/**
 * Moves the view back to the top of the webpage
 */
function handleBringToTop()
{
    document.getElementById("header").scrollIntoView({behavior: 'smooth'});
}

/**
 * Reloads the webpage after .1 seconds
 */
function handleReset()
{
    reload(.1)
}

window.top.parent.onload = init; //After the webpage is done loading