AFRAME.registerComponent('gltf-loader', {
    schema: {
      src: { type: 'string' }
    },
  
    init: function () {
      let el = this.el;
  
      // Load the GLB model
      let loader = new THREE.GLTFLoader();
      loader.load(this.data.src, function (gltf) {
        let model = gltf.scene;
        el.setObject3D('mesh', model);
  
        //Get the color of all materials
        model.traverse(function (node) {
            if (node.material) {
            //console.log(node.material.color.getHexString());
            node.material.color.set('#00ff00');
          }
        });

        // // Get the color of all materials
        // model.traverse(function (node) {
        //     console.log(node);
        // });




      });
    }
  });
  