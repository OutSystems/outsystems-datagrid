namespace OSFramework.Interface {
    /**
     * Defines the interface for disposable objects
     */
    export interface IDisposable {
        /**
         * Dispose object and free up its used resources
         */
        dispose(): void;
    }
}
