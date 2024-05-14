import { Card, Row } from 'components/Form';

interface Props {
  data: {
    contentSecurityPolicy?: boolean;
    strictTransportPolicy?: boolean;
    xContentTypeOptions?: boolean;
    xFrameOptions?: boolean;
    xXSSProtection?: boolean;
  };
  title: string;
  actionButtons?: JSX.Element;
}

export const HttpSecurityCard = ({ data, title, actionButtons }: Props): JSX.Element => {
  return (
    <Card heading={title} actionButtons={actionButtons ?? <></>}>
      <Row
        key="contentSecurityPolicy"
        lbl="Content Security Policy"
        val={data.contentSecurityPolicy ? '✅ Yes' : '❌ No'}
      />
      <Row
        key="strictTransportPolicy"
        lbl="Strict Transport Policy"
        val={data.strictTransportPolicy ? '✅ Yes' : '❌ No'}
      />
      <Row
        key="xContentTypeOptions"
        lbl="X-Content-Type-Options"
        val={data.xContentTypeOptions ? '✅ Yes' : '❌ No'}
      />
      <Row
        key="xFrameOptions"
        lbl="X-Frame-Options"
        val={data.xFrameOptions ? '✅ Yes' : '❌ No'}
      />
      <Row
        key="xxssProtection"
        lbl="X-XSS-Protection"
        val={data.xXSSProtection ? '✅ Yes' : '❌ No'}
      />
    </Card>
  );
};
