let draggingItem = null;
var includedListDetails;// = localStorage.getItem("chromeContextControlIncluded")?.split(',');
var excludedListDetails;// = localStorage.getItem("chromeContextControlExcluded")?.split(',');



const defaultIncludedListDetails = ['Back', 'Forward', 'Reload','Save','Print','Copy','Paste','Source','Inspect']

window.addEventListener('load', async function () {

    includedListDetails = await getStorageValue("chromeContextControlIncluded");
    excludedListDetails = await getStorageValue("chromeContextControlExcluded");

    populateLists()
    // Add lsit event listeners
    document.querySelectorAll('.sortable-list').forEach(list => {
        list.addEventListener('dragover', event => {
            event.preventDefault();
        });
    
        list.addEventListener('drop', event => {
            event.preventDefault();
            const oldItem = document.querySelector('.dragging');
            const newItem = document.createElement('li');
            newItem.innerHTML = oldItem.innerHTML;
            addItemListeners(newItem)
            newItem.classList.add('sortable-item')
            newItem.draggable = 'true'
            addItemToList(list, newItem, event.pageY)
            oldItem.remove();
        });
    });

    document.getElementById("saveButton").addEventListener("click", function() {
        saveMenu()
    });

    document.getElementById("resetButton").addEventListener("click", function() {
        resetToDefault()
    });
})

function addItemToList(list, item, y){
    const listItems = list.querySelectorAll('.sortable-item')
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
        list.appendChild(item)
    }
}

function addItemListeners(item) {
    item.addEventListener('dragstart', event => {
        event.dataTransfer.setData('text/plain', event.target.outerHTML);
        event.target.classList.add('dragging');
    });

}

function addNewListItem(list, details) {
    const element = document.createElement('li')
    element.classList.add('sortable-item')
    element.draggable = "true"
    element.innerHTML = 
    `
    <div>
        ${details}
    </div>
    `
    addItemListeners(element)
    list.appendChild(element)
}

function populateLists() {
    const includedList = document.getElementById('included')
    const excludedList = document.getElementById('excluded')
    console.log(includedListDetails, excludedListDetails)
    // if they have no existing local storage populate with
    if(includedListDetails == null || excludedListDetails == null) {
        for(i of defaultIncludedListDetails){
            addNewListItem(includedList, i)
        }
        includedListDetails = defaultIncludedListDetails
        excludedListDetails = []
    }else{
        for(i of includedListDetails){
            addNewListItem(includedList, i)
        }
        for(i of excludedListDetails){
            addNewListItem(excludedList, i)
        }
    }
}

function saveMenu() {
    const included = Array.from(document.getElementById('included').querySelectorAll('.sortable-item')).map(e => e.textContent.trim())
    const excluded = Array.from(document.getElementById('excluded').querySelectorAll('.sortable-item')).map(e => e.textContent.trim())
    console.log(included, excluded)
    chrome.storage.local.set({ chromeContextControlExcluded: excluded }, function() {
        console.log('Data saved: fruit = apples,bananas');
    });
    chrome.storage.local.set({ chromeContextControlIncluded: included }, function() {
        console.log('Data saved: fruit = apples,bananas');
    });

    //localStorage.setItem("chromeContextControlExcluded", excluded)
    //localStorage.setItem("chromeContextControlIncluded", included)
}

function resetToDefault() {
    chrome.storage.local.remove(['chromeContextControlExcluded'], function() {
        console.log('fruit key has been removed');
    });
    chrome.storage.local.remove(['chromeContextControlIncluded'], function() {
        console.log('fruit key has been removed');
    });
    //localStorage.removeItem("chromeContextControlExcluded")
    //localStorage.removeItem("chromeContextControlIncluded")
}

async function getStorageValue(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result[key]); // Resolve with the stored value
            }
        });
    });
}