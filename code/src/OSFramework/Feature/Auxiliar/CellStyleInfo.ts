// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature.Auxiliar {
    export class CellStyleInfo {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _classes: Array<string>;
        public cssClass: Map<string, Array<string>>;

        constructor() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.cssClass = new Map<string, Array<string>>();
        }

        private getCSSClassesByBinding(binding: string) {
            return this.cssClass.get(binding);
        }

        public addClass(binding: string, cssClass: string): void {
            if (this.hasCssClass(binding, cssClass) === false) {
                const cssClasses = this.getCSSClassesByBinding(binding) || [];

                cssClasses.push(cssClass);

                this.cssClass.set(binding, cssClasses);
            }
        }

        /** Checks if class exists in the cssClass array */
        public hasCssClass(binding: string, cssClass: string): boolean {
            const cssClasses = this.getCSSClassesByBinding(binding);
            if (cssClasses) return cssClasses.indexOf(cssClass) !== -1;

            return false;
        }

        /** Remove all classes from the cssClass array */
        public removeAllClasses(binding: string): void {
            this.cssClass.delete(binding);
        }

        public removeClass(binding: string, cssClass: string): void {
            if (this.hasCssClass(binding, cssClass)) {
                const cssClasses = this.getCSSClassesByBinding(binding);
                cssClasses.splice(cssClasses.indexOf(cssClass), 1);
            }
        }
    }
}
