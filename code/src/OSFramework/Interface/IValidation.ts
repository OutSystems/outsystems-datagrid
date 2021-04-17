namespace OSFramework.Interface {
    export interface IValidation {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validateAction(action: OSFramework.Event.Actions, ctx: any): string;
    }
}
