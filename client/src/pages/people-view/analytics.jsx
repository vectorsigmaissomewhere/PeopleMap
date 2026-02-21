import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalytics } from "@/store/people/analytics-slice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building,
  Tag,
  Users,
  BarChart3,
  PieChart,
  AlertCircle
} from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Analytics() {
  const dispatch = useDispatch();
  const { companyChart, tagChart, summary, isLoading } = useSelector((state) => state.analytics);
  const [chartView, setChartView] = useState('both'); // 'both', 'companies', 'tags'

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  // Company chart configuration
  const companyChartData = {
    labels: companyChart.labels,
    datasets: [
      {
        label: 'Number of Contacts',
        data: companyChart.data,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const companyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            return `${context.raw} contacts`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  // Tag chart configuration
  const tagChartData = {
    labels: tagChart.labels,
    datasets: [
      {
        data: tagChart.data,
        backgroundColor: tagChart.colors.length > 0 
          ? tagChart.colors 
          : [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
              '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#9966FF'
            ],
        borderWidth: 1,
        borderColor: 'white',
      },
    ],
  };

  const tagChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value} contacts (${percentage}%)`;
          },
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          
          {/* Summary Cards Skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart Skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Visualize your contacts distribution by company and tags
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-blue-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {summary.total_contacts}
                </span>
              </div>
              <p className="text-sm text-gray-600">Total Contacts</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Building className="w-8 h-8 text-green-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {companyChart.labels.length}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Companies Represented
                <span className="block text-xs text-gray-400">
                  {companyChart.total_with_company} contacts with companies
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Tag className="w-8 h-8 text-purple-500" />
                <span className="text-3xl font-bold text-gray-900">
                  {tagChart.labels.length}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Tags Used
                <span className="block text-xs text-gray-400">
                  {tagChart.total_with_tag} contacts with tags
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart View Toggle (Mobile) */}
        <div className="flex gap-2 mb-4 lg:hidden">
          <Button
            variant={chartView === 'both' ? 'default' : 'outline'}
            onClick={() => setChartView('both')}
            className="flex-1"
          >
            Both Charts
          </Button>
          <Button
            variant={chartView === 'companies' ? 'default' : 'outline'}
            onClick={() => setChartView('companies')}
            className="flex-1"
          >
            Companies
          </Button>
          <Button
            variant={chartView === 'tags' ? 'default' : 'outline'}
            onClick={() => setChartView('tags')}
            className="flex-1"
          >
            Tags
          </Button>
        </div>

        {/* Charts */}
        <div className={`grid grid-cols-1 ${chartView === 'both' ? 'lg:grid-cols-2' : ''} gap-6`}>
          {/* Company Chart */}
          {(chartView === 'both' || chartView === 'companies') && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Contacts by Company (Top 10)
                </CardTitle>
                {companyChart.no_company_count > 0 && (
                  <div className="flex items-center gap-1 text-sm text-amber-600">
                    <AlertCircle className="w-4 h-4" />
                    {companyChart.no_company_count} without company
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {companyChart.labels.length > 0 ? (
                  <div className="h-[400px]">
                    <Bar data={companyChartData} options={companyChartOptions} />
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-gray-500">
                    No company data available
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tag Chart */}
          {(chartView === 'both' || chartView === 'tags') && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-500" />
                  Contacts by Tag (Top 10)
                </CardTitle>
                {tagChart.no_tag_count > 0 && (
                  <div className="flex items-center gap-1 text-sm text-amber-600">
                    <AlertCircle className="w-4 h-4" />
                    {tagChart.no_tag_count} without tags
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {tagChart.labels.length > 0 ? (
                  <div className="h-[400px]">
                    <Pie data={tagChartData} options={tagChartOptions} />
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-gray-500">
                    No tag data available
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Simple Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Company Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Companies:</span>
                  <span className="font-semibold">{companyChart.labels.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Contacts with Companies:</span>
                  <span className="font-semibold">{companyChart.total_with_company}</span>
                </div>
                <div className="flex justify-between items-center text-amber-600">
                  <span>Contacts without Company:</span>
                  <span className="font-semibold">{companyChart.no_company_count}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tag Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Tags:</span>
                  <span className="font-semibold">{tagChart.labels.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Contacts with Tags:</span>
                  <span className="font-semibold">{tagChart.total_with_tag}</span>
                </div>
                <div className="flex justify-between items-center text-amber-600">
                  <span>Contacts without Tags:</span>
                  <span className="font-semibold">{tagChart.no_tag_count}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Analytics;