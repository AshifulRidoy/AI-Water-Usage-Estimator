// Dedicated error type so callers (content script) can distinguish a thrown
// validation error from any other unexpected exception, per ESTIMATION.md
// "Error Handling": negative token values must throw a validation error.
export class EstimationValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EstimationValidationError";
  }
}
