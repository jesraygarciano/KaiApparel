;(function () {
	
	'use strict';



	// iPad and iPod detection	
	var isiPad = function(){
		return (navigator.platform.indexOf("iPad") != -1);
	};

	var isiPhone = function(){
	    return (
			(navigator.platform.indexOf("iPhone") != -1) || 
			(navigator.platform.indexOf("iPod") != -1)
	    );
	};

	// Main Menu Superfish
	var mainMenu = function() {

		$('#fh5co-primary-menu').superfish({
			delay: 0,
			animation: {
				opacity: 'show'
			},
			speed: 'fast',
			cssArrows: true,
			disableHI: true
		});

	};

	// Offcanvas and cloning of the main menu
	var offcanvas = function() {

		var $clone = $('#fh5co-menu-wrap').clone();
		$clone.attr({
			'id' : 'offcanvas-menu'
		});
		$clone.find('> ul').attr({
			'class' : '',
			'id' : ''
		});

		$('#fh5co-page').prepend($clone);

		// click the burger
		$('.js-fh5co-nav-toggle').on('click', function(){

			if ( $('body').hasClass('fh5co-offcanvas') ) {
				$('body').removeClass('fh5co-offcanvas');
			} else {
				$('body').addClass('fh5co-offcanvas');
			}
			// $('body').toggleClass('fh5co-offcanvas');

		});

		$(window).resize(function(){
			var w = $(window);

			if ( w.width() > 769 ) {
				if ( $('body').hasClass('fh5co-offcanvas') ) {
					$('body').removeClass('fh5co-offcanvas');
				}
			}

		});	

	}

	// Superfish Sub Menu Click ( Mobiles/Tablets )
	var mobileClickSubMenus = function() {

		$('body').on('click', '.fh5co-sub-ddown', function(event) {
			event.preventDefault();
			var $this = $(this),
				li = $this.closest('li');
			li.find('> .fh5co-sub-menu').slideToggle(200);
		});

	};


	// Animations

	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							el.addClass('fadeInUp animated');
							el.removeClass('item-animate');
						},  k * 200, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '85%' } );
	};
	

	// Document on load.
	$(function(){

		offcanvas();
		contentWayPoint();
		

	});


}());
















jQuery(document).ready(function($) {
	var galleryItems = $('.cd-gallery').children('li');

	galleryItems.each(function(){
		var container = $(this),
			// create slider dots
			sliderDots = createSliderDots(container);
		//check if item is on sale
		updatePrice(container, 0);

		// update slider when user clicks one of the dots
		sliderDots.on('click', function(){
			var selectedDot = $(this);
			if(!selectedDot.hasClass('selected')) {
				var selectedPosition = selectedDot.index(),
					activePosition = container.find('.cd-item-wrapper .selected').index();
				if( activePosition < selectedPosition) {
					nextSlide(container, sliderDots, selectedPosition);
				} else {
					prevSlide(container, sliderDots, selectedPosition);
				}

				updatePrice(container, selectedPosition);
			}
		});

		// update slider on swipeleft
		container.find('.cd-item-wrapper').on('swipeleft', function(){
			var wrapper = $(this);
			if( !wrapper.find('.selected').is(':last-child') ) {
				var selectedPosition = container.find('.cd-item-wrapper .selected').index() + 1;
				nextSlide(container, sliderDots);
				updatePrice(container, selectedPosition);
			}
		});

		// update slider on swiperight
		container.find('.cd-item-wrapper').on('swiperight', function(){
			var wrapper = $(this);
			if( !wrapper.find('.selected').is(':first-child') ) {
				var selectedPosition = container.find('.cd-item-wrapper .selected').index() - 1;
				prevSlide(container, sliderDots);
				updatePrice(container, selectedPosition);
			}
		});

		// preview image hover effect - desktop only
		container.on('mouseover', '.move-right, .move-left', function(event){
			hoverItem($(this), true);
		});
		container.on('mouseleave', '.move-right, .move-left', function(event){
			hoverItem($(this), false);
		});

		// update slider when user clicks on the preview images
		container.on('click', '.move-right, .move-left', function(event){
			event.preventDefault();
			if ( $(this).hasClass('move-right') ) {
				var selectedPosition = container.find('.cd-item-wrapper .selected').index() + 1;
				nextSlide(container, sliderDots);
			} else {
				var selectedPosition = container.find('.cd-item-wrapper .selected').index() - 1;
				prevSlide(container, sliderDots);
			}
			updatePrice(container, selectedPosition);
		});
	});

	function createSliderDots(container){
		var dotsWrapper = $('<ol class="cd-dots"></ol>').insertAfter(container.children('a'));
		container.find('.cd-item-wrapper li').each(function(index){
			var dotWrapper = (index == 0) ? $('<li class="selected"></li>') : $('<li></li>'),
				dot = $('<a href="#0"></a>').appendTo(dotWrapper);
			dotWrapper.appendTo(dotsWrapper);
			dot.text(index+1);
		});
		return dotsWrapper.children('li');
	}

	function hoverItem(item, bool) {
		( item.hasClass('move-right') )
			? item.toggleClass('hover', bool).siblings('.selected, .move-left').toggleClass('focus-on-right', bool)
			: item.toggleClass('hover', bool).siblings('.selected, .move-right').toggleClass('focus-on-left', bool);
	}

	function nextSlide(container, dots, n){
		var visibleSlide = container.find('.cd-item-wrapper .selected'),
			navigationDot = container.find('.cd-dots .selected');
		if(typeof n === 'undefined') n = visibleSlide.index() + 1;
		visibleSlide.removeClass('selected');
		container.find('.cd-item-wrapper li').eq(n).addClass('selected').removeClass('move-right hover').prevAll().removeClass('move-right move-left focus-on-right').addClass('hide-left').end().prev().removeClass('hide-left').addClass('move-left').end().next().addClass('move-right');
		navigationDot.removeClass('selected')
		dots.eq(n).addClass('selected');
	}

	function prevSlide(container, dots, n){
		var visibleSlide = container.find('.cd-item-wrapper .selected'),
			navigationDot = container.find('.cd-dots .selected');
		if(typeof n === 'undefined') n = visibleSlide.index() - 1;
		visibleSlide.removeClass('selected focus-on-left');
		container.find('.cd-item-wrapper li').eq(n).addClass('selected').removeClass('move-left hide-left hover').nextAll().removeClass('hide-left move-right move-left focus-on-left').end().next().addClass('move-right').end().prev().removeClass('hide-left').addClass('move-left');
		navigationDot.removeClass('selected');
		dots.eq(n).addClass('selected');
	}

	function updatePrice(container, n) {
		var priceTag = container.find('.cd-price'),
			selectedItem = container.find('.cd-item-wrapper li').eq(n);
		if( selectedItem.data('sale') ) { 
			// if item is on sale - cross old price and add new one
			priceTag.addClass('on-sale');
			var newPriceTag = ( priceTag.next('.cd-new-price').length > 0 ) ? priceTag.next('.cd-new-price') : $('<em class="cd-new-price"></em>').insertAfter(priceTag);
			newPriceTag.text(selectedItem.data('price'));
			setTimeout(function(){ newPriceTag.addClass('is-visible'); }, 100);
		} else {
			// if item is not on sale - remove cross on old price and sale price
			priceTag.removeClass('on-sale').next('.cd-new-price').removeClass('is-visible').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				priceTag.next('.cd-new-price').remove();
			});
		}
	}
});











/*=====================================FEATURED PAGE JQUERY=====================================*/

jQuery(document).ready(function($){
	var isPreserve3DSupported = ( $('.preserve3d').length > 0 ),
		isTransitionSupported = ( $('.csstransitions').length > 0 ),
		backToTopBtn = $('.cd-top');
	
	function Portfolio3D( element ) {
		//define a Portfolio3D object
		this.element = element;
		this.navigation = this.element.children('.cd-3d-portfolio-navigation');
		this.rowsWrapper = this.element.children('.projects');
		this.rows = this.rowsWrapper.children('.row');
		this.visibleFace = 'front';
		this.visibleRowIndex = 0;
		this.rotationValue = 0;
		//animating variables
		this.animating = false;
		this.scrolling = false;
		// bind portfolio events
		this.bindEvents();
	}

	Portfolio3D.prototype.bindEvents = function() {
		var self = this;

		this.navigation.on('click', 'a:not(.selected)', function(event){
			//update visible projects when clicking on the filter
			event.preventDefault();
			if( !self.animating ) {
				self.animating = true;
				var index = $(this).parent('li').index();
				//update filter
				$(this).addClass('selected').parent('li').siblings('li').find('.selected').removeClass('selected');
				//show new projects
				self.showNewContent(index);
			}
		});

		this.rows.on('click', 'li.selected', function(){
			//open a new project
			if( !self.animating && !$(this).hasClass('open')) {
				self.animating = true;
				self.rowsWrapper.addClass('project-is-open project-has-transition');
				
				$(this).addClass('open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					//wait for the end of the transition and set the animating variable to tru
					self.animating = false;
					$(this).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
				});
				
				if(!isTransitionSupported) self.animating = false;
			}
		});

		this.element.on('click', '.close-project', function(event){
			event.preventDefault();
			//close a project
			if( !self.animating ) {
				self.animating = true;
				self.rowsWrapper.removeClass('project-is-open');

				self.rows.find('li.open').find('.project-title').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					//wait until the project is clodes and remove classes/set animating to false
					$(this).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
					self.resetProjects();
				});

				if(!isTransitionSupported) self.resetProjects();
			}
		});

		this.rowsWrapper.find('.project-wrapper').on('scroll', function(){
			//detect scroll incide an open project - hide/show back to top
			var scrollValue = $(this).scrollTop();
			if(!self.scrolling) {
				self.scrolling = true;
				(!window.requestAnimationFrame) ? setTimeout(function() {self.checkScroll(scrollValue);}, 250) : window.requestAnimationFrame(function() {self.checkScroll(scrollValue);});
			}
		});
	};

	Portfolio3D.prototype.resetProjects = function() {
		this.rows.find('li.open').removeClass('open');
		this.rowsWrapper.removeClass('project-has-transition');
		this.animating = false;
	};

	Portfolio3D.prototype.checkScroll = function(scrollValue) {
		( scrollValue > 300 ) ? backToTopBtn.addClass('is-visible') : backToTopBtn.removeClass('is-visible cd-fade-out');
		this.scrolling = false;
	}

	Portfolio3D.prototype.showNewContent = function(index) {
		var self = this,
			direction = ( index > self.visibleRowIndex ) ? 'rightToLeft' : 'leftToRight',
			rotationParams = this.getRotationPrameters( direction ),
			newVisibleFace = rotationParams[0],
			rotationY = rotationParams[1],
			translateZ = $(window).width()/2;

		
		this.rows.each(function() {
			$(this).children('li').addClass('hidden').removeClass('selected').eq(index).removeClass('hidden left-face right-face back-face front-face').addClass(newVisibleFace + '-face selected').end().eq(self.visibleRowIndex).removeClass('hidden selected');
		});
		
		//if preserve3D is supported -> rotate projects
		isPreserve3DSupported 
			? this.setTransform(rotationY, translateZ)
			: self.animating = false;
		this.visibleFace = newVisibleFace;
		this.visibleRowIndex = index;
		this.rotationValue = rotationY;
	};

	Portfolio3D.prototype.getRotationPrameters = function(direction) {
		var newVisibleFace,
			rotationY;
		if(  this.visibleFace == 'front' ) {
			newVisibleFace = ( direction == 'rightToLeft' ) ? 'right' : 'left';
		} else if( this.visibleFace == 'right' ) {
			newVisibleFace = ( direction =='rightToLeft' ) ? 'back' : 'front';
		} else if( this.visibleFace == 'left' ) {
			newVisibleFace = ( direction =='rightToLeft' ) ? 'front' : 'back';
		} else {
			newVisibleFace = ( direction =='rightToLeft' ) ? 'left' : 'right';
		}

		if( direction == 'rightToLeft' ) {
			rotationY = this.rotationValue - 90;
		} else {
			rotationY = this.rotationValue + 90;
		}

		return [newVisibleFace, rotationY];
	};

	Portfolio3D.prototype.setTransform = function(rotationValue, translateValue) {
		var self = this;
		this.rows.each(function(index){
			$(this).css({
			    '-moz-transform': 'translateZ(-'+ translateValue +'px) rotateY(' + rotationValue + 'deg)',
			    '-webkit-transform': 'translateZ(-'+ translateValue +'px) rotateY(' + rotationValue + 'deg)',
				'-ms-transform': 'translateZ('-+ translateValue +'px) rotateY(' + rotationValue + 'deg)',
				'-o-transform': 'translateZ(-'+ translateValue +'px) rotateY(' + rotationValue + 'deg)',
				'transform': 'translateZ(-'+ translateValue +'px) rotateY(' + rotationValue + 'deg)'
			});

			if(index == 2)  
				$(this).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					$(this).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
					self.animating = false;
				});
		});
	};

	Portfolio3D.prototype.scrollProjectTop = function() {
		this.rows.children('li.selected.open').find('.project-wrapper').animate({scrollTop: 0 }, 300);
	}

	if( $('.cd-3d-portfolio').length > 0 ) {
		var portfolios3D = [];
		$('.cd-3d-portfolio').each(function(){
			//create a Portfolio3D object for each .cd-3d-portfolio
			portfolios3D.push(new Portfolio3D($(this)));
		});
	}

	var windowResize = false;
	//detect window resize - reset .cd-products-comparison-table properties
	$(window).on('resize', function(){
		if(!windowResize) {
			windowResize = true;
			(!window.requestAnimationFrame) ? setTimeout(checkResize, 250) : window.requestAnimationFrame(checkResize);
		}
	});

	function checkResize(){
		portfolios3D.forEach(function(element){
			//update transform values on resize
			element.setTransform(element.rotationValue, $(window).width()/2);
		});

		windowResize = false;
	}

	backToTopBtn.on('click', function(event){
		//scroll to the top of a project when clicking the backToTop button
		event.preventDefault();
		portfolios3D.forEach(function(element){
			element.scrollProjectTop();
		});
	});
});
/*=====================================FEATURED PAGE JQUERY=====================================*/




/*=====================================WEARS PAGE JQUERY=====================================*/
jQuery(document).ready(function($){
	var visionTrigger = $('.cd-3d-trigger'),
		galleryItems = $('.no-touch #cd-gallery-items').children('li'),
		galleryNavigation = $('.cd-item-navigation a');

	//on mobile - start/end 3d vision clicking on the 3d-vision-trigger
	visionTrigger.on('click', function(){
		$this = $(this);
		if( $this.parent('li').hasClass('active') ) {
			$this.parent('li').removeClass('active');
			hideNavigation($this.parent('li').find('.cd-item-navigation'));
		} else {
			$this.parent('li').addClass('active');
			updateNavigation($this.parent('li').find('.cd-item-navigation'), $this.parent('li').find('.cd-item-wrapper'));
		}
	});

	//on desktop - update navigation visibility when hovering over the gallery images
	galleryItems.hover(
		//when mouse enters the element, show slider navigation
		function(){
			$this = $(this).children('.cd-item-wrapper');
			updateNavigation($this.siblings('nav').find('.cd-item-navigation').eq(0), $this);
		},
		//when mouse leaves the element, hide slider navigation
		function(){
			$this = $(this).children('.cd-item-wrapper');
			hideNavigation($this.siblings('nav').find('.cd-item-navigation').eq(0));
		}
	);

	//change image in the slider
	galleryNavigation.on('click', function(){
		var navigationAnchor = $(this);
			direction = navigationAnchor.text(),
			activeContainer = navigationAnchor.parents('nav').eq(0).siblings('.cd-item-wrapper');
		
		( direction=="Next") ? showNextSlide(activeContainer) : showPreviousSlide(activeContainer);
		updateNavigation(navigationAnchor.parents('.cd-item-navigation').eq(0), activeContainer);
	});
});

function showNextSlide(container) {
	var itemToHide = container.find('.cd-item-front'),
		itemToShow = container.find('.cd-item-middle'),
		itemMiddle = container.find('.cd-item-back'),
		itemToBack = container.find('.cd-item-out').eq(0);

	itemToHide.addClass('move-right').removeClass('cd-item-front').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
		itemToHide.addClass('hidden');
	});
	itemToShow.addClass('cd-item-front').removeClass('cd-item-middle');
	itemMiddle.addClass('cd-item-middle').removeClass('cd-item-back');
	itemToBack.addClass('cd-item-back').removeClass('cd-item-out');
}

function showPreviousSlide(container) {
	var itemToMiddle = container.find('.cd-item-front'),
		itemToBack = container.find('.cd-item-middle'),
		itemToShow = container.find('.move-right').slice(-1),
		itemToOut = container.find('.cd-item-back');

	itemToShow.removeClass('hidden').addClass('cd-item-front');
	itemToMiddle.removeClass('cd-item-front').addClass('cd-item-middle');
	itemToBack.removeClass('cd-item-middle').addClass('cd-item-back');
	itemToOut.removeClass('cd-item-back').addClass('cd-item-out');

	//wait until itemToShow does'n have the 'hidden' class, then remove the move-right class 
	//in this way, transition works also in the way back
	var stop = setInterval(checkClass, 100);
	
	function checkClass(){
		if( !itemToShow.hasClass('hidden') ) {
			itemToShow.removeClass('move-right');
			window.clearInterval(stop);
		}
	}
}

function updateNavigation(navigation, container) {
	var isNextActive = ( container.find('.cd-item-middle').length > 0 ) ? true : false,
		isPrevActive = 	( container.children('li').eq(0).hasClass('cd-item-front') ) ? false : true;
	(isNextActive) ? navigation.find('a').eq(1).addClass('visible') : navigation.find('a').eq(1).removeClass('visible');
	(isPrevActive) ? navigation.find('a').eq(0).addClass('visible') : navigation.find('a').eq(0).removeClass('visible');
}

function hideNavigation(navigation) {
	navigation.find('a').removeClass('visible');
}
/*=====================================WEARS PAGE JQUERY=====================================*/

/*=====================================ABOUT PAGE JQUERY=====================================*/
jQuery(document).ready(function(){
	var modalTriggerBts = $('a[data-type="cd-modal-trigger"]'),
		coverLayer = $('.cd-cover-layer');

	/*
	 convert a cubic bezier value to a custom mina easing
	 http://stackoverflow.com/questions/25265197/how-to-convert-a-cubic-bezier-value-to-a-custom-mina-easing-snap-svg
	 */
	var duration = 600,
		epsilon = (1000 / 60 / duration) / 4,
		firstCustomMinaAnimation = bezier(.63,.35,.48,.92, epsilon);

	modalTriggerBts.each(function(){
		initModal($(this));
	});

	function initModal(modalTrigger) {
		var modalTriggerId =  modalTrigger.attr('id'),
			modal = $('.cd-modal[data-modal="'+ modalTriggerId +'"]'),
			svgCoverLayer = modal.children('.cd-svg-bg'),
			paths = svgCoverLayer.find('path'),
			pathsArray = [];
		//store Snap objects
		pathsArray[0] = Snap('#'+paths.eq(0).attr('id')),
			pathsArray[1] = Snap('#'+paths.eq(1).attr('id')),
			pathsArray[2] = Snap('#'+paths.eq(2).attr('id'));

		//store path 'd' attribute values
		var pathSteps = [];
		pathSteps[0] = svgCoverLayer.data('step1');
		pathSteps[1] = svgCoverLayer.data('step2');
		pathSteps[2] = svgCoverLayer.data('step3');
		pathSteps[3] = svgCoverLayer.data('step4');
		pathSteps[4] = svgCoverLayer.data('step5');
		pathSteps[5] = svgCoverLayer.data('step6');

		//open modal window
		modalTrigger.on('click', function(event){
			event.preventDefault();
			modal.addClass('modal-is-visible');
			coverLayer.addClass('modal-is-visible');
			animateModal(pathsArray, pathSteps, duration, 'open');
		});

		//close modal window
		modal.on('click', '.modal-close', function(event){
			event.preventDefault();
			modal.removeClass('modal-is-visible');
			coverLayer.removeClass('modal-is-visible');
			animateModal(pathsArray, pathSteps, duration, 'close');
		});
	}

	function animateModal(paths, pathSteps, duration, animationType) {
		var path1 = ( animationType == 'open' ) ? pathSteps[1] : pathSteps[0],
			path2 = ( animationType == 'open' ) ? pathSteps[3] : pathSteps[2],
			path3 = ( animationType == 'open' ) ? pathSteps[5] : pathSteps[4];
		paths[0].animate({'d': path1}, duration, firstCustomMinaAnimation);
		paths[1].animate({'d': path2}, duration, firstCustomMinaAnimation);
		paths[2].animate({'d': path3}, duration, firstCustomMinaAnimation);
	}

	function bezier(x1, y1, x2, y2, epsilon){
		//https://github.com/arian/cubic-bezier
		var curveX = function(t){
			var v = 1 - t;
			return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
		};

		var curveY = function(t){
			var v = 1 - t;
			return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
		};

		var derivativeCurveX = function(t){
			var v = 1 - t;
			return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (- t * t * t + 2 * v * t) * x2;
		};

		return function(t){

			var x = t, t0, t1, t2, x2, d2, i;

			// First try a few iterations of Newton's method -- normally very fast.
			for (t2 = x, i = 0; i < 8; i++){
				x2 = curveX(t2) - x;
				if (Math.abs(x2) < epsilon) return curveY(t2);
				d2 = derivativeCurveX(t2);
				if (Math.abs(d2) < 1e-6) break;
				t2 = t2 - x2 / d2;
			}

			t0 = 0, t1 = 1, t2 = x;

			if (t2 < t0) return curveY(t0);
			if (t2 > t1) return curveY(t1);

			// Fallback to the bisection method for reliability.
			while (t0 < t1){
				x2 = curveX(t2);
				if (Math.abs(x2 - x) < epsilon) return curveY(t2);
				if (x > x2) t0 = t2;
				else t1 = t2;
				t2 = (t1 - t0) * .5 + t0;
			}

			// Failure
			return curveY(t2);

		};
	};
});
/*=====================================ABOUT PAGE JQUERY=====================================*/


// Get the modal
var modal = document.getElementById('myModal');
var modal_b = document.getElementById('myModal-b');
var modal_c = document.getElementById('myModal-c');
var modal_d = document.getElementById('myModal-d');

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById('myImg');
var imgb = document.getElementById('myImgb');
var imgc = document.getElementById('myImgc');
var imgd = document.getElementById('myImgd');


var modalImg = document.getElementById("img01");
var modalImgb = document.getElementById("img02");
var modalImgc = document.getElementById("img03");
var modalImgd = document.getElementById("img04");


var captionText = document.getElementById("caption_a");
var captionTextb = document.getElementById("caption_b");
var captionTextc = document.getElementById("caption_c");
var captionTextd = document.getElementById("caption_d");


img.onclick = function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
};

imgb.onclick = function(){
    modal_b.style.display = "block";
    modalImgb.src = this.src;
    captionTextb.innerHTML = this.alt;
};

imgc.onclick = function(){
    modal_c.style.display = "block";
    modalImgc.src = this.src;
    captionTextc.innerHTML = this.alt;
};

imgd.onclick = function(){
    modal_d.style.display = "block";
    modalImgd.src = this.src;
    captionTextd.innerHTML = this.alt;
};

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close-a")[0];
var spanb = document.getElementsByClassName("close-b")[0];
var spanc = document.getElementsByClassName("close-c")[0];
var spand = document.getElementsByClassName("close-d")[0];


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
	modal.style.display = "none";
};
spanb.onclick = function() {
    modal_b.style.display = "none";
};
spanc.onclick = function() {
    modal_c.style.display = "none";
};
spand.onclick = function() {
    modal_d.style.display = "none";
};


$(document).ready(function(){
	/* Get iframe src attribute value i.e. YouTube video url
	 and store it in a variable */
    var url = $("#cartoonVideo").attr('src');

	/* Assign empty url value to the iframe src attribute when
	 modal hide, which stop the video playing */
    $("#myModalVideo").on('hide.bs.modal', function(){
        $("#cartoonVideo").attr('src', '');
    });

	/* Assign the initially stored url back to the iframe src
	 attribute when modal is displayed again */
    $("#myModalVideo").on('show.bs.modal', function(){
        $("#cartoonVideo").attr('src', url);
    });


});

