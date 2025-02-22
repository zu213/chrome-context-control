
// Currently stops window from appearing at all.
var selected = window.getSelection().toString()
var activeElement = document.activeElement;

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

document.addEventListener("contextmenu", async function (e) {
    e.preventDefault(); // Stop default right-click menu
    var includedListDetails;
    includedListDetails = await getStorageValue("chromeContextControlIncluded")
    console.log(includedListDetails)
    if(!includedListDetails){
        includedListDetails = ['Back', 'Forward', 'Reload', 'hr' , 'Save','Print','Copy','Paste', 'hr','Source','Inspect'];
    }

    // Add the inital context menu element (this is what will change depending on customisation)
    var temp = `<div id="customContextMenu" class="context-menu">
        <ul>`
    for(const button of includedListDetails){
        if(button == 'hr'){
            temp += `<hr />`
        }else {
            temp += `<li class="menu-item" data-action="${button}">${button}</li>`
        }
    }
    temp += `
        </ul>
    </div>`;
    selected = window.getSelection().toString()
    activeElement = document.activeElement;
    const contextMenuContainer = document.createElement("div");
    contextMenuContainer.innerHTML = temp;
    document.body.appendChild(contextMenuContainer.firstElementChild);


    document.getElementById("customContextMenu")
        .addEventListener("click", (e) => 
        {
            // Do the correct action depending on the button
            let action = e.target.getAttribute("data-action");

            switch (action) {
                case "Back":
                    history.back();
                    break;
                case "Forward":
                    history.forward();
                    break;
                case "Print":
                        window.print();
                    break;
                case "Save":
                        const htmlContent = document.documentElement.outerHTML; // Get full page HTML
                        const blob = new Blob([htmlContent], { type: "text/html" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = document.title.replace(/\s+/g, "_") + ".html"; // Use page title as filename
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);        
                    
                        break;    
                case "Reload":
                        location.reload();
                        break;
                case "Copy":
                    const text =window.getSelection().toString()
                    if(selected){
                        navigator.clipboard.writeText(selected)
                    }
                    break;
                case "Paste":
                        navigator.clipboard.readText().then((pasteText) => {
                        if (!pasteText) return;
                
                
                        if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
                            // For input and textarea elements
                            const start = activeElement.selectionStart;
                            const end = activeElement.selectionEnd;
                            const value = activeElement.value;
                
                            // Insert text at cursor position
                            activeElement.value = value.slice(0, start) + pasteText + value.slice(end);
                            activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
                        }
                    })
                    break;
                case "Source":
                    // Open pop up telling them keys as this is programatically impossible

                    alert("Press Ctrl + U to view source");

                    break;
                case "Inspect":
                    // Open pop up telling them keys as this is programatically impossible
                    alert("Press F12 or Ctrl+Shift+I (Cmd+Option+I on Mac) to open DevTools.");

                    console.log('	Command + Option + I	F12 or Control + Shift + I')
                    break;
            }
        });

    // Position the element correctly
    let menu = document.getElementById("customContextMenu");
    menu.style.left = `${e.pageX}px`;
    menu.style.top = `${e.pageY}px`;
    menu.style.display = "block";
});

// Remove the menu on any click
document.addEventListener("click", function (e) {
    let menu = document.getElementById("customContextMenu");
    if(!menu) return
    if (menu.contains(e.target)){
        // Clicked in box
        document.body.removeChild(menu)
    } else{
        // Clicked outside the box
        document.body.removeChild(menu)
    }
});

