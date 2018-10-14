const fs = require('fs')
const log = require('captains-log')()
const request = require('superagent')
const VError = require('verror')
const xml2js = require('xml2js');
const xml2jsParser = xml2js.Parser({trim: true, explicitArray: false});

module.exports = async function queryForSparql (config, queryFilenameFragment, targetDataset, offset) {
  const sparqlQueryBytes = fs.readFileSync(`${__dirname}/sparql/${queryFilenameFragment}.rq`)
  const sparqlQuery = sparqlQueryBytes.toString().replace(config.datasetPlaceholder, targetDataset)
  try {
    const query = `${sparqlQuery} OFFSET ${offset} LIMIT ${config.pageSize}`
    log.debug(`submitting query='${queryFilenameFragment}' for dataset='${targetDataset}' with offset='${offset}'`)
    const bindings = await doSparqlQuery(query, config)
    await convertRDFStringToJson(bindings)

    return bindings
  } catch (error) {
    const msg = `Failed while processing query='${queryFilenameFragment}', dataset='${targetDataset}', ` +
      `offset='${offset}', pageSize='${config.pageSize}'`
    throw new VError(error, msg)
  }
}

function doSparqlQuery (query, config) {
    console.log(`config.sparqlServerQueryUrl is ${config.sparqlServerQueryUrl}`);   
  return new Promise((resolve, reject) => {
    request
      .post(config.sparqlServerQueryUrl)
      .set('Accept', 'application/sparql-results+json')
      .type('form') // will coerce to 'application/x-www-form-urlencoded' for us
      .send({query: query})
      .on('error', err => {
        return reject(new VError(err, 'Failed to make SPARQL query HTTP call'))
      })
      .then(res => {
        return resolve(res.body.results.bindings)
      })
  })
}

function convertRDFStringToJson(value) {
  console.log(value);
}