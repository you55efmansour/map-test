import './App.css';
import { MapContainer, TileLayer, CircleMarker , Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
function App() {
  const position = [51.505, -0.09];
  return (
    <div className="App">
      <MapContainer center={position} zoom={13} style={{ height: "100vh" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker  center={position} radius={20} color="blue" fillColor="blue" fillOpacity={0.6}>
          <Popup>
            <h1>london</h1>
            <h2>test</h2>
            <h2>test</h2>
          </Popup>
        </CircleMarker >
    </MapContainer>
    </div>
  );
}

export default App;
