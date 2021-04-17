// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Helper {
    export function DynamicallyLoadScript(
        url: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callBack: (event: any) => void = null
    ): void {
        const script = document.createElement('script');

        script.src = url;
        script.async = false;

        script.addEventListener('load', callBack);
        script.addEventListener('error', function () {
            const regex = new RegExp('(?<=culture.)(.*)(?=.min)');
            const result = regex.exec(url);
            let lang = '';
            if (result.length > 0) lang = result[0];

            throw new Error(`Language ${lang} does not exist`);
        });

        document.head.appendChild(script);
        document.head.removeChild(script);
    }
}
