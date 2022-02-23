using System;
using System.Collections;
using System.Data;
using OutSystems.HubEdition.RuntimePlatform;
using OutSystems.RuntimePublic.Db;

namespace OutSystems.NssDataGridUtils {

	public class CssDataGridUtils: IssDataGridUtils {

		/// <summary>
		/// DEPRECATED - Prepares your data to be used in the Data Grid.
		/// </summary>
		/// <param name="ssData">List or record to get meta data from.</param>
		/// <param name="ssDataJSON">JSON with the data for the data grid</param>
		/// <param name="ssDataMetadata">JSON with the structure of the object passed.</param>
		public void MssConvertData2JSON_deprecated(object ssData, out string ssDataJSON, out string ssDataMetadata) {
			ssDataJSON = "";
			ssDataMetadata = "";
			// TODO: Write implementation for action
		} // MssConvertData2JSON_deprecated

		/// <summary>
		/// Prepares your data to be used in the Data Grid.
		/// </summary>
		/// <param name="ssData">List or record to get meta data from.</param>
		/// <param name="ssDataJSON">JSON with the data and metadata for the data grid</param>
		public void MssConvertData2JSON(object ssData, out string ssDataJSON) {
			ssDataJSON = "";
			// TODO: Write implementation for action
		} // MssConvertData2JSON

	} // CssDataGridUtils

} // OutSystems.NssDataGridUtils

