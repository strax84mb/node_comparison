import { Event, Response } from "./types";

export const idCommentHandlers = 'app-handlers-CommentHandlers';

export interface ICommentHandlers {
    getAll(event: Event): Promise<Response>;
    getOne(event: Event): Promise<Response>;
    getAllForCity(event: Event): Promise<Response>;
    update(event: Event): Promise<Response>;
    saveNew(event: Event): Promise<Response>;
    delete(event: Event): Promise<Response>;
}