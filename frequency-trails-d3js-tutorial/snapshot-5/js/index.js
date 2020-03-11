var lineData = [];
var lineWidth = 580;
var lineSpacing = 20;
var labelWidth = 200;
var paths;
var labels;

var xScale = d3.scaleLinear().domain([0, 1435]).range([0, lineWidth]);
var yScale = d3.scaleLinear().domain([0, 1]).range([0, -40]);
var areaGenerator = d3.area()
    .x(function(d) {
        return xScale(d.minutes);
    })
    .y0(0)
    .y1(function(d) {
        return yScale(d.value);
    });


/* Data processing */
function smoothed(values) {
    var smoothed = [];
    var lastIndex = values.length - 1;
    
    for (var i = 1; i < lastIndex; i++) {
        smoothed[i] = (values[i - 1] + values[i] + values[i + 1]) / 3;
    }

    smoothed[0] = values[0];
    smoothed[lastIndex] = values[lastIndex];

    return smoothed;
}

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

    // Smooth
    lineData.forEach(function(d) {
        var values = d.data.map(function(d) {
            return d.value;
        });
        var smoothedValues = smoothed(values);

        d.data.forEach(function(dd, i) {
            dd.value = smoothedValues[i];
        });
    });

    // Normalize
    lineData.forEach(function(activity) {
        var maxValue = d3.max(activity.data, function(d) {
            return d.value;
        });

        activity.data.forEach(function(d) {
            d.value = d.value / maxValue;
        });
    });

    // Y offsets
    lineData.forEach(function(activity, i) {
        activity.yOffset = i * lineSpacing;
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
        .attr('transform', function(d) {
            return 'translate(' + labelWidth + ', ' + d.yOffset + ')';
        })
        .attr('d', function(d) {
            return areaGenerator(d.data);
        });
}

function updateLabels() {
    labels = d3.select('.chart .labels')
        .selectAll('text')
        .data(lineData)
        .join('text')
        .attr('transform', function(d, i) {
            return 'translate(' + (labelWidth - 5) + ', ' + d.yOffset + ')';
        })
        .style('text-anchor', 'end')
        .text(function(d) {
            return d.name;
        });
}

function updateChart() {
    updateLines();
    updateLabels();
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
