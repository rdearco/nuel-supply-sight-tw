import { Component, OnInit, OnDestroy, inject, effect } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ProductsService, KPIData } from '../../services/products.service';

interface TrendData {
  date: string;
  stock: number;
  demand: number;
}

@Component({
  selector: 'app-trend-chart',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './trend-chart.html',
  styleUrl: './trend-chart.css'
})
export class TrendChart implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private productsService = inject(ProductsService);

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Stock',
        fill: false,
        tension: 0.3,
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#3b82f6',
        pointRadius: 3,
        pointHoverRadius: 4,
        borderWidth: 2
      },
      {
        data: [],
        label: 'Demand',
        fill: false,
        tension: 0.3,
        borderColor: '#10b981',
        backgroundColor: '#10b981',
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#10b981',
        pointRadius: 3,
        pointHoverRadius: 4,
        borderWidth: 2
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#374151',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const value = Math.round(context.parsed.y).toLocaleString();
            return `${context.dataset.label}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        display: true,
        grid: {
          color: '#f0f0f0'
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          },
          callback: function(value) {
            return Number(value).toLocaleString();
          }
        },
        border: {
          display: false
        }
      },
      x: {
        display: true,
        grid: {
          color: '#f0f0f0'
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          }
        },
        border: {
          display: false
        }
      }
    }
  };

  public lineChartType = 'line' as const;

  constructor() {
    // Use effect to reactively update chart when KPI data changes
    effect(() => {
      const kpiData = this.productsService.kpiData();
      const isLoading = this.productsService.isLoading();
      
      if (!isLoading && kpiData) {
        this.updateChartData('7d', kpiData);
      }
    });
  }

  ngOnInit(): void {
    // Initial setup can be done here if needed
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateChartData(dateRange: '7d' | '14d' | '30d', kpis: KPIData): void {
    const days = dateRange === '7d' ? 7 : dateRange === '14d' ? 14 : 30;
    const trendData = this.generateTrendData(days, kpis);

    // Create new data object to trigger change detection
    this.lineChartData = {
      labels: trendData.map(item => item.date),
      datasets: [
        {
          ...this.lineChartData.datasets[0],
          data: trendData.map(item => item.stock)
        },
        {
          ...this.lineChartData.datasets[1],
          data: trendData.map(item => item.demand)
        }
      ]
    };
    
    console.log(`Updated chart for ${days} days with ${trendData.length} data points`);
  }

  private generateTrendData(days: number, kpis: KPIData): TrendData[] {
    const data: TrendData[] = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const isToday = i === days - 1;
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      data.push({
        date: `${monthNames[date.getMonth()]} ${date.getDate()}`,
        // For historical days, use simulated data around current totals
        // For today, use actual current totals
        stock: isToday ? kpis.totalStock : kpis.totalStock + Math.random() * 40 - 20,
        demand: isToday ? kpis.totalDemand : kpis.totalDemand + Math.random() * 30 - 15
      });
    }

    return data;
  }
}
