const h = 100; 
const w = 500; 

const dataset = [ 5, 10, 15, 20, 25, ]; 

const svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h); 


const circles = svg.selectAll("circle")
                    .data(dataset)
                    .enter()
                    .append("circle")

circles.attr("cx", function(d,i) {
    return (i * 60) + 25; 
})
        .attr("cy", h/2)
        .attr("r", function(d) {
            return d; 
        }); 

circles.attr("fill", "yellow")
        .attr("stroke", "orange")
        .attr("stroke-width", function(d) { return d / 2; });