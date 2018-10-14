const queryForSparql = require('./queryForSparql');
const xml2js = require('xml2js');
const xml2jsParser = xml2js.Parser({trim: true, explicitArray: false});

let config = {};
config.sparqlServerQueryUrl = process.env.SPARQL_SERVER_QUERY_URL || 'http://localhost:3030/ds/query';
config.pageSize = 1; //10000;
config.datasetPlaceholder = '%TARGET_DATASET%'
const queryFilenameFragment = 'getAllObservations';
const targetDataset = 'wadec_ravensthorpe';
const offset = 0;

const bindings = queryForSparql(config, queryFilenameFragment, targetDataset, offset);

bindings.then( (data, err) => {
    //console.log(data);
    data.forEach(item => {
        //const value = observations.value;
        //let observationsString = `<observations> ${item.observations.value} </observations>`;
        let observationsString = `<observations> ${item.observations.value} </observations>`;
        let cleanObservationsString = observationsString.replace(/<i>|<\/i>/gi, "");

        // Now convert the string to json objects
        xml2jsParser.parseString(cleanObservationsString, (err, result) => {
            //console.log(JSON.stringify(result, null, 2));
            // var obs = JSON.parse(JSON.stringify(result, null, 2));
            result.observations.observation.forEach(observation => {
                //console.log("mosh: " + observation.systemIdentifier);
                console.log("json: " + JSON.stringify(observation, null, 2));
                console.log("--------------------------");
                
            })
        })

    });
});


