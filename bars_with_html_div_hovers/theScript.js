const h = 250; 
const w = 600; 
const barPadding = 1; 

const dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
    11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ]; 

const svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h); 

var xScale = d3.scaleBand()
                .domain(d3.range(dataset.length))
                .rangeRound([0, w])
                .paddingInner(0.05);

var yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset)])
                .range([0, h]);



let sortOrder = false; 
// define the sort function 
const sortBars = function() {
    sortOrder = !sortOrder; 

    svg.selectAll("rect")
        .sort(function(a, b) {
            if (sortOrder) {
                return d3.ascending(a, b); 
            } else { 
                return d3.descending(a, b); 
            }
        })
        .transition()
        .delay(function(d, i) {
            return i * 50; 
        })
        .duration(500) 
        .attr("x", (d, i) => xScale(i))
}; 


//Create bars
svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
            return xScale(i);
    })
    .attr("y", d => h - yScale(d))
    .attr("width", xScale.bandwidth())
    .attr("height", d => yScale(d))
    .attr("fill", function(d) {
        return `rgb(0, 0, ${Math.round(d * 10)})`; 
    })
    .on("mouseover", function(d) {

        let xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
        let yPosition = parseFloat(d3.select(this).attr("y")) / 2 + h / 2;

        d3.select("#tooltip")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")
            .select("#value")
            .text(d); 

        // Show the tooltip
        d3.select("#tooltip").classed("hidden", false); 

    })
    .on("mouseout", function() {
        d3.select("#tooltip").classed("hidden", true); 
    }); 


d3.select("#sort_button")
    .on("click", function() {
        sortBars(); 
    }); 
