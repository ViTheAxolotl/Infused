"use strict";
import { reload } from '../js/viMethods.js';

/**
 * Runs after the webpage loads
 */
function init()
{
    let buttons = document.getElementsByTagName("button"); //Gets all of the buttons
    
    buttons[buttons.length - 3].onclick = handleSearch;
    buttons[buttons.length - 2].onclick = handleBringToTop;
    buttons[buttons.length - 1].onclick = handleReset;
}

/**
 * When they click submit button
 */
function handleSearch()
{
    let txtBox = document.getElementById("searchTxt");
    let display = document.getElementById("description");
    let image = document.getElementById("itemImg");

    display.innerHTML = items[txtBox.value]; //Changes display to show the item's descriptions
    image.classList = ""; //Makes the image visible
    image.src = img[txtBox.value]; //Adds the image of the item
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

window.onload = init; //After the webpage is done loading

let items = 
{
    "ItSM0GA" : "This dagger is very rare, only a few are in existence. 3 of them are own by Galno, each representative has one. These blades are forged from a meteor that struck the Goddess Kasie in the shoulder. These blades are able to destroy magic, even the strongest of spells will be destroyed. These blades are used mostly to destroy tattoos, freeing the powers within. This blade can also be used to disarm powers for a time.",
    "ItXI1Da" : "The X of forgotten knowledge belongs to a civilization long ago. The knowledge it holds is kept in a crystal that is currently missing.",
    "KeTS1Ss" : "Gen 1. The True-Self key is also known as the mind key, for its mental powers. When inserted into anything and twisted to the left, this key will reveal the true self of the being/object. All shapeshift or other non-natural effects will vanish. This ability is most known to stop Monster Key’s powers and return the person to their normal state of being. When you twist this key to the right, a door will appear. This door leads to the person’s mind, and the self-conscious of the person will appear next to the body of the person. The person is paralyzed and controls the self-conscious. You will be able to open the door, see memories and the mindscape of the person, and alter it as you seem fit.",
    "KeMR2Mi" : "Gen 1. The Monster key is used to create an army for the most part. When you insert the key into a person and twist it to the left, the person will become infected. This infection changes in a matter of things. If the person is whole, their mind will get scrambled, causing them to attack the first person they see. If the person is not whole, they will keep their minds, but they will be more aggressive. No matter how whole the infected are, they become super strong and fast. The degrees of these powers are based on their power level. If the key is turned to the right, then the person will be able to command the infected. They become puppets to their master. Any command that is long-term will continue after the key is taken out. Furthermore, the user can take over any body of the infected and issue commands from them.",
    "KeAM1Bd" : "Gen 2. The Any-Item key is used to turn items into other items. Whether a ball to a house, or a car to a pencil. These transformations are permanent till the key is used once more. When turning the key to the right and taking it out, whatever item the user thinks of will become in reality. When turning to the left it will undo whatever item was turned. (The key is using the Key Points system, or KP for short. KP the user has is = Spell casting modifier + Proficiency + Character level. You regenerate KP after a long rest. To turn this key left to undo a transformation it cost 2 KP, no matter the size. To turn an item to something of similar size it costs 3 KP. To make something bigger or smaller it costs 3 + how many sizes change. Some sizes are, Tiny, Small, medium, huge, giant. Tiny is baseball and smaller, small is a basketball, medium is human 5’9”, huge is a normal car size, and giant is a house and bigger. An example Baseball to a Basketball would take 4 KP. Baseball to a human size cutout would be 5 KP. House to a car would be 4 KP.)",
    "KeSy3Bd" : "Gen 3. The Shadow Key is used to animate shadows and travel through them. If the key is inserted into a shadow and turned to the left, the shadow will engulf you. Allowing you to travel through the shadows, (Cast Misty Step) using KP. If you turn the key to the right, you will summon a shadow creature that will do your bidding. These shadows have player lvl * 4 hp, and can do a claw attack. (Claws. Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: (2d6 + 4) slashing damage.) These creatures are able to get hit by physical damage, as they have a form. They can only last an hour from creation. (The key is using the Key Points system, or KP for short. KP the user has is = Spell casting modifier + Proficiency + Character level. You regenerate KP after a long rest. To travel the shadows takes 3KP, to summon a shadow it takes 5KP.",
    "ItDh2Bd" : "Dagger of the truth, Relic. The person not on the team, stabbed with this dagger can only tell the truth till long rest, if they answer a yes or no question or anything of the sort, they must follow through with it. Can be used twice a day.",
    "ItAh1TO" : "This necklace is the trophy to show that you are a Trusted member of the Trazoth Clan. After bonding with the necklace, while wearing it the user's intelligence is increased by 2.",
    "ItCr4Bd" : "Cranthor, Relic. A bow charged with the energies of nature, it is said to have been born from a mana tree, where empty magic is replenished. The wood itself doesn't create enough magic to be used, however it can generate it's own arrows infused with the elements. The range of the bow is 80/320, with damage being 2d6 for basic arrows. The bow can make unlimited white magic arrows, or explosive, ice, or nature arrows. The special arrows can be used 5 times a day, for each type. Explosive arrows are filled with more raw magic then the normal ones, the damage is now 3d6 + 2, all creatures around the impact will take 1d4 damage. Ice arrows will do 2d6 + 2 damage and half the movement of anyone hit for 1 minute. With nature arrows they do 2d6 damage, and restrains the person hit for 1 minute.",
    "ISIc1Du" : "The Ice Chest Plate is a chest plate imbued with the Ice Stones magic, giving 15 + Dex AC for medium armor. Build from the old Cursed Infused, this chest plate has different abilities for which stone it contains, each contains a passive ability and an active. While wearing this chest plate you feel cold, while it is isolated, not all of the cold can be contained. Where ever you touch there will be ice crystals and frost. Furthermore, if you touch any liquids they will freeze up to 20 feet from you and will stay frozen for 1 hour, unless melted with magic. You also gain the active ability Ice Try. This ability can be used as much times as you have proficiency bonus. As a reaction to getting hit, you will expand the cold within your chest plate, this cold will travel to the one who hit you within 5 feet. This cold will freeze the opponent for 1 turn rotation skipping their next turn."
}; //Writes our all the descriptions

let img =
{
    "ItSM0GA" : "images/items/bladeOfStarMagic.png",
    "ItXI1Da" : "images/items/xOfForgoten.png",
    "KeTS1Ss" : "images/items/TSKey.png",
    "KeMR2Mi" : "images/items/MRKey.png",
    "KeAM1Bd" : "images/items/KeAM1Bd.png",
    "ItDh2Bd" : "images/items/ItDh2Bd.png",
    "KeSy3Bd" : "images/items/KeSy3Bd.png",
    "ItAh1TO" : "images/items/ItAh1TO.png",
    "ItCr4Bd" : "images/items/ItCr4Bd.png",
    "ISIc1Du" : "images/items/ISIc1Du.png"
}; //Gets all the images
