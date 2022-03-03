// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Enum {
    /**
     * Available messages indicating wheter an action was not successful or not
     */
    export enum ErrorMessages {
        Aggregate_NotFound = 'The aggregate you have passed does not exist.',
        AddRowErrorMessage = 'An error occurred while trying to add a new row.',
        AddRowWithActiveFilterOrSort = 'It seems that you have an active filter, group or sort on your columns. Remove them and try again.',
        Column_NotFound = 'Column not found',
        CustomizeExportingMessageEmptyString = 'It seems you are passing an empty message. Please pass a valid message.',
        FreezeColumnPositiveNumberExpected = 'Unable to freeze column. Please use a positive number.',
        Grid_NotFound = 'Grid not found.',
        InvalidColumnIdentifier = 'It seems you are not passing a valid column.',
        Row_EmptyList = 'Rows list is empty',
        Row_InvalidRowDataKey = 'The data key is invalid.',
        Row_InvalidStartingRowHeader = 'The starting row header is invalid.',
        Row_ListEmptyValues = 'Rows list has empty values.',
        Row_NotFound = 'Row not found.',
        SuccessMessage = 'Success',
        UnableToAddRow = 'Unable to add row. Please use ArrangeData action to serialize your data.'
    }
}
