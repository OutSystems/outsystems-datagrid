// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Enum {
    /**
     * Available messages indicating wheter an action was not successful or not
     */
    export enum ErrorMessages {
        SuccessMessage = 'Success',
        Column_NotFound = 'Column not found',
        Grid_NotFound = 'Grid not found',
        Aggregate_NotFound = 'The aggregate you have passed does not exist.',
        InvalidColumnIdentifier = 'It seems you are not passing a valid column.',
        AddRowWithActiveFilterOrSort = 'It seems that you have an active filter, group or sort on your columns. Remove them and try again.',
        AddRowErrorMessage = 'An error occurred while trying to add a new row.',
        UnableToAddRow = 'Unable to add row. Please use ArrangeData action to serialize your data.',
        FreezeColumnPositiveNumberExpected = 'Unable to freeze column. Please use a positive number.',
        Row_NotFound = 'Row not found',
        Row_InvalidRowDataKey = 'The data key is invalid',
        Row_InvalidStartingRowHeader = 'The starting row header is invalid'
    }
}
