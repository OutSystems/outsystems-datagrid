/**
 * Defines the interface for buildable objects
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
interface IBuilder {
    /**
     * Build object, instantiating dependencies, and maniulating DOM when necessary
     */
    build(): void;
}