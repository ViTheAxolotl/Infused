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
    "ep1" : "We begin the campaign in The Dull Knife Bar. After everyone appeared/walked in, Prince Grado introduced himself and failed at getting to know the party. He then discussed the mission and gave the keys to the Holiday Inn rooms. The party drank a bit and argued about the galaxy and its meaning. After waking up they arrive at a rundown carriage pulled by 2 stallions. The party then took to the road. After a couple of hours, you take a break to eat by the lake. The Grado decides right now is a good time to swim. Stripping to his crown undies, he jumps into the water. Just in time to get ambushed by bandits. With Razor obliterating 2 of them, the battle went smoothly. Then some dreams and back to the road they went. As two giant bears with bones coming out of their bodies, with Nibbly pull vaulting techniques they were killed. But they took a horse down with them. The party then found out they were creatures called MagicVoid that hunger for magic. Arriving at the gates to Salatude, the party bullied the gateman. And got some shopping in before the ball, or should we say rave. Prince Thallos switched the theme to get his grinding on. After meeting some interesting people, a murder was discovered, now the party must find the killer so they can leave the ball.",
    "ep2" : "We started at the ball after the murders. The party was told by a guard if they turned in the culprit they would be paid. So they went to ask questions of the 4 suspects. After inspecting the bodies, they learned they were killed by magic. However, they didn't catch the murderer in time as he went to kill the prince. As one of the guards shot the fairy out of the air he dropped a crystal. The party then decided to start heading home and had some dreams. Then they went and got jumped by some bandits where Leonier & Razor went down for a spell. Grado after noticing how none of them fully died decided to offer them a job working for the castle. So they went to the castle, met some people, and got a cottage as long as they had a quest going. Some hijinks with Leoiner’s bed, and buying spices and food. And they settled in and slept. Wake up to find the job board has some jobs and got their team name ‘The Crimson Fatales’. Accepting both the missing people and MV attack quest and taking off after eating their free meal Nook attacks a waitress. On the road, they were offered a ride on a carriage and murdered all the bandits in sight.",
    "ep3" : "The episode begins after the fight with the cart. The party took all of the bodies out and left them on the ground. They then took to the road, and after a day of travel, they came up to a young girl running away from 3 people.  They looked like the generic bandits, but they were different. With one shooting magic, and another with a golden 'T' on his shirt who used a stone to transform into a bear. This girl while not having much attacking ability was proficient in healing. After defeating these 3, they found out the girl's name was Sky.  She didn't remember much of anything, all she knew was she was trying to find her mom. But she doesn't know anything of Jaun, she appears to be from the Feywilds. They then made it to the city of Lake View. With an exiled alchemist who tried to poison his wife trying to come back in. Anyways, the group made it into the city and met with the mayor. She tells them of the MV who was been attacking the town every day for the last 15 days. She had some field researchers investigate it, but they didn't return. The MV stole a pyramid that allowed it to change its shape from them. The MV fused with the object giving it 3 different forms. They went to the cave and fought it, as they found out Sky has a dragonoid form she can go into with her stone. They managed to beat it as it became black goo, and Nook found the object. They went back and got the reward of gold, a warp crystal that was out of magic, and a spa day all paid for. They also got a quest to find missing items, from some of the residents. They found out it was a girl with red hair a blue cloak and puke green shoes. This person stole an old wooden wand that keeps tempo, a magical hair brush that detangles hair, and a rare mixer that can mix any ingredients. Leoneir saw their 'uncle' Fargate, and he offered her blueberry pie thinking it was her favorite. They then slept in his inn and had dreams, and Nook shot a laser.",
    "ep4" : "Nook goes on a stakeout to find the thief, while Leonier and Nibbly go to the College of Magic to get Nibbly's key identified. After finding out the Wizard was cheating in a gambling game, Nibbly blackmailed him to give a discounted price on the identity. They then joined up to find the thief was sitting at his table. When he got up he robbed Nibbly of the key and gold. The party managed to catch him and made him tell them why he steals. They found out he was 8th in line for the throne from the Kingdom of Slarus' Coast, he was stealing for the thrill of it all. He then trapped Nibbly and Leonier in his lair. But with Nook being on top of him, she was able to transform into a spider and bite his head off of him. They then returned the items. Then they enjoyed a spa day and had some hijinks. Then they went to bed and had a shared dream. Then off to Lake View to find out what happened to the mayor and bring him back. When they arrived, everyone avoided the party. At the bar, they realized it was because when Nook and Nibbly left this town, people became missing. However, Mal the barkeep believed they were innocent. He believed that the Mayor's brother had something to do with it. Since he gained the most benefit from the disappearance, with almost 2 weeks passing since the disappearance, his brother would take the mayor slot. The party was informed that the brother sponsored the black market, which has high death tolls. Mal gave the party the brother's address, and they went to interrogate him. They broke into his house and threatened him to get the info. They found out that he hired someone to roughen up his brother. They went to the hired hand's blackjack booth, made lots of gold, and stole the hired hand, Skinin, contracts. Showed the barkeep, then returned to get info out of Skinin. But Skinin peaced the scene, leaving one of his workers as a scapegoat. They rescued the mayor from under the tree and put the brother in jail.",
    "ep5" : "The party was walking away from the mayors house when an earth quake happened causing everyone except Leonier to fall down and get hurt. The party healed and a panicked mother came asking for help to find her daughter. The party went the her last known location and found a trial for intelligence and instincts. They managed to beat it and got a magical necklace and a whip sword. And they are now trusted members of the Trazoth Clan. They then found out that the daughter wasn’t in the trail but was on the other side of the building picking flowers. They got paid and went off. Nibbly and Nook had a dream giving a quest to save Fae that are being experimented on and drained of magic. And Razor got a dream to make sure the Map Maker dies or else. When Razor spoke of this dream, Leonier was worried and told the party she has been having this voice in her head for a couple months and that it also wanted the map maker dead since he was going to find out that Leonier was creating the MagicVoid monsters. They then got the map maker into the cottage and killed him before he could deliver the map. Jac’u asked the party if they seen him, and the party said they didn’t. So Jac’u went to go check up on his twin children, since he was a single dad. The party is now on track to go to Firetown, Solatude to save the fae. But got stoped at a carnival. Nook horses the strength test worker and Nibbly won the test. They went to the scare house and uncovered some sinister stuff happening. Some of the carnival goers have been captured and drained of blood and missing body parts. They saved a little girl who was locked up and drained for 3 days.",
    "ep6" : "The party started at the carnival. They managed to bring the kid to Sky and she healed her wounds. While Nook embraced her inner Karen to get the ring master to come over. Claiming she was turned small in the tent. When the party group up once more they took down the Vamps. Found out Leonier had a hole going straight through her heart and stole from the worker’s weekly pay. Explained death and religion, and that the girl will never see her moms again. She cried and then slept. And to the road to Firetown, they went. When they got closer, both Nook and Sky lost their memories and tried to flee. Sky was thrown in the air as Nook and Nibbly had an all-out brawl. After Nook woke up in a jar, she was able to recall everything. But had this haze over her, while they helped Sky remember the power of friendship. They continued on their way. Till they reached the gate of this town that's on fire. Spared with a robot owned by Firing Co. And went in, leaving Sky and the kid in the cart. Went to a speech by the CEO promising to give unlimited magic to his Loya customers, so Firetown will live on past the apocalypse. Found out all the smoke from the building and stuff is being pulled into the factory. And we ended up outside the Firing Co. building."
};

let expandName =
{
    "ep1" : "Travels to Salatude",
    "ep2" : "The Crimson Fatales",
    "ep3" : "The Shapeshifting MagicVoid",
    "ep4" : "Misconceptions",
    "ep5" : "The Map Maker’s Demise",
    "ep6" : "The Town of Fire"
};