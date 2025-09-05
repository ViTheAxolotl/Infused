"use strict";

function createCard(title, text, status)
{
    document.write
    (
        '<div class="card '+ status +'">'+
            '<div class="card-body '+ status + '">'+
                '<h5 class="card-title color-UP-black">' + title + ' (' + status[0].toUpperCase() + status.substring(1)  + ')</h5>'+
                '<p class="card-text ' + status +'">' + text + '</p>'+
            '</div>'+
        '</div>'
    );
}

function setUpCards()
{
    for(let title in titleAndText)
    {
        createCard(title, titleAndText[title], titleAndStatus[title]);
    }
}

let titleAndText =
{
    "Impower Infusion" : "You have been given the quest to gather supplies to make a toxin that will strengthen your infusions. You have gathered the Pickled Greens and the flowers from the ravine. Now you must report back to him to create the toxin.",
    "Garrett's Headache" : "Garrett has been acting strange since he was resurected. In the middle of the night, he woke up bleeding from his forehead. Insisting they go to Pavv right away to get fixed.",
    "Missing Pieces" : "You have restored the tablet from a century ago, surprisingly it still works. However it is missing 3 computing parts, ECC Chip, RTC Chip, & Fusion Chip. Jason may have a lead, but he needed some time to remember where he found the tablet. Check back with him the next time you see him."
};

let titleAndStatus =
{
    "Impower Infusion" : "complete",
    "Garrett's Headache" : "incomplete",
    "Missing Pieces" : "incomplete"
};

setUpCards();