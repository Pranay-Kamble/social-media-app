class AppError extends Error {
    constructor(message="Internal Server Error from App", statusCode=500) {
        super();
        this.message = message
        this.status = statusCode
    }
}

export default AppError;