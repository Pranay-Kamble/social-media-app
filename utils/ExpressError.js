class ExpressError extends Error {
    constructor(message="Internal Server Error from Express", statusCode=500) {
        super();
        this.status = statusCode;
        this.message = message;
    }
}

export default ExpressError;