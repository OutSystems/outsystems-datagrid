// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    /**
     * Abstraction implemented by all columns that has a custom Editor
     *
     * @example Date and Datetime columns has a custom editor which is calendar
     */
    export abstract class AbstractProviderColumnEditor<
            T extends IConfigurationColumn,
            K extends IConfigurationColumnEditor
        >
        extends AbstractProviderColumn<T>
        implements IColumnCustom {
        private _editor: wijmo.Control;
        private _editorConfigs: K;

        constructor(
            grid: WijmoProvider.Grid.IGrid,
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public get editorProvider(): wijmo.Control {
            return this._editor;
        }

        public applyConfigs(): void {
            if (this.isReady) {
                const providerConfig = this.getProviderConfig();
                delete providerConfig.editor;

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

            super.build();
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public changeProperty(propertyName: string, propertyValue: any): void {
            //Verify the property is available on EditorConfigs
            if (this.editorConfig.hasOwnProperty(propertyName)) {
                this.editorConfig[propertyName] = propertyValue;

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
