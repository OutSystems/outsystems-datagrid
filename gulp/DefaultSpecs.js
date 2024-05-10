/*
 * Global constants info
 **/
const constants = {
	fileName: 'GridFramework',
	gitUrl: 'https://github.com/OutSystems/outsystems-datagrid',
	websiteUrl: 'https://outsystemsui.outsystems.com/OutSystemsDataGridSample/',
	envType: {
		development: 'dev',
		production: 'prod',
	},
	// list of files to be excluded from a specific platform
	excludeFromTsTranspile: {},
	// list of platforms to compile and create scss files.
	platformTarget: {
		default: '',
	},
};

// Store the default project specifications
const specs = {
	version: '2.15.1',
	name: 'OutSystems DataGrid',
	description: '',
	url: 'Website:\n • ' + constants.websiteUrl,
	gitHub: 'GitHub:\n • ' + constants.gitUrl,
};

// Expose sections info!
exports.info = specs;
exports.globalConsts = constants;
