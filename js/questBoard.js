"use strict";
function init()
{ 
    let cols = document.getElementsByClassName("qBCol");
    let x = 1;

    for(let z = 0; z < 2; z++)
    {   
        for(let y = 0; y < 4; y++)
        {   
            let cellNode = document.createElement("div");
            cellNode.id = "qBCell" + x;
            let cardNode = document.createElement("div");
            cardNode.classList = "card";
            cardNode.style = "min-height: 150px;"
            let nailNode = document.createElement("img");
            nailNode.src = "images/nail.png";
            nailNode.style = "height: 5%; width: 5%; margin: 5px auto;";
            let cardBodyNode = document.createElement("div");
            cardBodyNode.classList = "card-body --bs-gray-200";
            let titleNode = document.createElement("h5");
            titleNode.classList = "card-title";
            titleNode.style = "margin-top: -20px;"
            let textNode = document.createElement("p");
            textNode.classList = "card-text";
            textNode.style = "color: black; font-size: 14px;"
            
            cols[z].appendChild(cellNode);
            cellNode.appendChild(cardNode);
            cardNode.appendChild(nailNode);
            cardNode.appendChild(cardBodyNode);
            cardBodyNode.appendChild(titleNode);
            cardBodyNode.appendChild(textNode);
            x++;
        }
    }

    for(let title in titleAndText)
    {
        createCards(title, titleAndText[title], cellNumber[title]);
    }
}

function createCards(title, text, cell)
{
    let card = document.getElementById(cell);
    let cardNode = card.childNodes[0];
    let bodyNode = cardNode.childNodes[1];
    let titleNode = bodyNode.childNodes[0];
    let textNode = bodyNode.childNodes[1];

    titleNode.innerHTML = title;
    textNode.innerHTML = text;
}

let titleAndText =
{
    "Researching MagicVoid (M)" : "The head scientist of Castle Havenport has found some less hostile MagicVoid. He wants to do some research to understand the properties of MagicVoid, however, he is not equipt to fight them if they attack. He asks for some escorts and protectors, so he can find a way to stop MagicVoid from taking over the world. Reward: 45 gold & information.",
};

/**
 * 1   5
 * 2   6
 * 3   7
 * 4   8
 */
let cellNumber =
{
    "Researching MagicVoid (M)" : "qBCell1",
};

init();