import styled from 'styled-components';
import { HostNames } from 'utils/result-processor';
import colors from 'styles/colors';
import { Card } from 'components/Form/Card';
import Heading from 'components/Form/Heading';

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem;
  margin-bottom: 0.25rem;
  border-bottom: 1px solid ${colors.primary};
  &:last-child { border-bottom: none; }
  span:first-child { font-weight: bold; }
`;

interface HostListSectionProps {
  list: string[];
  title: string;
}

const HostListSection = ({ list, title }: HostListSectionProps) => {
  if (list.length === 0) {
    return null;
  }

  return (
    <>
      <Heading as="h4" size="small" align="left" color={colors.primary}>{title}</Heading>
      {list.map((entry: string, index: number) => {
        return (
          <Row key={`${title.toLocaleLowerCase()}-${index}`} tabIndex={0} role="button">
            <span>{entry}</span>
          </Row>
        );
      })}
    </>
  );
}

const cardStyles = `
  max-height: 50rem;
  overflow: auto;
`;

interface HostNamesCardProps {
  data: HostNames;
  title: string;
  actionButtons: any;
}

const HostNamesCard = ({ data, title, actionButtons }: HostNamesCardProps): JSX.Element => {
  if (!data || !data.domains.length && !data.hostnames.length) {
    return null;
  }

  return (
    <Card
      key={title}
      heading={title}
      actionButtons={actionButtons}
      styles={cardStyles}
    >
      {data.domains.length > 0 && (
        <HostListSection list={data.domains} title="Domains" />
      )}
      {data.hostnames.length > 0 && (
        <HostListSection list={data.hostnames} title="Hosts" />
      )}
    </Card>
  );
}

export default HostNamesCard;
