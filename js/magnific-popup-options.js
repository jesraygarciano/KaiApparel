$(document).ready(function() {
  // MagnificPopup
	var magnifPopup = function() {
		$('.image-popup').magnificPopup({
			type: 'image',
			removalDelay: 10000,
			mainClass: 'mfp-with-zoom',
			gallery:{
				enabled:true
			},
			zoom: {
				enabled: true, // By default it's false, so don't forget to enable it

				duration: 300, // duration of the effect, in milliseconds
				easing: 'ease-in-out', // CSS transition easing function
				closeOnBgClick: false,
				// The "opener" function should return the element from which popup will be zoomed in
				// and to which popup will be scaled down
				// By defailt it looks for an image tag:
				opener: function(openerElement) {
				// openerElement is the element on which popup was initialized, in this case its <a> tag
				// you don't need to add "opener" option if this code matches your needs, it's default one.
				return openerElement.is('image') ? openerElement : openerElement.find('image');
				}
			}
		});
	};

	var magnifVideo = function() {
		$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
        disableOn: 3000,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
		

        fixedContentPos: false
    });
	};

	


	// Call the functions 
	magnifPopup();
	magnifVideo();

});