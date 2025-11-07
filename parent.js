import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js'; 
import { auth, database } from './js/viMethods.js';
import { setMode, setWholeCustom, setWholeDB, setWholeChar, setWholeTO, setWholeSummons, setWholeBubbles } from './src/map.js';
import { setPlayer, setWholeTOCont, setWholeInteractive, setWholeCharCont, setWholeCustomCont, setWholeDBCont, setWholeDisplay, setWholeQuests } from './js/mapControler.js';

export let wholeCustom = {};
export let wholeBubbles = {};
export let wholeChar = {};
export let wholeDB = {};
export let wholeDisplay = {};
export let wholeInteractive = {};
export let wholePre = {};
export let wholeQuests = {};
export let wholeSummons = {};
export let wholeTO = {};
export let imgs = {};
export let wholeActions = {};
export let wholeSpells = {};

onAuthStateChanged(auth, (user) => 
{
    if (!user) 
    {
        alert("You need to login before using this resource. Click Ok and be redirected, -map.html");
        window.location.href = "loginPage.html?map.html"; 
    } 

    else
    {
        setMode(auth);
        setPlayer(auth);
    }
});

fetch('https://vitheaxolotl.github.io/Infused/src/files.json').then(res => res.json()).then((json) => imgs = json);
fetch('https://vitheaxolotl.github.io/Infused/src/actions.json').then(res => res.json()).then((json) => wholeActions = json);
fetch('https://vitheaxolotl.github.io/Infused/src/spells.json').then(res => res.json()).then((json) => wholeSpells = json);

const customsRef = ref(database, 'customImages/');
onValue(customsRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeCustom = data;
    setWholeCustom(data);
    setWholeCustomCont(data);
});

const currentMapRef = ref(database, 'currentMap/');
onValue(currentMapRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeDB = data;
    setWholeDB(data);
    setWholeDBCont(data);
});

const charRef = ref(database, 'playerChar/');
onValue(charRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeChar = data;
    setWholeChar(data);
    setWholeCharCont(data);
});

const currentTORef = ref(database, 'currentTO/');
onValue(currentTORef, (snapshot) => 
{
    const data = snapshot.val();
    wholeTO = data;
    setWholeTO(data);
    setWholeTOCont(data);
});

const summonsRef = ref(database, 'playerChar/Vi/summons');
onValue(summonsRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeSummons = data;
    setWholeSummons(data);
});

const bubbleRef = ref(database, 'bubbles');
onValue(bubbleRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeBubbles = data;
    setWholeBubbles(data);
});

const interactiveRef = ref(database, 'playerChar/Vi/interactive');
onValue(interactiveRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeInteractive = data;
    setWholeInteractive(data);
});

const displayRef = ref(database, 'display/');
onValue(displayRef, (snapshot) => 
{
    const data = snapshot.val();
    wholeDisplay = data;
    setWholeDisplay(data);
});

const questRef = ref(database, `playerChar/Vi/quests/`);
onValue(questRef, (snapshot) =>
{
    const data = snapshot.val();
    wholeQuests = data;
    setWholeQuests(data);
});

const presetRef = ref(database, 'preset/');
onValue(presetRef, (snapshot) => 
{
    const data = snapshot.val();
    wholePre = data;
});