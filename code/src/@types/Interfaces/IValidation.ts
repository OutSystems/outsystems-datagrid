interface IValidation {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateAction(action: InternalEvents.Actions, ctx: any): string;
}
