import React, { useState, useMemo } from 'react';
import type { Sale, TimePeriod } from './types';
import { generateMockSalesData } from './data/mockData';
import Header from './components/Header';
import DashboardCard from './components/DashboardCard';
import SalesChart from './components/SalesChart';
import ProductPieChart from './components/ProductPieChart';
import { groupSalesByCategory, groupSalesByDate, formatCurrency } from './utils/helpers';

const App: React.FC = () => {
  const [salesData] = useState<Sale[]>(() => generateMockSalesData(500));
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30D');

  const filteredSales = useMemo(() => {
    const now = new Date();
    let daysToSubtract = 0;
    switch (timePeriod) {
      case '7D':
        daysToSubtract = 7;
        break;
      case '30D':
        daysToSubtract = 30;
        break;
      case '90D':
        daysToSubtract = 90;
        break;
      case 'ALL':
        return salesData;
      default:
        return salesData;
    }
    const startDate = new Date(now.setDate(now.getDate() - daysToSubtract));
    return salesData.filter(sale => sale.date >= startDate);
  }, [salesData, timePeriod]);

  const totalRevenue = useMemo(() => {
    return filteredSales.reduce((acc, sale) => acc + sale.units * sale.pricePerUnit, 0);
  }, [filteredSales]);

  const totalSales = useMemo(() => {
    return filteredSales.reduce((acc, sale) => acc + sale.units, 0);
  }, [filteredSales]);
  
  const topCategory = useMemo(() => {
    if (filteredSales.length === 0) return { name: 'N/A', revenue: 0 };
    const categorySales = groupSalesByCategory(filteredSales);
    const top = categorySales.reduce((prev, current) => (prev.value > current.value) ? prev : current);
    return { name: top.name, revenue: top.value };
  }, [filteredSales]);

  const chartData = useMemo(() => groupSalesByDate(filteredSales), [filteredSales]);
  const pieChartData = useMemo(() => groupSalesByCategory(filteredSales), [filteredSales]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header onTimePeriodChange={setTimePeriod} selectedPeriod={timePeriod} />

        <main className="mt-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard 
              title="Total Revenue" 
              value={formatCurrency(totalRevenue)} 
              icon="revenue"
            />
            <DashboardCard 
              title="Total Sales (Units)" 
              value={totalSales.toLocaleString()} 
              icon="sales"
            />
            <DashboardCard 
              title="Avg. Sale Value" 
              value={filteredSales.length > 0 ? formatCurrency(totalRevenue / filteredSales.length) : '$0.00'} 
              icon="average"
            />
            <DashboardCard 
              title="Top Category" 
              value={topCategory.name}
              subValue={formatCurrency(topCategory.revenue)}
              icon="category"
            />
          </div>

          {/* Charts */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Revenue Over Time</h3>
              <SalesChart data={chartData} />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Sales by Category</h3>
              <ProductPieChart data={pieChartData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
