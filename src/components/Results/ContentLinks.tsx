import { Card, Row } from 'components/Form';
import Heading from 'components/Form/Heading';
import colors from 'styles/colors';

const CardStyles = (): string => `
  small { margin-top: 1rem; opacity: 0.5; }
  a {
    color: ${colors.textColor};
  }
  details {
    display: flex;
    transition: all 0.2s ease-in-out;
    h3 {
      display: inline;
    }
    summary {
      padding: 0;
      margin: 1rem 0 0 0;
      cursor: pointer;
    }
    summary:before {
      content: "►";
      position: absolute;
      margin-left: -1rem;
      color: ${colors.primary};
      cursor: pointer;
    }
    &[open] summary:before {
      content: "▼";
    }
  }
`;

const getPathName = useCallback((link: string) => {
  if (!link) {
    return '';
  }
  try {
    const url = new URL(link);
    return url.pathname;
  } catch(e) {
    return link;
  }
}, []);

interface ContentLinksCardProps {
  data: {
    internal?: string[];
    external?: string[];
  };
  title: string;
  actionButtons?: any;
}

const ContentLinksCard = ({ data, title, actionButtons }: ContentLinksCardProps): JSX.Element => {
  const internal = data.internal || [];
  const external = data.external || [];
  return (
    <Card heading={title} actionButtons={actionButtons} styles={CardStyles()}>
      <Heading as="h3" size="small" color={colors.primary}>Summary</Heading>
      <Row lbl="Internal Link Count" val={internal.length} />
      <Row lbl="External Link Count" val={external.length} />
      { internal.length > 0 && (
        <details>
          <summary><Heading as="h3" size="small" color={colors.primary}>Internal Links</Heading></summary>
          {internal.map((link: string) => (
            <Row key={link} lbl="" val="">
              {getPathName(link) && (
                <a href={link} target="_blank" rel="noreferrer">{getPathName(link)}</a>
              )}
            </Row>
          ))}
        </details>
      )}
      { external.length > 0 && (
        <details>
          <summary><Heading as="h3" size="small" color={colors.primary}>External Links</Heading></summary>
          {external.map((link: string) => (
            <Row key={link} lbl="" val="">
              {link && (
                <a href={link} target="_blank" rel="noreferrer">{link}</a>
              )}
            </Row>
          ))}
        </details>
      )}
    </Card>
  );
}

export default ContentLinksCard;
