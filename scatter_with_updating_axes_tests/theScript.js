const h = 600; 
const w = 1200; 
const barPadding = 1; 
const padding = 80; 

// creating the data
// edit 
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

const xAxis = d3.axisBottom(xScale);     

const yAxis = d3.axisLeft(yScale); 

const svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h); 

//define clip-path so that circles don't appear out of bounds     
svg.append("clipPath")
    .attr("id", "chart-area")
    .append("rect")
    .attr("x", padding)
    .attr("y", padding)
    .attr("width", w - padding * 2 ) // x 2 for right and left 
    .attr("height", h - padding * 2 ) // x 2 for top and bottom 
    
    
//adding in the circles, to a group element with the clip-path 
svg.append("g")   
    .attr("id", "circles")      
    .attr("clip-path", "url(#chart-area") //reference the id of the clip-path
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => yScale(d[1]))
        .attr("r", d => aScale(d[1]))
        .attr("fill", "steelblue")
        .attr("opacity", "0.8"); 

svg.append('g')
    .attr("class", "x axis")
    .attr("transform", `translate(${0}, ${h - padding})`)
    .call(xAxis); 

svg.append('g')
    .attr("class", "y axis")
    .attr("transform", `translate(${padding}, ${0})`)
    .call(yAxis)


csv('https://vizhub.com/curran/datasets/temperature-in-san-francisco.csv')
    .then(data => {
        data.forEach(d => {
          d.temperature = +d.temperature;
        d.timestamp = new Date(d.timestamp); 
    });
    render(data);
  });