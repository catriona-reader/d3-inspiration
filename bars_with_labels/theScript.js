const h = 200; 
const w = 500; 
const barPadding = 1; 

let dataset = []; 

for (let i = 0; i < 20; i++) {
     dataset.push(Math.round(Math.random() * 30))
}; 

const svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h); 

svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function (_d, i) { return i * (w / dataset.length); })
    .attr("y", function(d) { return h - d * 4 })
    .attr("height", function(d) { return d * 4 })
    .attr("width", w / dataset.length - barPadding)
    .attr("fill", function(d) {
        return `rgb(0, 0, ${Math.round(d * 10)})`; 
    })

svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(d => d) // remember the shorthand for functions 
    .attr("x", function (_d, i) { 
        return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2 ; 
    })
    .attr("y", function(d) { return h - d * 4 + 15})
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "white")
    .attr("text-anchor", "middle")
