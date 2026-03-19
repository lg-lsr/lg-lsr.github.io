window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
      slidesToScroll: 1,
      slidesToShow: 3,
      loop: true,
      infinite: true,
      autoplay: false,
      autoplaySpeed: 3000,
    };

    // Initialize carousel only when the library is available.
    if (typeof bulmaCarousel !== 'undefined' && bulmaCarousel.attach) {
      var carousels = bulmaCarousel.attach('.carousel', options);
      for (var i = 0; i < carousels.length; i++) {
        carousels[i].on('before:show', function(state) {
          console.log(state);
        });
      }
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    if (typeof bulmaSlider !== 'undefined' && bulmaSlider.attach) {
      bulmaSlider.attach();
    }

    var taskToggleButtons = document.querySelectorAll('.task-toggle-btn');
    var taskPanels = document.querySelectorAll('.task-panel');
    taskToggleButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        var selectedTask = button.getAttribute('data-task');
        taskToggleButtons.forEach(function(btn) {
          var isActive = btn === button;
          btn.classList.toggle('is-active', isActive);
          btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        taskPanels.forEach(function(panel) {
          var panelTask = panel.id.replace('task-panel-', '');
          panel.classList.toggle('is-active', panelTask === selectedTask);
        });
      });
    });

    var promptFileElements = document.querySelectorAll('.prompt-file[data-prompt-file]');
    promptFileElements.forEach(function(element) {
      var filePath = element.getAttribute('data-prompt-file');
      if (!filePath) return;

      fetch(filePath, { cache: 'no-store' })
        .then(function(response) {
          if (!response.ok) {
            throw new Error('Failed to load prompt');
          }
          return response.text();
        })
        .then(function(text) {
          element.textContent = text.trim();
        })
        .catch(function() {
          element.textContent = 'Unable to load prompt file: ' + filePath;
        });
    });

})
