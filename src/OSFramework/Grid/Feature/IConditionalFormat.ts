// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface IConditionalFormat {
        /**
         * Adds new conditional format rules to the desired binding.
         */
        addRules(
            binding: string,
            rules: Array<OSFramework.OSStructure.ConditionalFormat>,
            refresh?: boolean
        ): void;

        /**
         * Removes rules of desired binding.
         */
        removeRules(binding: string);
    }
}
