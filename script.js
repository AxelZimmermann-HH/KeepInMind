let headlines = [];
let notes = [];
let deletedHeadlines = [];
let deletedNotes = [];
let favHeadlines = [];
let favNotes = [];

load();


function showAddLayer() {
    document.getElementById('addNote').classList.remove('d-none');
}


function removeAddLayer() {
    document.getElementById('addNote').classList.add('d-none');
    document.getElementById('writeTitle').value = '';
    document.getElementById('writeNote').value = '';
}


function showEditLayer() {
    document.getElementById('editNote').classList.remove('d-none');
}


function removeEditLayer() {
    document.getElementById('editNote').classList.add('d-none'); 
}


function render() {

    document.getElementById('trashCan').src = "img/trash-red.svg";
    
    let content = document.getElementById('library');
    content.innerHTML = ``;
    
    for (let i = 0; i < headlines.length; i++) {
        content.innerHTML = generateNote(i) 
            + content.innerHTML;
        };

    document.getElementById('home').src = 'img/home-black.svg'
}

/*Generiert String mit HTML-Code für render()*/
function generateNote(i) { //Diese Variable bezieht sich auf DIESE Funktion. Wir wollen i in render() übertragen. i muss nur in dieser Funktion stimmig sein.
    return `
    <div class="smallNote">  
        <div class="smallIcons">
            <img id="star" onclick="prio(${i})" src="img/star-regular.svg" alt="">
            <img onclick="editNote(${i})" src="img/edit.svg" alt="">
            <img onclick="removeNote(${i})" src="img/trash-red.svg" alt="">
        </div>
        <h1>${headlines[i]}</h1>
        <div class="line"></div>
        <p>${notes[i]}<p>

    </div>`
}


function renderFav() {

    let favContent = document.getElementById('favs');
    favContent.innerHTML = '';
    
    for (i = 0; i < favHeadlines.length; i++) {
        favContent.innerHTML = `
            <div class="smallNoteFav">  
                <div class="smallIcons">
                    <img id="star" onclick="unPrio(${i})" src="img/star-solid.svg" alt="">
                    <img onclick="editFavNote(${i})" src="img/edit.svg" alt="">
                    <img onclick="removeFavNote(${i})" src="img/trash-red.svg" alt="">
                </div>
                <h1>${favHeadlines[i]}</h1>
                <div class="line"></div>
                <p>${favNotes[i]}<p>
    
            </div>` 
            + favContent.innerHTML;
        };
}


function showTrash() {
    
    document.getElementById('trashCan').src = "img/trash-black.svg";
    document.getElementById('home').src = 'img/home-red.svg'

    document.getElementById('favs').innerHTML = '';

    let content = document.getElementById('library');
    content.innerHTML = '';
    
    for (a = 0; a < deletedHeadlines.length; a++) {
        content.innerHTML = /*html*/`
            
            <div class="smallNote">  
                <div class="smallIcons">
                    <img onclick="restore(${a})" src="img/restore.svg" alt="">
                    <img onclick="removeCompletely(${a})" src="img/trash-red.svg" alt="">
                </div>
                <h1>${deletedHeadlines[a]}</h1>
                <div class="line"></div>
                <p>${deletedNotes[a]}<p>
    
            </div>` 
            + content.innerHTML;
        };
}


function addNote() {
    let myHeadline = document.getElementById('writeTitle').value;
    let myNote = document.getElementById('writeNote').value;
    let myNoteFormat = myNote.replace(/\n/g, '<br>');
    
    if (myHeadline.length < 1) {
        headlines.push('Kein Betreff')
    }   else {
            headlines.push(myHeadline);
        };

    if (myNoteFormat.length < 1) {
        notes.push('Kein Inhalt')
    }   else {
            notes.push(myNoteFormat);
        }; 

    render();
    removeAddLayer();
    save();
}

/*Die JEWEILIGE Headline (i) wird aus dem Array gelöscht und zu den Favoriten hinzugefügt.*/ 
function prio(i) { 
    favHeadlines.push(headlines[i]);
    favNotes.push(notes[i]);

    headlines.splice(i, 1);
    notes.splice(i, 1);
    
    render();
    renderFav();
    save();
}


function unPrio(i) {
    headlines.push(favHeadlines[i]);
    notes.push(favNotes[i]);

    favHeadlines.splice(i, 1);
    favNotes.splice(i, 1);

    render();
    renderFav();
    save();
}


function removeNote(position) {
    let delHeadline = headlines[position];
    let delNote = notes[position];

    deletedHeadlines.push(delHeadline);
    deletedNotes.push(delNote);
    
    headlines.splice(position, 1);
    notes.splice(position, 1);

    render();
    save();
}


function removeFavNote(position) {
    let delHeadline = favHeadlines[position];
    let delNote = favNotes[position];

    deletedHeadlines.push(delHeadline);
    deletedNotes.push(delNote);
    
    favHeadlines.splice(position, 1);
    favNotes.splice(position, 1);

    renderFav();
    save();
}


function restore(position) {
    let resHeadline = deletedHeadlines[position];
    let resNote = deletedNotes[position];

    headlines.push(resHeadline);
    notes.push(resNote);

    deletedHeadlines.splice(position, 1);
    deletedNotes.splice(position, 1);

    if (deletedHeadlines.length > 0) {
        showTrash();
        save();
    } else {
        render();
        renderFav();
        save();
    }
}


function removeCompletely(position) {
    if (deletedHeadlines.length > 1) {
        deletedHeadlines.splice(position, 1);
        deletedNotes.splice(position, 1);

        showTrash();
        save();
    } else {
        deletedHeadlines.splice(position, 1);
        deletedNotes.splice(position, 1);

        render();
        renderFav();
        save();
    }
}


function editNote(i) {
    showEditLayer();
    let content = document.getElementById('editNote');
    content.innerHTML = ``;
    content.innerHTML += `
        <div class="innerLayer">
            <input type="text" id="writeTitle2" placeholder="Titel">
            
            <textarea id="writeNote2" placeholder="Notiz schreiben..."></textarea>
            
            <div class="icons">
                <img onclick="removeEditLayer()" src="img/xmark.svg" alt="">
                <img onclick="saveChange(${i})" src="img/check.svg" alt="">
            </div>
            
        </div>
        `;

    let nh = notes[i];
    let nhf = nh.replace(/<br\s*\/?>/gi, '\n');
    document.getElementById('writeTitle2').value = `${headlines[i]}`;
    document.getElementById('writeNote2').value = `${nhf}`;
}


function editFavNote(i) {
    showEditLayer();
    let content = document.getElementById('editNote');
    content.innerHTML = ``;
    content.innerHTML += `
        <div class="innerLayer">
            <input type="text" id="writeTitle2" placeholder="Titel">
            
            <textarea id="writeNote2" placeholder="Notiz schreiben..."></textarea>
            
            <div class="icons">
                <img onclick="removeEditLayer()" src="img/xmark.svg" alt="">
                <img onclick="saveFavChange(${i})" src="img/check.svg" alt="">
            </div>
            
        </div>
        `;

    let nh = favNotes[i];
    let nhf = nh.replace(/<br\s*\/?>/gi, '\n');
    document.getElementById('writeTitle2').value = `${favHeadlines[i]}`;
    document.getElementById('writeNote2').value = `${nhf}`;
}


function saveChange(i) {
    headlines.splice(i, 1);
    notes.splice(i, 1);

    let newHeadline = document.getElementById('writeTitle2').value;
    let newNote = document.getElementById('writeNote2').value;
    let newNoteFormat = newNote.replace(/\n/g, '<br>');    

    headlines.splice(i, 0, newHeadline);
    notes.splice(i, 0, newNoteFormat);

    removeEditLayer();

    render();
    save();
}


function saveFavChange(i) {
    favHeadlines.splice(i, 1);
    favNotes.splice(i, 1);

    let newFavHeadline = document.getElementById('writeTitle2').value;
    let newFavNote = document.getElementById('writeNote2').value;
    let newFavNoteFormat = newFavNote.replace(/\n/g, '<br>'); 

    favHeadlines.splice(i, 0, newFavHeadline);
    favNotes.splice(i, 0, newFavNoteFormat);

    removeEditLayer();

    render();
    renderFav();
    save();
}


function save() {
    let headlinesAsText = JSON.stringify(headlines); //Array in formatierten Text umwandeln
    let notesAsText = JSON.stringify(notes);
    let deletedHeadlinesAsText = JSON.stringify(deletedHeadlines);
    let deletedNotesAsText = JSON.stringify(deletedNotes);
    let favHeadlinesAsText = JSON.stringify(favHeadlines);
    let favNotesAsText = JSON.stringify(favNotes);
    localStorage.setItem('headlines', headlinesAsText); //speichern, erst angezeigter Name, dann Array
    localStorage.setItem('notes', notesAsText);
    localStorage.setItem('deletedHeadlines', deletedHeadlinesAsText);
    localStorage.setItem('deletedNotes', deletedNotesAsText);
    localStorage.setItem('favHeadlines', favHeadlinesAsText);
    localStorage.setItem('favNotes', favNotesAsText);
}


function load() {
    let headlinesAsText = localStorage.getItem('headlines');
    let notesAsText = localStorage.getItem('notes');
    let deletedHeadlinesAsText = localStorage.getItem('deletedHeadlines');
    let deletedNotesAsText = localStorage.getItem('deletedNotes');
    let favHeadlinesAsText = localStorage.getItem('favHeadlines');
    let favNotesAsText = localStorage.getItem('favNotes');
    if (headlinesAsText && notesAsText && deletedHeadlinesAsText && deletedNotesAsText && favHeadlinesAsText && favNotesAsText) {   //Prüfung, ob im local storage die Arrays existieren
        headlines = JSON.parse(headlinesAsText);
        notes = JSON.parse(notesAsText);
        deletedHeadlines = JSON.parse(deletedHeadlinesAsText);
        deletedNotes = JSON.parse(deletedNotesAsText);
        favHeadlines = JSON.parse(favHeadlinesAsText);
        favNotes = JSON.parse(favNotesAsText);
    }
}
