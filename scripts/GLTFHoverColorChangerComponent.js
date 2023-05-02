// Add this component to an object if you want the object to change color when the cursor is hovering on the object

AFRAME.registerComponent('colorchanger', {
    init: function () {
        console.log("init");
        var loadedModel;
        var materials = [];
        var hoverColor = "green";
        var unHoverColor = "white";

        this.el.addEventListener("mouseenter",
            function (e) {
                materials.forEach(function (material) {
                material.color.set(hoverColor);
                });
               
            });

        this.el.addEventListener("mouseleave",
            function (e) {
                materials.forEach(function (material) {
                material.color.set(unHoverColor);
                });
            });

        this.el.addEventListener('model-loaded', 
            function (evt) {
                loadedModel = evt.detail.model;                  
                    loadedModel.traverse(function (node) {
                    // Retrieve the material from the model's hierarchy and store them                  
                        if (node.material) {
                        materials.push(node.material);
                        }
                    });

                 });
    }
});

