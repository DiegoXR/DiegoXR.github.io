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