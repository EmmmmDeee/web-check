import styled from 'styled-components';
import { Card } from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import colors from 'styles/colors';

type Tech = {
  name: string;
  version?: string;
  icon: string;
  description: string;
  website: string;
  categories: { name: string }[];
  confidence?: number;
};

type TechStackCardProps = {
  data: Tech[];
  title: string;
  actionButtons: JSX.Element;
};

const TechStackRow = styled.div`
  transition: all 0.2s ease-in-out;
  border-bottom: 1px solid ${colors.primary};
  &:last-child {
    margin-bottom: 0;
  }
  &:hover {
    .tech-confidence {
      display: block;
    }
    .tech-categories {
      display: none;
    }
  }
  .r1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  h4 {
    margin: 0.5rem 0 0 0;
    title: ${(props) => props.techName};
  }
  .r2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .tech-version {
    opacity: 0.5;
  }
  .tech-confidence,
  .tech-categories {
    font-size: 0.8rem;
    opacity: 0.5;
  }
  .tech-confidence {
    display: none;
  }
  .tech-description,
  .tech-website {
    font-size: 0.8rem;
    margin: 0.25rem 0;
    font-style: italic;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .tech-website {
    -webkit-line-clamp: 1;
  }
  .tech-icon {
    min-width: 2.5rem;
    border-radius: 4px;
    margin: 0.5rem 0;
    height: 2.5rem;
  }
  .tech-categories {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const TechStackCard: React.FC<TechStackCardProps> = (props) => {
  const { data, title, actionButtons } = props;
  return (
    <Card heading={title} actionButtons={actionButtons} styles={cardStyles}>
      {data.map((tech, index) => {
        const techName = tech.name;
        return (
          <TechStackRow key={index} techName={techName}>
            <div className="r1">
              <Heading as="h4" size="small">
                {tech.name}
                <span className="tech-version">
                  {tech.version ? `(v${tech.version})` : '(version unknown)'}
                </span>
              </Heading>
              <span
                className="tech-confidence"
                title={`${tech.confidence || 0}% certain`}
                aria-label={`${tech.confidence || 0}% certain`}
              >
                Certainty: {tech.confidence || 0}%
              </span>
              <span className="tech-categories">
                {tech.categories.map((cat, i) => `${cat.name}${i < tech.categories.length - 1 ? ', ' : ''}`)}
              </span>
            </div>
            <div className="r2">
              <img
                className="tech-icon"
                width="2.5"
                height="2.5"
                src={`${iconsCdn}${tech.icon}`}
                alt={tech.name}
              />
              <div>
                <p className="tech-description">{tech.description}</p>
                <p className="tech-website">
                  Learn more at:{' '}
                  <a
                    href={tech.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tech.website}
                  </a>
                </p>
              </div>
            </div>
          </TechStackRow>
        );
      })}
    </Card>
  );
};

const cardStyles = `
  grid-row: span 2;
  small {
    margin-top: 1rem;
    opacity: 0.5;
    display: block;
    a { color: ${colors.primary}; }
  }
`;

const iconsCdn = 'https://www.wappalyzer.com/images/icons/';

export default TechStackCard;
