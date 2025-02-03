
// Currently stops window from appearing at all.
var selected = window.getSelection().toString()
var activeElement = document.activeElement; // Get focused element


document.addEventListener("contextmenu", function (e) {
    e.preventDefault(); // Stop default right-click menu

    const temp = `
    <div id="customContextMenu" class="context-menu">
      <ul>
          <li class="menu-item" data-action="back">⬅ Back</li>
          <li class="menu-item" data-action="forward">➡ Forward</li>
          <li class="menu-item" data-action="reload">🔄 Reload</li>
          <hr />
          <li class="menu-item" data-action="copy">📋 Copy</li>
          <li class="menu-item" data-action="paste">📄 Paste</li>
          <hr />
          <li class="menu-item" data-action="inspect">🔍 Inspect</li>
      </ul>
    </div>`;
    selected = window.getSelection().toString()
    activeElement = document.activeElement;
  
    // Create a new div element
    const contextMenuContainer = document.createElement("div");
  
    // Insert the HTML template inside the new div
    contextMenuContainer.innerHTML = temp;
  
    // Append the div to the body
    document.body.appendChild(contextMenuContainer.firstElementChild);
  
  
  
    document.getElementById("customContextMenu").addEventListener("click", function (e) {
      let action = e.target.getAttribute("data-action");
  
      switch (action) {
          case "back":
              history.back();
              break;
          case "forward":
              history.forward();
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
          case "inspect":
              // Open pop up telling them keys as this is programatically impossible
              alert("Press F12 or Ctrl+Shift+I (Cmd+Option+I on Mac) to open DevTools.");

              console.log('	Command + Option + I	F12 or Control + Shift + I')
              break;
      }
  
      // Hide menu after selection
      document.getElementById("customContextMenu").style.display = "none";
    });

    console.log('aa', e)
    let menu = document.getElementById("customContextMenu");
    menu.style.cssText = "position: absolute; background: white;z-index: 100000;"
    menu.style.left = `${e.pageX}px`;
    menu.style.top = `${e.pageY}px`;
    menu.style.display = "block";
    console.log(menu)

});

// Hide menu on any other click
document.addEventListener("click", function (e) {
    let menu = document.getElementById("customContextMenu");
    if(!menu) return
    if (menu.contains(e.target)){
                console.log('insdie')
                document.body.removeChild(menu)
        // Clicked in box
    } else{
        // Clicked outside the box
        console.log('outside')
        document.body.removeChild(menu)
    }
    //menu.style.display = "none";
});

