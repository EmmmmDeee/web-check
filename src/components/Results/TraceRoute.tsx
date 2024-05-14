import styled from 'styled-components';
import colors from 'styles/colors';
import { Card, CardProps } from 'components/Form/Card';

type RouteRowProps = {
  ipName: string;
};

const RouteRow = styled.div<RouteRowProps>`
  text-align: center;
  width: fit-content;
  margin: 0 auto;

  .ipName {
    font-size: 1rem;
  }
`;

type RouteTimingsProps = {
  timings: number[];
};

const RouteTimings = styled.div<RouteTimingsProps>`
  p {
    margin: 0 auto;
    line-height: 1.5;
  }

  .arrow {
    font-size: 2.5rem;
    color: ${colors.primary};
    margin-top: -1rem;
    display: inline-block;
    vertical-align: middle;
  }

  .times {
    font-size: 0.85rem;
    color: ${colors.textColorSecondary};
    display: inline-block;
    vertical-align: middle;
  }

  .completed {
    text-align: center;
    font-weight: bold;
  }
`;

const TraceRouteCard: React.FC<CardProps & { data: { result: { [ip: string]: number[] }[]; timeTaken: number } }> = (props) => {
  const { data: { result: routes, timeTaken }, title, actionButtons } = props;

  return (
    <Card heading={title} actionButtons={actionButtons} styles={cardStyles}>
      {routes.map((route, index) => (
        <RouteRow key={index} ipName={Object.keys(route)[0]}>
          <RouteTimings timings={route[Object.keys(route)[0]]}>
            {route[Object.keys(route)[0]].map((time, packetIndex) => (
              <p className="times" key={`timing-${packetIndex}-${time}`}>
                {route[Object.keys(route)[0]].length > 1 && <>Packet #{packetIndex + 1}: </>}
                Took {time} ms
              </p>
            ))}
            <p className="arrow" role="img" aria-label="Down arrow">↓</p>
          </RouteTimings>
        </RouteRow>
      ))}
      <RouteTimings timings={[]} className="completed">
        <p>
          Round trip completed in {timeTaken} ms
        </p>
      </RouteTimings>
    </Card>
  );
}

const cardStyles = '';

export default TraceRouteCard;
