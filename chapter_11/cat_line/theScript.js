var w = 800;
var h = 300;
var padding = 40;

// defining this outside of the render function, will use while reading in the data 
const rowConverter = function(d) {
    return {
        date: new Date(+d.year, (+d.month - 1)),  //Make a new Date object for each year + month
        average: parseFloat(d.average)  //Convert from string to float
    };
}

const formatTime = d3.timeFormat("%Y")

const render = data => {

    const dataset = data; 

    //Create scale functions
    xScale = d3.scaleTime()
                .domain([d3.min(dataset, d => d.date), d3.max(dataset, d => d.date)])
                .rangeRound([padding, w]); 

    yScale = d3.scaleLinear()
                .domain([d3.min(dataset, function(d) {if (d.average > 0) return d.average; }) - 10, 
                d3.max(dataset, d => d.average)])
                .rangeRound([h - padding, 0]); 


    //defining axes 
    xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(10)
                .tickFormat(formatTime); 

    yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(10); 

    //Define line generator
    line = d3.line()
                .defined(d => d.average > 0 && d.average <=350)
                .x(d => xScale(d.date))
                .y(d => yScale(d.average))

    dangerLine = d3.line()
                .defined(d => d.average >= 350)
                .x(d => xScale(d.date))
                .y(d => yScale(d.average))
    
    //Create SVG element
    var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    //Create line
    svg.append("path")
        // notice the singular 'datum' - the line is a single graphical mark 
        .datum(dataset)
        .attr("class", "line")
        .attr("d", line); // I think attribute d for 'draw' 

    svg.append("path")
        .datum(dataset)
        .attr("class", "line danger") // giving it two classes here
        .attr("d", dangerLine); 


    //Draw 350 ppm "safeLevel" line - just a starting (1) and ending (2) point for both x and y 
    svg.append("line")
        .attr("class", "line safeLevel")
        .attr("x1", padding)
        .attr("x2", w)
        .attr("y1", yScale(350))
        .attr("y2", yScale(350));

    //annotation for the safeLevel line
    svg.append("text")
        .attr("id", "lineAnnotation")
        .attr("x", padding + 10)
        .attr("y", yScale(350) - 8)
        .text("350ppm 'safe' level")

    // add axes 
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(xAxis)

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis)

}; 

d3.csv("mauna_loa_co2_monthly_averages.csv", rowConverter)
    .then(data => {
    render(data); 
}); 
