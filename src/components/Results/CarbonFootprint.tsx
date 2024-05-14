import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card } from 'components/Form/Card';
import Row from 'components/Form/Row';
import colors from 'styles/colors';

const LearnMoreInfo = styled.p`
font-size: 0.8rem;
margin-top: 0.5rem;
opacity: 0.75;
a { color: ${colors.primary}; }
`;

type CarbonDataable = {
  c?: number;
  p?: number;
}

const CarbonCard: React.FC<{ data: any, title: string, actionButtons: any }> = ({ data, title, actionButtons }) => {
  const carbons = data.statistics;
  const initialUrl = data.scanUrl;

  const [carbonData, setCarbonData] = useState<CarbonDataable>({});

  useEffect(() => {
    const fetchCarbonData = async () => {
      try {
        const response = await fetch(`https://api.websitecarbon.com/b?url=${encodeURIComponent(initialUrl)}`);
        const data = await response.json();
        setCarbonData(data);
      } catch (error) {
        console.error('Error fetching carbon data:', error);
      }
    };
    fetchCarbonData();
  }, [initialUrl]);

  return (
    <Card heading={title} actionButtons={actionButtons}>
      {!carbons?.adjustedBytes && !carbonData.c && <p>Unable to calculate carbon footprint for host</p>}
      {carbons?.adjustedBytes > 0 && carbons.adjustedBytes && <>
        <Row lbl="HTML Initial Size" val={`${carbons.adjustedBytes} bytes`} />
        {carbons.co2.grid.grams && <Row lbl="CO2 for Initial Load" val={`${(carbons.co2.grid.grams * 1000).toPrecision(4)} grams`} />}
        {carbons.energy && <Row lbl="Energy Usage for Load" val={`${(carbons.energy * 1000).toPrecision(4)} KWg`} />}
      </>}
      {carbonData.c && <Row lbl="CO2 Emitted" val={`${carbonData.c} grams`} />}
      {carbonData.p && <Row lbl="Better than average site by" val={`${carbonData.p}%`} />}
      <br />
      <LearnMoreInfo>Learn more at <a href="https://www.websitecarbon.com/">websitecarbon.com</a></LearnMoreInfo>
    </Card>
  );
}

export default CarbonCard;
