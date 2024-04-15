// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Language {
	const _languagesURL: Map<string, string> = new Map<string, string>();

	function transposeLanguageFormat(languageCode: string): string {
		let changedLang = languageCode;

		switch (languageCode) {
			//the following languages exist in these variants
			case 'ar-AE':
			case 'ar-SA':
			case 'de-CH':
			case 'en-CA':
			case 'en-GB':
			case 'es-MX':
			case 'fr-CA':
			case 'mn-MN':
			case 'zh-HK':
			case 'zh-TW':
				break;
			//all other languages, the provider doesn't have a local variant
			default:
				changedLang = languageCode.substring(0, 2);
		}

		return changedLang;
	}

	export function AddLanguage(languageCode: string, filePath: string): void {
		if (_languagesURL.has(languageCode) === false) {
			_languagesURL.set(languageCode, filePath);
		}
	}

	export function GetLanguageFilePath(languageCode: string): string {
		const tLanguageCode = transposeLanguageFormat(languageCode);
		let pathFile = undefined;

		if (_languagesURL.has(tLanguageCode)) {
			pathFile = _languagesURL.get(tLanguageCode);
		}
		return pathFile;
	}

	export function HaveLanguagesBeenSet(): boolean {
		return _languagesURL.size > 0;
	}

	export function IsLanguageSupported(languageCode: string): boolean {
		return _languagesURL.has(transposeLanguageFormat(languageCode));
	}
}
