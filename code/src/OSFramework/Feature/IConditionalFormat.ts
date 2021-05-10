// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface IConditionalFormat {
        addRule(
            binding: string,
            rule: Array<OSFramework.OSStructure.ConditionalFormat>
        ): void;
    }
}
