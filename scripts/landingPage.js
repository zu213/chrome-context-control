let draggingItem = null;
var includedListDetails;
var excludedListDetails;

const cross = `<svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
  <line x1="1" y1="1" x2="7" y2="7" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <line x1="7" y1="1" x2="1" y2="7" stroke="white" stroke-width="2" stroke-linecap="round"/>
</svg>`
const defaultIncludedListDetails = ['Back', 'Forward', 'Reload', 'hr' , 'Save','Print','Copy','Paste', 'hr','Source','Inspect'];

// Main setup
window.addEventListener('load', async function () {
    includedListDetails = await getStorageValue("chromeContextControlIncluded");
    excludedListDetails = await getStorageValue("chromeContextControlExcluded");

    populateLists();
    // Add list event listeners for dragging
    document.querySelectorAll('.sortable-list').forEach(list => {
        list.addEventListener('dragover', event => {
            event.preventDefault();
        });
    
        list.addEventListener('drop', event => {
            event.preventDefault();
            const oldItem = document.querySelector('.dragging');
            const newItem = document.createElement('li');
            newItem.innerHTML = oldItem.innerHTML;
            addItemListeners(newItem);
            newItem.classList.add('sortable-item');
            newItem.draggable = 'true';
            addItemToList(list, newItem, event.pageY);
            oldItem.remove();
        });
    });

    // Buttons have to be done this way for chrome
    document.getElementById("saveButton").addEventListener("click", function() {
        saveMenu();
    });

    document.getElementById("resetButton").addEventListener("click", function() {
        resetToDefault();
    });

    document.getElementById("addHrButton").addEventListener("click", function() {
        addNewListItem(document.getElementById('included'),'hr');
    });

    document.getElementById("submitButton").addEventListener("click", function() {
        submitItem();
    });
})

// List moving functions
function addItemToList(list, item, y){
    // insert the element above where you hovered
    const listItems = list.querySelectorAll('.sortable-item');
    var chosenItem;
    for(const listItem of listItems){
        const box = listItem.getBoundingClientRect();
        if(y < box.y){
            chosenItem = listItem;
            break;
        }
    }
    if(chosenItem){
        list.insertBefore(item, chosenItem);
    }else{
        // Append to the end of the list
        list.appendChild(item);
    }
}

// helper functions
function addItemListeners(item) {
    item.addEventListener('dragstart', event => {
        event.dataTransfer.setData('text/plain', event.target.outerHTML);
        event.target.classList.add('dragging');
    });
}

function addNewListItem(list, details) {
    const element = document.createElement('li');
    element.classList.add('sortable-item');
    element.draggable = "true";
    element.innerHTML = `
    <div>
        ${details}
        ${details == 'hr' ? `<button id="deleteButton" class="primary-button action-button delete-button"><div>${cross}</div></button>` : ''}
    </div>`;
    addItemListeners(element);
    list.appendChild(element);
    if(details == 'hr'){
        element.addEventListener("click", function() {
            element.remove();
        })
    }
}

async function getStorageValue(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result[key]);
            }
        });
    });
}

// setup functions
function populateLists() {
    const includedList = document.getElementById('included');
    const excludedList = document.getElementById('excluded');
    // If they have no existing local storage populate with
    if(includedListDetails == null || excludedListDetails == null) {
        for(i of defaultIncludedListDetails){
            addNewListItem(includedList, i);
        }
        includedListDetails = defaultIncludedListDetails;
        excludedListDetails = [];
    }else{
        for(i of includedListDetails){
            addNewListItem(includedList, i);
        }
        for(i of excludedListDetails){
            addNewListItem(excludedList, i);
        }
    }
}

// button functions
function saveMenu() {
    const included = Array.from(document.getElementById('included').querySelectorAll('.sortable-item')).map(e => e.textContent.trim());
    const excluded = Array.from(document.getElementById('excluded').querySelectorAll('.sortable-item')).map(e => e.textContent.trim());
    chrome.storage.local.set({ chromeContextControlExcluded: excluded }, function() {
        console.log(`Set chromeContextControlExcluded = {${excluded}}`);
    });
    chrome.storage.local.set({ chromeContextControlIncluded: included }, function() {
        console.log(`Set chromeContextControlIncluded = {${included}}`);
    });
}

function resetToDefault() {
    chrome.storage.local.remove(['chromeContextControlExcluded']);
    chrome.storage.local.remove(['chromeContextControlIncluded']);
    window.location.reload();
}

async function submitItem() {
    const key = document.getElementById('codeKey').textContent;
    const code = document.getElementById('codeEditor').textContent;
    const obj = {};
    obj[key] = code;
    chrome.storage.local.set(obj, function() {
        console.log(`New context code saved`);
    });
    var existingKeys = await getStorageValue("chromeContextControlKeys");
    if(existingKeys){
        existingKeys += `,${key}`;
    } else {
        existingKeys = key;
    }
    chrome.storage.local.set({chromeContextControlKeys: existingKeys}, function() {
        console.log(`New context key saved: ${key}`);
    });
    addNewListItem(document.getElementById('included'), key);
    saveMenu();
}