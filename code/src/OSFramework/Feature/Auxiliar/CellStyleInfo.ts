// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature.Auxiliar {
    export class CellStyleInfo {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public cssClass: Map<string, any>;
        constructor() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.cssClass = new Map<string, any>();
        }
        public addClass(binding: string, cssClass: string): void {
            this.cssClass.set(binding, cssClass);
        }
        public removeClass(binding: string): void {
            if (this.cssClass.get(binding)) {
                this.cssClass.delete(binding);
            }
        }
    }
}
