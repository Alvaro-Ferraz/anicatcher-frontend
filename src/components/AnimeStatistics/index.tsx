import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"

type ScoreItem = {
  score: number
  votes: number
  percentage: number
}

type Statistics = {
  watching: number
  completed: number
  on_hold: number
  dropped: number
  plan_to_watch: number
  scores: ScoreItem[]
}

const statusColors: Record<string, string> = {
  watching: "#4ade80",
  plan_to_watch: "#3b82f6",
  dropped: "#a855f7",
  on_hold: "#f472b6",
  completed: "#ef4444",
}

const statusLabels: Record<string, string> = {
  watching: "Current",
  plan_to_watch: "Planning",
  dropped: "Dropped",
  on_hold: "Paused",
  completed: "Completed",
}

interface AnimeStatisticsProps {
  id: number
}

const AnimeStatistics: React.FC<AnimeStatisticsProps> = ({ id }) => {
  const [statistics, setStatistics] = useState<Statistics | null>(null)

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/anime/${id}/statistics`)
        setStatistics(res.data.data)
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error)
      }
    }

    fetchStatistics()
  }, [id])

  if (!statistics) return null

  const statusData = [
    { key: "watching", value: statistics.watching },
    { key: "plan_to_watch", value: statistics.plan_to_watch },
    { key: "dropped", value: statistics.dropped },
    { key: "on_hold", value: statistics.on_hold },
    { key: "completed", value: statistics.completed },
  ]

  // Calculate total for percentage calculation
  const totalUsers = statusData.reduce((sum, item) => sum + item.value, 0)

  // Get score data and sort by score
  const scoreData = statistics.scores.filter((s) => s.score > 0).sort((a, b) => a.score - b.score)

  // Find max votes for size scaling
  const maxVotes = Math.max(...scoreData.map((s) => s.votes))

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Distribution */}
        <div>
          <h2 className="text-sm text-[#90cdf4] font-semibold mb-2">Status Distribution</h2>
          <div className="bg-[#151f2e] p-3 rounded-lg">
            {/* Status labels and counts */}
            <div className="flex flex-wrap gap-3 mb-3 justify-center">
              {statusData.map((item) => (
                <div key={item.key} className="flex flex-col items-center">
                  <span
                    className="px-4 py-1 text-white font-semibold rounded text-[10px] mb-2"
                    style={{ backgroundColor: statusColors[item.key] }}
                  >
                    {statusLabels[item.key]}
                  </span>
                  <span className="text-gray300 text-[10px]">{item.value.toLocaleString()} Users</span>
                </div>
              ))}
            </div>

            {/* Horizontal segmented bar */}
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden flex">
              {statusData.map((item) => {
                const percentage = (item.value / totalUsers) * 100
                return (
                  <div
                    key={item.key}
                    className="h-full"
                    style={{
                      backgroundColor: statusColors[item.key],
                      width: `${percentage}%`,
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Score Distribution */}
        <div>
          <h2 className="text-sm text-[#90cdf4] font-semibold mb-2">Score Distribution</h2>
          <div className="bg-[#151f2e] p-3 rounded-lg">
            <div className="flex items-end justify-between gap-1 h-16">
              {scoreData.map((item) => {
                // Altura da barra baseada nos votos (min 8px, max 40px)
                const height = Math.max(8, Math.min(40, (item.votes / maxVotes) * 40))
                // Cor da barra baseada no score
                const hue = ((item.score - 1) / 9) * 120 // 0 (red) to 120 (green)
                const color = `hsl(${hue}, 80%, 50%)`
                return (
                  <div key={item.score} className="flex flex-col items-center relative group">
                    {/* Vertical bar */}
                    <div
                      className="w-3 rounded-t-sm mb-1 cursor-pointer"
                      style={{
                        backgroundColor: color,
                        height: `${height}px`,
                      }}
                    />
                    {/* Tooltip no hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap transition-opacity duration-200">
                      <div>
                        <span className="font-bold">Score:</span> {item.score}
                      </div>
                      <div>
                        <span className="font-bold">Votos:</span> {item.votes}
                      </div>
                      <div>
                        <span className="font-bold">{item.percentage.toFixed(1)}%</span> dos usuários
                      </div>
                    </div>
                    {/* Score number below bar */}
                    <span className="text-gray-400 text-[10px] font-medium">{item.score}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnimeStatistics
