import styled from 'styled-components';
import { Card } from 'components/Form/Card';
import Row from 'components/Form/Row';

type RowProps = {
  lbl: string;
  val: string | boolean | null | undefined;
};

const Note = styled.small<{ className?: string }>`
  opacity: 0.5;
  display: block;
  margin-top: 0.5rem;
`;

const FirewallCard = (props: { data: any; title: string; actionButtons: any }): JSX.Element => {
  const { data, title, actionButtons } = props;
  return (
    <Card heading={title} actionButtons={actionButtons}>
      <Row lbl="Firewall" val={data.hasWaf ? '✅ Yes' : '❌ No*'} key="firewall" />
      {data.waf && <Row lbl="WAF" val={data.waf} key="waf" />}
      {data.hasWaf === false && data.waf === undefined && (
        <Note className="note">
          *The domain may be protected with a proprietary or custom WAF which we were unable to identify automatically
        </Note>
      )}
    </Card>
  );
};

export default FirewallCard;
