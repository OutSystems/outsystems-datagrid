// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    /**
     * Interface for saving and loaging grid view
     */
    export interface IView {
        /**
         * Get the current layout
         */
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        getViewLayout(): any;
        /**
         * Load a predefined layout
         * @param view A JSON representing a previous saved visualization
         */
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        setViewLayout(view: any): void;
    }
}
