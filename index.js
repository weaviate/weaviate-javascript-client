module.exports = function (params) {

    // check if the URL is set
    if (!params.host) throw new Error('Missing `host` parameter')

    // check if the scheme is set
    if (!params.scheme) throw new Error('Missing `scheme` parameter')

    // check if headers are set
    if (!params.headers) params.headers = {}

    return {
        // the graphql function
        graphql: function (query){
            return require('graphql-client')({
                url: params.scheme + '://' + params.host + '/v1/graphql',
                headers: params.headers
            })
            .query(query)
        },
        // the create_schema function
        create_schema: function(){
            throw new Error('Not implemented yet')
        },
        // the create_thing function
        create_thing: function(){
            throw new Error('Not implemented yet')
        },
        // the create_action function
        create_action: function () {
            throw new Error('Not implemented yet')
        }
    }
}