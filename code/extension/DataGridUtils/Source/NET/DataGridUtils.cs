
namespace OutSystems.NssDataGridUtils {

	public class CssDataGridUtils: IssDataGridUtils {

		/// <summary>
		/// Prepares your data to be used in the Data Grid.
		/// </summary>
		/// <param name="ssData">List or record to get meta data from.</param>
		/// <param name="ssDataJSON">JSON with the data for the data grid</param>
		/// <param name="ssDataMetadata">JSON with the structure of the object passed.</param>
		public void MssConvertData2JSON_deprecated(object ssData, out string ssDataJSON, out string ssDataMetadata) {
			ObtainMetadata.fromObject(ssData, out ssDataMetadata);
			temp_ardoJSON.OutSystemsObjToJSON(ssData, 3, out ssDataJSON);
		} // MssConvertData2JSON_deprecated

		/// <summary>
		/// Prepares your data to be used in the Data Grid.
		/// </summary>
		/// <param name="ssData">List or record to get meta data from.</param>
		/// <param name="ssDataJSON">JSON with the data for the data grid</param>
		public void MssConvertData2JSON(object ssData, out string ssDataJSON) {
			System.Text.StringBuilder strbuilder = new System.Text.StringBuilder();
			System.IO.StringWriter sw = new System.IO.StringWriter(strbuilder);

			MssConvertData2JSON_deprecated(ssData, out string dataJSONtemp, out string dataMetadata);

			using (Newtonsoft.Json.JsonWriter json = new Newtonsoft.Json.JsonTextWriter(sw)) {
				json.WriteStartObject();
				json.WritePropertyName("data");
				json.WriteRawValue(dataJSONtemp);
				json.WritePropertyName("metadata");
				json.WriteRawValue(dataMetadata);
				json.WriteEndObject();
			}
			ssDataJSON = strbuilder.ToString();
		} // MssConvertData2JSON

    } // CssDataGridUtils

} // OutSystems.NssDataGridUtils

