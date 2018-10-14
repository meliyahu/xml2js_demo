const fs = require('fs');
const xml2js = require('xml2js');

const parser = xml2js.Parser({trim: true, explicitArray: false});

const observations = fs.readFileSync('observation.xml', 'utf8');
let finalObservations = `<observations> ${observations} </observations>`;
let cleanObservations = finalObservations.replace(/<i>|<\/i>/gi, "");
// console.log('cleanObservations =' + cleanObservations);

// console.log(finalObservations);
parser.parseString(cleanObservations, (err, result) => {
    console.log(JSON.stringify(result, null, 2));
    var obs = JSON.parse(JSON.stringify(result, null, 2));
    obs.observations.observation.forEach(observation => {
        console.log(observation.systemIdentifier);
        console.log(observation.result);
    })
})


