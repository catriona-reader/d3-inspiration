var w = 600;
var h = 250;

var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

var xScale = d3.scaleBand()
                .domain(d3.range(dataset.length))
                .rangeRound([0, w])
                .paddingInner(0.05);

var yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset)])
                .range([0, h]);

//Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

//Create bars
svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
        return xScale(i);
    })
    .attr("y", function(d) {
        return h - yScale(d);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) {
        return yScale(d);
    })
    .attr("fill", function(d) {
        return "rgb(0, 0, " + Math.round(d * 10) + ")";
    });

//Create labels
svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
        return d;
    })
    .attr("text-anchor", "middle")
    .attr("x", function(d, i) {
        return xScale(i) + xScale.bandwidth() / 2;
    })
    .attr("y", function(d) {
        if (yScale(d) < 30) {
            return h - yScale(d) - 14;
        } else {
            return h - yScale(d) + 14;
        }
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", function(d) {
        if (yScale(d) < 30) {
            return "black";
        } else {
            return "white";
        }
    });

d3.select("button")
    .on("click", function() {
            //New values for dataset
        const maxValue = 25; 
        var numValues = dataset.length;						//Count original length of dataset
        dataset = [];  						 				//Initialize empty array
        for (var i = 0; i < numValues; i++) {				//Loop numValues times
            var newNumber = Math.floor(Math.random() * maxValue); //New random integer (0-24)
            dataset.push(newNumber);			 			//Add new number to array
        };

        yScale.domain([0, d3.max(dataset)]); 

        svg.selectAll("rect")
            .data(dataset)
            .transition()
            .delay(function(d, i) {
                return i / dataset.length * 1000; 
            })
            .duration(1000)
            .attr("y", d => h - yScale(d))
            .attr("height", d => yScale(d))
            .attr("fill", function(d) {
                return "rgb(0, 0, " + Math.round(d * 10) + ")";
            });

        svg.selectAll("text")
            .data(dataset)
            .transition()
            .delay(function(d, i) {
                return i / dataset.length * 1000; 
            })
            .duration(1000)
            .text(function(d) {
                return d;
            })
            .attr("text-anchor", "middle")
            .attr("x", function(d, i) {
                return xScale(i) + xScale.bandwidth() / 2;
            })
            .attr("y", function(d) {
                if (yScale(d) < 30) {
                    return h - yScale(d) - 7;
                } else {
                    return h - yScale(d) + 14;
                }
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", function(d) {
                if (yScale(d) < 30) {
                    return "black";
                } else {
                    return "white";
                }
            });

    }); 