$(document).ready(function() {
	
	function search() {

		var query_value = $('#search').val();
		$('#search-string').text(query_value);
		if (query_value !== '') {
			$.ajax({
				type: "POST",
				url: "php/search.php",
				data: { query: query_value },
				cache: false,
				success: function(html){
					$("#results").css("text-transform", "capitalize");
					$("#results").html(html);
					$listItems = $('.result');
				}
			});
		}
		return false;    
	}

	$("#input-container").on("keyup", "#search", function(e) {

		if (e.keyCode != 40 && e.keyCode != 38 && e.keyCode != 13 && e.keyCode != 9) {

			clearTimeout($.data(this, 'timer'));
			var search_string = $(this).val();

			if (search_string == '') {
				$("#results").fadeOut();
				$('#results-text').fadeOut();
				$('#description').fadeOut();




			} else {
				$("#results").fadeIn();
				$('#results-text').fadeIn();
				$(this).data('timer', setTimeout(search, 100));
			};
		}
	});

	$("#input-container").on("click", ".result", function(e) {
		var name = $(e.target).text();
		plot(name, false);

	});
	$("#comp-container").on("click", ".wrap h3", function(e) {
		var name = $(e.target).text();
		name = name.replace(/[^a-zA-Z]+/g, ' ');
		plot(name, false);

	});
	$("#random").on("click", function(e) {
		plot(" ", true);
	});

	function plot (name, rand) {
		if (name !== '') {
			if (!rand) {
				$.ajax({
					type: "POST",
					url: "php/get_player.php",
					data: { query: name },
					cache: false,
					success: function(data){
						plot_player(data);
					}
				});
			} else {
				$.ajax({
					type: "POST",
					url: "php/search.php",
					data: { queryRand: name },
					cache: false,
					success: function(data){
						plot(data, false);
					}
				});
				return;
			}

			$.ajax({
				type: "POST",
				url: "php/get_player.php",
				data: { query2: name },
				cache: false,
				success: function(data){
					var dataset = JSON.parse(data);
					dataset.forEach(function(d) {
						d.name = d.name;
						d.player1 = d.player1;
						d.player1sim = +d.player1sim;
						$.ajax({
							type: "POST",
							url: "php/get_player.php",
							data: { query: d.player1 },
							cache: false,
							success: function(data){
								plot_sim(data, d.player1sim, 1);
							}
						});
						d.player2 = d.player2;
						d.player2sim = +d.player2sim;
						$.ajax({
							type: "POST",
							url: "php/get_player.php",
							data: { query: d.player2 },
							cache: false,
							success: function(data){
								plot_sim(data, d.player2sim, 2);
							}
						});
						d.player3 = d.player3;
						d.player3sim = +d.player3sim;
						d.projections = JSON.parse(d.projected_rankings);
						$.ajax({
							type: "POST",
							url: "php/get_player.php",
							data: { query: d.player3 },
							cache: false,
							success: function(data){
								plot_sim(data, d.player3sim, 3);
								plot_proj(d.projections);
							}
						});

					});
				}
			});
		}
		$("#search").val(name);
		$("#results-text").fadeOut(1);
		$("#results").fadeOut(1);
		$('#description').fadeIn();

	}

	$('#search').keydown(function(e) {
		var $listItems = $('.result');
		if (!$listItems) {
			return;
		}
	    var key = e.keyCode,
	        $selected = $listItems.filter('.selected'),
	        $current;

	    if ( key != 40 && key != 38 && key != 13 && key != 9) return;
	    
	    $listItems.removeClass('selected');

	    if ( key == 40 || key == 9) {
	    	if (e.which == 9) {
	    		e.preventDefault();
	    	}

	        if ( ! $selected.length || $selected.is(':last-child') ) {
	            $current = $listItems.eq(0);
	        }
	        else {
	            $current = $selected.next();
	        }
	    }
	    else if ( key == 38 ) {
	        if ( ! $selected.length || $selected.is(':first-child') ) {
	            $current = $listItems.last();
	        }
	        else {
	            $current = $selected.prev();
	        }
	    }
	    else if ( key == 13) {
	    	if ( !$selected.length ) {
	    		$current = $listItems.eq(0);
	    		plot($current.text(), false);
	    		return;
	    	} else {
	    		$current = $selected;
	    		plot($current.text(), false);
	    		return;
	    	}
	    }
	    var $inp = $current.addClass('selected');
	    $(this).val($inp.text());
	});

	$("body").on("click", function(e) { 
		$("#results-text").fadeOut();
		$("#results").fadeOut();
	});
});