## Project Structure

Bellow there is some comments about the application structure.  

The namespaces should follow application directories, this way we should find files and objects using the same path.

    .
    ├── ...
    ├── src                   # Where the code lives
    |   ├── GridAPI           # The opened API used by consumers, most of the case by OS actions
    |   ├── OSFramework       # Here the defined structure and interfaces for Grid, Columns and Features 
    |       ├── Column        # Base structure for grid's columns
    |       ├── Configuration # The configuration used by columns and grid
    |       ├── Enum          # The used enums we use to control the work
    |       ├── Event         # Base structure for implementing events
    |       ├── Feature       # All the available features have a defined interface, in case of changing the provider the interfaces should be maintained
    |       ├── Grid          # Base structure for the grid
    |       ├── Helper        # Where we share static functions to help on our daily work, GetElementByUniqueId for example, is shared here
    |       ├── Interface     # Interfaces shared and used by our objects
    |       ├── OSCallback    # OS Actions can have parameters, instead of creating methods not stric typed, in this folder you should create types to represent OS Actions callbacks
    |       └── OSStructure   # Where to create classes that map OS structures
    |   └── WijmoProvider     # To let our framework free of providers, all the references to wijmo must be done here, in case of new consumers, a new folder in this level should be created, following the same pattern *<ProviderName>Provider*, for exemple, if we use a provider called Uttem, this new path should be *UttemProvider*.
    └── ...
  