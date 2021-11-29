// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    /**
     * Abstraction implemented by all columns that has a custom Editor
     *
     * @example Date and Datetime columns has a custom editor which is calendar
     */
    export abstract class AbstractProviderColumnEditor<
            T extends OSFramework.Configuration.IConfigurationColumn,
            K extends OSFramework.Configuration.IConfigurationColumnEditor
        >
        extends AbstractProviderColumn<T>
        implements OSFramework.Column.IColumnCustom
    {
        private _editor: wijmo.Control;
        private _editorConfigs: K;

        constructor(
            grid: OSFramework.Grid.IGrid,
            columnID: string,
            configs: T,
            editorConfigs: K
        ) {
            super(grid, columnID, configs);
            this._editorConfigs = editorConfigs;
        }

        public get editorConfig(): K {
            return this._editorConfigs;
        }

        public get editorProvider(): wijmo.Control {
            return this._editor;
        }

        public get hasConditionalFormat(): boolean {
            return (
                this.editorConfig.conditionalFormat !== undefined &&
                this.editorConfig.conditionalFormat.length > 0
            );
        }

        public applyConfigs(): void {
            if (this.isReady) {
                const providerConfig = this.getProviderConfig();
                delete providerConfig.editor;

                providerConfig.visible = this._getVisibility();
                providerConfig.format = this.editorConfig.format;

                wijmo.copy(this.provider, providerConfig);
                wijmo.copy(
                    this._editor,
                    this._editorConfigs.getProviderConfig()
                );
            } else {
                console.log('applyConfigs - Column needs to be build');
            }
        }

        public build(): void {
            if (this.isReady) return;

            const wijmoControl = this.editorProviderType;

            //Copy column's config
            this._editorConfigs.required = this.config.required || false;
            this._editorConfigs.format = this.config.format;

            // this.config.editor = this._editorConfigs.getProviderConfig();
            this._editor = this._editor
                ? this._editor
                : new wijmoControl(
                      document.createElement('div'),
                      this._editorConfigs.getProviderConfig()
                  );

            //Save the editor on config =D
            this.config.editor = this._editor;

            if (this.hasConditionalFormat) {
                this.setConditionalFormat(this.editorConfig.conditionalFormat);
            }

            super.build();
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public changeProperty(propertyName: string, propertyValue: any): void {
            //Verify the property is available on EditorConfigs
            if (this.editorConfig.hasOwnProperty(propertyName)) {
                this.editorConfig[propertyName] = propertyValue;

                if (this.hasConditionalFormat) {
                    this.setConditionalFormat(JSON.parse(propertyValue), true);
                    this.grid.provider.invalidate(); // reapply classes
                }

                if (this.isReady) {
                    this.applyConfigs();
                }
            }
            //If not send to super
            else {
                super.changeProperty(propertyName, propertyValue);
            }
        }

        public dispose(): void {
            super.dispose();
            this._editor && this._editor.dispose();
            this._editor = undefined;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        abstract get editorProviderType(): any;
    }
}
