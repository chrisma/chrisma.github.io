var timelineBlocks = document.querySelectorAll('.timeline > li');
// http://stackoverflow.com/questions/28633221/document-body-scrolltop-firefox-returns-0-only-js
var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

// Hide the parts of the timeline below the fold
Array.prototype.forEach.call(timelineBlocks, function(el, i){
	var offsetTop = el.getBoundingClientRect().top + scrollTop;
	if (offsetTop > scrollTop + windowHeight * 0.9) {
		var timelineParts = el.querySelectorAll('.pop-in');
		Array.prototype.forEach.call(timelineParts, function(part, i){
			part.classList.add('hidden');
		});
	}
});
// Show initially hidden timeline to prevent noticeable removal of elements
document.getElementById('recently').style.visibility='visible';

// Show parts of the timeline when they enter the viewport
window.addEventListener('scroll', function(){
	Array.prototype.forEach.call(timelineBlocks, function(el, i){
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		var offsetTop = el.getBoundingClientRect().top + scrollTop;
		var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		if (offsetTop <= scrollTop + windowHeight * 0.9 && el.querySelector('.pop-in').classList.contains('hidden')) {
			var timelineParts = el.querySelectorAll('.pop-in');
			Array.prototype.forEach.call(timelineParts, function(part, i){
				part.classList.remove('hidden');
				part.classList.add('bounce-in');
			});
		}
	});
});
