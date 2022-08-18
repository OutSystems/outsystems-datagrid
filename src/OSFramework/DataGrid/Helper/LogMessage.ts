/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.Helper {
    export const warningMessage =
        'This API is deprecated please use the new api';

    export function LogWarningMessage(message: string): void {
        // TODO mechanism to enable logging mesages (like in OS UI)
        console.warn(message);
    }
}
