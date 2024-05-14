import styled from 'styled-components';
import colors from 'styles/colors';
import { Card } from 'components/Form/Card';
import Row, { ExpandableRow } from 'components/Form/Row';

const Expandable = styled.details`
  margin-top: 0.5rem;
  cursor: pointer;
  summary::marker {
    color: ${colors.primary};
  }
`;

const getExpandableTitle = (urlObj: any) => {
  let pathName = '';
  try {
    pathName = new URL(urlObj.url).pathname;
  } catch (e) {
    console.error('Error parsing URL:', e);
    return 'Invalid URL';
  }
  return `${pathName} (${urlObj.id})`;
}

const convertToDate = (dateString: string | null): string => {
  if (!dateString) {
    return '';
  }
  const [date, time] = dateString.split(' ');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute, second] = time.split(':').map(Number);
  const dateObject = new Date(year, month - 1, day, hour, minute, second);
  if (isNaN(dateObject.getTime())) {
    return dateString;
  }
  return dateObject.toString();
}

type MalwareCardProps = {
  data: any;
  title: string;
  actionButtons: any;
}

const MalwareCard = (props: MalwareCardProps): JSX.Element => {
  const {
    data: {
      urlHaus,
      phishTank,
      cloudmersive,
      safeBrowsing,
    },
    title,
    actionButtons,
  } = props;

  const urlHausData = urlHaus || {};
  const phishTankData = phishTank || {};
  const cloudmersiveData = cloudmersive || {};
  const safeBrowsingData = safeBrowsing || {};

  return (
    <Card heading={title} actionButtons={actionButtons}>
      {safeBrowsingData && safeBrowsingData.unsafe !== null && (
        <Row
          lbl="Google Safe Browsing"
          val={safeBrowsingData.unsafe ? '❌ Unsafe' : '✅ Safe'}
        />
      )}
      {(cloudmersiveData.error === null || safeBrowsingData.details) && (
        <Row
          lbl="Threat Type"
          val={safeBrowsingData.details?.threatType || cloudmersiveData.WebsiteThreatType || 'None :)'}
        />
      )}
      {phishTankData && phishTankData.error === null && (
        <Row
          lbl="Phishing Status"
          val={phishTankData?.url0?.in_database !== 'false' ? '❌ Phishing Identified' : '✅ No Phishing Found'}
        />
      )}
      {phishTankData.url0 && phishTankData.url0.phish_detail_page && (
        <Row
          lbl=""
          val=""
        >
          <span className="lbl">Phish Info</span>
          <span className="val"><a href={phishTankData.url0.phish_detail_page}>{phishTankData.url0.phish_id}</a></span>  
        </Row>
      )}
      {urlHausData.query_status === 'no_results' && <Row lbl="Malware Status" val="✅ No Malwares Found" />}
      {urlHausData.query_status === 'ok' && (
        <>
        <Row lbl="Status" val="❌ Malware Identified" />
        <Row lbl="First Seen" val={convertToDate(urlHausData.firstseen)} />
        <Row lbl="Bad URLs Count" val={urlHausData.url_count} />
        </>
      )}
      {urlHausData.urls && (
        <Expandable>
          <summary>Expand Results</summary>
          { urlHausData.urls.map((urlResult: any, index: number) => {
          const rows = [
            { lbl: 'ID', val: urlResult.id },
            { lbl: 'Status', val: urlResult.url_status },
            { lbl: 'Date Added', val: convertToDate(urlResult.date_added) },
            { lbl: 'Threat Type', val: urlResult.threat },
            { lbl: 'Reported By', val: urlResult.reporter },
            { lbl: 'Takedown Time', val: urlResult.takedown_time_seconds },
            { lbl: 'Larted', val: urlResult.larted },
            { lbl: 'Tags', val: (urlResult.tags || []).join(', ') },
            { lbl: 'Reference', val: urlResult.urlhaus_reference },      
            { lbl: 'File Path', val: urlResult.url },      
          ];
          return (<ExpandableRow lbl={getExpandableTitle(urlResult)} val="" rowList={rows} />)
        })}
        </Expandable>
      )}
    </Card>
  );
}

export default MalwareCard;
