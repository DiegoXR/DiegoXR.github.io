
  AFRAME.registerPrimitive('a-testPrimitive', {
    defaultComponents: {
      geometry: { primitive: 'box' },
      material: { color: 'red' }
    },
    mappings: {
      size: 'geometry.width',
      color: 'material.color'
    },
    init: function() {
      var el = this.el;
      console.log("Diego");
      var cube1 = document.createElement('a-entity');
      cube1.setAttribute('geometry', { width: 1, height: 1, depth: 1 });
      cube1.setAttribute('material', { color: 'yellow' });
      cube1.setAttribute('position', { x: 0, y: 1, z: -1 });
      el.appendChild(cube1);
    }
  });
  
  // For some reason, when the primitive or component have a default component or mapping, the init function is not called