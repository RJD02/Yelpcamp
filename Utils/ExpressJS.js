class ExpressError extends Error {
  constructor(message, status) {
    super();
    this.status = status;
    this.message = message;
  }
}

export default ExpressError;
