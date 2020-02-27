let dataset = []; 

for (let i = 0; i < 20; i++) {
    dataset.push(Math.random() * 30)
}; 

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']

function randomColor() { 
    let c = colors[ Math.floor(Math.random() * 7) ]; 
    console.log(c); 
    return c 
}; 

d3.select("body").selectAll("div")
    .data(dataset)
    .enter()
    .append("div")
    .attr("class", "bar") 
    .style("height", function(d) { return d * 10 + "px"; })
    .style("background-color", function(d) {return randomColor()}); 

