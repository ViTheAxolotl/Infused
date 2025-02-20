"use strict";
function init()
{
    let characters = document.getElementsByTagName("button");

    for(let char of characters) 
    {
        char.onclick = handleCharacterButton;
    }

    characters[characters.length - 2].onclick = handleBringToTop;
    characters[characters.length - 1].onclick = handleReset;
}

function handleCharacterButton()
{
    let txtBox = document.getElementById("description");
    let nameTxt = document.getElementById("name");
    txtBox.innerHTML = charStories[this.id];
    nameTxt.innerHTML = expandName[this.id];
    document.getElementById("display").scrollIntoView({behavior: 'smooth'});
}

function handleBringToTop()
{
    document.getElementById("header").scrollIntoView({behavior: 'smooth'});
}

function handleReset()
{
    location.reload(true);
}

window.onload = init;

let charStories = 
{
    "ep1" : "The party is in two groups, Maine & Card and Board. The Maine group was Dream and Okomi, they were at the apartment in Maine, while Vi took Nikko out to go potty. A figure appeared on the TV and started chanting, as lightning struck both of them in the chest. Then the apartment began to shake as it was ripped off the ground and flung through time and space. When things settled they saw their bodies no longer theirs alone—now having another being infused within them. When going outside the top half of a man’s body fell from above them, looking like he was ripped in half. Two guards came by and believed they were the ones who murdered this man. Dream let out their inner Karen on the guards as Okomi went willingly with them to the Town Hall. Group Card and Board consists of Ben, Kody, & Garrett. They were in the middle of a commander battle when Ben summoned Xanathar. The lights began to flicker and people started running out of the shop. As lightning struck through the light fixtures hunting people down. Screams and blood splatter everywhere, as each of them was hit. Then the shop ripped off the ground and was thrown into the new world. When arriving they found out the town was being raided by goblins. Milo the Mercenary gave them weapons to defend themselves. They decided that bunkering down in the bar was the best idea. While in the bar Garrett was having a midlife crisis and was talking to people who weren’t there. Garrett convinced the party that they needed to help protect the people and discovered he could use magic. They all went to the center of town, where Garrett was instantly killed. (Cut to Garrett) Fighting their way together they ran into Okomi and Dream. And was able to kill all of the Goblins. After taking a minute to bury Garrett, they decided to go to the bar. When arriving they saw most of the people getting very drunk after the attack. Seeing Milo and a girl at the table they went over to them. They found out they were not the only people who are from Earth meeting Hannah. Finding out the *Hot* Mayor was kidnapped by the Goblins and together they went to rescue her. After finding a weird glowing cave they were able to kill the goblins and this is where the session was brought to a close.",
};

let expandName =
{
    "ep1" : "New World",
};