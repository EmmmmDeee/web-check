import React from 'react';
import styled from 'styled-components';
import { TechnologyGroup, Technology } from 'utils/result-processor';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';

const Outer = styled(Card)`
  grid-row: span 2;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem;
  &:not(:last-child) {
    border-bottom: 1px solid ${colors.primary};
  }
  span.lbl {
    font-weight: bold;
  }
  span.val {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

interface ListRowProps {
  title: string;
  list: Technology[];
}

const ListRow: React.FC<ListRowProps> = ({ title, list }) => {
  return (
    <>
      <Heading as="h3" align="left" color={colors.primary}>
        {title}
      </Heading>
      {list.map((entry, index) => {
        return (
          <Row key={`${title.toLocaleLowerCase()}-${index}`}>
            <span>{entry.Name || '-'}</span>
          </Row>
        );
      })}
    </>
  );
};

interface BuiltWithCardProps {
  data: TechnologyGroup[];
}

const BuiltWithCard: React.FC<BuiltWithCardProps> = (props) => {
  const { data } = props;

  return (
    <Outer>
      <Heading as="h3" align="left" color={colors.primary}>
        Technologies
      </Heading>
      {data.map((group) => {
        return (
          <ListRow key={group.tag} title={group.tag} list={group.technologies} />
        );
      })}
    </Outer>
  );
};

export default BuiltWithCard;
