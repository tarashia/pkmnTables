// ==UserScript==
// @name         PKMN table conversion
// @version      1
// @grant        none
// @match        https://pokefarm.com/forum/post/*
// ==/UserScript==

header = document.querySelector('.forumpost .bbcode h2');
if(header.innerText.includes('Pokemon in Tables')) {
    button = document.createElement('button');
    button.innerText = 'Convert';
    button.style = 'margin-left: 0.3em';
    header.append(button);

    button.onclick = runConvert;
}

function runConvert() {
    console.log('Converting');
    tables = document.querySelectorAll('table');
    codes = document.querySelectorAll('.code .panel > div');
    pkmnRegex = /\[pkmn=([^\]]+)\]/gm;
    imgRegex = /static\.pokefarm\.com(\/img\/pkmn[^\.]+\.png)/;
    newCodes = [];
    for(i=0; i<codes.length; i++) {
        tiles = tables[i].getElementsByTagName('td');
        newCodes[i] = '';
        matches = codes[i].innerText.split(pkmnRegex);
        for(j=0; j<matches.length; j++) {
            if(j%2 == 0) { // even indexes contain table bbcode etc
                newCodes[i] += matches[j];
            }
            else { // odd indexes contain pkmn names
                tileIndex = Math.floor(j/2);
                imgCode = tiles[tileIndex].innerHTML.match(imgRegex)[1];
                newCodes[i] += '[img]'+imgCode+'[/img][*'+matches[j]+'*]';
            }
        }
    }
    openModal();
    modalContents = document.getElementById('custom-modal-contents');
    for(i=0; i<newCodes.length; i++) {
        txtBox = document.createElement('textarea');
        txtBox.value = newCodes[i];
        txtBox.style = 'margin-top: 1em; width: 100%;'
        txtBox.rows = '5';
        modalContents.append(txtBox);
    }
}


function openModal() {
    let modal = document.createElement('div');
    modal.className = 'dialog';
    let dialogContents = '<div><div><div><h3>Converted Codes</h3><div style="margin:0.5em;">'
        + '<div id="custom-modal-contents" style="margin-bottom: 1em;"></div>'
        + '<button id="custom-modal-close" type="button" style="float: right;">Close</button>'
        + '</div></div></div></div>';
    modal.innerHTML = dialogContents;
    document.body.append(modal);
    document.getElementById('core').classList.add('scrolllock');
    document.getElementById('custom-modal-close').onclick = function() { closeModal(modal); }
}

function closeModal(modal) {
    modal.remove();
    document.getElementById('core').classList.remove('scrolllock');
}