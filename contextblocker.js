
// Currently stops window from appearing at all.
var selected = window.getSelection().toString()
var activeElement = document.activeElement; // Get focused element

document.addEventListener("contextmenu", function (e) {
    e.preventDefault(); // Stop default right-click menu

    // Add the inital context menu element (this is what will change depending on customisation)
    const temp = `
    <div id="customContextMenu" class="context-menu">
    <ul>
        <li class="menu-item" data-action="back">⬅ Back</li>
        <li class="menu-item" data-action="forward">➡ Forward</li>
        <li class="menu-item" data-action="reload">🔄 Reload</li>
        <hr />
        <li class="menu-item" data-action="saveas">📋 Save as</li>
        <li class="menu-item" data-action="print">📋 Print</li>
        <li class="menu-item" data-action="copy">📋 Copy</li>
        <li class="menu-item" data-action="paste">📄 Paste</li>
        <hr />
        <li class="menu-item" data-action="viewsource">    View source</li>
        <li class="menu-item" data-action="inspect">🔍 Inspect</li>
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
                case "back":
                    history.back();
                    break;
                case "forward":
                    history.forward();
                    break;
                case "print":
                        window.print();
                    break;
                case "saveas":
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
                case "reload":
                        location.reload();
                        break;
                case "copy":
                    const text =window.getSelection().toString()
                    if(selected){
                        navigator.clipboard.writeText(selected)
                    }
                    break;
                case "paste":
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
                case "viewsource":
                    // Open pop up telling them keys as this is programatically impossible

                    alert("Press Ctrl + U to view source");

                    break;
                case "inspect":
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

