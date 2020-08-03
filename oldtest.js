// Connect to Weaviate
const weaviate = require('./index.js')({
    scheme: 'https',
    host: 'demo.dataset.playground.semi.technology',
    // headers: {
    //     Authorization: 'Bearer ' + token
    // }
});

// Execute a request
weaviate
    //.graphql()
    .graphql(`{
        Get {
            Things {
                Article {
                    title
                    url
                    wordCount
                }
            }
        }
    }`)
    .then(function (result) {
        if(result.data.Get.Things.Article.length > 0){
            console.log('OK');
        }
    })