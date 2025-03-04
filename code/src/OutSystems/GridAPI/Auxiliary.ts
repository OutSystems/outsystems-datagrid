/**
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.GridAPI.Auxiliary {
    type APIHandler = {
        // eslint-disable-next-line
        callback: any;
        errorCode: OSFramework.Enum.ErrorCodes;
        gridID: string;
        hasValue?: boolean;
    };

    type APIResponse = {
        code: OSFramework.Enum.ErrorCodes;
        isSuccess: boolean;
        message: OSFramework.Enum.ErrorMessages;
        // eslint-disable-next-line
        value?: any;
    };

    export function CreateApiResponse({
        gridID,
        callback,
        errorCode,
        hasValue = false
    }: APIHandler): string {
        const responseObj: APIResponse = {
            isSuccess: true,
            message: OSFramework.Enum.ErrorMessages.SuccessMessage,
            code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS
        };

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message = OSFramework.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code = OSFramework.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }

        try {
            if (hasValue) {
                responseObj.value = callback();
            } else {
                callback();
            }
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code = errorCode;
        }

        return JSON.stringify(responseObj);
    }

    /**
     * Receives a string and generates the hashcode of it.
     * @param str - string, typically the data to be showed in the grid.
     * @returns hashcode to the str
     */
    export function GetHashCode(str: string): number {
        return OSFramework.Helper.GenerateHashCode(str);
    }
}
/// Overrides for the old namespace - calls the new one, lets users know this is no longer in use

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Auxiliary {
    type APIHandler = {
        // eslint-disable-next-line
        callback: any;
        errorCode: OSFramework.Enum.ErrorCodes;
        gridID: string;
        hasValue?: boolean;
    };

    export function CreateApiResponse({
        gridID,
        callback,
        errorCode,
        hasValue = false
    }: APIHandler): string {
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.Auxiliary.CreateApiResponse()'`
        );

        return OutSystems.GridAPI.Auxiliary.CreateApiResponse({
            gridID,
            callback,
            errorCode,
            hasValue
        });
    }

    /**
     * Receives a string and generates the hashcode of it.
     * @param str - string, typically the data to be showed in the grid.
     * @returns hashcode to the str
     */
    export function GetHashCode(str: string): number {
        OSFramework.Helper.LogWarningMessage(
            `${OSFramework.Helper.warningMessage} 'OutSystems.GridAPI.Auxiliary.GetHashCode()'`
        );
        return OutSystems.GridAPI.Auxiliary.GetHashCode(str);
    }
}
