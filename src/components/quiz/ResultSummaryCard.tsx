import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface DimensionPair {
  key: string;
  labelLeft: string;
  labelRight: string;
  value: number; // 0-100 for Right side key (e.g. E)
  colorLeft: string;
  colorRight: string;
}

interface ResultSummaryCardProps {
  title: string;
  subtitle: string;
  dimensionPairs?: DimensionPair[];
  chartType?: 'spectrum' | 'radar';
  dimensions?: Array<{ key: string; label: string; colorClass: string }>;
  scores?: Record<string, number>;
}

const ResultSummaryCard = ({ title, subtitle, dimensionPairs, chartType = 'spectrum', dimensions, scores }: ResultSummaryCardProps) => {
  const isRadar = chartType === 'radar' && dimensions && scores;

  const radarData = isRadar ? {
    labels: dimensions.map(d => d.label.split(' ')[0]),
    datasets: [
      {
        label: '得分倾向',
        data: dimensions.map(d => scores[d.key] || 0),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(99, 102, 241)',
      },
    ],
  } : null;

  const radarOptions = {
    scales: {
      r: {
        angleLines: { display: true, color: 'rgba(0,0,0,0.05)' },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { display: false, stepSize: 20 },
        pointLabels: {
          font: { size: 10, weight: 'bold' as const },
          color: '#64748b'
        }
      }
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Visual Header */}
      <div className="relative p-7 text-center border-b border-border/50 bg-gradient-to-b from-primary/10 to-transparent">
        <motion.div
          className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-foreground flex items-center justify-center shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12 }}
        >
          <span className="text-3xl text-background">✦</span>
        </motion.div>
        
        <p className="text-[10px] font-black text-primary tracking-[0.2em] uppercase mb-2 opacity-80">Personality Report</p>
        <h2 className="font-display font-black text-2xl mb-2 text-foreground leading-tight tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-[13px] max-w-[260px] mx-auto leading-relaxed italic">“{subtitle}”</p>
      </div>

      <div className="p-7">
        <h3 className="font-display font-black text-[10px] text-muted-foreground/60 uppercase tracking-widest text-center mb-6">
          {isRadar ? '人格核心特征雷达图' : '维度倾向分布 (Spectrum)'}
        </h3>

        {isRadar ? (
          <div className="aspect-square max-w-[280px] mx-auto">
            <Radar data={radarData!} options={radarOptions} />
          </div>
        ) : dimensionPairs && dimensionPairs.length > 0 ? (
          <div className="space-y-8">
            {dimensionPairs.map((pair, i) => {
              const isRight = pair.value > 50;
              const strength = Math.abs(pair.value - 50) * 2;
              
              return (
                <div key={pair.key} className="space-y-3">
                  <div className="flex justify-between items-end px-0.5">
                    <span className={`text-[11px] font-bold ${!isRight ? 'text-foreground' : 'text-muted-foreground opacity-40'}`}>
                      {pair.labelLeft}
                    </span>
                    <div className="flex flex-col items-center">
                       <span className="text-[13px] font-display font-black text-primary leading-none">
                         {Math.round(strength)}%
                       </span>
                    </div>
                    <span className={`text-[11px] font-bold text-right ${isRight ? 'text-foreground' : 'text-muted-foreground opacity-40'}`}>
                      {pair.labelRight}
                    </span>
                  </div>

                  <div className="h-2 bg-muted/30 rounded-full relative overflow-hidden">
                    <div className="absolute left-1/2 top-0 w-[1.5px] h-full bg-border/40 z-10" />
                    <motion.div
                      className={`absolute h-full rounded-full ${isRight ? pair.colorRight : pair.colorLeft}`}
                      initial={{ width: 0, left: '50%' }}
                      animate={{ 
                        width: `${Math.abs(pair.value - 50)}%`,
                        left: isRight ? '50%' : `${pair.value}%`
                      }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "circOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
        
        <p className="text-[10px] text-center text-muted-foreground mt-6 opacity-50 px-4">
          {isRadar ? '数值反映了你在各个性格关键维度的原始能量强度' : '数值代表你偏离中立区间的「偏好强度」'}
        </p>
      </div>
    </div>
  );
};

export default ResultSummaryCard;
