import styled from 'styled-components';
import docs from 'utils/docs';
import colors from 'styles/colors';
import Heading from 'components/Form/Heading';

type Doc = {
  id: string;
  title: string;
  description: string;
  use: string;
  resources: (string | { title: string; link: string })[];
  screenshot?: string;
};

const JobDocsContainer = styled.div`
  p.doc-desc,
  p.doc-uses,
  ul {
    margin: 0.25rem auto 1.5rem auto;
  }
  ul {
    padding: 0 0.5rem 0 1rem;
  }
  ul li a {
    color: ${colors.primary};
  }
  summary {
    color: ${colors.primary};
  }
  h4 {
    border-top: 1px solid ${colors.primary};
    color: ${colors.primary};
    opacity: 0.75;
    padding: 0.5rem 0;
  }
`;

const DocContent = (id: string) => {
  const doc = docs.filter((doc: Doc) => doc.id === id)[0] || null;
  if (!doc) return null;
  return (
    <JobDocsContainer>
      <Heading as="h3" size="medium" color={colors.primary}>
        {doc.title}
      </Heading>
      <Heading as="h4" size="small">
        About
      </Heading>
      <p className="doc-desc">{doc.description}</p>
      <Heading as="h4" size="small">
        Use Cases
      </Heading>
      <p className="doc-uses">{doc.use}</p>
      <Heading as="h4" size="small">
        Links
      </Heading>
      <ul>
        {doc.resources.map((resource, index) => (
          <li key={index} id={`link-${index}`}>
            {typeof resource === 'string' ? (
              <a
                target="_blank"
                rel="noreferrer"
                href={resource}
              >
                {resource}
              </a>
            ) : (
              <a
                target="_blank"
                rel="noreferrer"
                href={resource.link}
              >
                {resource.title}
              </a>
            )}
          </li>
        ))}
      </ul>
      <details>
        <summary>
          <Heading as="h4" size="small">
            Example
          </Heading>
        </summary>
        {doc.screenshot && <img width="300" src={doc.screenshot} alt="Screenshot" />}
      </details>
    </JobDocsContainer>
  );
};

export default DocContent;
