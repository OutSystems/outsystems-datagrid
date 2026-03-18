
namespace OutSystems.NssDataGridUtils {

	public class CssDataGridUtils: IssDataGridUtils {

		/// <summary>
		/// Converts the data to JSON.
		/// </summary>
		/// <param name="ssData">The data to convert.</param>
		/// <param name="ssDataJSON">The JSON representation of the data.</param>
		/// <param name="ssDataMetadata">The metadata of the data.</param>
        private void ConvertDataToJSON(object ssData, out string ssDataJSON, out string ssDataMetadata) {
            ObtainMetadata.fromObject(ssData, out ssDataMetadata);
            temp_ardoJSON.OutSystemsObjToJSON(ssData, 3, out ssDataJSON);
        }

		/// <summary>
		/// Prepares your data to be used in the Data Grid.
		/// </summary>
		/// <param name="ssData">List or record to get meta data from.</param>
		/// <param name="ssDataJSON">JSON with the data for the data grid</param>
		/// <param name="ssDataMetadata">JSON with the structure of the object passed.</param>
		public void MssConvertData2JSON_deprecated(object ssData, out string ssDataJSON, out string ssDataMetadata) {
			ConvertDataToJSON(ssData, out ssDataJSON, out ssDataMetadata);
		} // MssConvertData2JSON_deprecated

		/// <summary>
		/// Prepares your data to be used in the Data Grid.
		/// </summary>
		/// <param name="ssData">List or record to get meta data from.</param>
		/// <param name="ssDataJSON">JSON with the data for the data grid</param>
		public void MssConvertData2JSON(object ssData, out string ssDataJSON) {
			var sb = new System.Text.StringBuilder();
			using (var sw = new System.IO.StringWriter(sb))
			using (Newtonsoft.Json.JsonWriter json = new Newtonsoft.Json.JsonTextWriter(sw)) {
				json.WriteStartObject();
				json.WritePropertyName("data");
				temp_ardoJSON.writeData(json, ssData, 3);
				json.WritePropertyName("metadata");
				ObtainMetadata.writeMetadata(json, ssData);
				json.WriteEndObject();
			}
			ssDataJSON = sb.ToString();
		} // MssConvertData2JSON

    } // CssDataGridUtils

} // OutSystems.NssDataGridUtils

