import { useState, useEffect } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import { Card } from 'components/Form/Card';
import Button from 'components/Form/Button';
import Row, { ExpandableRow } from 'components/Form/Row';

const Expandable = styled.details`
  margin-top: 0.5rem;
  cursor: pointer;
  summary::marker {
    color: ${colors.primary};
  }
`;

type AnalysisResult = {
  analyzer: string;
  result: Record<string, any>;
  success: boolean;
};

type Result = {
  lbl: string;
  val?: any;
  plaintext?: string;
  list?: string[];
};

const makeExpandableData = (results: AnalysisResult[]): Result[] => {
  if (!results || !results.length) {
    return [];
  }
  return results.map((analysis) => {
    const fields = Object.keys(analysis.result).map((label) => {
      const lbl = isNaN(parseInt(label, 10)) ? label : '';
      const val = analysis.result[label] || 'None';
      if (typeof val !== 'object') {
        return { lbl, val };
      }
      return { lbl, val: '', plaintext: JSON.stringify(analysis.result[label]) };
    });
    return {
      title: analysis.analyzer,
      value: analysis.success ? '✅' : '❌',
      fields,
    };
  });
};

const makeResults = (results: AnalysisResult[]): Result[] => {
  const rows: Result[] = [];
  if (!results || !results.length) {
    return rows;
  }

  const caaWorker = results.find((a) => a.analyzer === 'caaWorker');
  if (caaWorker?.result?.host) rows.push({ lbl: 'Host', val: caaWorker.result.host });
  if ('has_caa' in caaWorker?.result)
    rows.push({ lbl: 'CA Authorization', val: caaWorker.result.has_caa });
  if (caaWorker?.result?.issue)
    rows.push({ lbl: 'CAAs allowed to Issue Certs', plaintext: caaWorker.result.issue.join('\n') });

  const mozillaGradingWorker = results.find((a) => a.analyzer === 'mozillaGradingWorker')?.result;
  if (mozillaGradingWorker?.grade) rows.push({ lbl: 'Mozilla Grading', val: mozillaGradingWorker.grade });
  if (mozillaGradingWorker?.gradeTrust)
    rows.push({ lbl: 'Mozilla Trust', val: mozillaGradingWorker.gradeTrust });

  const symantecDistrust = results.find((a) => a.analyzer === 'symantecDistrust')?.result;
  if ('isDistrusted' in symantecDistrust)
    rows.push({ lbl: 'No distrusted symantec SSL?', val: !symantecDistrust.isDistrusted });
  if (symantecDistrust?.reasons)
    rows.push({ lbl: 'Symantec Distrust', plaintext: symantecDistrust.reasons.join('\n') });

  const top1m = results.find((a) => a.analyzer === 'top1m')?.result;
  if (top1m?.certificate?.rank)
    rows.push({ lbl: 'Certificate Rank', val: top1m.certificate.rank.toLocaleString() });

  const mozillaEvaluationWorker = results.find((a) => a.analyzer === 'mozillaEvaluationWorker')?.result;
  if (mozillaEvaluationWorker?.level)
    rows.push({ lbl: 'Mozilla Evaluation Level', val: mozillaEvaluationWorker.level });
  if (mozillaEvaluationWorker?.failures) {
    const { bad, old, intermediate, modern } = mozillaEvaluationWorker.failures;
    if (bad) rows.push({ lbl: `Critical Security Issues (${bad.length})`, list: bad });
    if (old) rows.push({ lbl: `Compatibility Config Issues (${old.length})`, list: old });
    if (intermediate)
      rows.push({ lbl: `Intermediate Issues (${intermediate.length})`, list: intermediate });
    if (modern)
      rows.push({ lbl: `Modern Issues (${modern.length})`, list: modern });
  }
  return rows;
};

type TlsCardProps = {
  data: { id: number } & AnalysisResult;
  title: string;
  actionButtons: JSX.Element;
};

const TlsCard = (props: TlsCardProps): JSX.Element => {
  const [tlsRowData, setTlsRowData] = useState<Result[]>(makeExpandableData(
