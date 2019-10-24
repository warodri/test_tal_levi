
/**
 * Run this to start the test
 */
function runTest() {

    const API_URL = 'https://openlibrary.org/search.json';
    const sources = [];
    const waitBetweenCalls = 100; // 1 second every 10 calls (100 * 10 = 1000 millisecs)

    for (let i = 0; i < 100; i++) {
        sources.push(API_URL + '?q=' + i);
    }

    batchFetch(sources, waitBetweenCalls).then(documents => {
        const info = "<pre>" + JSON.stringify( documents, undefined, 2 ) + "</pre>";
        writeUI( info );
    });
}


/**
 * This is the main function
 * 
 * @param {*} urls : List of URLs to fetch
 * @param {*} waitBetweenCalls : Millisecs to wait between calls
 */
function batchFetch(urls, waitBetweenCalls) {

    let info = '';
    let documents = [];

    return new Promise((resolve, reject) => {

        // do the fetch and save the result
        async function recursiveFetch(url) {
            const response = await fetch(url);
            const json = await response.json();
            documents.push( json );
        }

        // run the url "concurrentRequestsLimit" times
        function runSetOfUrls(index = 0) {
            if (index >= urls.length) {
                resolve(documents);
                return;
            }

            const url = urls[index];

            if (!url) {
                info = "Invalid URL. Ending execution!";
                writeUI( info )    
                reject(documents);
                return;
            }

            info = "Fetching: " + url + " at " + new Date();
            writeUI( info )

            recursiveFetch( url );

            setTimeout(() => {
                index++;
                runSetOfUrls(index);
            }, waitBetweenCalls)
        }

        runSetOfUrls();

    });
}

/**
 * Aux function to write on the UI and the console
 * 
 * @param {*} text : Text to log
 */
function writeUI(text) {
    console.log( text );    
    document.getElementById('results').innerHTML = text;
}
