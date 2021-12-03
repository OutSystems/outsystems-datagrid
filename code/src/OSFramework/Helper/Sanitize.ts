// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Helper {
    export function Sanitize(value: string): string {
        if (typeof value === 'string') {
            if (value !== undefined && value !== null && value !== '') {
                return value.replace(/</g, '‹').replace(/>/g, '›');
            }
        }
        return value;
    }
}
