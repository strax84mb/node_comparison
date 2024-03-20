const myEvent = {
    "resource":"/test",
    "path":"/test",
    "httpMethod":"GET",
    "headers":{
       "Accept":"*/*",
       "Content-Type":"application/x-www-form-urlencoded",
       "Host":"55h4irp2v1.execute-api.eu-central-1.amazonaws.com",
       "User-Agent":"curl/7.81.0",
       "X-Amzn-Trace-Id":"Root=1-65cb7817-2c94267824e5f21b41cd85b8",
       "X-Forwarded-For":"178.220.237.81",
       "X-Forwarded-Port":"443",
       "X-Forwarded-Proto":"https"
    },
    "multiValueHeaders":{
       "Accept":[
          "*/*"
       ],
       "Content-Type":[
          "application/x-www-form-urlencoded"
       ],
       "Host":[
          "55h4irp2v1.execute-api.eu-central-1.amazonaws.com"
       ],
       "User-Agent":[
          "curl/7.81.0"
       ],
       "X-Amzn-Trace-Id":[
          "Root=1-65cb7817-2c94267824e5f21b41cd85b8"
       ],
       "X-Forwarded-For":[
          "178.220.237.81"
       ],
       "X-Forwarded-Port":[
          "443"
       ],
       "X-Forwarded-Proto":[
          "https"
       ]
    },
    "queryStringParameters":{
       "qwerty":"12"
    },
    "multiValueQueryStringParameters":{
       "qwerty":[
          "12"
       ]
    },
    "pathParameters":null,
    "stageVariables":null,
    "requestContext":{
       "resourceId":"pgz41f",
       "resourcePath":"/test",
       "httpMethod":"GET",
       "extendedRequestId":"TE-ztF8wliAEAQw=",
       "requestTime":"13/Feb/2024:14:09:27 +0000",
       "path":"/dev/hello",
       "accountId":"967910360152",
       "protocol":"HTTP/1.1",
       "stage":"dev",
       "domainPrefix":"55h4irp2v1",
       "requestTimeEpoch":1707833367414,
       "requestId":"15a084f2-7711-45e3-96ba-8fc2ca0b7965",
       "identity":{
          "cognitoIdentityPoolId":null,
          "accountId":null,
          "cognitoIdentityId":null,
          "caller":null,
          "sourceIp":"178.220.237.81",
          "principalOrgId":null,
          "accessKey":null,
          "cognitoAuthenticationType":null,
          "cognitoAuthenticationProvider":null,
          "userArn":null,
          "userAgent":"curl/7.81.0",
          "user":null
       },
       "domainName":"55h4irp2v1.execute-api.eu-central-1.amazonaws.com",
       "deploymentId":"5vjejb",
       "apiId":"55h4irp2v1"
    },
    "body":"{\"test\":12}",
    "isBase64Encoded":false
};

const BaseException = require('./exceptions/base_exception.cjs').BaseException;

class RouteNotFound extends BaseException {
    constructor() {
        super('NOT_FOUND', 'route not found');
    }
}

let ctx;

if (!ctx) {
    const Context = require('./context/context.cjs').Context;
    ctx = new Context();
}

const cityControllerModule = require('./controllers/city-controller.cjs');
const userControllerModule = require('./controllers/user-controller.cjs');
const airportControllerModule = require('./controllers/airport-controller.cjs');
const commentControllerModule = require('./controllers/comment-controller.cjs');

let __cityController;
let __userController;
let __airportController;
let __commentController;

async function __initCityController() {
    if (!__cityController) {
        __cityController = await ctx.getBeanAsync(
            cityControllerModule.CityController,
            cityControllerModule.idCityController,
        );
    }
}

async function __initUserController() {
    if (!__userController) {
        __userController = await ctx.getBeanAsync(
            userControllerModule.UserController,
            userControllerModule.idUserController,
        );
    }
}

async function __initAirportController() {
    if (!__airportController) {
        __airportController = await ctx.getBeanAsync(
            airportControllerModule.AirportController,
            airportControllerModule.idAirportController,
        );
    }
}

async function __initCommentController() {
    if (!__commentController) {
        __commentController = await ctx.getBeanAsync(
            commentControllerModule.CommentController,
            commentControllerModule.idCommentController,
        );
    }
}

async function route(event) {
    const pathParts = event.requestContext.path.substr('/dev/'.length).split('/');
    if (pathParts.length) {
        switch (pathParts[0]) {
            case 'hello': 
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'world' }),
                };
            case 'login':
                await __initUserController();
                return await __userController.login(event);
            case 'cities':
                switch (pathParts.length) {
                    case 1:
                        // /cities
                        switch (event.requestContext.httpMethod) {
                            case 'GET':
                                await __initCityController();
                                return await __cityController.getAll(event);
                            case 'POST':
                                await __initCityController();
                                return await __cityController.create(event);
                            default:
                                throw new RouteNotFound();
                        }
                    case 2:
                        // /cities/{id}
                        switch (event.requestContext.httpMethod) {
                            case 'GET':
                                await __initCityController();
                                return await __cityController.getOne(event);
                            case 'PUT':
                                await __initCityController();
                                return await __cityController.update(event);
                            case 'DELETE':
                                await __in;itCityController();
                                return await __cityController.delete(event);
                            default:
                                throw new RouteNotFound();
                        }
                    case 3:
                        switch(pathParts[2]) {
                            case 'airports':
                                // /cities/{id}/airports
                                if (event.requestContext.httpMethod == 'GET') {
                                    await __initAirportController();
                                    return await __airportController.getAllInCity(event);
                                } else {
                                    throw new RouteNotFound();
                                }
                            case 'comments':
                                // /cities/{id}/comments
                                switch (event.requestContext.httpMethod) {
                                    case 'GET':
                                        await __initCommentController();
                                        return await __commentController.getAllForCity(event);
                                    case 'POST':
                                        await __initCommentController();
                                        return await __commentController.saveNew(event);
                                    default:
                                        throw new RouteNotFound();
                                }
                            default:
                                throw new RouteNotFound();
                        }
                    default:
                        throw new RouteNotFound();
                }
            case 'airports':
                switch (pathParts.length) {
                    case 1:
                        // /airports
                        switch (event.requestContext.httpMethod) {
                            case 'GET':
                                await __airportController();
                                return await __airportController.getAll(event);
                            case 'POST':
                                await __airportController();
                                return await __airportController.saveNewAirport(event);
                            default:
                                throw new RouteNotFound();
                        }
                    case 2:
                        // /airports/{id}
                        switch (event.requestContext.httpMethod) {
                            case 'GET':
                                await __initAirportController();
                                return await __airportController.getOne(event);
                            case 'DELETE':
                                await __initAirportController();
                                return await __airportController.deleteOne(event);
                            case 'PUT':
                                await __initAirportController();
                                return await __airportController.updateAirport(event);
                            default:
                                throw new RouteNotFound();
                        }
                    default:
                        throw new RouteNotFound();
                }
            case 'comments':
                switch (pathParts.length) {
                    case 1:
                        // /comments
                        switch (event.requestContext.httpMethod) {
                            case 'GET':
                                await __initCommentController();
                                return await __commentController.getAll(event);
                            default:
                                throw new RouteNotFound();
                        }
                    case 2:
                        // /comments/{id}
                        switch (event.requestContext.httpMethod) {
                            case 'GET':
                                await __initCommentController();
                                return await __commentController.getOne(event);
                            case 'DELETE':
                                await __initCommentController();
                                return await __commentController.delete(event);
                            case 'PUT':
                                await __initCommentController();
                                return await __commentController.update(event);
                            default:
                                throw new RouteNotFound();
                        }
                    default:
                        throw new RouteNotFound();
                }
            default:
                throw new RouteNotFound();
        }
    }
}

async function handle(myEvent) {
    try {
        return await route(myEvent);
    } catch(err) {
        if (err.errorCode) {
            return {
                statusCode: err.toHttpStatusCode(),
                body: JSON.stringify({
                    message: err.message,
                }),
            };
        } else {
            console.log('Error:', JSON.stringify(err.message));
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'unhandled error',
                }),
            };
        }
    }
}

handle(myEvent).then(response => {
    console.log(JSON.stringify(response));
    process.exit(0);
});
