AFRAME.registerComponent('create-xrplayer', {
  init: function () {
    
    console.log("Creating xr player");

      // Camera
      let camera = document.createElement('a-entity');
      camera.setAttribute('camera', { });
      camera.setAttribute('wasd-controls', { });
      camera.setAttribute('look-controls', { });
      camera.setAttribute('id', "camera");
      camera.setAttribute("position", "0 1.6 0");
      this.el.appendChild(camera);
      
      // Cursor
      let cursor = document.createElement('a-cursor');
      cursor.setAttribute('id', "cursor");
      cursor.setAttribute("position", "0 0 -1");
      cursor.setAttribute('geometry', { primitive: 'ring' });
      cursor.setAttribute('geometry', { radiusInner: '0.03'});
      cursor.setAttribute('geometry', { radiusOuter: '0.04'});
      camera.appendChild(cursor);
      
      // Controls parent
      let controlsParent = document.createElement('a-entity');
      this.el.appendChild(controlsParent);

      // Left Control
      let leftControl = document.createElement('a-entity');
      leftControl.setAttribute('id', "leftControl");
      leftControl.setAttribute('super-hands', { });
      leftControl.setAttribute('blink-controls', { });
      leftControl.setAttribute('sphere-collider', { objects: 'a-box'});
      leftControl.setAttribute('hand-controls', { hand: 'right'});
      controlsParent.appendChild(leftControl);

      // Right Control
      let rightControl = document.createElement('a-entity');
      rightControl.setAttribute('id', "rightControl");
      rightControl.setAttribute('super-hands', { });
      rightControl.setAttribute('blink-controls', { });
      rightControl.setAttribute('sphere-collider', { objects: 'a-box'});
      rightControl.setAttribute('hand-controls', { hand: 'left'});
      controlsParent.appendChild(rightControl);
  }
});
