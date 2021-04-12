
/**
 * Defines a basic interface for Custom column Editors
 */
 interface IConfigurationColumnEditor extends IConfiguration {
    /** The format used to print data on screen.
     * This property is used only for data visualization.
     * @example Date fields can be DD/MM/YYYY
     */
    format: string;
    /** Defines when the column can or not be empty */
    required: boolean;
}