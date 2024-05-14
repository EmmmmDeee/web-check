import { Card, CardProps } from 'components/Form/Card';
import Row, { RowProps } from 'components/Form/Row';

const cardStyles = `
  grid-row: span 2;
  .content {
    max-height: 50rem;
    overflow-y: auto;
  }
`;

type RobotsTxtCardProps = {
  data: {
    robots: RowProps[];
  };
  title: string;
  actionButtons: any;
} & CardProps;

export const RobotsTxtCard: React.FC<RobotsTxtCardProps> = ({
  data: { robots },
  title,
  actionButtons,
  children,
}) => {
  return (
    <Card
      heading={title}
      actionButtons={actionButtons}
      styles={cardStyles}
    >
      {children}
      <div className="content">
        {
          robots.length === 0 && <p>No crawl rules found.</p>
        }
        {
          robots.map((row: RowProps, index: number) => {
            return (
              <Row
                key={`${row.lbl}-${index}`}
                lbl={row.lbl}
                val={row.val}
              />
            )
          })
        }
      </div>
    </Card>
  );
}
