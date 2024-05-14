import React from 'react';
import colors from 'styles/colors';
import { Card, Row } from 'components/Form';

type DomainDataable = {
  data: {
    internicData: {
      Domain_Name?: string;
      Creation_Date?: string;
      Updated_Date?: string;
      Registry_Expiry_Date?: string;
      Registry_Domain_ID?: string;
      Registrar_WHOIS_Server?: string;
      Registrar?: string;
      Registrar_URL?: string;
      Registrar_IANA_ID?: string;
    } | null;
  };
  title: string;
  actionButtons?: JSX.Element | null;
};

const DomainLookupCard: React.FC<DomainDataable> = (props) => {
  const domain = props.data.internicData || {};
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {domain.Domain_Name && <Row key="RegisteredDomain" lbl="Registered Domain" val={domain.Domain_Name} />}
      {domain.Creation_Date && <Row key="CreationDate" lbl="Creation Date" val={domain.Creation_Date} />}
      {domain.Updated_Date && <Row key="UpdatedDate" lbl="Updated Date" val={domain.Updated_Date} />}
      {domain.Registry_Expiry_Date && <Row key="RegistryExpiryDate" lbl="Registry Expiry Date" val={domain.Registry_Expiry_Date} />}
      {domain.Registry_Domain_ID && <Row key="RegistryDomainID" lbl="Registry Domain ID" val={domain.Registry_Domain_ID} />}
      {domain.Registrar_WHOIS_Server && <Row key="RegistrarWhoisServer" lbl="Registrar WHOIS Server" val={domain.Registrar_WHOIS_Server} />}
      {domain.Registrar && domain.Registrar_URL && <Row key="Registrar" lbl="" val={<a href={domain.Registrar_URL}>{domain.Registrar}</a>} />}
      {domain.Registrar && !domain.Registrar_URL && <Row key="Registrar" lbl="" val={domain.Registrar} />}
      {domain.Registrar_IANA_ID && <Row key="RegistrarIANAID" lbl="Registrar IANA ID" val={domain.Registrar_IANA_ID} />}
    </Card>
  );
}

const cardStyles = `
  span.val {
    &.up { color: ${colors.success}; }
    &.down { color: ${colors.danger}; }
  }
`;

export default DomainLookupCard;
