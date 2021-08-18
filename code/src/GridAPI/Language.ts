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
            PerformanceAPI.SetMark('Language.SetLanguage');

            if (language !== '') {
                WijmoProvider.Helper.Translation.SetLanguage(language, url);
            }

            PerformanceAPI.SetMark('Language.SetLanguage-end');
            PerformanceAPI.GetMeasure(
                '@datagrid-Language.SetLanguage',
                'Language.SetLanguage',
                'Language.SetLanguage-end'
            );
        }
    }
}
