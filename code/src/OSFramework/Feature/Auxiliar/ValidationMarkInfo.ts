// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature.Auxiliar {
    export class ValidationMarkInfo {
        public errorMessage: Map<string, string>;
        public validation: Map<string, boolean>;

        constructor() {
            this.validation = new Map<string, boolean>();
            this.errorMessage = new Map<string, string>();
        }
    }
}
