namespace OutSystems.GridAPI.Language {
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
            Providers.DataGrid.Wijmo.Helper.Translation.SetLanguage(
                language,
                url
            );
        }

        Performance.SetMark('Language.SetLanguage-end');
        Performance.GetMeasure(
            '@datagrid-Language.SetLanguage',
            'Language.SetLanguage',
            'Language.SetLanguage-end'
        );
    }
}

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
            OSFramework.DataGrid.Helper.LogWarningMessage(
                `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Language.SetLanguage()'`
            );
            return OutSystems.GridAPI.Language.SetLanguage(language, url);
        }
    }
}
