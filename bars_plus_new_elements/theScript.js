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

        const maxValue = 20; 
        const newNumber = Math.floor(Math.random() * maxValue); 
        dataset.push(newNumber); 

        xScale.domain(d3.range(dataset.length))

        const bars = svg.selectAll("rect")
                        .data(dataset); //binding all the new data
    
        bars.enter() // now only referring to the new element 
            .append("rect")
            .attr("x", w) // keeping it out of sight
            .attr("y", d => h - yScale(d)) // setting it to the correc y co-ord
            .attr("width", xScale.bandwidth())
            .attr("height", d => yScale(d))
            .attr("fill", function(d)  {
                return `rgb(0, 0, ${Math.round(d*10)})`
            })
            .merge(bars) // now bringing this single element into the rest of the bars
            .transition().duration(500)
            .attr("x", function(d, i) {
                return xScale(i); 
            })
            .attr("y", d => h - yScale(d))
            .attr("width", xScale.bandwidth())
            .attr("height", d => yScale(d))

        const text = svg.selectAll("text")
                        .data(dataset); 
        
        text.enter()
            .append("text")
            .text(d => d)
            .attr("text-anchor", "middle")
            .attr("x", w)
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
            })
            .merge(text) // and remember, this is the variable defined above
            .transition().duration(500)
            .attr("x", function(d, i) {
                return xScale(i) + xScale.bandwidth() / 2;
            });
    }); 