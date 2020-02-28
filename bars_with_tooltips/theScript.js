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
        // define the label behaviour for hover over 
        let xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2; 
        let yPosition = parseFloat(d3.select(this).attr("y")) + 14; 

        svg.append("text")
            .attr("id", "tooltip")
            .attr("x", xPosition) 
            .attr("y", yPosition)
            .attr("text-anchor", "middle") 
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text(d); 


    })
    .on("mouseout", function() {
        // and because we gave the hover text an id, it's easy to delete! 
        d3.select("#tooltip").remove(); 
    })



d3.select("#sort_button")
    .on("click", function() {
        sortBars(); 
    })
