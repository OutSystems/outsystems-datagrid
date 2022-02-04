// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Enum {
    /**
     * Available messages indicating wheter an action was not successful or not
     */
    export enum ErrorMessages {
        SuccessMessage = 'Success',
        Grid_NotFound = 'Grid not found',
        InvalidColumnIdentifier = 'It seems you are not passing a valid column.',
        AddRowWithActiveFilterOrSort = 'It seems that you have an active filter, group or sort on your columns. Remove them and try again.',
        AddRowErrorMessage = 'An error occurred while trying to add a new row.',
        UnableToAddRow = 'Unable to add row. Please use ArrangeData action to serialize your data.'
    }
}
