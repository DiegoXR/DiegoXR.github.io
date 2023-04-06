AFRAME.registerComponent('cursor-listener', {
    init: function () {
        console.log("init");
        var hoverColor = "green";
        var defaultColor = "red";

        this.el.addEventListener("mouseenter",
            function (e) {
                console.log("mouse enter");
                // Muestra informacion del objeto
                console.log(e.detail.intersection.object);
                // Muestra el punto de interseccion
                console.log(e.detail.intersection.point);

                this.setAttribute('material', 'color', hoverColor);
            });

        this.el.addEventListener("mouseleave",
            function (e) {
                console.log("mouse leave");
                this.setAttribute('material', 'color', defaultColor);
            });

    }
});