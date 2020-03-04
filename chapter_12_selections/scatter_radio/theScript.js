//Width and height
var w = 600;
var h = 300;
var padding = 40;

//Dynamic, random dataset
let dataset = []; 
const numDataPoints = 200; 
const xRange = 1000; 
const yRange = 1000; 

for (let i = 0; i < numDataPoints; i++) {
  let num1 = Math.floor(Math.random() * xRange); 
  let num2 = Math.floor(Math.random() * yRange); 
  dataset.push([num1, num2]); 
}

// create scale functions
const xScale = d3.scaleLinear()
                .domain([0, xRange])
                .range([padding, w - padding / 2]);

const yScale = d3.scaleLinear() 
                .domain([0, yRange])
                .range([h - padding, padding / 2]);

const xAxis = d3.axisBottom()
                .scale(xScale);

const yAxis = d3.axisLeft()
                .scale(yScale);          

// create SVG element               
const svg = d3.select("body")
              .append("svg")
                .attr("height", h)
                .attr("width", w); 

// create circles                 
const allCircles = svg.selectAll("circles")
      .data(dataset)
      .enter()
      .append("circle")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => yScale(d[1]))
        .attr("r", 3)
        .attr("fill", "#333399")

       
// create X axis
svg.append("g")
  .attr("class", "axis")
  .attr("transform", `translate(0, ${h - padding})`)
  .call(xAxis);

// create Y axis
svg.append("g")
  .attr("class", "axis")
  .attr("transform", `translate(${padding}, 0)`)
  .call(yAxis);

// update styling on radio button click 
d3.selectAll("input")
  .on("click", function(){
    
    const threshold = +d3.select(this).node().value; 

    allCircles.attr("fill", "#333399")
      .filter(d => d[0] < threshold)
        .attr("fill", "#669999")

  }); 

// d3.selectAll("input")
//   .on("click", function() {

//     var threshold = +d3.select(this).node().value;
    
//     allCircles.attr("fill", "black")
//       .filter(function(d) {
//         return d[0] <= threshold;
//       })
//       .attr("fill", "red");

//   });
