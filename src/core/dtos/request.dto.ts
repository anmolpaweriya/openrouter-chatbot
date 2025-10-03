import { Request } from 'express';

export type RequestDto = Request & { userId: string };
