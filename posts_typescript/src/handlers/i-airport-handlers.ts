import { Event, Response } from "./types";

export const idAirportHandlers = 'app-handlers-AirportHandlers';

export interface IAirportHandlers {
    getAll(event: Event): Promise<Response>;
    getOne(event: Event): Promise<Response>;
    getForCity(event: Event): Promise<Response>;
    saveNew(event: Event): Promise<Response>;
    update(event: Event): Promise<Response>;
    delete(event: Event): Promise<Response>;
}