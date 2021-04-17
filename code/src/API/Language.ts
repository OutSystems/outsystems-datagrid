// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI {
    export namespace Language {
        /**
         *
         *
         * @export
         * @param {string} language
         * @param {string} url
         */
        export function SetLanguage(language: string, url: string): void {
            if (language !== '') {
                OSFramework.Helper.SetLanguage(language, url);
            }
        }
    }
}
