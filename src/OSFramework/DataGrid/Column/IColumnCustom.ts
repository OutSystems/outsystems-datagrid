// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Column {
    /**
     * An extension of IColumn, used to specify custom editors
     *
     * @example Date and Datetime columns has a custom editor which is calendar
     */
    export interface IColumnCustom extends IColumn {
        /** Holds the custom editor used to manipulate columns data */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        editorProvider: any;
        /**
         * Holds the reference to the provider editor's type
         * Used during the instantiation of the column to create the editor Provider
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        editorProviderType: any;
    }
}
