var margin = {top: 20, right: 60, bottom: 60, left: 70}
var width = 500 - margin.right - margin.left;
var height = 400 - margin.top - margin.bottom;
var avgPlayer = [[1991, 121], [1992, 98], [1993, 88], [1994, 79], [1995, 74]];
var xScale = d3.scale.linear()
					.domain(d3.extent(avgPlayer, function(d) { return d[0]; })).nice()
					.range([0, width]);

var yScale = d3.scale.linear()
					.domain(d3.extent(avgPlayer, function(d) { return d[1]; })).nice()
					.range([height, 0]);

var eval = d3.scale.quantize().domain([1, 175]).range(["Legend", "Elite", "Gatekeeper", "Journeyman",
														"Open title competitor", "Early round threat",
														"Grand slam qualifier", "Challenger circuit competitor",
														"Nearly relevant"]);

// var tierColor = d3.scale.quantize().domain([1, 175]).range(["forestgreen", "#73DB07", "#99DF06", "#C1E206",
// 														"#E6E205", "#EABF04",
// 														"#ED9A04", "#F17403",
// 														"#FF0033"]);
// var yearColor = d3.scale.quantize().domain([20, 1]).range(["#FF0033", "#F17403", "#EABF04", "#C1E206", "#73DB07", "forestgreen"]);

// var ageColor = yearColor.copy().domain([40, 20]);

d3.select("#tier").text(" " + eval(92)); //.style("color", tierColor(92));
d3.select("#totalyears").text(" " + 5); //.style("color", yearColor(5));
d3.select("#highestranking").text(" " + 74 + " (" + 1995 + ")"); //.style("color", tierColor(74));
d3.select("#highestrankingage").text(" " + 26); //.style("color", ageColor(26));
d3.select("#oldestage").text(" " + 26); //.style("color", ageColor(26));

var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
				.tickFormat(d3.format("d"))
				.ticks(7);

var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left")
				.ticks(10);


var svg = d3.select("svg")
			.attr("class", "chart")
			.attr("width", width + margin.right + margin.left)
			.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");



var marker = svg.append("line")
		.attr("x1", xScale(2015))
		.attr("y1", 0)
		.attr("x2", xScale(2015))
		.attr("y2", height)
		.style("stroke-width", "2px")
		.style("stroke", "darkred")
		.style("fill", "none")
		.style("opacity", "0");
// console.log(xScale(2015));
var txt = svg.append("text").text("Projection")
				.attr("x", xScale(2015))
				.attr("y", height / 2)
				.style("fill", "darkred")
				.style("opacity", "0");
// console.log(xScale(2015));

svg.selectAll("circle")
        .data(avgPlayer)
      	.enter()
      	.append("circle")
        .attr("cx", function(d) { return xScale(d[0]); })
        .attr("cy", function(d) { return yScale(d[1]); })
        .attr("r", 3.5);

svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);

svg.append("text")
	.attr("x", width / 2)
	.attr("y", (height + 40))
	.attr("dy", 5)
	.attr("text-anchor", "middle")
	.style("font-size", "1.25em")
	.text("Year");

svg.append("g")
	.attr("class", "y axis")
	.call(yAxis);

svg.append("text")
	.attr("x", -(height / 2))
	.attr("y", -45)
	.attr("dy", -5)
	.attr("transform", "rotate(-90)")
	.style("text-anchor", "middle")
	.style("font-size", "1.25em")
	.text("Year-end Ranking");

var connectDotsInit = d3.svg.line()
					.interpolate("monotone")
					.x(function(d) { return xScale(d[0]); })
					.y(function(d) { return yScale(d[1]); });
	
var connect = svg.append("path")
				.attr("class", "line");

var connectProjPath = svg.append("path")
					.attr("class", "line2");

connect.datum(avgPlayer)
		.transition()
		.duration(500)
		.delay(100)
		.attr("d", connectDotsInit);


// Setting up the sim boxes.

var margin2 = {top: 10, right: 20, bottom: 20, left: 25}
var width2 = 200 - margin2.right - margin2.left;
var height2 = 200 - margin2.top - margin2.bottom;

var xScale2 = d3.scale.linear()
				.domain([1973, 2015])
				.range([0, width2]);

var yScale2 = d3.scale.linear()
				.domain([0, 200])
				.range([height2, 0]);

var xAxis2 = d3.svg.axis()
			.scale(xScale2)
			.orient("bottom")
			.tickFormat(d3.format("d"))
			.ticks(5);

var yAxis2 = d3.svg.axis()
			.scale(yScale2)
			.orient("left");

var chartnames = ["chart1", "chart2", "chart3"]

for (var i = 0; i < 3; i++) {
	chartnames[i] = d3.select(".wrap.cont" + i)
						.append("h3")
						.attr("class", "sim name" + i)
						.style("font-size", "1em")
						.style("font-family", "Helvetica")
						.style("text-align", "center");
	chartnames[i] = d3.select(".wrap.cont" + i)
			.append("svg")
			.attr("class", "comp chart" + i)
			.attr("width", width2 + margin2.right + margin2.left)
			.attr("height", height2 + margin2.top + margin2.bottom)
				.append("g")
				.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

	chartnames[i].append("g")
		.attr("class", "x" + i + " axis2")
		.attr("transform", "translate(0," + height2 + ")")
		.call(xAxis2);

	chartnames[i].append("g")
		.attr("class", "y" + i + " axis2")
		.call(yAxis2);

	chartnames[i].append("path")
		.attr("class", "line l" + i);
}

var vars = {};

function plot_player(data) {
	var dataset = JSON.parse(data);
	var n;
	dataset.forEach(function(d) {
		d.name = d.name;
		n = d.name;
		d.ranking = +d.ranking;
		d.age = +d.age;
		d.year = +d.year;
	});

	var rankByYear = dataset.sort(function(a, b) {
		return a.year - b.year;
	});
	var cpy = JSON.parse(data);
	var sortByRank = cpy.sort(function(a, b) {
		return d3.ascending(+a.ranking, +b.ranking) || d3.ascending(+a.age, +b.age);
	});

	var minRank = d3.min(rankByYear, function(d) {
		return d.ranking;
	});

	var maxRank = d3.max(rankByYear, function(d) {
		return d.ranking;
	});
	var stdDev = d3.deviation(rankByYear, function(d) {
		return d.ranking;
	});
	var mean = d3.mean(rankByYear, function(d) {
		return d.ranking;
	});
	var maxAge = d3.max(rankByYear, function(d) {
		return d.age;
	});
	vars.maxYear = d3.max(rankByYear, function(d) { return d.year; });
	vars.minYear = d3.min(rankByYear, function(d) { return d.year; });
	vars.lastRank = rankByYear.slice(-1);
	var maxBound = 0;
	var minBound = 0;
	if (stdDev) {
		maxBound = mean + (2 * stdDev);
	}
	if ((minRank) - (2 * stdDev) >= 1) {
		minBound = minRank - (2 * stdDev);
	} else {
		minBound = 1;
	}
	xScale.domain(d3.extent(rankByYear, function(d) { return d.year; })).nice();
	yScale.domain([minBound, maxBound]).nice();
	marker.style("opacity", "0");
	txt.style("opacity", "0");
	if (rankByYear.length == 1) {
		xScale.domain([(vars.minYear - 1), (vars.maxYear + 1)]).nice();
		yScale.domain([1, 175]);
	}

	if (vars.maxYear >= 2015) {
		// remove before
		xScale.domain([d3.min(rankByYear, function(d) { return d.year; }), 2018]).nice();
		marker.transition()
			.duration(800)
			.attr("x1", xScale(2015))
			.attr("y1", 0)
			.attr("x2", xScale(2015))
			.attr("y2", height)
			.style("stroke-width", "2px")
			.style("stroke", "darkred")
			.style("fill", "darkred")
			.style("opacity", "0.7");
		txt.transition()
			.duration(800)
			.attr("x", xScale(2015) + 3)
			.attr("y", height / 2)
			.style("fill", "darkred")
			.style("opacity", "0.3");
	}



	var dots = svg.selectAll("circle").data(rankByYear, function(d) { return d.year; });


   	dots.transition()
   		.duration(1000)
   		.delay(function(d, i) { return i * 50; })
    	.attr("r", 3.5)
        .attr("cx", function(d) { return xScale(d.year); })
        .attr("cy", function(d) { return yScale(d.ranking); });

    dots.enter()
    	.append("circle")
    	.transition()
   		.duration(1000)
   		.delay(function(d, i) { return i * 50; })
    	.attr("r", 3.5)
        .attr("cx", function(d) { return xScale(d.year); })
        .attr("cy", function(d) { return yScale(d.ranking); });

    dots.exit()
    	.style("opacity", 1)
    	.transition()
    	.duration(500)
    	.style("opacity", 0)
    	.remove();

	svg.select(".x.axis")
		.transition()
		.duration(500)
		.call(xAxis);

	svg.select(".y.axis")
		.transition()
		.duration(500)
		.call(yAxis);


	var connectDots = d3.svg.line()
					.interpolate("monotone")
					.x(function(d) { return xScale(d.year); })
					.y(function(d) { return yScale(d.ranking); });

	connect.datum(rankByYear)
		.transition()
		.duration(500)
		.delay(700)
		.attr("d", connectDots);

	// playerName.text(n);

	d3.select("#name").text(n);
	d3.select("#tier").text(" " + eval(mean)); //.style("color", tierColor(mean));
	d3.select("#totalyears").text(" " + dataset.length); //.style("color", yearColor(dataset.length));
	d3.select("#highestranking").text(" " + minRank + " (" + sortByRank[0].year + ")"); //.style("color", tierColor(minRank));
	d3.select("#highestrankingage").text(" " + sortByRank[0].age); //.style("color", ageColor(sortByRank[0].age));
	d3.select("#oldestage").text(" " + maxAge); //.style("color", ageColor(maxAge));
}



function plot_sim(playerdata, playersim, ind) {
	
	var pdataset = JSON.parse(playerdata);
	var n;

	pdataset.forEach(function(d) {
		n = d.name;
		d.name = d.name;
		d.ranking = +d.ranking;
		d.age = +d.age;
		d.year = +d.year;
	});


	var pRankSort = pdataset.sort(function(a, b) {
		return a.year - b.year;
	});

	xScale2.domain(d3.extent(pRankSort, function(d) { return d.year; })).nice();
	yScale2.domain(d3.extent(pRankSort, function(d) { return d.ranking; })).nice();

	var circ = chartnames[ind - 1].selectAll("circle").data(pRankSort, function(d) { return d.year; });

	if (pRankSort.length == 1) {
		xScale2.domain([d3.min(pRankSort, function(d) { return d.year; }) - 1, d3.max(pRankSort, function(d) { return d.year; }) + 1]).nice();
		yScale2.domain([1, 175]);

	}

	circ.transition()
   		.duration(1000)
   		.delay(function(d, i) { return i * 50; })
    	.attr("r", 2)
        .attr("cx", function(d) { return xScale2(d.year); })
        .attr("cy", function(d) { return yScale2(d.ranking); });

    circ.enter()
    	.append("circle")
    	.transition()
   		.duration(1000)
   		.delay(function(d, i) { return i * 50; })
    	.attr("r", 2)
        .attr("cx", function(d) { return xScale2(d.year); })
        .attr("cy", function(d) { return yScale2(d.ranking); });

    circ.exit()
    	.style("opacity", 1)
    	.transition()
    	.duration(500)
    	.style("opacity", 0)
    	.remove();

	var line = d3.svg.line()
		.interpolate("monotone")
		.x(function(d) {
			return xScale2(d.year);
		})
		.y(function(d) {
			return yScale2(d.ranking);
		});

	chartnames[ind - 1].select(".x" + (ind - 1) + ".axis2")
		.transition()
		.duration(500)
		.call(xAxis2);

	var percentSim = Math.round(playersim * 100);
	if (percentSim == 100) {
		percentSim = ">99"
	}

	d3.select(".sim.name" + (ind-1))
					.text(n + ": " + percentSim + "%");

	chartnames[ind - 1].select(".y" + (ind - 1) + ".axis2")
		.transition()
		.duration(500)
		.call(yAxis2);

	chartnames[ind - 1].select(".line.l" + (ind - 1))
		.datum(pRankSort)
		.transition()
		.duration(500)
		.attr("d", line);

}

function plot_proj(projections) {
	var projected = [];
	var lastYear = vars.maxYear;
	projected.push({"ranking": vars.lastRank[0].ranking, "year": lastYear});
	for (var i = 0; i < projections.length; i++) {
		lastYear++;
		var newProj = {"ranking": projections[i], "year": lastYear};
		projected.push(newProj);
	}
	var proj_dots = svg.selectAll("circle").data(projected, function(d) { return d.year; });

	proj_dots.transition()
   		.duration(1000)
   		.delay(function(d, i) { return i * 50; })
    	.attr("r", 3.5)
        .attr("cx", function(d) { return xScale(d.year); })
        .attr("cy", function(d) { return yScale(d.ranking); });


	proj_dots.enter()
			.append("circle")
	    	.transition()
	   		.duration(1000)
	   		.delay(function(d, i) { return i * 50; })
	   		.attr("class", "proj")
	    	.attr("r", 3.5)
	        .attr("cx", function(d) { return xScale(d.year); })
	        .attr("cy", function(d) { return yScale(d.ranking); });

	var connectProj = d3.svg.line()
				.interpolate("monotone")
				.x(function(d) { return xScale(d.year); })
				.y(function(d) { return yScale(d.ranking); });


	connectProjPath.datum(projected)
			.transition()
			.duration(500)
			.delay(700)
			.attr("d", connectProj);

}




