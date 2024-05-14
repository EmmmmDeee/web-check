import React from 'react';
import styled from 'styled-components';

import colors from 'styles/colors';
import Heading from 'components/Form/Heading';
import Footer from 'components/misc/Footer';
import Nav from 'components/Form/Nav';
import Button from 'components/Form/Button';
import AdditionalResources from 'components/misc/AdditionalResources';
import { StyledCard } from 'components/Form/Card';
import docs, { about, featureIntro, license, fairUse, supportUs } from 'utils/docs';

const AboutContainer = styled.div`
  width: 95vw;
  max-width: 1000px;
  margin: 2rem auto;
  padding-bottom: 1rem;
`;

const HeaderLinkContainer = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  a {
    text-decoration: none;
  }
`;

const Section = styled(StyledCard)`
  margin-bottom: 2rem;
  overflow: clip;
  max-height: 100%;
  h3 {
    font-size: 1.5rem;
  }
  hr {
    border: none;
    border-top: 1px dashed ${colors.primary};
    margin: 1.5rem auto;
  }
  ul {
    padding: 0 0 0 1rem;
    list-style: circle;
  }
  a {
    color: ${colors.primary};
    &:visited { opacity: 0.8; }
  }
  pre {
    background: ${colors.background};
    border-radius: 4px;
    padding: 0.5rem;
    width: fit-content;
  }
  small { opacity: 0.7; }
  .contents {
    ul {
      list-style: none;
      li {
        a {
          // color: ${colors.textColor};
          &:visited { opacity: 0.8; }
        }
        b {
          opacity: 0.75;
          display: inline-block;
          width: 1.5rem;
        }
      }
    }
  }
  .example-screenshot {
    float: right; 
    display: inline-flex;
    flex-direction: column;
    clear: both;
    max-width: 300px;
    img {
      float: right;
      break-inside: avoid;
      max-width: 300px;
      // max-height: 30rem;
      border-radius: 6px;
      clear: both;
    }
    figcaption {
      font-size: 0.8rem;
      text-align: center;
      opacity: 0.7;
    }
  }
`;

const makeAnchor = (title: string): string => {
  return title.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "-");
};

const About: React.FC = () => {
  return (
    <div>
      <AboutContainer>
        <Nav>
          <HeaderLinkContainer>
            <a href="https://github.com/lissy93/web-check"><Button>View on GitHub</Button></a>
          </HeaderLinkContainer>
        </Nav>

        <Heading as="h2" size="medium" color={colors.primary}>Intro</Heading>
        <Section>
          {about.map((para, index: number) => (
            <p key={index}>{para}</p>
          ))}
          <hr />
          <p>
            Web-Check is developed and maintained by <a href="https://aliciasykes.com">Alicia Sykes</a>.
            It's licensed under the <a href="https://github.com/Lissy93/web-check/blob/master/LICENSE">MIT license</a>,
            and is completely free to use, modify and distribute in both personal and commercial settings.
            Source code and self-hosting docs are available on <a href="https://github.com/lissy93/web-check">GitHub</a>.
            If you've found this service useful, consider <a href="https://github.com/sponsors/Lissy93">sponsoring me</a> from $1/month,
            to help with the ongoing hosting and development costs.
          </p>
        </Section>

        <Heading as="h2" size="medium" color={colors.primary}>Features</Heading>
        <Section>
          {featureIntro.map((fi: string, i: number) => (<p key={i}>{fi}</p>))}
          <div className="contents">
            <Heading as="h3" size="small" id="#feature-contents" color={colors.primary}>Contents</Heading>
            <ul>
              {docs.map((section, index: number) => (
                <li key={index}>
                  <a href={`#${makeAnchor(section.title)}`}>{section.title}</a>
                </li>
              ))}
            </ul>
            <hr />
          </div>
          {docs.map((section, sectionIndex: number) => (
            <section key={section.title}>
              { sectionIndex > 0 && <hr /> }
              <Heading as="h3" size="small" id={makeAnchor(section.title)} color={colors.primary}>{section.title}</Heading>
              {section.screenshot &&
                <figure className="example-screenshot">
                  <img className="screenshot" src={section.screenshot} alt={`Example Screenshot ${section.title}`} />
                  <figcaption>Fig.{sectionIndex + 1} - Example of {section.title}</figcaption>
                </figure> 
              }
              {section.description && <>
                <Heading as="h4" size="small">Description</Heading>
                <p>{section.description}</p>
              </>}
              { section.use && <>
                <Heading as="h4" size="small">Use Cases</Heading>
                <p>{section.use}</p>
              </>}
              {section.resources && section.resources.length > 0 && <>
                <Heading as="h4" size="small">Useful Links</Heading>
                <ul>
                  {section.resources.map((link: string | { title: string, link: string }, linkIndx: number) => (
                    typeof link === 'string' ? (
                      <li id={`link-${linkIndx}`}><a target="_blank" rel="noreferrer" href={link}>{link}</a></li>
                    ) : (
                      <li id={`link-${linkIndx}`}><a target="_blank" rel="noreferrer" href={link.link}>{link.title}</a></li>
                    )
                  ))}
                </ul>
              </>}
            </section>
          ))}
        </Section>

        {/* ... Rest of the code ... */}

      </AboutContainer>
      <Footer />
    </div>
  );
}

export default About;
