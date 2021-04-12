// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Grid {

    export interface IGridGeneric<W> extends IGrid {
        provider: W;
    }}