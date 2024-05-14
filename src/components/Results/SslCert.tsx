import React from 'react';
import styled from 'styled-components';
import { Card, Heading } from 'components/Form';
import colors from 'styles/colors';
import { OID } from 'asn1js'; // added import

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem;
  border-bottom: ${(props) =>
    props.lastChild ? 'none' : `1px solid ${colors.primary}`};
  span.lbl { font-weight: bold; }
  span.val {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.warn(`Invalid date string: ${dateString}`);
    return '';
  }
  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return formatter.format(date);
};

const DataRow = (props: { lbl: string; val: string | null }) => {
  const { lbl, val } = props;
  return (
    <Row lastChild={lbl === 'Fingerprint'}>
      <span className="lbl">{lbl}</span>
      <span className="val" title={val}>
        {val || '-'}
      </span>
    </Row>
  );
};

const getExtendedKeyUsage = (oids: string[]): string[] => {
  const oidMap: { [key: string]: string } = {
    // ... (same as before)
  };
  const oidSet = new Set<string>();
  for (const oid of oids) {
    const name = oidMap[oid];
    if (name) {
      oidSet.add(name);
    } else {
      oidSet.add(oid);
    }
  }
  return Array.from(oidSet);
};

const ListRow = (props: { list: string[]; title: string }) => {
  const { list, title } = props;
  return (
    <>
      <Heading as="h3" size="small" align="left" color={colors.primary}>
        {title}
      </Heading>
      {list.map((entry: string, index: number) => {
        return <Row key={`${title.toLocaleLowerCase()}-${index}`}><span>{entry}</span></Row>;
      })}
    </>
  );
};

interface SslCertCardProps {
  data: any;
  title: string;
  actionButtons: any;
}

const SslCertCard: React.FC<SslCertCardProps> = (props) => {
  const { data, title, actionButtons } = props;
  const {
    subject,
    issuer,
    fingerprint,
    serialNumber,
    asn1Curve,
    nistCurve,
    valid_to,
    valid_from,
    ext_key_usage,
  } = data;

  return (
    <Card heading={title} actionButtons={actionButtons}>
      {subject && <DataRow lbl="Subject" val={subject?.CN} />}
      {issuer?.O && <DataRow lbl="Issuer" val={issuer.O} />}
      {asn1Curve && <DataRow lbl="ASN1 Curve" val={asn1Curve} />}
      {nistCurve && <DataRow lbl="NIST Curve" val={nistCurve} />}
      {valid_to && <DataRow lbl="Expires" val={formatDate(valid_to)} />}
      {valid_from && (
        <DataRow lbl="Renewed" val={formatDate(valid_from)} />
      )}
      {serialNumber && (
        <DataRow lbl="Serial Num" val={serialNumber} />
      )}
      {fingerprint && (
        <DataRow lbl="Fingerprint" val={fingerprint} />
      )}
      {ext_key_usage && (
        <ListRow
          title="Extended Key Usage"
          list={getExtendedKeyUsage(
            ext_key_usage.map((oid: OID) => oid.toString())
          )}
        />
      )}
    </Card>
  );
};

export default SslCertCard;
