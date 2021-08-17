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
            Performance.SetMark('Language.SetLanguage');

            if (language !== '') {
                WijmoProvider.Helper.Translation.SetLanguage(language, url);
            }

            Performance.SetMark('Language.SetLanguage-end');
            Performance.GetMeasure(
                '@datagrid-Language.SetLanguage',
                'Language.SetLanguage',
                'Language.SetLanguage-end'
            );
        }
    }
}
