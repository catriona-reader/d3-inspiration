var lineData = [];
var lineWidth = 580;
var lineSpacing = 20;
var paths;

var xScale = d3.scaleLinear().domain([0, 1435]).range([0, lineWidth]);
var yScale = d3.scaleLinear().domain([0, 0.001]).range([0, -40]);
var areaGenerator = d3.area()
    .x(function(d) {
        return xScale(d.minutes);
    })
    .y0(0)
    .y1(function(d) {
        return yScale(d.value);
    });


/* Data processing */
function processData(data) {
    // Create an array of activities where each activity
    // contains an array of time series data
    var grouped = _.groupBy(data, function(d) {
        return d.activity;
    });

    Object.keys(grouped).forEach(function(key) {
        lineData.push({
            name: key,
            data: grouped[key]
        });
    });
}


/* Update functions */
function updateLines() {
    paths = d3.select('.chart .lines')
        .selectAll('path')
        .data(lineData)
        .join('path')
        .style('fill', '#eee')
        .style('stroke', '#aaa')
        .style('opacity', 0.8)
        .attr('transform', function(d, i) {
            return 'translate(0, ' + i * lineSpacing + ')';
        })
        .attr('d', function(d) {
            return areaGenerator(d.data);
        });
}

function updateChart() {
    updateLines();
}


/* Load data */
function processRow(d) {
    return {
        activity: d.activity,
        minutes: +d.time, // minutes since midnight
        value: +d.p
    };
}

function dataIsReady(data) {
    processData(data);
    updateChart();
}

d3.csv('data/activity.csv', processRow)
    .then(dataIsReady);
