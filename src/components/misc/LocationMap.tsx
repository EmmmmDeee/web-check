import { ComposableMap, Geographies, Geography, Annotation } from 'react-simple-maps';
import { default as colors } from 'styles/colors';
import MapFeatures from 'assets/data/map-features.json';

interface MapChartProps {
  lat: number;
  lon: number;
  label?: string;
}

const MapChart = ({ lat, lon, label }: MapChartProps) => {
  return (
    <ComposableMap
      projection="geoAzimuthalEqualArea"
      projectionConfig={{
        rotate: [0, 0, 0],
        center: [lon + 5, lat - 25],
        scale: 200,
      }}
    >
      <Geographies
        geography={MapFeatures}
        fill={colors.backgroundDarker}
        stroke={colors.primary}
        strokeWidth={0.5}
      >
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
      {label && (
        <Annotation
          subject={[lon, lat]}
          dx={-80}
          dy={-80}
          connectorProps={{
            stroke: colors.textColor,
            strokeWidth: 3,
            strokeLinecap: 'round',
          }}
        >
          <text
            x="-8"
            textAnchor="end"
            fill={colors.textColor}
            fontSize={25}
          >
            {label}
          </text>
        </Annotation>
      )}
    </ComposableMap>
  );
};

export default MapChart;
