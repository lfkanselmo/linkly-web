import type { EChartsOption } from 'echarts';

import { ClickCountByPeriod, TopValue } from '../../core/models/url';
import { ChartColors } from '../../core/utils/chart-theme';

export function seriesLineOptions(series: ClickCountByPeriod[], colors: ChartColors): EChartsOption {
  return {
    grid: { left: 8, right: 16, top: 16, bottom: 24, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.border,
      textStyle: { color: colors.text },
      borderWidth: 0,
    },
    xAxis: {
      type: 'category',
      data: series.map((point) => formatDay(point.periodStart)),
      axisLine: { lineStyle: { color: colors.border } },
      axisLabel: { color: colors.textMuted },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: colors.border } },
      axisLabel: { color: colors.textMuted },
    },
    series: [
      {
        type: 'line',
        data: series.map((point) => point.count),
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: colors.primary, width: 2 },
        itemStyle: { color: colors.primary },
        areaStyle: { color: colors.primary, opacity: 0.12 },
      },
    ],
  };
}

export function topValuesBarOptions(values: TopValue[], colors: ChartColors): EChartsOption {
  const ordered = [...values].reverse();
  return {
    grid: { left: 8, right: 24, top: 8, bottom: 8, containLabel: true },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: colors.border,
      textStyle: { color: colors.text },
      borderWidth: 0,
    },
    xAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { color: colors.textMuted },
      splitLine: { lineStyle: { color: colors.border } },
    },
    yAxis: {
      type: 'category',
      data: ordered.map((item) => item.value),
      axisLabel: { color: colors.text },
      axisLine: { lineStyle: { color: colors.border } },
    },
    series: [
      {
        type: 'bar',
        data: ordered.map((item) => item.count),
        itemStyle: { color: colors.primary, borderRadius: [0, 6, 6, 0] },
        barMaxWidth: 18,
      },
    ],
  };
}

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString('es', { day: '2-digit', month: '2-digit' });
}
