import styled from 'styled-components';
import ErrorBoundary from 'components/misc/ErrorBoundary';
import Heading from 'components/Form/Heading';
import colors from 'styles/colors';

export const StyledCard = styled.section<{ styles?: string; height?: string }>`
  background: ${colors.backgroundLighter};
  box-shadow: 4px 4px 0px ${colors.bgShadowColor};
  border-radius: 8px;
  padding: 1rem;
  position: relative;
  margin: 0.5rem;
  max-height: 64rem;
  height: ${props => props.height};
  overflow: auto;
  padding-bottom: 1rem;
  ${props => props.styles}
`;

interface CardProps {
  children: React.ReactNode;
  heading?: string;
  title?: string;
  styles?: string;
  actionButtons?: React.ReactNode | undefined;
  height?: string;
}

export const Card = (props: CardProps): JSX.Element => {
  const { children, heading, title, styles, actionButtons, height } = props;
  return (
    <ErrorBoundary title={title}>
      <StyledCard styles={styles} height={height}>
        {actionButtons && actionButtons}
        {heading && <Heading className="inner-heading" as="h3" align="left" color={colors.primary}>{heading}</Heading>}
        {children}
      </StyledCard>
    </ErrorBoundary>
  );
};

export default StyledCard;
