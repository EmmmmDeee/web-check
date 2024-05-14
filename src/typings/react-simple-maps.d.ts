// src/index.js

import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-files/world-110m.json';

const MapChart = () => {
  return (
    <ComposableMap projectionConfig={{ scale: 200 }}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#EAEAEC"
              stroke="#D8D8D8"
              strokeWidth={0.5}
            />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
};

export default MapChart;
