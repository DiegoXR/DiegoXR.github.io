// Add this component to an object if you want the object to change color when the cursor is hovering on the object

AFRAME.registerComponent('cursor-listener', {
    init: function () {
        console.log("init");
        var hoverColor = "green";
        var defaultColor ;

        this.el.addEventListener("mouseenter",
            function (e) {
                console.log("mouse enter");
                // Show Object Information
                console.log(e.detail.intersection.object);
                // Muestra Point of Intersection
                console.log(e.detail.intersection.point);
                // Retrieve the color attribute from the scheme
                defaultColor = this.data.color;                
                this.setAttribute('material', 'color', hoverColor);                                      
            });

        this.el.addEventListener("mouseleave",
            function (e) {
                console.log("mouse leave");
                this.setAttribute('material', 'color', defaultColor);
            });
    }
});

