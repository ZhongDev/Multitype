///
/// Frequency table in CSV to Cumulative frequency table in json
/// usage: node CSVpreprocessor.js -i <input.csv> -o <output.json>
///

/// System Improrts
const fs = require('fs')
const readline = require('readline')
const path = require('path')

/// Parse Command Line Arguments
var argv = require('minimist')(process.argv.slice(2))
// check argument inputs
// show usage and exit if true
let inputErrorFlag = false

if ( !("o" in argv) || !("i" in argv) ) {
    console.log("error: -i and/or -o arguments not found")
    inputErrorFlag = true
} else {
    if (argv.i == true) {
        console.log("error: input filename not found")
        inputErrorFlag = true
    }
    if (argv.o == true) {
        console.log("error: output filename not found")
        inputErrorFlag = true
    }
}

if (inputErrorFlag) {
    console.log("usage: node CSVpreprocessor.js -i <input.csv> -o <output.json>")
    return
}
// save args as variables
let inputFilename = argv.i
let outputFilename = argv.o

/// preprcessor function
async function preprocessCSV(inFilepath, outFilepath) {
    // Read in csv file, Line by line
    const fileStream = fs.createReadStream(inFilepath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })

    // working vars
    let cumulativeFrequencies = []
    let wordList = []
    var total = 0   

    for await (const line of rl) {
        let [word, frequency] = line.split(',')
        frequency = parseInt(frequency, 10)
        total += frequency
        cumulativeFrequencies.push(total)
        wordList.push(word)
    }

    let cumulationObject = {"words": wordList, "cumulativeFreq": cumulativeFrequencies}

    fs.writeFileSync(outFilepath, JSON.stringify(cumulationObject))
    console.log('Cumulative frequencies saved to:', outFilepath)
}

preprocessCSV(path.join(__dirname, inputFilename), path.join(__dirname, outputFilename))
