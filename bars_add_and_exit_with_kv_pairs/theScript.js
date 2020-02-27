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

const key = function(d) {
    return d.key; 
}

var xScale = d3.scaleBand()
                .domain(d3.range(dataset.length))
                .rangeRound([0, w])
                .paddingInner(0.05);

var yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, d => d.value)])
                .range([0, h]);

//Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

//Create bars
svg.selectAll("rect")
    .data(dataset, key)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
        return xScale(i);
    })
    .attr("y", function(d) {
        return h - yScale(d.value);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) {
        return yScale(d.value);
    })
    .attr("fill", function(d) {
        return "rgb(0, 0, " + Math.round(d.value * 10) + ")";
    });

//Create labels
svg.selectAll("text")
    .data(dataset, key)
    .enter()
    .append("text")
    .text(d => d.value)
    .attr("text-anchor", "middle")
    .attr("x", function(d, i) {
        return xScale(i) + xScale.bandwidth() / 2;
    })
    .attr("y", function(d) {
        if (yScale(d.value) < 30) {
            return h - yScale(d.value) - 14;
        } else {
            return h - yScale(d.value) + 14;
        }
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", function(d) {
        if (yScale(d.value) < 30) {
            return "black";
        } else {
            return "white";
        }
    });

d3.selectAll("button")
    .on("click", function() {
    
    const buttonId = d3.select(this).attr("id"); 

    if (buttonId == "add_one") {

        const minValue  = 2; 
        const maxValue = 25 - minValue; 
        const newNumber = Math.floor(Math.random() * maxValue) + minValue; 
        const lastKeyValue = dataset[dataset.length - 1].key; 
        dataset.push({key: lastKeyValue + 1, 
                        value: newNumber}); 

    } else {
        dataset.shift()
    }

    xScale.domain(d3.range(dataset.length))

    const bars = svg.selectAll("rect")
                        .data(dataset, key); //binding all the new data

    bars.enter() // now only referring to the new element 
        .append("rect")
        .attr("x", w) // keeping it out of sight
        .attr("y", function(d) {
            return h - yScale(d.value); 
        }) 
        .attr("width", xScale.bandwidth())
        .attr("height", d => yScale(d.value))
        .attr("fill", function(d)  {
            return `rgb(0, 0, ${Math.round(d.value *10)})`
        })
        .merge(bars) // now bringing this single element into the rest of the bars
        .transition().duration(500)
        .attr("x", function(d, i) {
            return xScale(i); 
        })
        .attr("y", function(d) {
            return h - yScale(d.value); 
        }) 
        .attr("width", xScale.bandwidth())
        .attr("height", d => yScale(d.value))

    bars.exit() // now only referring to the new element 
        .transition()
        .duration(500)
        .attr("x", 0) // keeping it out of sight
        .remove();
    
    const text = svg.selectAll("text")
                    .data(dataset, key); 
    
    text.enter()
        .append("text")
        .text(d => d.value)
        .attr("text-anchor", "middle")
        .attr("x", w)
        .attr("y", function(d) {
            if (yScale(d.value) < 30) {
                return h - yScale(d.value) - 14;
            } else {
                return h - yScale(d.value) + 14;
            }
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", function(d) {
            if (yScale(d.value) < 30) {
                return "black";
            } else {
                return "white";
            }
        })
        .merge(text) // and remember, this is the variable defined above
        .transition().duration(500)
        .attr("x", function(d, i) {
            return xScale(i) + xScale.bandwidth() / 2;
        });


    text.exit()
        .transition()
        .duration(500)
        .attr("x", 0)
        .remove(); 


    }); 

// d3.select("#add_one")
//     .on("click", function() {

//         const maxValue = 20; 
//         const newNumber = Math.floor(Math.random() * maxValue); 
//         dataset.push(newNumber); 

//         xScale.domain(d3.range(dataset.length))

//         const bars = svg.selectAll("rect")
//                         .data(dataset, key); //binding all the new data
    
//         bars.enter() // now only referring to the new element 
//             .append("rect")
//             .attr("x", w) // keeping it out of sight
//             .attr("y", function(d) {
//                 return h - yScale(d.value); 
//             }) 
//             .attr("width", xScale.bandwidth())
//             .attr("height", d => yScale(d.value))
//             .attr("fill", function(d)  {
//                 return `rgb(0, 0, ${Math.round(d.value*10)})`
//             })
//             .merge(bars) // now bringing this single element into the rest of the bars
//             .transition().duration(500)
//             .attr("x", function(d, i) {
//                 return xScale(i); 
//             })
//             .attr("y", function(d) {
//                 return h - yScale(d.value); 
//             }) 
//             .attr("width", xScale.bandwidth())
//             .attr("height", d => yScale(d.value))

//         const text = svg.selectAll("text")
//                         .data(dataset, key); 
        
//         text.enter()
//             .append("text")
//             .text(d => d.value)
//             .attr("text-anchor", "middle")
//             .attr("x", w)
//             .attr("y", function(d) {
//                 if (yScale(d.value) < 30) {
//                     return h - yScale(d.value) - 14;
//                 } else {
//                     return h - yScale(d.value) + 14;
//                 }
//             })
//             .attr("font-family", "sans-serif")
//             .attr("font-size", "11px")
//             .attr("fill", function(d) {
//                 if (yScale(d.value) < 30) {
//                     return "black";
//                 } else {
//                     return "white";
//                 }
//             })
//             .merge(text) // and remember, this is the variable defined above
//             .transition().duration(500)
//             .attr("x", function(d, i) {
//                 return xScale(i) + xScale.bandwidth() / 2;
//             });
//     }); 


// // weird, but remember that even though we want to remove an element, we still 
// // need to enter the updated data before exiting the extra data 
// d3.select("#remove_one")
//     .on("click", function() {

//         dataset.pop()

//         xScale.domain(d3.range(dataset.length))

//         const bars = svg.selectAll("rect")
//                         .data(dataset, key); //binding all the new data

//         bars.enter() // now only referring to the new element 
//             .append("rect")
//             .attr("x", w) // keeping it out of sight
//             .attr("y", function(d) {
//                 return h - yScale(d.value); 
//             }) 
//             .attr("width", xScale.bandwidth())
//             .attr("height", d => yScale(d.value))
//             .attr("fill", function(d)  {
//                 return `rgb(0, 0, ${Math.round(d.value *10)})`
//             })
//             .merge(bars) // now bringing this single element into the rest of the bars
//             .transition().duration(500)
//             .attr("x", function(d, i) {
//                 return xScale(i); 
//             })
//             .attr("y", function(d) {
//                 return h - yScale(d.value); 
//             }) 
//             .attr("width", xScale.bandwidth())
//             .attr("height", d => yScale(d.value))
    
//         bars.exit() // now only referring to the new element 
//             .transition()
//             .duration(500)
//             .attr("x", w) // keeping it out of sight
//             .remove();
      
//         const text = svg.selectAll("text")
//                         .data(dataset, key); 
        
//         text.enter()
//             .append("text")
//             .text(d => d.value)
//             .attr("text-anchor", "middle")
//             .attr("x", w)
//             .attr("y", function(d) {
//                 if (yScale(d.value) < 30) {
//                     return h - yScale(d.value) - 14;
//                 } else {
//                     return h - yScale(d.value) + 14;
//                 }
//             })
//             .attr("font-family", "sans-serif")
//             .attr("font-size", "11px")
//             .attr("fill", function(d) {
//                 if (yScale(d.value) < 30) {
//                     return "black";
//                 } else {
//                     return "white";
//                 }
//             })
//             .merge(text) // and remember, this is the variable defined above
//             .transition().duration(500)
//             .attr("x", function(d, i) {
//                 return xScale(i) + xScale.bandwidth() / 2;
//             });


//         text.exit()
//             .transition()
//             .duration(500)
//             .attr("x", w)
//             .remove(); 
//     }); 