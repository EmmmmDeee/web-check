import styled from 'styled-components';
import { ServerLocation } from 'utils/result-processor';
import { Card } from 'components/Form/Card';
import LocationMap from 'components/misc/LocationMap';
import Flag from 'components/misc/Flag';
import { TextSizes } from 'styles/typography';
import Row, { StyledRow } from 'components/Form/Row';

type CardProps = {
  children: React.ReactNode;
  heading: string;
  actionButtons: any;
  styles: string;
};

const cardStyles = '';

const SmallText = styled.span<{ width: string }>`
  opacity: 0.5;
  font-size: ${TextSizes.xSmall};
  text-align: right;
  display: block;
  width: ${(props) => props.width};
`;

const MapRow = styled(StyledRow)`
  padding-top: 1rem;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CountryValue = styled.span`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ServerLocationCard = (props: { data: ServerLocation; title: string }): JSX.Element => {
  const location = props.data;
  const {
    city, region, country,
    postCode, countryCode, coords,
    isp, timezone, languages, currency, currencyCode,
  } = location;

  return (
    <Card
      variants={cardStyles}
      heading={props.title}
      actionButtons={props.actionButtons}
    >
      <Row
        lbl="City"
        val={`${postCode}, ${city}, ${region}`}
      />
      <Row
        lbl="Country"
        val={
          <CountryValue>
            {country}
            {countryCode && <Flag countryCode={countryCode} width={28} title={country} />}
          </CountryValue>
        }
      />
      <Row lbl="Timezone" val={timezone} />
      <Row lbl="Languages" val={languages} />
      <Row lbl="Currency" val={`${currency} (${currencyCode})`} />
      <MapRow>
        <LocationMap
          lat={coords.latitude}
          lon={coords.longitude}
          label={`Server (${isp})`}
          for="location-map"
        />
        <SmallText width="100%" id="location-map">
          Latitude: {coords.latitude}, Longitude: {coords.longitude}
        </SmallText>
      </MapRow>
    </Card>
  );
};

export default ServerLocationCard;
