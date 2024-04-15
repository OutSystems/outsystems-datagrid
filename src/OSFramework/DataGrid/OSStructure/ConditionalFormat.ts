// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.OSStructure {
	export class ConditionalFormat {
		public cellClass: string;
		public format: Array<Format>;
		public rowClass: string;

		constructor() {
			this.format = new Array<Format>();
		}
	}
}
