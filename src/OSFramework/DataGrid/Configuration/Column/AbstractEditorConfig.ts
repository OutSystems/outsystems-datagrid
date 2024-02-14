/// <reference path="../AbstractConfiguration.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
	/**
	 * Abstract class for columns with Custom Editors
	 */
	export abstract class AbstractEditorConfig
		extends AbstractConfiguration<DataGrid.Types.IEditorProviderConfigs>
		implements IConfigurationColumnEditor
	{
		public conditionalFormat: Array<OSStructure.ConditionalFormat>;
		public format: string;
		public required: boolean;
	}
}
