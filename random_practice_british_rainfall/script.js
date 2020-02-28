
const dataset = [{ k: 'Jan', v: 82.9}, 
            {k: 'Feb', v: 60.3}, 
            {k: 'Mar', v: 64.0}, 
            {k: 'Apr', v: 58.7}, 
            {k: 'May', v: 58.4}, 
            {k: 'Jun', v: 61.8}, 
            {k: 'Jul', v: 62.6}, 
            {k: 'Aug', v: 69.3}, 
            {k: 'Sep', v: 69.7}, 
            {k: 'Oct', v: 91.7}, 
            {k: 'Nov', v: 88.2},
            {k: 'Dec', v: 87.2}]


const h = 400; 
const w = 800; 

const svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h); 


const xScale = d3.scaleBand()
                .domain(d3.range(dataset.length))
                .rangeRound([0, w])
                .paddingInner(0.05); 

const yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, d => d.v)])
                .range([0, h]); 


svg.selectAll("rect")
        .data(dataset, d => d.k)
        .enter()
        .append("rect")
            .attr("x", (d, i) => xScale(i))
            .attr("y", d => h - yScale(d.v))
            .attr("width", function() { return xScale.bandwidth() } )
            .attr("height", d => yScale(d.v))
            .attr("fill", function(d) {
                return `rgb(0, 0 , ${Math.round( (100 - d.v) * 5 )})`
            })