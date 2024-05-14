import { Card } from 'components/Form/Card';
import { ExpandableRow } from 'components/Form/Row';

type Audit = {
  id: string,
  score?: number | string,
  scoreDisplayMode?: 'score' | 'pass-fail',
  title?: string,
  description?: string,
  displayValue?: string,
};

const processScore = (percentile: number): string => {
  return `${Math.round(percentile * 100)}%`;
}

const makeValue = (audit: Audit): string => {
  let score = audit.score;
  if (audit.displayValue) {
    score = audit.displayValue;
  } else if (audit.scoreDisplayMode) {
    score = (score === 1 || score === '1') ? '✅ Pass' : '❌ Fail'; 
  }
  return score || '';
};

const LighthouseCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const lighthouse = props.data;
  if (!lighthouse || !lighthouse.categories || !lighthouse.audits) {
    return <div>No data available</div>;
  }

  const categories = lighthouse?.categories || {};
  const audits = lighthouse?.audits || [];

  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      { Object.keys(categories).map((title: string, index: number) => {
        if (!categories[title].auditRefs) {
          return null;
        }

        const scoreIds = categories[title].auditRefs.map((ref: { id: string }) => ref.id);
        const scoreList = scoreIds.map((id: string) => {
          const audit = audits[id];
          if (!audit || !audit.title || !audit.description || !audit.val) {
            return null;
          }

          return { lbl: audit.title, val: makeValue(audit), title: audit.description, key: id }
        }).filter(Boolean);

        return (
          <ExpandableRow
            key={`lighthouse-${index}`}
            lbl={title}
            val={processScore(categories[title].score)}
            rowList={scoreList}
          />
        );
      }) }
    </Card>
  );
}

export default LighthouseCard;
