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
    "Figure out Where You Are" : "You have arrived in an unfamiliar plane, when leaving the building you are in, you are no longer in Kansas anymore. With the mid evil architect it looks like a place in a history book. Then you notice the fantasy beings, you gather the feeling that you need to find allies. With everyone looking at you like your the strange ones.",
};

let titleAndStatus =
{
    "Figure out Where You Are" : "incomplete",
};

setUpCards();