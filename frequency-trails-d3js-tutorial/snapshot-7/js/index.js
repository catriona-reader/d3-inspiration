var lineData = [];
var lineWidth = 580;
var lineSpacing = 20;
var labelWidth = 200;
var hoveredActivity = null;
var paths, labels;
var backgroundColor = '#fff';
var fillColor = '#7796CB';
var highlightColor = '#576e94';
var labelColor = '#555';
var labelHighlightColor = '#161c25';

var xScale = d3.scaleLinear().domain([180, 1615]).range([0, lineWidth]);
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

    // Sort according to peak time
    lineData.forEach(function(activity) {
        var max = _.maxBy(activity.data, function(d) {
            return d.value;
        });
        activity.peakMinutes = max.minutes;
    });

    lineData = _.sortBy(lineData, function(activity) {
        return -activity.peakMinutes;
    });

    // Shift time so that start time is 3:00
    lineData.forEach(function(activity) {
        var before3 = activity.data.slice(0, 36);
        before3.forEach(function(d) {
            d.minutes += 1440;
        });
        activity.data = activity.data.slice(36).concat(before3);
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


/* Event handling */
function handleMousemove(d) {
    hoveredActivity = d;
    updateHighlighting();
}

function handleMouseout() {
    hoveredActivity = null;
    updateHighlighting();
}


/* Update functions */
function updateLines() {
    paths = d3.select('.chart .lines')
        .selectAll('path')
        .data(lineData)
        .join('path')
        .style('fill', fillColor)
        .style('stroke', backgroundColor)
        .attr('transform', function(d) {
            return 'translate(' + labelWidth + ', ' + d.yOffset + ')';
        })
        .attr('d', function(d) {
            return areaGenerator(d.data);
        })
        .on('mousemove', handleMousemove)
        .on('mouseout', handleMouseout);
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
        .style('fill', labelColor)
        .text(function(d) {
            return d.name;
        })
        .on('mousemove', handleMousemove)
        .on('mouseout', handleMouseout);
}

function updateAxis() {
    var axis = d3.axisBottom()
        .tickFormat(function(d) {
            return ((d / 60) % 24) + ':00';
        })
        .tickValues([3 * 60, 6 * 60, 9 * 60, 12 * 60, 15 * 60, 18 * 60, 21 * 60, 24 * 60, 27 * 60])
        .scale(xScale);

    var axisY = (lineData.length - 1) * lineSpacing + 10;
    d3.select('.chart .axis')
        .attr('transform', 'translate(' + labelWidth + ', ' + axisY + ')')
        .call(axis);
}

function isHovered(d) {
    return hoveredActivity && d.name === hoveredActivity.name;
}

function updateHighlighting() {
    paths
        .style('fill', function(d) {
            return isHovered(d) ? highlightColor : fillColor;
        });

    labels
        .style('fill', function(d) {
            return isHovered(d) ? labelHighlightColor : labelColor;
        })
        .style('font-weight', function(d) {
            return isHovered(d) ? 'bold' : 'normal';
        });
}

function updateChart() {
    updateLines();
    updateLabels();
    updateAxis();
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
