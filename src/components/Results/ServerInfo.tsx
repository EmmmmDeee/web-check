import { ServerInfo } from 'utils/result-processor';
import { Card } from 'components/Form/Card';
import Row from 'components/Form/Row';

type ServerInfoCardProps = {
  data: ServerInfo;
  title: string;
  actionButtons: any;
};

const ServerInfoCard = (props: ServerInfoCardProps): JSX.Element => {
  const info = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {info.org && <Row key="org" lbl="Organization" val={info.org ?? ''} />}
      {info.isp && info.isp !== info.org && (
        <Row key="isp" lbl="Service Provider" val={info.isp ?? ''} />
      )}
      {info.os && <Row key="os" lbl="Operating System" val={info.os ?? ''} />}
      {info.asn && <Row key="asn" lbl="ASN Code" val={info.asn ?? ''} />}
      {info.ports && <Row key="ports" lbl="Ports" val={info.ports ?? ''} />}
      {info.ip && <Row key="ip" lbl="IP" val={info.ip ?? ''} />}
      {info.type && <Row key="type" lbl="Type" val={info.type ?? ''} />}
      {info.loc && <Row key="loc" lbl="Location" val={info.loc ?? ''} />}
    </Card>
  );
};

export default ServerInfoCard;
