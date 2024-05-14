import styled from 'styled-components';
import colors from 'styles/colors';
import Card from 'components/Form/Card';
import Heading from 'components/Form/Heading';
import { useState, useEffect, ReactNode } from 'react';

type LoadCardProps = {
  children: ReactNode;
};

const LoadCard = styled(Card)<LoadCardProps>`
  margin: 0 auto 1rem auto;
  width: 95vw;
  position: relative;
  transition: all 0.2s ease-in-out;
  &.hidden {
    height: 0;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }
`;

// ... other styled components ...

type ProgressLoaderProps = {
  loadStatus: LoadingJob[];
  showModal: (err: ReactNode) => void;
  showJobDocs: (job: string) => void;
};

type LoadingJob = {
  name: string;
  state: LoadingState;
  timeTaken?: number;
  retry?: () => void;
  error?: string;
};

type LoadingState = 'success' | 'loading' | 'skipped' | 'error' | 'timed-out';

const jobNames = [
  'get-ip',
  'location',
  'ssl',
  'domain',
  'quality',
  'tech-stack',
  'server-info',
  'cookies',
  'headers',
  'dns',
  'hosts',
  'http-security',
  'social-tags',
  'trace-route',
  'security-txt',
  'dns-server',
  'firewall',
  'dnssec',
  'hsts',
  'threats',
  'mail-config',
  'archives',
  'rank',
  'screenshot',
  'tls-cipher-suites',
  'tls-security-config',
  'tls-client-support',
  'redirects',
  'linked-pages',
  'robots-txt',
  'status',
  'ports',
  // 'whois',
  'txt-records',
  'block-lists',
  'features',
  'sitemap',
  'carbon',
] as const;

const initialJobs = jobNames.map((job: string) => {
  return {
    name: job,
    state: 'loading' as LoadingState,
    retry: () => {}
  }
});

type StateCount = {
  [key in LoadingState]: number;
};

const calculateLoadingStatePercentages = (loadingJobs: LoadingJob[]): StateCount => {
  const totalJobs = loadingJobs.length;

  // Initialize count object
  const stateCount: StateCount = {
    'success': 0,
    'loading': 0,
    'skipped': 0,
    'error': 0,
    'timed-out': 0,
  };

  // Count the number of each state
  loadingJobs.forEach((job) => {
    stateCount[job.state] += 1;
  });

  // Convert counts to percentages
  const statePercentage: StateCount = {
    'success': (stateCount['success'] / totalJobs) * 100,
    'loading': (stateCount['loading'] / totalJobs) * 100,
    'skipped': (stateCount['skipped'] / totalJobs) * 100,
    'error': (stateCount['error'] / totalJobs) * 100,
    'timed-out': (stateCount['timed-out'] / totalJobs) * 100,
  };

  return statePercentage;
};

type MillisecondCounterProps = {
  isDone: boolean;
};

const MillisecondCounter = (props: MillisecondCounterProps) => {
  const { isDone } = props;
  const [milliseconds, setMilliseconds] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    // Start the timer as soon as the component mounts
    if (!isDone) {
      timer = setInterval(() => {
        setMilliseconds(milliseconds => milliseconds + 100);
      }, 100);
    }
    // Clean up the interval on unmount
    return () => {
      clearInterval(timer);
    };
  }, [isDone]); // If the isDone prop changes, the effect will re-run

  return <span>{milliseconds} ms</span>;
};

type RunningTextProps = {
  state: LoadingJob[];
  count: number;
};

const RunningText = (props: RunningTextProps): JSX.Element => {
  const { state, count } = props;
  const loadingTasksCount = jobNames.length - state.filter((val: LoadingJob) => val.state === 'loading').length;
  const isDone = loadingTasksCount >= jobNames.length;
  return (
    <p className="run-status">
    { isDone ? 'Finished in ' : `Running ${loadingTasksCount} of ${count} jobs - ` }
    <MillisecondCounter isDone={isDone} />
    </p>
  );
};

type SummaryTextProps = {
  state: LoadingJob[];
  count: number;
};

const SummaryText = (props: SummaryTextProps): JSX.Element => {
  const { state, count } = props;
  const totalJobs = jobNames.length;
  let failedTasksCount = state.filter((val: LoadingJob) => val.state === 'error').length;
  let loadingTasksCount = state.filter((val: LoadingJob) => val.state === 'loading').length;
  let skippedTasksCount = state.filter((val: LoadingJob) => val.state === 'skipped').length;
  let successTasksCount = state.filter((val: LoadingJob) => val.state === 'success').length;

  const jobz = (jobCount: number) => `${jobCount} ${jobCount === 1 ? 'job' : 'jobs'}`;

  const skippedInfo = skippedTasksCount > 0 ? (<span className="skipped">{jobz(skippedTasksCount)} skipped </span>) : null;
  const successInfo = successTasksCount > 0 ? (<span className="success">{jobz(successTasksCount)} successful </span>) : null;
  const failedInfo = failedTasksCount > 0 ? (<span className="error">{jobz(failedTasksCount)} failed </span>) : null;

  if (loadingTasksCount > 0) {
    return (
      <SummaryContainer className="loading-info">
        <b>Loading {totalJobs - loadingTasksCount} / {totalJobs} Jobs</b>
        {skippedInfo}
      </SummaryContainer>
    );
  }

  if (failedTasksCount === 0) {
    return (
      <SummaryContainer className="success-info">
        <b>{successTasksCount} Jobs Completed Successfully</b>
        {skippedInfo}
      </SummaryContainer>
    );
  }

  return (
    <SummaryContainer className="error-info">
      {successInfo}
      {skippedInfo}
      {failedInfo}
    </SummaryContainer>
  );
};

const ProgressLoader = (props: ProgressLoaderProps): JSX.Element => {
  const [ hideLoader, setHideLoader ] = useState<boolean>(false);
  const loadStatus = props.loadStatus;
  const percentages = calculateLoadingStatePercentages(loadStatus);

  const loadingTasksCount = jobNames.length - loadStatus.filter((val: LoadingJob) => val.state === 'loading').length;
  const isDone = loadingTasksCount >= jobNames.length;

  const makeBarColor = (colorCode: string): [string, string] => {
    const amount = 10;
    const darkerColorCode = '#' + colorCode.replace(/^#/, '').replace(
      /../g,
      colorCode => ('0' + Math.min(255, Math.max(0, parseInt(colorCode, 16) - amount)).toString(16)).slice(-2),
    );
    return [colorCode, darkerColorCode];
  };

  const barColors: Record<LoadingState | string, [string, string]> = {
    'success': isDone ? makeBarColor(colors.primary) : makeBarColor(colors.success),
    'loading': makeBarColor(colors.info),
    'skipped': makeBarColor(colors.warning),
    'error': makeBarColor(colors.danger),
    'timed-out': makeBarColor(colors.neutral),
  };

  const getStatusEmoji = (state: LoadingState): string => {
    switch (state) {
      case 'success':
        return '✅';
      case 'loading':
        return '🔄';
      case 'skipped':
        return '⏭️';
      case 'error':
        return '❌';
      case 'timed-out':
        return '⏸️';
      default:
        return '❓';
    }
  };

  const showErrorModal = (name: string, state: LoadingState, timeTaken: number | undefined, error: string, isInfo?: boolean) => {
    const errorContent = (
      <ErrorModalContent>
        <Heading as="h3">Error Details for {name}</Heading>
        <p>
          The {name} job failed with an {state} state after {timeTaken} ms.
          The server responded with the following error:
        </p>
        { /* If isInfo == true, then add .info className to pre */}
        <pre className={isInfo ? 'info' : 'error'}>{error}</pre>
      </ErrorModalContent>
    );
    props.showModal(errorContent);
  };

  return (
  <>
  <ReShowContainer className={!hideLoader ? 'hidden' : ''}>
    <DismissButton onClick={() => setHideLoader(false)}>Show Load State</DismissButton>
  </ReShowContainer>
  <LoadCard className={hideLoader ? 'hidden' : ''}>
    <ProgressBarContainer>
      {Object.keys(percentages).map((state: string | LoadingState) =>
        <ProgressBarSegment 
          color={barColors[state][0]} 
          color2={barColors[state][1]} 
          title={`${state} (${Math.round(percentages[state])}%)`}
          width={percentages[state]}
          key={`progress-bar-${state}`}
        />
      )}
    </ProgressBarContainer>
    
    <StatusInfoWrapper>
      <SummaryText state={loadStatus} count={loadStatus.length} />
      <RunningText state={loadStatus} count={loadStatus.length} />
    </StatusInfoWrapper>

    <Details>
      <summary>Show Details</summary>
      <ul>
        {
          loadStatus.map((job, index) => {
            if (!job.name || !job.state) {
              console.error(`Missing name or state for job ${index}`);
              return null;
            }

            const { name, state, timeTaken, retry, error } = job;
            return (
              <li key={name}>
                <b onClick={() => props.showJobDocs(name)}>{getStatusEmoji(state)} {name}</b>
                <span style={{color : barColors[state][0]}}> ({state})</span>.
                <i>{(timeTaken && state !== 'loading') ? ` Took ${timeTaken} ms` : '' }</i>
                { (retry && state !== 'success' && state !== 'loading') && <FailedJobActionButton onClick={retry}>↻ Retry</FailedJobActionButton> }
                { (error && state === 'error') && <FailedJobActionButton onClick={() => showErrorModal(name, state, timeTaken, error)}>■ Show Error</FailedJobActionButton> }
                { (error && state === 'skipped') && <FailedJobActionButton onClick={() => showErrorModal(name, state, timeTaken, error, true)}>■ Show Reason</FailedJobActionButton> }
              </li>
            );
          })
        }
      </ul>
      { loadStatus.filter((val: LoadingJob) => val.state === 'error').length > 0 &&
        <p className="error">
          <b>Check the browser console for logs and more info</b><br />
          It's normal for some jobs to fail, either because the host doesn't return the required info,
          or restrictions in the lambda function, or hitting an API limit.
        </p>}
        <AboutPageLink href="/about" target="_blank" rel="noreferer" >Learn More about Web-Check</AboutPageLink>
    </Details>
    <DismissButton onClick={() => setHideLoader(true)}>Dismiss</DismissButton>
  </LoadCard>
  </>
  );
}



export default ProgressLoader;
