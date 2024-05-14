import { Card, Row } from 'components/Form';
import React from 'react';

type HeadersCardProps = {
  data: { [key: string]: string | number };
  title: string;
  actionButtons?: React.ReactNode;
};

const HeadersCard = (props: HeadersCardProps): JSX.Element => {
  const { data, title, actionButtons } = props;
  const hasHeaders = Object.keys(data).length > 0;

  return (
    <Card
      heading={title}
      styles="grid-row: span 2;"
      actionButtons={actionButtons && actionButtons}
      key={title}
    >
      {hasHeaders &&
        Object.entries(data).map(([header, val], index) => {
          return <Row key={`header-${index}`} lbl={header} val={val} />;
        })}
    </Card>
  );
};

export default HeadersCard;
