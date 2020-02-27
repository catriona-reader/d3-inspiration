const h = 600; 
const w = 1200; 
const barPadding = 1; 
const padding = 80; 

const dataset = [
    [5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
    [410, 12], [475, 44], [25, 67], [85, 21], [220, 88], [600, 150]
  ];

const xScale = d3.scaleLinear()
                .domain([0 , d3.max(dataset, d => d[0])])
                .range([padding, w - padding])
                .nice(); 

const yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, d => d[1])])
                .range([h - padding, padding])
                .nice(); 

const aScale = d3.scaleSqrt()
                .domain([0, d3.max(dataset, d => d[1])])
                .range([0, 10]); 

// const formatAsPercent = d3.format(".1%");                

const xAxis = d3.axisBottom(xScale)
                .ticks(5); 
                // .tickFormat(formatAsPercent);         

const yAxis = d3.axisLeft(yScale); 

const svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h); 

//adding in guidelines for the circles 
svg.selectAll("line")
    .data(dataset)
    .enter()
    .append("line")
        .attr("x1", d => xScale(d[0]))
        .attr("x2", d => xScale(d[0]))
        .attr("y1", d => h - padding)
        .attr("y2", d => yScale(d[1]))
        .attr("stroke", "#ddd")
        .attr("stroke-width", 1);

//adding in the circles                 
svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => yScale(d[1]))
        .attr("r", d => aScale(d[1]))
        .attr("fill", "steelblue")
        .attr("opacity", "0.8"); 

// svg.selectAll("text")
//     .data(dataset)
//     .enter()
//     .append("text")
//     .text(function(d) {
//         return `${d[0]}, ${d[1]}`; 
//     })
//     .attr("x", d => xScale(d[0]) + Math.sqrt(h - d[1]))
//     .attr("y", d => yScale(d[1]))
//     .attr("font-family", "sans-serif")
//     .attr("font-size", "11px")
//     .attr("fill", "black")

svg.append('g')
    .attr("class", "axis")
    .attr("transform", `translate(${0}, ${h - padding})`)
    .call(xAxis); 

svg.append('g')
    .attr("class", "axis")
    .attr("transform", `translate(${padding}, ${0})`)
    .call(yAxis)
