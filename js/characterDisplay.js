"use strict";
import { reload } from '../js/viMethods.js';

/**
 * Runs when js is started up
 */
function init()
{
    let characters = document.getElementsByTagName("button"); //Gets all character buttons

    for (let char of characters) //For all the characters in the character buttons
    {
        char.onclick = handleCharacterButton;
    }

    characters[characters.length - 2].onclick = handleBringToTop;
    characters[characters.length - 1].onclick = handleReset;
}

/**
 * Once a character is clicked it will display their information
 */
function handleCharacterButton()
{
    let txtBox = document.getElementById("description");
    let image = document.getElementById("charImg");
    let nameTxt = document.getElementById("name");
    
    txtBox.innerHTML = charStories[this.id]; //Display will show their backstory
    image.style.display = "block";
    image.src = charImg[this.id]; //Changes the image to theirs
    nameTxt.innerHTML = [this.id]; //Changes the title to their name
    document.getElementById("display").scrollIntoView({behavior: 'smooth'}); //Moves the view to their backstories
}

/**
 * Allows the button to move the view to the top of the page
 */
function handleBringToTop()
{
    document.getElementById("header").scrollIntoView({behavior: 'smooth'});
}

function handleReset()
{
    reload(.1);
}

window.onload = init; //Once the page loads run init

let charStories = 
{
    "Nook" : "",
    "Nibbly" : "",
    "Leonier" : "",
    "Razor" : "<p>𝘼𝙜𝙚: 𝟸𝟺 𝙂𝙚𝙣𝙙𝙚𝙧: 𝙵𝚎𝚖𝚊𝚕𝚎 𝙍𝙖𝙘𝙚: 𝙷𝚞𝚖𝚊𝚗 𝘾𝙡𝙖𝙨𝙨: 𝚆𝚒𝚣𝚊𝚛𝚍 </p><p> 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: 𝐀𝐭𝐭𝐞𝐦𝐩𝐭𝐢𝐧𝐠 𝐭𝐨 𝐮𝐧𝐝𝐞𝐫𝐬𝐭𝐚𝐧𝐝 𝐭𝐡𝐞 𝐚𝐬𝐩𝐞𝐜𝐭 𝐨𝐟 𝐭𝐡𝐞 𝐝𝐞𝐞𝐩𝐞𝐫 𝐮𝐧𝐢𝐯𝐞𝐫𝐬𝐞 𝐚𝐫𝐨𝐮𝐧𝐝 𝐡𝐞𝐫. 𝐒𝐡𝐞'𝐬 𝐭𝐚𝐤𝐞𝐧 𝐚 𝐪𝐮𝐢𝐭𝐞 𝐥𝐨𝐧𝐠 𝐭𝐢𝐦𝐞 𝐭𝐨 𝐬𝐭𝐮𝐝𝐲 𝐦𝐚𝐧𝐲 𝐟𝐨𝐫𝐦𝐬 𝐨𝐟 𝐦𝐚𝐠𝐢𝐜, 𝐥𝐢𝐭𝐞𝐫𝐚𝐭𝐮𝐫𝐞, 𝐡𝐢𝐬𝐭𝐨𝐫𝐲 𝐚𝐧𝐝 𝐞𝐯𝐞𝐧 𝐬𝐜𝐢𝐞𝐧𝐜𝐞. 𝐒𝐡𝐞 𝐰𝐢𝐬𝐡𝐞𝐬 𝐭𝐨 𝐬𝐞𝐞 𝐭𝐡𝐞 𝐞𝐧𝐝𝐬 𝐨𝐟 𝐭𝐡𝐞 𝐮𝐧𝐢𝐯𝐞𝐫𝐬𝐞 𝐚𝐧𝐝 𝐞𝐱𝐩𝐥𝐨𝐫𝐞 𝐚𝐬 𝐦𝐮𝐜𝐡 𝐚𝐬 𝐬𝐡𝐞 𝐜𝐚𝐧. 𝐋𝐨𝐨𝐤𝐢𝐧𝐠 𝐟𝐨𝐫𝐰𝐚𝐫𝐝 𝐭𝐨 𝐛𝐞 𝐜𝐨𝐧𝐬𝐢𝐝𝐞𝐫𝐞𝐝 𝐬𝐨𝐦𝐞𝐰𝐡𝐚𝐭 𝐨𝐟 𝐚 𝐇𝐞𝐫𝐨. 𝐄𝐲𝐞𝐬 𝐜𝐡𝐚𝐧𝐠𝐞 𝐢𝐧 𝐭𝐡𝐢𝐬 𝐨𝐫𝐝𝐞𝐫 𝐛𝐚𝐬𝐞𝐝 𝐨𝐧 𝐚𝐧𝐠𝐞𝐫 (𝐑𝐞𝐝-𝐎𝐫𝐚𝐧𝐠𝐞-𝐘𝐞𝐥𝐥𝐨𝐰-𝐒𝐢𝐥𝐯𝐞𝐫-𝐏𝐮𝐫𝐩𝐥𝐞-𝐁𝐥𝐮𝐞)*</p>",
    "Jac'U" : "Jac'U is the girl who interviewed and put up the flier for the escort job. Jac'U has always worked with the royal family, she is well-liked in the console. She is also a Foreign Relations expert, she can speak many of Zaydia's languages fluently. She spends most of her time learning about other places and their culture. She has friends from all over.",
    "Grado" : "Grado is the prince of Havenport, the only child of the king. Grado tries his best to serve his kingdom in any way he can. He created the Clean Food & Water Act to help those who can't afford food. He helped open homeless centers in each of his towns. Many people don't like him, they hate that their tax money goes to the freeloaders. Multiple assassin attacks happened in recent years, causing Grado to have to be more careful. He still tries to be wild and have fun, even with some moles in his castle.",
    "Thallos" : "Prince Thallos is one of the wildest royals. Could it be his Succubus ways or the fact that he is the only one of his family 'left'? Thallos has his dads and his sister, however they are all MIA. King Alm went to go find his husband and daughter, leaving Thallos as the only one in charge of Salatude. It has been over 40 years since King Alm's disappearance, however, Thallos has not taken on the king's role. In his words, 'Where is the fun in that, I don't want to be one of those boring rulers. My Kingdom is prospering with me as the ruler, prince or king, doesn't matter.'",
    "Haven" : "Haven is the person who messagers go to. He takes all the letters and info and distributes it to the right people. Haven is also in charge of the mail throughout Castle Havenport. He has the office space next to him to store mail until his associates take it. He spends most of his time sorting mail by importance and category. He was raised by his father, and when his father passed he took over the family business in the castle. The party will need to talk with him to sign up for the quest, he will get the final say on all quest-related matters.",
    "Laura" : "Laura is the residential/housing lead, not much is known about her. She seems to be close with some of the guards. Even though she doesn't get paid much, she lives in the biggest house and takes many vacations. Something feels off about her, but you can't quite place your finger on it.",
    "Sky" : "Sky is a young girl who lost her memory. She is looking for her mother.",
    "Mal" : "Mal is the Bar/Innkeep of Lago. He cares for each of his patrons, not only for their gold. He listens to all their woes, and he tries to confers them. By doing this he doesn't only have loyal customers, but he learns what is happening around town. If you need any information, Mal is where you should start.",
    "Skinin" : "Skinin is an assassin for hire.",
    "Cliven" : "Cliven is the mayor of Lake View, she is also a part-time college student at Stavin University. She spends most of her time reading and learning about magic/magical objects. She is the best friend of the Royal Scientist, she tries to help him with what she can. Her people look up to her and aspire to be just like her.",
    "Fargate" : "Fargate is the owner of the Tiger's Pub. He left the village, needing to get out and find himself. He opened his bar in Lago, and quickly made friends with the locals. He was like an uncle to Leonier, being there for events and making food and baked goods for him and the village.",
    "Grain" : "Grain is the 8th in line at Slarus' Coast, he is a petty theif.",
    "Howard" : "Howard is the mad scientist of Castle Havenport, he uses what he finds to help anyone he can. His great-great-grandpa was one of the people King Alm brought from Main to help his kingdom grow and advance. Howard's family has been loyal to the king ever since, but when he vanished, Howard found other employment. Working for Castle Havenport.",
    "Jallion" : "Jallion is the royal map maker of Havenpont. He travels all around and gathers diffrent satistics to base his maps off of. From the most danagerous places to poverty, he has a map showing where and intesity. Resently Prince Grado and some other nearby kingdoms asked him to make a map of high density of MagicVoid. Grado hopes this could be used to find safer routes and what drives their migrations.",
    "Slavve" : "King Slavve is the figurehead of Havenport, however, all he does is sign the papers he is told to. His son, Grado, handles everything in the kingdom. Slavve isn't the man he used to be, he used to be the active king who would go on quests and adventures to benefit his kingdom. That all changed when his husband of 35 years died in battle, the king took it hard. Now he barely leaves his bed, the only time he leaves is to eat. This is because the staff refuses to let him stay in his bed all day. They will not serve food to him in his bed with him only wearing underwear.",
    "Harold" : "Harold the CEO of Firetown has promised to deliver unlimited magic to his loyal customers. The magic seems to be fey magic."
}; //Backstories

let charImg = 
{
    "Nook" : "images/characters/Nook.jpg",
    "Nibbly" : "images/characters/Nibbly.png",
    "Leonier" : "images/characters/Leonier.png",
    "Razor" : "images/characters/Razor.jpg",
    "Jac'U" : "images/npcs/Jac'U.jpg",
    "Grado" : "images/npcs/Grado.jpeg",
    "Thallos" : "images/npcs/princeThallos.PNG",
    "Haven" : "images/npcs/questGiverHaven.PNG",
    "Laura" : "images/npcs/resLaura.PNG",
    "Sky" : "images/npcs/feySkyHuman.PNG",
    "Mal" : "images/npcs/barkeepMal.PNG",
    "Skinin" : "images/npcs/skinin.png",
    "Cliven" : "images/npcs/mayorCliven.PNG",
    "Fargate" : "images/npcs/tigersPubFargate.PNG",
    "Grain" : "images/npcs/princeGrain.PNG",
    "Howard" : "images/npcs/madHoward.PNG",
    "Jallion" : "images/npcs/Jallion.PNG",
    "Slavve" : "images/npcs/kingSlavve.PNG",
    "Harold" : "images/npcs/firetownHarold.PNG"
} //Images