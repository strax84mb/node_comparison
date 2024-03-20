import { Comment } from "../entities/comment";
import { Airport } from "../entities/airport";
import { City } from "../entities/city";
import { BadRequestException } from "../exceptions/bad-request-exception";

export type Headers = {
    "Accept": string;
    "Content-Type": string;
    "Host": string;
    "User-Agent": string;
    "X-Amzn-Trace-Id": string;
    "X-Forwarded-For": string;
    "X-Forwarded-Port": string;
    "X-Forwarded-Proto": string;
}

export class RequestContextIdentity {
    cognitoIdentityPoolId?: string;
    accountId?: string;
    cognitoIdentityId?: string;
    caller?: string;
    sourceIp: string;
    principalOrgId?: string;
    accessKey?: string;
    cognitoAuthenticationType?: string;
    cognitoAuthenticationProvider?: string;
    userArn?: string;
    userAgent: string;
    user?: string;
}

export class RequestContext {
    resourceId: string;
    resourcePath: string;
    httpMethod: string;
    extendedRequestId: string;
    requestTime: string;
    path: string;
    accountId: string;
    protocol: string;
    stage: string;
    domainPrefix: string;
    requestTimeEpoch: number;
    requestId: string;
    identity: RequestContextIdentity;
    domainName: string;
    deploymentId: string;
    apiId: string;
}

export class Event {
    resource: string;
    path: string;
    httpMethod: string;
    headers: Object;
    multiValueHeaders: Object;
    queryStringParameters: Object;
    multiValueQueryStringParameters: Object;
    pathParameters?: Object;
    stageVariables?: Object;
    requestContext: RequestContext;
    body?: string;
    isBase64Encoded: boolean;
};

export type Response = {
    statusCode: number;
    body?: string;
}

export function respond(statusCode: number, body?: Object): Response {
    return {
        statusCode: statusCode,
        body: body ? JSON.stringify(body) : null,
    };
}

export  function getNumber(value: string, errorMessage: string,  mandatory: boolean, defaultValue?: number): number {
    if (value) {
        const numericalValue = +value;
        if (numericalValue + '' == 'NaN') {
            throw new BadRequestException(errorMessage);
        }
        return numericalValue;
    } else if (mandatory) {
        return defaultValue;
    } else {
        return null;
    }
}

export class CityCommentDto {
    id: number;
    userId: number;
    text: string;
    updatedAt: Date;
    createdAt: Date;
}

export class CommentDto extends CityCommentDto {
    cityId: number;
}

export class CityAirportDto {
    id: number;
    name: string;
}

export class AirportDto extends CityAirportDto {
    cityId: number;
}

export class CityDto {
    id: number;
    name: string;
    airports?: CityAirportDto[];
    comments?: CityCommentDto[];
}

export function cityToDto(city: City): CityDto {
    return {
        id: city.id,
        name: city.name,
        airports: city.airports ? 
            city.airports.map(a => {
                return {
                    id: a.id,
                    name: a.name,
                };
            })
            : null,
        comments: city.comments ? 
            city.comments.map(c => {
                return {
                    id: c.id,
                    userId: c.userId,
                    updatedAt: c.updatedAt,
                    createdAt: c.createdAt,
                    text: c.text,
                };
            })
            : null,
    };
}

export function airportToDto(airport: Airport): AirportDto {
    return {
        id: airport.id,
        name: airport.name,
        cityId: airport.cityId,
    };
}

export function commentToDto(comment: Comment): CommentDto {
    return {
        id: comment.id,
        cityId: comment.cityId,
        text: comment.text,
        userId: comment.userId,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
    };
}

export class SaveNewCityDto {
    name: string;
}

export class SaveAirportDto {
    cityId: number;
    name: string;
}

export class SaveComment {
    cityId: number;
    text: string;
}

export class UpdateComment {
    text: string;
}

export class LoginUserDto {
    username: string;
    password: string;
}