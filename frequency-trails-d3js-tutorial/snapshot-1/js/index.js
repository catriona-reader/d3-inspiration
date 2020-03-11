/* Load data */
function processRow(d) {
    return {
        activity: d.activity,
        minutes: +d.time, // minutes since midnight
        value: +d.p
    };
}

function dataIsReady(data) {
    console.log(data);
}

d3.csv('data/activity.csv', processRow)
    .then(dataIsReady);
