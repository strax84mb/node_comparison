import { Event, Response } from "./types";

export const idUserHandlers = 'app-handlers-UserHandlers';

export interface IUserHandlers {
    login(event: Event): Promise<Response>
}