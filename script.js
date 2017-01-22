(function(timelineBlocks){
	// http://stackoverflow.com/questions/28633221/document-body-scrolltop-firefox-returns-0-only-js
	var scrollTop = function(){ return document.documentElement.scrollTop || document.body.scrollTop };
	var offsetTop = function(el){ return el.getBoundingClientRect().top + scrollTop() };
	var foldThreshold = function(){
		var wh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		return scrollTop() + wh * 0.9
	};
	// Hide the parts of the timeline below the fold
	Array.prototype.forEach.call(timelineBlocks, function(el, i){
		if (offsetTop(el) > foldThreshold()) {
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
			if (offsetTop(el) <= foldThreshold() && el.querySelector('.pop-in').classList.contains('hidden')) {
				var timelineParts = el.querySelectorAll('.pop-in');
				Array.prototype.forEach.call(timelineParts, function(part, i){
					part.classList.remove('hidden');
					part.classList.add('bounce-in');
				});
			}
		});
	});
}(document.querySelectorAll('.timeline > .tl-item')));
