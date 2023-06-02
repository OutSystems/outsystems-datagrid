namespace OutSystems.GridAPI.Language {
    /**
     *
     *
     * @export
     * @param {string} language
     * @param {string} filePath
     */
    export function AddSupportedLanguage(
        language: string,
        filePath: string
    ): void {
        Performance.SetMark('Language.AddSupportedLanguage');

        if (language !== '') {
            Providers.DataGrid.Wijmo.Language.AddLanguage(language, filePath);
        }

        Performance.SetMark('Language.AddSupportedLanguage-end');
        Performance.GetMeasure(
            '@datagrid-Language.AddSupportedLanguage',
            'Language.AddSupportedLanguage',
            'Language.AddSupportedLanguage-end'
        );
    }

    export function HaveLanguagesBeenSet(): boolean {
        Performance.SetMark('Language.HaveLanguagesBeenSet');

        const result = Providers.DataGrid.Wijmo.Language.HaveLanguagesBeenSet();

        Performance.SetMark('Language.HaveLanguagesBeenSet-end');
        Performance.GetMeasure(
            '@datagrid-Language.HaveLanguagesBeenSet',
            'Language.HaveLanguagesBeenSet',
            'Language.HaveLanguagesBeenSet-end'
        );
        return result;
    }

    /**
     *
     *
     * @export
     * @param {string} language
     * @param {string} url
     */
    export function SetLanguage(language: string): void {
        Performance.SetMark('Language.SetLanguage');

        if (language !== '') {
            Providers.DataGrid.Wijmo.Helper.Translation.SetLanguage(language);
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
            return OutSystems.GridAPI.Language.SetLanguage(language);
        }
    }
}
