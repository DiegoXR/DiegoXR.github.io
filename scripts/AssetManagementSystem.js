//window.addEventListener('load', preLoadAssets)
let PlaceHolder = document.querySelector("#assetManagementSystemPlaceholder");

function preLoadAssets() {
    // createAssetItem("gallery", "assets/gallery.glb");
    // createAssetItem("ted", "assets/ted.glb");
    // createAssetItem("pig", "https://awesomesaucelabs.github.io/piglet-webgl-demo/StreamingAssets/piggleston.glb");
    createAssetItem();
}

function createAssetItem() {

    let assetItem = document.createElement("a-asset-item");
    assetItem.setAttribute("id", "pig");
    assetItem.setAttribute("src", "https://awesomesaucelabs.github.io/piglet-webgl-demo/StreamingAssets/piggleston.glb");
    PlaceHolder.appendChild(assetItem); 
}
