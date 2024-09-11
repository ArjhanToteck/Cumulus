import CodeBlock from "/src/components/CodeBlock.js";

export default async function Page() {

	const response = await fetch(`${process.env.NEXT_PUBLIC_SOCKETIO_SERVER}/api/projects/cumulus?latitude=39.947969&longitude=-75.195000`);
	const weatherData = await response.json();

	return (
		<main>
			<section>
				<h1>Cumulus</h1>
				<p>Cumulus is a free and simple weather API without the need for an API key. I originally made this a few years ago, but it was terrible. Hopefully this works a little better.</p>

				<h2>Demo</h2>

				The weather outside of the University of Pennsylvania in Philadelphia is {weatherData.description.toLowerCase()}. The temperature is {weatherData.temperature} degrees Fahrenheit.

				<h2>Endpoint</h2>
				<p>Simply make an HTTP request to {process.env.NEXT_PUBLIC_SOCKETIO_SERVER}/api/projects/cumulus?latitude=LATITUDE&longitude=LONGITUDE and read the data as a JSON. Obviously, make sure to replace LATITUDE and LONGITUDE with an actual valid latitude and longitude.</p>

				<p>In JavaScript, for example:</p>

				<CodeBlock code={
					`fetch("${process.env.NEXT_PUBLIC_SOCKETIO_SERVER}/api/projects/cumulus?latitude=LATITUDE&longitude=LONGITUDE")` + "\n" +
					`	.then((response) => response.json())` + "\n" +
					`	.then(console.log);`
				} />

				<h2>Documentation</h2>
				<p>Cumulus returns the following data in a JSON format. Note that the data may be outdated by a few minutes, the time at which the data was updated is available in the timeUpdated property.</p>
				<table>
					<tbody>
						<tr>
							<th>Property Name</th>
							<th>Description</th>
							<th>Data Type</th>
						</tr>
						<tr>
							<td>airQualityIndex</td>
							<td>A number ranging from 0 to 500 describing the amount of pollution in the air. If this value is low, it means the air quality is good. If this value is high, it means the air quality is poor.</td>
							<td>Integer</td>
						</tr>
						<tr>
							<td>city</td>
							<td>The name of the city/town where the weather is being observed.</td>
							<td>String</td>
						</tr>
						<tr>
							<td>description</td>
							<td>A basic description of the weather. Some examples include "Cloudy," "Clear," "Fair," "Mostly Cloudy," "Partly Cloudy," and "Sunny."</td>
							<td>String</td>
						</tr>
						<tr>
							<td>dewPoint</td>
							<td>The temperature in Fahrenheit that needs to be reached for the air to reach a humidity of 100%.</td>
							<td>Integer</td>
						</tr>
						<tr>
							<td>feelsLike</td>
							<td>What the temperature feels like outside due to the wind, sun, and other factors measured in Fahrenheit.</td>
							<td>Integer</td>
						</tr>
						<tr>
							<td>high</td>
							<td>The highest predicted temperature in Fahrenheit.</td>
							<td>Integer</td>
						</tr>
						<tr>
							<td>humidity</td>
							<td>A decimal number indicating the humidity from a scale of 0 to 1.</td>
							<td>Decimal</td>
						</tr>
						<tr>
							<td>latitude</td>
							<td>The latitude used to access the data.</td>
							<td>Decimal</td>
						</tr>
						<tr>
							<td>longitude</td>
							<td>The longitude used to access the data.</td>
							<td>Decimal</td>
						</tr>
						<tr>
							<td>low</td>
							<td>The lowest predicted temperature in Fahrenheit.</td>
							<td>Integer</td>
						</tr>
						<tr>
							<td>moonPhase</td>
							<td>The phase the moon is taking in the lunar cycle.</td>
							<td>String</td>
						</tr>
						<tr>
							<td>pressure</td>
							<td>The atmospheric pressure measured in inches.</td>
							<td>Decimal</td>
						</tr>
						<tr>
							<td>rainChance</td>
							<td>The chances it will rain today as a number from a scale of 0 to 1.</td>
							<td>Decimal</td>
						</tr>
						<tr>
							<td>sunrise</td>
							<td>The time in which the sun rises reported in an ISO date format.</td>
							<td>String</td>
						</tr>
						<tr>
							<td>sunset</td>
							<td>The time in which the sun sets reported in an ISO date format.</td>
							<td>String</td>
						</tr>
						<tr>
							<td>temperature</td>
							<td>The current temperature in Fahrenheit.</td>
							<td>Number</td>
						</tr>
						<tr>
							<td>timeUpdated</td>
							<td>The time at which the data was reported in in an ISO date format.</td>
							<td>String</td>
						</tr>
						<tr>
							<td>timezone</td>
							<td>The timezone reported in TZ identifier or "Area/Location" form. For example, "Europe/Paris" or "America/New_York."</td>
							<td>String</td>
						</tr>
						<tr>
							<td>uvIndex</td>
							<td>The measurement of UV rays received from the sun in the area, reported as a number from a scale of 0 to 1.</td>
							<td>Number</td>
						</tr>
						<tr>
							<td>visibility</td>
							<td>The number of miles visible from a given point under the current weather conditions.</td>
							<td>Number</td>
						</tr>
						<tr>
							<td>windDirection</td>
							<td>The direction in which the wind blows as an angle. Note that 0 is South, 180 is North, 90 is west, and 270 is east.</td>
							<td>Number</td>
						</tr>
						<tr>
							<td>windSpeed</td>
							<td>The speed of the wind measured in miles per hour.</td>
							<td>Number</td>
						</tr>
					</tbody>
				</table>
				<br></br>
			</section>
		</main>
	);
}