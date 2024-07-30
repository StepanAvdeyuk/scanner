import { BarChart } from '@mui/x-charts/BarChart';

import { Event } from '../index';
import { Select } from 'antd';
import { useState } from 'react';

import './EventChart.scss';

interface EventChartsProps {
  events: Event[]
}

export default function EventCharts({ events }: EventChartsProps) {
  const [chartType, setChartType] = useState('severity');

  const handleChange = (value: string) => {
    setChartType(value);
  }

  const dataset = [];
  if (chartType === 'severity') {
    const calculateEvents = (severity: string) => {
      return events?.filter(event => event.info.severity === severity)?.length || 0;
    }

    const infoCount = calculateEvents('info');
    const lowCount = calculateEvents('low');
    const mediumCount = calculateEvents('medium');
    const highCount = calculateEvents('high');

    dataset.push({ data: infoCount, label: 'info' });
    dataset.push({ data: lowCount, label: 'low' });
    dataset.push({ data: mediumCount, label: 'medium' });
    dataset.push({ data: highCount, label: 'high' });
  }
  else if (chartType === 'type' || chartType === 'host') {
    const map = new Map<string, number>();
    events.forEach(event => {
      const key = event[chartType]
      if (map.get(key) !== undefined) {
        map.set(key, map.get(key)!! + 1);
      }
      else {
        map.set(key, 1);
      }
    });

    map.forEach((value, key) => dataset.push({data: value, label: key}));
  }

  return (
    <div className='chart-container'>
      <Select
        defaultValue="severity"
        style={{ width: 120 }}
        onChange={handleChange}
        options={[
          { value: 'severity', label: 'Severity' },
          { value: 'type', label: 'Type' },
          { value: 'host', label: 'Host' },
        ]}
      />
      <BarChart
        dataset={dataset}
        series={[{ dataKey: 'data' }]}
        height={dataset.length > 4 ? 22 * dataset.length : 100}
        width={720}
        yAxis={[{ scaleType: 'band', dataKey: 'label' }]}
        layout='horizontal'
        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
      />
    </div>
  );
}