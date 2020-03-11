//Width and height
var w = 500;
var h = 300;

//Original data
const dataset = [
    { apples: 5, oranges: 10, grapes: 22 },
    { apples: 4, oranges: 12, grapes: 28 },
    { apples: 2, oranges: 19, grapes: 32 },
    { apples: 7, oranges: 23, grapes: 35 },
    { apples: 23, oranges: 17, grapes: 43 }
];

// set up the stack method 
const stack = d3.stack()
                .order(d3.stackOrderDescending)
                .keys(["apples", "oranges", "grapes"])

// stack that data
const series = stack(dataset); 

// and now our dataset basically is three sub-arrays of data, each with 5 sub-arrays, like so: 

// [
//     [[], [], [], [], []], 
//     [[], [], [], [], []],  
//     [[], [], [], [], []]
// ]


//Set up scales
const xScale = d3.scaleBand()
    .domain(d3.range(dataset.length))
    .range([0, w])
    .paddingInner(0.05);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d.apples + d.oranges + d.grapes)])
    .range([h, 0]);
    
// setting up my own colorzzzzz
const colors = d3.scaleOrdinal().range(['#233C67', '#4470AD',  '#99AFD7'])

// create SVG element
const svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

// one group for each row of data
const groups = svg.selectAll('g')
    .data(series) // adding the already stacked dataset
    .enter()
    .append('g')
    .style("fill", (d, i) => colors(i))


// and now them rects 
const rects = groups.selectAll("rect")
    .data(d => d) // weird 
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(i))
    .attr("y", d => yScale(d[1])) //
    .attr("height", d => yScale(d[0]) - yScale(d[1])) // 
    .attr("width", d => xScale.bandwidth())
