// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Grid {
    export class ProviderDataSource extends OSFramework.Grid
        .AbstractDataSource {
        private _provider: wijmo.collections.CollectionView;

        public addRow(position?: number, data?: JSON[]): void {
            super.addRow(position, data);
            this._provider.refresh();
        }

        public build(): void {
            this._provider = new wijmo.collections.CollectionView();
            this._provider.trackChanges = true;
        }

        public clear(): void {
            this._provider.clearChanges();
        }

        public flatten(): void {
            super.flatten();
            this._provider.refresh();
        }

        public getChanges<T extends OSFramework.OSStructure.ChangesDone>(
            c: new () => T
        ): T {
            const changes = new c();
            const itemsSource = this._provider;

            if (itemsSource.itemsAdded.length > 0) {
                changes.hasChanges = true;
                changes.addedLinesJSON = this._getChangesString(
                    itemsSource.itemsAdded
                );
            }

            if (
                itemsSource.itemsEdited.length > 0 &&
                this.parentGrid.features.dirtyMark.isGridDirty
            ) {
                changes.hasChanges = true;
                changes.editedLinesJSON = this._getChangesString(
                    itemsSource.itemsEdited
                );
            }

            if (itemsSource.itemsRemoved.length > 0) {
                changes.hasChanges = true;
                changes.removedLinesJSON = this._getChangesString(
                    itemsSource.itemsRemoved
                );
            }

            return changes;
        }

        public getProviderDataSource(): wijmo.collections.CollectionView {
            return this._provider;
        }

        public hasResults(): boolean {
            return this._provider.isEmpty === false;
        }

        public search(searchedValue: string): void {
            const rx = new RegExp(searchedValue, 'i');

            // always move to first page when a search is done
            this._provider.moveToFirstPage();

            this._provider.filter = function (x) {
                return !searchedValue || JSON.stringify(x).match(rx) !== null;
            };
        }

        public setData(data: string): void {
            super.setData(data);
            this._provider.sourceCollection = this._ds;
        }
    }
}
