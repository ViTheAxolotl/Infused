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
    "ep2" : "The party starts in the mystical cave, with a bleeding-out Skyla lying on the ground. Ben managed to bandage her up after Kody decided to heal her. Skyla recognizing the markings told the group that this was an ancient cursed one’s temple and to put their hand on the paw print on the wall. While the party questioned her motives Ben went straight to opening the door. Exposing the Ice Trials. Going through the Wisdom trial quite easily they advanced to the Dexterity Labyrinth trial. Finding out they were on thin Ice they trod carefully and were able to find out the exit. Leading to a big arena, where a mechanized dragon awoke and stood up on its charger. The party using the walls and surroundings jumped the dragon. Beating it sensely they didn’t give it much of a chance to fight back. Destroying it they moved to the last room, which was a laboratory. On the wall laid a blue crystal, the Ice Crystal. Skyla told the party if they manage to collect all 6 crystals they will be able to make a wish. This place was built by Infused people like themselves and is empowered by the crystals. They went back to town saw the carnage, and found out there was someone who studied the Curse who lives in Penrith. After shopping around and finding a strip club and drug store combo. They went to sleep and had joint dreams. Then heading to the town hall the mercenary Milo agreed to accompany them since he has his next job in Penrith."
};

let expandName =
{
    "ep1" : "New World",
    "ep2" : "Icy Drugs"
};