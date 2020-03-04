//Width and height
var w = 600;
var h = 250;

var dataset = [ { key: 0, value: 5 },		//dataset is now an array of objects.
                { key: 1, value: 10 },		//Each object has a 'key' and a 'value'.
                { key: 2, value: 13 },
                { key: 3, value: 19 },
                { key: 4, value: 21 },
                { key: 5, value: 25 },
                { key: 6, value: 22 },
                { key: 7, value: 18 },
                { key: 8, value: 15 },
                { key: 9, value: 13 },
                { key: 10, value: 11 },
                { key: 11, value: 12 },
                { key: 12, value: 15 },
                { key: 13, value: 20 },
                { key: 14, value: 18 },
                { key: 15, value: 17 },
                { key: 16, value: 16 },
                { key: 17, value: 18 },
                { key: 18, value: 23 },
                { key: 19, value: 25 } ];


const xScale = d3.scaleBand()
                .domain(d3.range(dataset.length))     
                .rangeRound([0, w])           
                .paddingInner(0.05); 

const yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, d => d.value)])
                .range([0, h])

// create SVG element
const svg = d3.select("body")
                .append("svg")
                  .attr("height", h)
                  .attr("width", w); 

// create bars                   
svg.selectAll("rect")
    .data(dataset, d=> d .key) // always remember this for data objects. what is the key to bind to? 
    .enter()
    .append("rect")
      .attr("x", (d, i) => xScale(i))
      .attr("y", d => h - yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", d => yScale(d.value))
      .attr("fill", d => `rgb(0, 0, ${ d.value * 10 })`); 

// create labels 
svg.selectAll("text")
    .data(dataset, d => d.key)
    .enter()
    .append("text")
      .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr("y", d => h - yScale(d.value) + 14 )
      .attr("text-anchor", "middle")
      .text(d => d.value)
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "white");

d3.select("input")
    .on("change", function() {
        const threshold = +d3.select(this).node().value; 

        svg.selectAll("rect")
          .attr("fill", d => `rgb(0, 0, ${ d.value * 10 })` )
          .filter(function(d) {
            return d.value <= threshold;
        })
          .attr("fill", "red");
    }); 

