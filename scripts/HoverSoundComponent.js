AFRAME.registerComponent('hover-sound', {
        dependencies: ['sound'], 
        init: function () {
          var el = this.el;
          var sound = this.el.components.sound;
          el.addEventListener('mouseenter', function () {
            sound.playSound();
          });
          el.addEventListener('mouseleave', function () {
            sound.stopSound();
            sound.currentTime = 0;
          });
        }
      });