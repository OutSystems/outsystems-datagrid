// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature.Auxiliar {
    export class RowStyleInfo {
        /**
         * Contains all CSS classes from a specific row.
         */
        public cssClass: Map<string, Array<string>>;

        constructor() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.cssClass = new Map();
        }

        private _addClassName(className, binding) {
            // if element exists, we'll add the class to our existing class Array
            if (this.cssClass.has(className)) {
                const rowClasses = this.cssClass.get(className);
                if (rowClasses.indexOf(binding) === -1) {
                    this.cssClass.set(className, [...rowClasses, binding]);
                }
            }
            // otherwise, we'll create the element with an array containing the column binding
            else {
                this.cssClass.set(className, [binding]);
            }
        }

        private _handleClassNames(className, binding, cb) {
            const classNames = className.split(' ');

            classNames.forEach((name) => {
                cb(name, binding);
            });
        }

        private _removeClassName(className, binding) {
            if (this.cssClass.has(className)) {
                const rowClass = this.cssClass.get(className);
                // if rowClass array is empty or binding is empty, we want to delete the item from our Map
                // an empty binding means that the class was added through our Styling APIs.
                if (rowClass.length === 0 || binding === '') {
                    this.cssClass.delete(className);
                } else {
                    if (rowClass.indexOf(binding) > -1) {
                        rowClass.splice(rowClass.indexOf(binding), 1);
                    }
                }
            }
        }

        /** Add class to the cssClass array */
        public addClass(className: string, binding: string): void {
            this._handleClassNames(
                className,
                binding,
                this._addClassName.bind(this)
            );
        }

        /** Remove all classes from the cssClass array */
        public removeAllClasses(): void {
            Array.from(this.cssClass.keys()).forEach((key) =>
                this.cssClass.delete(key)
            );
        }

        /** Remove a single class from the cssClass array */
        public removeClass(className: string, binding: string): void {
            this._handleClassNames(
                className,
                binding,
                this._removeClassName.bind(this)
            );
        }
    }
}
