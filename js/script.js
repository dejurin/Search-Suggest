(function($) {
	
	$("#search-field").keydown(function(event) {
		if((event.which == 38 || event.which == 40) && !$('#popup').is(':hidden') && $('#popup').has('p.search-link').length != 0) {
			
		}
	});
	
	last_term = '';
	$("#search-field").keyup(function() {
		//check if the current term is the same as the last
		//prevents multiple searches due to multiple keys pressed at once
		if(last_term != $("#search-field").val()){
			if($("#search-field").val() != '') {
				last_term = $("#search-field").val();
				$('#popup').empty();
				if ( $('#popup').is(':hidden') ) {
					$('#popup').show();
				} 
				$.getJSON('autocomplete.php', {search_term: $("#search-field").val()}, function(data) {
					if(data) {
						$.each(data, function(i, result) {
							$('#popup').append('<p class="search-link">'+result.term+'</p>');
						});
					} else {
						$('#popup').append('<p>No results</p>');
					}
				});
			}else{
				$('#popup').hide().empty();
			}
		}
	});
	
	
	$(".search-link").live("click", function(event) {
		$("#search-field").val($(this).html());
		$("#popup").hide();
	});
	
	$(".search-link").live({
		mouseenter:
		function() {
			$(this).addClass("search-hovered");
		},
		mouseleave:
		function() {
			$(this).removeClass("search-hovered");
		}
	});
	
})(jQuery);
