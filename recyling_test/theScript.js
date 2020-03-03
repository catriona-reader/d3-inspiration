const h = 600; 
const w = 1200; 
const barPadding = 1; 
const margin = { left: 100, right: 20, top:60, bottom:150 }

// creating the data
const render = data => {

    const xScale = d3.scaleBand()
                    .domain(d3.range(data.length))
                    .rangeRound([margin.left, w - margin.right])
                    .paddingInner(0.1); 

    const yScale = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.Recycling_Rates)])
                    .range([ h - margin.bottom, margin.top ]); 

    const svg = d3.select("body")
                    .append("svg")
                    .attr("height", h)
                    .attr("width", w); 

    const yAxis = d3.axisLeft(yScale)
                    .tickSize(-(w - margin.left - margin.right)); 


    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d => data[d].Area); 


    svg.append("g")
        .attr("id", "x_axis") 
        .attr("transform", `translate(0,  ${h - margin.bottom})`)
        .call(xAxis)
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("font-size", 13)
            .attr("transform", "rotate(-45)" );

    svg.append("g")
        .attr("id", "y_axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis); 

    svg.selectAll("rect")
        .data(data, d => d.Code)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(i) )
        .attr("y", d => yScale(d.Recycling_Rates) )
        .attr("width", d => xScale.bandwidth())
        .attr("height", d => h - yScale(d.Recycling_Rates) - margin.bottom)
        .attr("fill",  d => `rgb(0, ${Math.round( d.Recycling_Rates * 3.5 )}, 0)`)

    let titleText = 'Recycling Rates by Borough - 2019'
      
    svg.append("text")
        .attr("id", "title")
        .attr("y", margin.top - 20)
        .attr("x", margin.left)
        .text(titleText);

        
    d3.selectAll("button")
        .on("click", function() {

            const buttonId = d3.select(this).attr("id");
            var currentData; 

            if (buttonId == "2018") {
                currentData = d3.csv('/household_recycling_2018.csv'); 
            } else if (buttonId == "2019") {
                currentData = d3.csv('/household_recycling_2019.csv'); 
            } else if (buttonId == "2017") {
                currentData = d3.csv('/household_recycling_2017.csv'); 
            } else if (buttonId == "2016") {
                currentData = d3.csv('/household_recycling_2016.csv'); 
            }

            currentData.then(data => {
                data.forEach( d => {
                    d.Recycling_Rates = +d.Recycling_Rates; 
                }); 
                data.sort(function(a, b) {
                    return d3.ascending(a.Area, b.Area); 
             }); 

            yScale.domain([0, d3.max(data, d => d.Recycling_Rates)])
            xScale.domain(d3.range(data.length))

            d3.select("#x_axis").call(xAxis); 
            d3.select("#y_axis").call(yAxis); 

            //editing this title part 
            titleText = `Recycling Rates by Borough - ${buttonId}`
            d3.select("#title").text(titleText); 

            const bars = svg.selectAll("rect")
                .data(data, d => d.Code); 

            bars.enter()
                .append("rect")
                .attr("x", (d, i) => xScale(i))
                .attr("y", d => h ) // keeping it out of sight 
                .attr("width", d => xScale.bandwidth())
                .attr("height", d => h - yScale(d.Recycling_Rates) - margin.bottom)
                .attr("fill",  d => `rgb(0, ${Math.round( d.Recycling_Rates * 3.5 )}, 0)`)
                .merge(bars)
                .transition().duration(500)
                .attr("x", (d, i) => xScale(i) )
                .attr("y", d => yScale(d.Recycling_Rates) )
                .attr("width", d => xScale.bandwidth())
                .attr("height", d => h - yScale(d.Recycling_Rates) - margin.bottom)

    
            bars.exit() // now only referring to the new element 
                .remove();
            });          
    }); 

}; 


d3.csv('/household_recycling_2019.csv')
    .then(data => {
        data.forEach(d => { 
            d.Recycling_Rates = +d.Recycling_Rates; 
        }); 
    // sorting the data as I read it in 
    data.sort(function(a, b) {
            return d3.ascending(a.Area, b.Area); 
     }); 
    render(data); 
}); 

