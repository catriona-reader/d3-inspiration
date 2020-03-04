//Width and height
const w = 400;
const h = 400;

const dataset = [ 5, 10, 20, 45, 6, 25 ];

const outerRadius = w / 2;
const innerRadius = w / 2 - 40 ; // had this set to 0 to make a full pie 
const arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

const pie = d3.pie()
            .padAngle(0.01); 

//Easy colors accessible via a 10-step ordinal scale
const color = d3.scaleOrdinal(d3.schemeCategory10);

//Create SVG element
const svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);


const arcs = svg.selectAll("g.arc")
                .data(pie(dataset))      // pass the dataset through our pie function 
                .enter()
                .append('g')      // each arc is a new group
                .attr("class", "arc")
                .attr("transform", `translate(${outerRadius}, ${outerRadius})`) // moving into the centre

// draw each arc path 
arcs.append("path")
    .attr("fill", (d, i) => color(i)) // color function defined above 
    .attr("d", arc)

// add text labels to centre of each slice 
arcs.append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .text(d => d.value); 
