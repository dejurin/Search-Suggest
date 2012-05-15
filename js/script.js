(function($) {
	
	$("#search-field").keydown(function(event) {
		if((event.which == 38 || event.which == 40 || event.which == 27) && !$('#popup').is(':hidden') && $('#popup').has('p.search-link').length != 0) {
			switch(event.which) {
				//Down Arrow
				case 38:
					//If nothing is highlighted
					if($('#popup').find('p.search-hovered').length == 0) {
						$('#popup p.search-link').last().addClass("search-hovered");
					} else {
						//Remove the current highlight and add a highlight to the term above
						$('#popup p.search-hovered').removeClass("search-hovered").prev().addClass("search-hovered");
					}
					break;
				//Up Arrow
				case 40:
					//If nothing is highlighted
					if($('#popup').find('p.search-hovered').length == 0) {
						$('#popup p.search-link').first().addClass("search-hovered");
					} else {
						//Remove the current highlight and add a highlight to the term below
						$('#popup p.search-hovered').removeClass("search-hovered").next().addClass("search-hovered");
					}
					break;
			}
		}
	});
	
	last_term = '';
	$("#search-field").keyup(function(event) {
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
		//change the search field to the value that is clicked
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
	
	$(document).bind('keydown', function (event){
		switch(event.which) {
			//Enter
			case 13:
				if ( !$('#popup').is(':hidden') ) {
					//change the search value to the term currently highlighted
					$("#search-field").val($('#popup p.search-hovered').html());
					$("#popup").hide();
					return false;
				}
				break;
			//Escape
			case 27:
				if ( !$('#popup').is(':hidden') ) {
					$('#popup').hide();
				} 
				break;
			}
  	});

	
})(jQuery);
