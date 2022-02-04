// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Enum {
    /**
     * Available messages indicating wheter an action was not successful or not
     */
    export enum ErrorMessages {
        SuccessMessage = 'Success',
        Column_NotFound = 'Column not found',
        Grid_NotFound = 'Grid not found',
        InvalidColumnIdentifier = 'It seems you are not passing a valid column.'
    }
}
