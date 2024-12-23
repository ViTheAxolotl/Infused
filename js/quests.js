"use strict";

function createCard(title, text, status)
{
    document.write
    (
        '<div class="card '+ status +'">'+
            '<div class="card-body '+ status + '">'+
                '<h5 class="card-title">' + title + ' (' + status[0].toUpperCase() + status.substring(1)  + ')</h5>'+
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
    "Kill the Map Maker" : "Razor and Leoneir were given a quest to kill the map maker before he reached the prince with the map showing Leoneir was creating MV. The party found out she was hearing a voice in her head, and was creating MV during her sleep.",
    "Get More Quests (M)" : "Go back to Castle Havenport to see updated quests on the quest board.",
    "Find the Missing Fey (S)" : "Nibbly and Nook have gotten a dream to find the missing Fey that been kidnapped and experimented on. Their goal is to find them, and free them. Then stop the ones responsable by any means necessary. Given a vrase to destroy the nearby realm, killing all in the area. This magic will go to Nook and Nibbly.",
    "Researching MagicVoid (M)" : "The head scientist of Castle Havenport has found some less hostile MagicVoid. He wants to do some research to understand the properties of MagicVoid, however, he is not equipt to fight them if they attack. He asks for some escorts and protectors, so he can find a way to stop MagicVoid from taking over the world. Reward: 45 gold & information."
};

let titleAndStatus =
{
    "Kill the Map Maker" : "complete",
    "Get More Quests (M)" : "incomplete",
    "Find the Missing Fey (S)" : "incomplete",
    " Researching MagicVoid (M)" : "incomplete"
};

setUpCards();