window.addEventListener('load', preLoadAssets)

function preLoadAssets() {
    let PlaceHolder = document.querySelector("#ambientPlaceHolder");

    // let newBox = document.createElement("a-box");
    // newBox.setAttribute("color", "yellow");
    // newBox.setAttribute("scale", "0.5 0.5 0.5");
    // PlaceHolder.appendChild(newBox);
   
    setSky(PlaceHolder);
    setLighting(PlaceHolder);
}

function setSky(elem) {
    elem.innerHTML +=  `<a-sky color="#ECECEC" material="color: blue"></a-sky>`
}

function setLighting(elem) {
    elem.innerHTML +=   
    `{<a-entity id="Ambient Light" position="0 1.16474 0"
      light="color: #ffffff; type: ambient; castShadow: false; intensity: 1.91"></a-entity>
    <a-entity id="Point Light" rotation="0 0 0"
      light="color: #0a18db; decay: 0.36; distance: 10; type: point; castShadow: true"></a-entity>}`
}

