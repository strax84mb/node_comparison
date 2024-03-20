import { Context } from "./context/context";
import { Event, Response } from "./handlers/types";
import { BaseException } from "./exceptions/base-exception";
import { NotFoundException } from "./exceptions/not-found-exception";
import { ICityHandlers, idCityHandlers } from "./handlers/i-city-handlers";
import { IAirportHandlers, idAirportHandlers } from './handlers/i-airport-handlers';
import { IUserHandlers, idUserHandlers } from './handlers/i-user-handlers';
import { ICommentHandlers, idCommentHandlers } from './handlers/i-comment-handlers';

const start = new Date();

const myEvent = {
    "resource":"/test",
    "path":"/test",
    "httpMethod":"GET",
    "headers": {
       "Accept":"*/*",
       "Content-Type":"application/x-www-form-urlencoded",
       "Host":"55h4irp2v1.execute-api.eu-central-1.amazonaws.com",
       "User-Agent":"curl/7.81.0",
       "X-Amzn-Trace-Id":"Root=1-65cb7817-2c94267824e5f21b41cd85b8",
       "X-Forwarded-For":"178.220.237.81",
       "X-Forwarded-Port":"443",
       "X-Forwarded-Proto":"https"
    },
    "multiValueHeaders": {
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
    "queryStringParameters": {
       "qwerty":"12"
    },
    "multiValueQueryStringParameters": {
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
} as Event;

class RouteNotFound extends NotFoundException {
    constructor() {
        super('route not found');
    }
}

const __ctx: Context = new Context();

let userHandlers: IUserHandlers;
let cityHandlers: ICityHandlers;
let airportHandlers: IAirportHandlers;
let commentHandlers: ICommentHandlers;

async function __initUserHandlers() {
    if (!userHandlers) {
        const userModule = await import('./handlers/user-handlers');
        userHandlers = await __ctx.getBean(idUserHandlers, userModule.UserHandlers) as any as IUserHandlers;
    }
}

async function __initCityHandlers() {
    if (!cityHandlers) {
        const cityModule = await import('./handlers/city-handlers');
        cityHandlers = await __ctx.getBean(idCityHandlers, cityModule.CityHandlers) as any as ICityHandlers;
    }
}

async function __initAirportHandlers() {
    if (!airportHandlers) {
        const airportModule = await import('./handlers/airport-handlers');
        airportHandlers = await __ctx.getBean(idAirportHandlers, airportModule.AirportHandlers) as any as IAirportHandlers;
    }
}

async function __initCommentHandlers() {
    if (!commentHandlers) {
        const commentModule = await import('./handlers/comment-handlers');
        commentHandlers = await __ctx.getBean(idCommentHandlers, commentModule.CommentHandlers) as any as ICommentHandlers;
    }
}
type routePartMapping = [any, RoutePart];

type mappingObject = routePartMapping[];

type initFunc = () => Promise<void>;

type RoutePart = {
    inits?: initFunc[];
    handleFunc?: (event: Event) => Promise<Response>;
    next?: mappingObject;
    nextCondition?: (parts: string[], event?: Event) => any;
    default?: RoutePart,
}

async function handleRoutePart(routePart: RoutePart, parts: string[], event: Event): Promise<Response> {
    if (routePart.nextCondition && routePart.next) {
        const condition = routePart.nextCondition(parts, event);
        let nextPart: routePartMapping;
        for (nextPart of routePart.next) {
            if (nextPart[0] == condition) {
                return await handleRoutePart(nextPart[1], parts, event);
            }
        }
        if (!routePart.default) {
            throw new RouteNotFound();
        }
        return await handleRoutePart(routePart.default, parts, event);
    } if (routePart.handleFunc) {
        if (routePart.inits) {
            for (const init of routePart.inits) {
                await init();
            }
        }
        return await routePart.handleFunc(event);
    } else {
        throw new RouteNotFound();
    }
}

const rootRouteMap: RoutePart = {
    nextCondition: (parts) => parts[0],
    next: [
        ['hello', {
            async handleFunc(event: Event): Promise<Response> {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'world' }),
                };
            },
        }],
        ['login', {
            inits: [__initUserHandlers],
            handleFunc: (event: Event) => { return userHandlers.login(event) },
        }],
        ['cities', {
            nextCondition: (parts) => parts.length,
            next: [
                [1, {
                    nextCondition: (_parts, event) => event.requestContext.httpMethod,
                    next: [
                        ['GET', {
                            inits: [__initCityHandlers],
                            handleFunc: (event: Event) => { return cityHandlers.getAll(event) },
                        }],
                        ['POST', {
                            inits: [__initCityHandlers],
                            handleFunc: (event: Event) => { return cityHandlers.saveNew(event) },
                        }],
                    ],
                }],
                [2, {
                    nextCondition: (_parts, event) => event.requestContext.httpMethod,
                    next: [
                        ['GET', {
                            inits: [__initCityHandlers],
                            handleFunc: (event: Event) => { return cityHandlers.getOne(event) },
                        }],
                        ['PUT', {
                            inits: [__initCityHandlers],
                            handleFunc: (event: Event) => { return cityHandlers.update(event) },
                        }],
                        ['DELETE', {
                            inits: [__initCityHandlers],
                            handleFunc: (event: Event) => { return cityHandlers.delete(event) },
                        }],
                    ],
                }],
                [3, {
                    nextCondition: (_parts, event) => event.requestContext.httpMethod,
                    next: [
                        ['GET', {
                            nextCondition: (parts) => parts[2],
                            next: [
                                ['airports', {
                                    inits: [__initAirportHandlers],
                                    handleFunc: (event: Event) => { return airportHandlers.getForCity(event) },
                                }],
                                ['comments', {
                                    inits: [__initCommentHandlers],
                                    handleFunc: (event: Event) => { return commentHandlers.getAllForCity(event) },
                                }],
                            ],
                        }],
                    ],
                }],
            ],
        }],
        ['airports', {
            nextCondition: (parts) => parts.length,
            next: [
                [1, {
                    nextCondition: (_parts, event) => event.requestContext.httpMethod,
                    next: [
                        ['GET', {
                            inits: [__initAirportHandlers],
                            handleFunc: (event: Event) => { return airportHandlers.getAll(event) },
                        }],
                        ['POST', {
                            inits: [__initAirportHandlers],
                            handleFunc: (event: Event) => { return airportHandlers.saveNew(event) },
                        }]
                    ],
                }],
                [2, {
                    nextCondition: (_parts, event) => event.requestContext.httpMethod,
                    next: [
                        ['GET', {
                            inits: [__initAirportHandlers],
                            handleFunc: (event: Event) => { return airportHandlers.getOne(event) },
                        }],
                        ['PUT', {
                            inits: [__initAirportHandlers],
                            handleFunc: (event: Event) => { return airportHandlers.update(event) },
                        }],
                        ['DELETE', {
                            inits: [__initAirportHandlers],
                            handleFunc: (event: Event) => { return airportHandlers.delete(event) },
                        }],
                    ],
                }],
            ],
        }],
        ['comments', {
            nextCondition: (parts) => parts.length,
            next: [
                [1, {
                    nextCondition: (_parts, event) => event.requestContext.httpMethod,
                    next: [
                        ['GET', {
                            inits: [__initCommentHandlers],
                            handleFunc: (event: Event) => { return commentHandlers.getAll(event) },
                        }],
                        ['POST', {
                            inits: [__initCommentHandlers],
                            handleFunc: (event: Event) => { return commentHandlers.saveNew(event) },
                        }]
                    ],
                }],
                [2, {
                    nextCondition: (_parts, event) => event.requestContext.httpMethod,
                    next: [
                        ['GET', {
                            inits: [__initCommentHandlers],
                            handleFunc: (event: Event) => { return commentHandlers.getOne(event) },
                        }],
                        ['PUT', {
                            inits: [__initCommentHandlers],
                            handleFunc: (event: Event) => { return commentHandlers.update(event) },
                        }],
                        ['DELETE', {
                            inits: [__initCommentHandlers],
                            handleFunc: (event: Event) => { return commentHandlers.delete(event) },
                        }],
                    ],
                }],
            ],
        }],
    ],
};

async function route(event: Event): Promise<Response> {
    const pathParts = event.requestContext.path.substring('/dev/'.length).split('/');
    if (pathParts.length) {
        switch (pathParts[0]) {
            case 'hello':
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'world' }),
                };
            case 'login':
                await __initUserHandlers();
                return await userHandlers.login(event);
            case 'cities':
                switch (pathParts.length) {
                    case 1:
                        // /cities
                        switch (event.requestContext.httpMethod) {
                            case 'GET':
                                await __initCityHandlers();
                                return await cityHandlers.getAll(event);
                            case 'POST':
                                await __initCityHandlers();
                                return await cityHandlers.saveNew(event);
                            default:
                                throw new RouteNotFound();
                        }
                    case 2:
                        // /cities/{id}
                        switch (event.requestContext.httpMethod) {
                            case 'GET':
                                await __initCityHandlers();
                                return await cityHandlers.getOne(event);
                            case 'PUT':
                                await __initCityHandlers();
                                return await cityHandlers.update(event);
                            case 'DELETE':
                                await __initCityHandlers();
                                return await cityHandlers.delete(event);
                            default:
                                throw new RouteNotFound();
                        }
                    case 3:
                        // /cities/{id}/*
                        switch (pathParts[2]) {
                            case 'airports':
                                if (event.requestContext.httpMethod == 'GET') {
                                    await __initAirportHandlers();
                                    return await airportHandlers.getForCity(event);
                                } else {
                                    throw new RouteNotFound();
                                }
                            case 'comments':
                                if (event.requestContext.httpMethod == 'GET') {
                                    await __initCommentHandlers();
                                    return await commentHandlers.getAllForCity(event);
                                } else {
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
                                await __initAirportHandlers();
                                return await airportHandlers.getAll(event);
                            case 'POST':
                                await __initAirportHandlers();
                                return await airportHandlers.saveNew(event);
                            default:
                                throw new RouteNotFound();
                        }
                    case 2:
                        // /airports/{id}
                        switch (event.requestContext.httpMethod) {
                            case 'GET':
                                await __initAirportHandlers();
                                return await airportHandlers.getOne(event);
                            case 'PUT':
                                await __initAirportHandlers();
                                return await airportHandlers.update(event);
                            case 'DELETE':
                                await __initAirportHandlers();
                                return await airportHandlers.delete(event);
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
                                await __initCommentHandlers();
                                return await commentHandlers.getAll(event);
                            case 'POST':
                                await __initCommentHandlers();
                                return await commentHandlers.saveNew(event);
                            default:
                                throw new RouteNotFound();
                        }
                    case 2:
                        // /comments/{id}
                        switch (event.requestContext.httpMethod) {
                            case 'GET':
                                await __initCommentHandlers();
                                return await commentHandlers.getOne(event);
                            case 'PUT':
                                await __initCommentHandlers();
                                return await commentHandlers.update(event);
                            case 'DELETE':
                                await __initCommentHandlers();
                                return await commentHandlers.delete(event);
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
    throw new RouteNotFound();
}

async function handle(event: Event) {
    try {
        return await route(event);
    }catch(err) {
        if (err['errorCode']) {
            const errEx = err as BaseException;
            return {
                statusCode: errEx.getHttpStatusCode(),
                body: JSON.stringify({
                    message: errEx.message,
                }),
            };
        } else {
            console.log('Error:', JSON.stringify(err['message']));
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
    const end = new Date();
    console.log('>>>', end.getTime() - start.getTime());
    process.exit(0);
});
