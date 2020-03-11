//Width and height
var w = 800;
var h = 500;
var padding = 20;

//For converting strings to Dates
const parseTime = d3.timeParse("%Y-%m"); 

// For formatting dates as strings 
const formatTime = d3.timeFormat("%b %Y"); 

//Set up stack method
const stack = d3.stack()
              .order(d3.stackOrderDescending);  // <-- Flipped stacking order

//Load in data
d3.csv("ev_sales_data.csv", function(d, i, cols) {
        //Initial 'row' object includes only date
        const row = {
            date: parseTime(d.Date),  //Make a new Date object for each year + month
        };
    
        //Loop once for each vehicle type, changing the values to intigers if they exist
        for (let i = 1; i < cols.length; i++) {
            const col = cols[i];
    
            //If the value exists…
            if (d[cols[i]]) {
                row[cols[i]] = +d[cols[i]];  //Convert from string to int
            } else {  //Otherwise…
                row[cols[i]] = 0;  //Set to zero
            }
        }
    
        return row;

}).then(function(data) {

    const dataset = data;

    //Now that we know the column names in the data…
    const keys = dataset.columns;
    keys.shift();  //Remove first column name ('Date')
    stack.keys(keys);  //Stack using what's left (the car names)

    //Data, stacked
    var series = stack(dataset);
    // console.log(series);

    //Create scale functions
    xScale = d3.scaleTime()
                   .domain([
                        d3.min(dataset, function(d) { return d.date; }),
                        d3.max(dataset, function(d) { return d.date; })
                    ])
                   .range([padding, w - padding * 2]);

    yScale = d3.scaleLinear()
                    .domain([
                        0,
                        d3.max(dataset, function(d) {
                            var sum = 0;

                            //Loops once for each row, to calculate
                            //the total (sum) of sales of all vehicles
                            for (var i = 0; i < keys.length; i++) {
                                sum += d[keys[i]];
                            };

                            return sum;
                        })
                    ])
                    .range([h - padding, padding / 2])
                    .nice();

    //Define axes
    xAxis = d3.axisBottom()
               .scale(xScale)
               .ticks(10)
               .tickFormat(formatTime);

    //Define Y axis
    yAxis = d3.axisRight()
               .scale(yScale)
               .ticks(5);

    //Define area generator
    area = d3.area()
                .x(function(d) { return xScale(d.data.date); })
                .y0(function(d) { return yScale(d[0]); })
                .y1(function(d) { return yScale(d[1]); });

    //Create SVG element
    var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    //Create areas
    svg.selectAll("path")
        .data(series)
        .enter()
        .append("path")
        .attr("class", "area")
        .attr("d", area)
        .attr("fill", function(d, i) {
            return d3.schemeCategory10[i];
        })
        .append("title")  //Make tooltip
        .text(function(d) {
            return d.key;
        });

    //Create axes
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (w - padding * 2) + ",0)")
        .call(yAxis);

});