// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Helper {
    export function SetLanguage(language: string, url: string): void {
        const regex = new RegExp('(?<=culture.)(.*)(?=.min)');
        url = url.replace(regex, language);

        fetch(url).then(function (response) {
            if (!response.ok) {
                url = url.replace(regex, language.substring(0, 2));
            }

            // this callback is wijmo's workaround to translate the group panel. Remove once they've fixed
            DynamicallyLoadScript(url, function () {
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
                wijmo.Control.invalidateAll();
            });
        });
    }
}
