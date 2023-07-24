// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Helper.Translation {
    export function FormatDateOperators(): void {
        const dateOperators =
            wijmo.culture.FlexGridFilter.numberOperators.filter(function (
                item
            ) {
                //Removing item "Does not Equal"
                return item.op !== 1;
            });

        wijmo.culture.FlexGridFilter.dateOperators = dateOperators;
    }

    export function SetLanguage(language: string): void {
        if (DataGrid.Wijmo.Language.IsLanguageSupported(language)) {
            const url = DataGrid.Wijmo.Language.GetLanguageFilePath(language);

            fetch(url, { method: 'HEAD' }).then(function (response) {
                if (response.ok) {
                    // this callback is wijmo's workaround to translate the group panel. Remove once they've fixed
                    OSFramework.DataGrid.Helper.DynamicallyLoadScript(
                        url,
                        () => {
                            const gps = document.body.querySelectorAll(
                                '.wj-control.wj-grouppanel'
                            );
                            const culture = wijmo.culture;
                            for (let i = 0; i < gps.length; i++) {
                                const gp = wijmo.Control.getControl(gps[i]);
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                gp.placeholder = culture.GroupPanel.dragDrop;
                            }
                            FormatDateOperators();
                            wijmo.Control.invalidateAll();
                        }
                    );
                } else {
                    //if the language resource is not found in the server, then throw an error and let the english be the default language.
                    throw `The language "${language}" is not supported. Falling back to the language in use.`;
                }
            });
        } else {
            throw `The language "${language}" is not supported. Falling back to the language in use.`;
        }
    }
}
