import React from 'react';
import { Card, Row } from 'components';
import colors from 'styles/colors';
import Heading from 'components/Form/Heading';

const formatDate = (timestamp: number | undefined): string => {
  if (!timestamp || isNaN(timestamp) || timestamp <= 0) return 'No Date';

  const date = new Date(timestamp * 1000);

  if (isNaN(date.getTime())) return 'Unknown';

  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return formatter.format(date);
}

interface SiteFeaturesCardProps {
  data: any;
  title: string;
  actionButtons: any;
}

const SiteFeaturesCard: React.FC<SiteFeaturesCardProps> = (props) => {
  const { data, title, actionButtons } = props;
  const features = data?.groups?.filter((group: any) => group.categories.length > 0);
  const filteredFeatures = useMemo(() => features?.map((group: any, index: number) => (
    <div key={`${group.name}-${index}`}>
      <Heading as="h4" size="small" color={colors.primary}>{group.name}</Heading>
      { group.categories.map((category: any, subIndex: number) => (
        <Row lbl={category.name} val={`${category.live} Live ${category.dead ? `(${category.dead} dead)` : ''}`} key={`${category.name}-${subIndex}`} />
      ))
      }
    </div>
  )), [features]);

  return (
    <Card heading={title} actionButtons={actionButtons} styles={{ __html: styles }}>
      <div className="content">
        {filteredFeatures}
      </div>
      <p className="scan-date">Last scanned on {formatDate(data?.last)}</p>
    </Card>
  );
}

const styles = `
  .content {
    max-height: 50rem;
    overflow-y: auto;
  }

  .scan-date {
    font-size: 0.8rem;
    margin-top: 0.5rem;
    opacity: 0.75;
  }
`;

export default SiteFeaturesCard;
