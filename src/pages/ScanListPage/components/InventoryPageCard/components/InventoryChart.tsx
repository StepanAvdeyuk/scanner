import { BarChart } from '@mui/x-charts/BarChart';

import { Inventory } from '../../../../../API/types';

interface InventoryChartProps {
  inventory?: Inventory
}

export default function InventoryChart({ inventory }: InventoryChartProps) {
  const domainStates = inventory?.domains?.map(domain => domain.state);

  const calculateStates = (state: boolean) => {
    return domainStates?.filter(domainState => domainState === state)?.length || 0;
  }

  const upDomainsCount = calculateStates(true);
  const downDomainsCount = calculateStates(false);

  const domainNames = new Map<string, number>;
  inventory?.domains?.forEach(domain => 
    domain.ips.forEach(ip => 
      ip.ports.forEach(port => {
        const name = port.name;

        if (domainNames.get(name) !== undefined) {
          domainNames.set(name, domainNames.get(name)!! + 1); 
        }
        else {
          domainNames.set(name, 1); 
        }
      })
    )
  );

  const nameSeries:any[] = [];
  domainNames.forEach((value, key) => {
    nameSeries.push({ data: value, label: key });
  });

  return (
    <>
      <BarChart
        series={[
          { data: [upDomainsCount],   label: 'Живые' },
          { data: [downDomainsCount], label: 'Мёртвые'},
        ]}
        height={nameSeries.length < 10 ? 200 : 22 * nameSeries.length}
        xAxis={[{ data: ['Хосты'], scaleType: 'band' }]}
        margin={{ top: 50, bottom: 30, left: 40, right: 10 }}
      />
      <BarChart
        dataset={nameSeries}
        series={[{ dataKey: 'data' }]}
        height={nameSeries.length < 10 ? 200 : 22 * nameSeries.length}
        yAxis={[{ scaleType: 'band', dataKey: 'label' }]}
        layout='horizontal'
        margin={{ top: 100, bottom: 30, left: 40, right: 10 }}
      />
    </>
  );
}