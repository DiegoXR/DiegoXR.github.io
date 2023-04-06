window.addEventListener('load', setPlayer)

function setPlayer() {
    let PlaceHolder = document.querySelector("#playerPlaceHolder");

    PlaceHolder.innerHTML +=
        `<a-entity id="player" position="0 0 2.43">
    <a-entity id="camera" camera wasd-controls look-controls position="0 1.6 0">
        <a-cursor position="0 0 -1" geometry="primitive:ring; radiusInner:0.03; radiusOuter: 0.04"></a-cursor>
    </a-entity>
    <a-entity sphere-collider="objects: a-box" super-hands hand-controls="hand: right" blink-controls></a-entity>
    <a-entity sphere-collider="objects: a-box" super-hands hand-controls="hand: right" blink-controls></a-entity>
    </a-entity>`
}


