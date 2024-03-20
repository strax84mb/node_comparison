import { Event, Response } from './types';

export const idCityHandlers = 'app-handlers-CityHandlers';

export interface ICityHandlers {
    getAll(event: Event): Promise<Response>;
    getOne(event: Event): Promise<Response>;
    saveNew(event: Event): Promise<Response>;
    update(event: Event): Promise<Response>;
    delete(event: Event): Promise<Response>;
}