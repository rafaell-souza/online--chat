export class CustomError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class NoContent extends CustomError {
    constructor(message: string) {
        super(message, 204);
    }
}

export class BadRequest extends CustomError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class Unauthorized extends CustomError {
    constructor(message: string) {
        super(message, 401);
    }
}

export class Forbidden extends CustomError {
    constructor(message: string) {
        super(message, 403);
    }
}

export class NotFound extends CustomError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class Conflict extends CustomError {
    constructor(message: string) {
        super(message, 409);
    }
}