import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { EnvelopeIcon, UsersIcon, ChartBarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import api from '../lib/api'

interface DashboardStats {
  totalCampaigns: number
  totalSubscribers: number
  openRate: number
  revenue: number
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/chart-data')
        ])
        setStats(statsRes.data)
        setChartData(chartRes.data)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      name: 'Total Campaigns',
      value: stats?.totalCampaigns || 0,
      icon: EnvelopeIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Subscribers',
      value: stats?.totalSubscribers || 0,
      icon: UsersIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Open Rate',
      value: `${stats?.openRate || 0}%`,
      icon: ChartBarIcon,
      color: 'bg-yellow-500'
    },
    {
      name: 'Revenue',
      value: `$${stats?.revenue || 0}`,
      icon: CurrencyDollarIcon,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your email marketing performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`p-2 rounded-md ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Performance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Dashboard