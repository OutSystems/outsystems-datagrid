// Auxiliary class that helps us define which type of date comes from the platform data (date or datetime)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSStructure {
    export class ExtendedDate extends Date {
        public isDate: boolean;
    }
}
