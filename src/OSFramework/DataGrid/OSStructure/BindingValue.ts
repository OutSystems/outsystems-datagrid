// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSStructure {
    /**
     * Used to expose Gris's selections to OS, in a key-value pair object
     */
    export class BindingValue {
        public binding: string;
        public value: string;

        /**
         * Define cell's value in a key-value pair object
         * @param binding column's binding field
         * @param value cell's value
         */
        constructor(binding: string, value: string) {
            this.binding = binding;
            this.value = value;
        }
    }
}
