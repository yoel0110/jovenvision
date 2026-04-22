import type { TimeSeriesData } from '../../types/dashboard';

export class MetricsCalculator {
  static calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  static calculateMovingAverage(data: TimeSeriesData[], windowSize: number): TimeSeriesData[] {
    if (data.length < windowSize) return data;
    
    const result: TimeSeriesData[] = [];
    
    for (let i = windowSize - 1; i < data.length; i++) {
      const window = data.slice(i - windowSize + 1, i + 1);
      const average = window.reduce((sum, point) => sum + point.value, 0) / windowSize;
      
      result.push({
        timestamp: data[i].timestamp,
        value: Math.round(average * 100) / 100,
        label: data[i].label,
      });
    }
    
    return result;
  }

  static calculatePercentile(data: number[], percentile: number): number {
    if (data.length === 0) return 0;
    
    const sorted = [...data].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }

  static calculateEngagementScore(metrics: {
    activeUsers: number;
    totalUsers: number;
    interactionsCount: number;
    averageSessionDuration: number;
  }): number {
    const { activeUsers, totalUsers, interactionsCount, averageSessionDuration } = metrics;
    
    if (totalUsers === 0) return 0;
    
    const activeRate = activeUsers / totalUsers;
    const interactionRate = Math.min(interactionsCount / (activeUsers * 10), 1); // Normalize to 0-1
    const sessionScore = Math.min(averageSessionDuration / 30, 1); // Normalize to 30 min max
    
    return Math.round((activeRate * 0.4 + interactionRate * 0.4 + sessionScore * 0.2) * 100);
  }

  static detectAnomalies(data: TimeSeriesData[], threshold: number = 2): TimeSeriesData[] {
    if (data.length < 3) return [];
    
    const values = data.map(point => point.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return data.filter(point => Math.abs(point.value - mean) > threshold * stdDev);
  }

  static calculateTrend(data: TimeSeriesData[]): 'up' | 'down' | 'stable' {
    if (data.length < 2) return 'stable';
    
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, point) => sum + point.value, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, point) => sum + point.value, 0) / secondHalf.length;
    
    const change = this.calculateGrowthRate(secondAvg, firstAvg);
    
    if (change > 5) return 'up';
    if (change < -5) return 'down';
    return 'stable';
  }

  static aggregateByPeriod(
    data: TimeSeriesData[], 
    period: 'hour' | 'day' | 'week' | 'month'
  ): TimeSeriesData[] {
    const grouped = new Map<string, TimeSeriesData[]>();
    
    data.forEach(point => {
      const date = new Date(point.timestamp);
      let key: string;
      
      switch (period) {
        case 'hour':
          key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
          break;
        case 'day':
          key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;
          break;
        case 'month':
          key = `${date.getFullYear()}-${date.getMonth()}`;
          break;
      }
      
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(point);
    });
    
    return Array.from(grouped.entries()).map(([key, points]) => {
      const avgValue = points.reduce((sum, p) => sum + p.value, 0) / points.length;
      return {
        timestamp: new Date(points[0].timestamp),
        value: Math.round(avgValue * 100) / 100,
        label: key,
      };
    }).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}
