import { Card, Row, ExpandableRow } from 'components/Form';
import { colors } from 'styles/colors';

const cardStyles = `
  max-height: 50rem;
  overflow-y: auto;
  a {
    color: ${colors.primary};
  }
  small {
    margin-top: 1rem;
    opacity: 0.5;
    display: block;
    a { color: ${colors.primary}; }
  }
`;

interface SitemapCardProps {
  data: {
    url?: string[];
    urlset?: {
      url: string[];
    };
    sitemapindex?: {
      sitemap: {
        loc: string[];
      }[];
    };
  };
  title: string;
  actionButtons?: JSX.Element;
}

const SitemapCard = ({ data, title, actionButtons }: SitemapCardProps): JSX.Element => {
  const normalSiteMap = data.url || (data.urlset && data.urlset.url) || [];
  const siteMapIndex = (data.sitemapindex && data.sitemapindex.sitemap) || [];

  const makeExpandableRowData = (site: any) => {
    const results = [];
    if (site.lastmod) { results.push({ lbl: 'Last Modified', val: site.lastmod[0] }); }
    if (site.changefreq) { results.push({ lbl: 'Change Frequency', val: site.changefreq[0] }); }
    if (site.priority) { results.push({ lbl: 'Priority', val: site.priority[0] }); }
    return results;
  };

  const getPathFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname || '';
    } catch (e) {
      console.error(`Error parsing URL: ${url}`);
      return url;
    }
  };

  return (
    <Card heading={title} actionButtons={actionButtons} styles={cardStyles}>
      {normalSiteMap.map((subpage: any, index: number) => {
        const path = getPathFromUrl(subpage.loc[0]);
        return (
          <ExpandableRow
            lbl={path}
            key={index}
            val=""
            rowList={makeExpandableRowData(subpage)}
          />
        );
      })}
      {siteMapIndex.length > 0 && (
        <>
          <p>This site returns a sitemap index, which is a list of sitemaps.</p>
          <ul>
            {siteMapIndex.map((subpage: any, index: number) => {
              const path = getPathFromUrl(subpage.loc[0]);
              return (
                <li key={index}>
                  <a href={subpage.loc[0]}>{path}</a>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Card>
  );
};

export default SitemapCard;
