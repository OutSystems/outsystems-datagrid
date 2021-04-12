/**
 * Defines the interface for objects with multiple DOM identifiers
 */
 interface ISearchById {
    /**
     * Validates if object matched with the given id
     */
    equalsToID(id: string): boolean;
}