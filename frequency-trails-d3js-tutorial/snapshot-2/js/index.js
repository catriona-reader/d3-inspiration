var lineData = [];


/* Data processing */
function processData(data) {
    // Create an array of activities where each activity
    // contains an array of time series data
    var grouped = _.groupBy(data, function(d) {
        return d.activity;
    });

    Object.keys(grouped).forEach(function(key) {
        lineData.push({
            activity: key,
            data: grouped[key]
        });
    });
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

    console.log(lineData);
}

d3.csv('data/activity.csv', processRow)
    .then(dataIsReady);
