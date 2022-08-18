// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSStructure {
    /** Return Message that is sent to Service Studio */
    export class ReturnMessage {
        /** Error Code from a list of codes */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public code?: OSFramework.Enum.ErrorCodes;
        /** In case of success the message that gets returned is always {isSuccess: True} ignoring {code, message} */
        public isSuccess?: boolean;
        /** The message is always the reason why the operation failed. Usually used to define the message returned by the provider */
        public message?: string;
        /** The value returned from API */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public value?: any;
    }
}
