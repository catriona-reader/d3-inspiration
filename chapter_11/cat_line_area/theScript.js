var w = 800;
var h = 300;
var padding = 40;
const topMargin = 80; 

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
    const xScale = d3.scaleTime()
                .domain([d3.min(dataset, d => d.date), d3.max(dataset, d => d.date)])
                .rangeRound([padding, w]); 

    const yScale = d3.scaleLinear()
                .domain([d3.min(dataset, function(d) {if (d.average > 0) return d.average; }) - 10, 
                d3.max(dataset, d => d.average)])
                .rangeRound([h - padding , topMargin]); 


    //defining axes 
    const xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(10)
                .tickFormat(formatTime); 

    const yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(10)
                .tickSize(-(w - padding))

    //Define line generator
    const area = d3.area()
                .defined(d => d.average > 0 )
                .x(d => xScale(d.date))
                .y0(d => yScale.range()[0]) // the start of the range set earlier 
                .y1(d => yScale(d.average)); 

    const dangerArea = d3.area()
                .defined(d => d.average >= 350)
                .x(d => xScale(d.date))
                .y0(d => yScale(350))
                .y1(d => yScale(d.average)); 
    
    //Create SVG element
    var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    // add axes 
    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(xAxis)
    

    svg.append("g")
        .attr("class", "yAxis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis)
        .call(g => g.select(".domain") // this removes the top path path.domain
            .remove())


    //Create line
    svg.append("path")
        // notice the singular 'datum' - the line is a single graphical mark 
        .datum(dataset)
        .attr("class", "line")
        .attr("d", area); // I think attribute d for 'draw' 

    svg.append("path")
        // notice the singular 'datum' - the line is a single graphical mark 
        .datum(dataset)
        .attr("class", "line danger")
        .attr("d", dangerArea); // I think attribute d for 'draw' 

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

    svg.append("text")
        .attr("id", "title")
        .attr("x", padding)
        .attr("y", padding  )
        .text("Average monthly values of CO2")

    svg.append("text")
        .attr("id", "subtitle")
        .attr("x", padding)
        .attr("y", padding + 20)
        .text("Measured at the Mauna Loa Observatory in Hawaii")

    svg.append("text")
        .attr("id", "footer")
        .attr("x", padding)
        .attr("y", h - 6)
        .text("*Gaps in graph indicate missing data")


    // testing out a legend 
    const keys = ['safe', 'danger']; 
    const colors = [ '#34ace0', '#ff5252']; 

    const size = 10; 
    svg.selectAll("myDots")
        .data(keys)
        .enter()
        .append("rect")
            .attr("x", w - padding * 1.5 )
            .attr("y", (d, i) => topMargin / 4 + i*(size + 5))
            .attr("width", size)
            .attr("height", size)
            .style("fill", (d, i) => colors[i])
            .style("opacity", 0.8)

    svg.selectAll("myLabels")
        .data(keys)
        .enter()
        .append("text")
            .attr("x", w - padding * 1.5 + size*1.5 )
            .attr("y", (d, i) => topMargin / 4 + i*(size + 5) + 7.5)
            .style("fill", (d, i) => colors[i])
            .text((d, i) => keys[i])
            .attr("text-anchor", "left")
            // .style("alignment-baseline", "auto")
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px")

}; 

d3.csv("mauna_loa_co2_monthly_averages.csv", rowConverter)
    .then(data => {
    render(data); 
}); 
