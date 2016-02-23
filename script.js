(function(){
  if (document.readyState != 'loading'){
    main();
  } else {
    document.addEventListener('DOMContentLoaded', main);
  }
})();

function main(){
	var timelineBlocks = document.querySelectorAll('.timeline > li');
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

	// Hide the parts of the timeline below the fold
	Array.prototype.forEach.call(timelineBlocks, function(el, i){
		var rect = el.getBoundingClientRect();
		var offsetTop = rect.top + document.body.scrollTop;
		if (offsetTop > scrollTop + windowHeight * 0.9) {
			var timelineParts = el.querySelectorAll('.timeline-panel, .timeline-badge');
			Array.prototype.forEach.call(timelineParts, function(part, i){
				part.classList.add('hidden');
			});
		}
	});

	// Show parts of the timeline when they enter the viewport
	window.addEventListener('scroll', function(){
		Array.prototype.forEach.call(timelineBlocks, function(el, i){
			var rect = el.getBoundingClientRect();
			var offsetTop = rect.top + document.body.scrollTop;
			if (offsetTop <= scrollTop + windowHeight * 0.9 && el.querySelectorAll('.timeline-panel')[0].classList.contains('hidden')) {
				var timelineParts = el.querySelectorAll('.timeline-panel, .timeline-badge');
				Array.prototype.forEach.call(timelineParts, function(part, i){
					part.classList.remove('hidden');
					part.classList.add('bounce-in');
				});
			}
		});
	});
} //main