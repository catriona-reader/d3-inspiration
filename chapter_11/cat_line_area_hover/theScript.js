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

    var lines = document.getElementsByClassName('line');

    const mouseG = svg.append("g")
         .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
         .attr("class", "mouse-line")
         .style("stroke", "#C0C0BB")
         .style("stroke-width", "1px")
         .style("opacity", "0");

    const mousePerLine = mouseG.select('.mouse-per-line')
        .datum(dataset)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");
   
    mousePerLine.append("circle")
        .attr("r", 7)
        .style("stroke", "steelblue")
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");
   
    mousePerLine.append("text")
        .attr("transform", "translate(10,3)");
   
    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', w) // can't catch mouse events on a g element
        .attr('height', h)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.selectAll(".mouse-per-line circle")
            .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
            .style("opacity", "0");
        })
         .on('mouseover', function() { // on mouse in show line, circles and text
            d3.select(".mouse-line")
            .style("opacity", "1");
           d3.select(".mouse-per-line circle")
             .style("opacity", "1");
           d3.select(".mouse-per-line text")
             .style("opacity", "1");
         })
         .on('mousemove', function() { // mouse moving over canvas
            var mouse = d3.mouse(this);
            d3.select(".mouse-line")
              .attr("d", function() {
                var d = "M" + mouse[0] + "," + (h-padding);
                d += " " + mouse[0] + "," + topMargin;
                return d;
              });
   
           //come here 
           d3.selectAll(".mouse-per-line")
             .attr("transform", function(d, i) {
               console.log(width/mouse[0])
               var xDate = x.invert(mouse[0]),
                   bisect = d3.bisector(function(d) { return d.date; }).right;
                   idx = bisect(d.average, xDate);
               
               var beginning = 0,
                   end = lines.getTotalLength(),
                   target = null;
   
               while (true){
                 target = Math.floor((beginning + end) / 2);
                 pos = lines.getPointAtLength(target);
                 if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                     break;
                 }
                 if (pos.x > mouse[0])      end = target;
                 else if (pos.x < mouse[0]) beginning = target;
                 else break; //position found
               }
               
               d3.select(this).select('text')
                 .text(y.invert(pos.y).toFixed(2));
                 
               return "translate(" + mouse[0] + "," + pos.y +")";
             });
         });

}; 

d3.csv("mauna_loa_co2_monthly_averages.csv", rowConverter)
    .then(data => {
    render(data); 
}); 
