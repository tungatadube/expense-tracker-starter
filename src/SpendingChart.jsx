import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#c8f135', '#4dde8c', '#60a5fa', '#f472b6', '#fb923c', '#a78bfa', '#34d399']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1c1c1c',
        border: '1px solid #2a2a2a',
        borderRadius: 8,
        padding: '10px 14px',
      }}>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', marginBottom: 4 }}>
          {payload[0].payload.name}
        </p>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, color: payload[0].fill }}>
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    )
  }
  return null
}

export default function SpendingChart({ transactions }) {
  const data = Object.entries(
    transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount)
        return acc
      }, {})
  ).map(([name, value]) => ({ name, value }))

  return (
    <div className="section chart-container">
      <p className="section-label">Spending by Category</p>
      {data.length === 0
        ? <p style={{ color: '#666', fontSize: 13 }}>No expense data yet.</p>
        : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontFamily: "'Syne', sans-serif", fontSize: 11, fill: '#666', textTransform: 'uppercase' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={v => `$${v}`}
                tick={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fill: '#666' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )
      }
    </div>
  )
}
