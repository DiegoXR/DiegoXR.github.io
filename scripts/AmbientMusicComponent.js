AFRAME.registerComponent('ambient-music', {
    dependencies: ['sound'], 
    init: function () {
      // Fetch the audio component
      var element = this.el;
      var sound = this.el.components.sound;

      // Play the music when the scene is loaded
      element.addEventListener('click', function () {
        sound.playSound();
      });
    }
  });
  

//   AFRAME.registerComponent('hover-sound', {
//     schema: {
//       src: {type: 'string'}
//     },
//     dependencies: ['sound'], 
//     init: function () {
//       var el = this.el;
//       var data = this.data;
//       //var sound = new Audio(data.src);
//       var sound = this.el.components.sound;
//       el.addEventListener('mouseenter', function () {
//         sound.playSound();
//       });
//       el.addEventListener('mouseleave', function () {
//         sound.stopSound();
//         sound.currentTime = 0;
//       });
//     }
//   });