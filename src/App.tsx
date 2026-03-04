import React, { useMemo, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  GraduationCap, 
  School,
  ArrowUpRight,
  ChevronRight,
  MapPin,
  Calendar,
  LayoutDashboard,
  FileText,
  Search
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell,
  Legend,
  PieChart,
  Pie
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  JANUARY_SCHOOL_DATA, 
  NOVEMBER_SCHOOL_DATA, 
  DECEMBER_SCHOOL_DATA, 
  COMPARISON_DATA, 
  OVERALL_TREND, 
  SchoolData 
} from './constants';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

type ViewType = 'overview' | 'november' | 'december' | 'january' | 'tamil' | 'english' | 'maths';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data fetching on view change
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentView]);

  const isSubjectView = ['tamil', 'english', 'maths'].includes(currentView);

  const stats = useMemo(() => {
    const data = (currentView === 'overview' || currentView === 'january' || isSubjectView)
      ? JANUARY_SCHOOL_DATA 
      : currentView === 'november' 
        ? NOVEMBER_SCHOOL_DATA 
        : DECEMBER_SCHOOL_DATA;

    const totalStudents = data.reduce((acc, curr) => acc + curr.totalStudents, 0);
    const attainedBLO = data.reduce((acc, curr) => acc + curr.attainedBLO, 0);
    const notAttainTamil = data.reduce((acc, curr) => acc + curr.notAttainTamil, 0);
    const notAttainEnglish = data.reduce((acc, curr) => acc + curr.notAttainEnglish, 0);
    const notAttainMaths = data.reduce((acc, curr) => acc + curr.notAttainMaths, 0);
    
    return {
      totalStudents,
      attainedBLO,
      percentAttained: ((attainedBLO / totalStudents) * 100).toFixed(1),
      notAttainTamil,
      notAttainEnglish,
      notAttainMaths,
      improvement: currentView === 'overview' ? (79.1 - 65.6).toFixed(1) : null
    };
  }, [currentView, isSubjectView]);

  const subjectTrendData = useMemo(() => {
    if (!isSubjectView) return [];
    const subjectKey = currentView === 'tamil' ? 'notAttainTamil' : currentView === 'english' ? 'notAttainEnglish' : 'notAttainMaths';
    
    const getCount = (data: SchoolData[]) => data.reduce((acc, s) => acc + (s[subjectKey as keyof SchoolData] as number), 0);

    return [
      { month: 'Nov', count: getCount(NOVEMBER_SCHOOL_DATA) },
      { month: 'Dec', count: getCount(DECEMBER_SCHOOL_DATA) },
      { month: 'Jan', count: getCount(JANUARY_SCHOOL_DATA) },
    ];
  }, [currentView, isSubjectView]);

  const subjectData = [
    { name: 'Tamil', value: stats.notAttainTamil, color: '#f59e0b' },
    { name: 'English', value: stats.notAttainEnglish, color: '#ef4444' },
    { name: 'Maths', value: stats.notAttainMaths, color: '#3b82f6' },
  ];

  const currentMonthData = useMemo(() => {
    if (isSubjectView) return JANUARY_SCHOOL_DATA;
    switch(currentView) {
      case 'november': return NOVEMBER_SCHOOL_DATA;
      case 'december': return DECEMBER_SCHOOL_DATA;
      case 'january': return JANUARY_SCHOOL_DATA;
      default: return JANUARY_SCHOOL_DATA;
    }
  }, [currentView, isSubjectView]);

  const { top5Ids, bottom5Ids } = useMemo(() => {
    const data = [...currentMonthData];
    let sortedForPerformance;
    
    if (isSubjectView) {
      const subjectKey = currentView === 'tamil' ? 'notAttainTamil' : currentView === 'english' ? 'notAttainEnglish' : 'notAttainMaths';
      // For subjects, lower non-attainment is better
      sortedForPerformance = data.sort((a, b) => (a[subjectKey as keyof SchoolData] as number) - (b[subjectKey as keyof SchoolData] as number));
    } else {
      // For months, higher attainment % is better
      sortedForPerformance = data.sort((a, b) => (b.attainedBLO / b.totalStudents) - (a.attainedBLO / a.totalStudents));
    }

    return {
      top5Ids: new Set(sortedForPerformance.slice(0, 5).map(s => s.udise)),
      bottom5Ids: new Set(sortedForPerformance.slice(-5).reverse().map(s => s.udise))
    };
  }, [currentMonthData, currentView, isSubjectView]);

  const filteredSchools = useMemo(() => {
    let data = currentMonthData;
    if (isSubjectView) {
      const subjectKey = currentView === 'tamil' ? 'notAttainTamil' : currentView === 'english' ? 'notAttainEnglish' : 'notAttainMaths';
      data = [...currentMonthData].sort((a, b) => (b[subjectKey as keyof SchoolData] as number) - (a[subjectKey as keyof SchoolData] as number));
    }
    return data.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.udise.includes(searchQuery)
    );
  }, [currentMonthData, searchQuery, currentView, isSubjectView]);

  const topSchools = [...currentMonthData]
    .sort((a, b) => (b.attainedBLO / b.totalStudents) - (a.attainedBLO / a.totalStudents))
    .slice(0, 5);

  const schoolsNeedingAttention = [...currentMonthData]
    .sort((a, b) => (a.attainedBLO / a.totalStudents) - (b.attainedBLO / b.totalStudents))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Sidebar / Top Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <School className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 leading-tight">Samagra Shiksha</h2>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">BRC Kadayampatti</p>
            </div>
          </div>

          <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl gap-1">
            <div className="flex gap-1 border-r border-slate-200 pr-2 mr-1">
              <NavButton 
                active={currentView === 'overview'} 
                onClick={() => setCurrentView('overview')}
                icon={LayoutDashboard}
                label="Overview"
              />
            </div>
            <div className="flex gap-1 border-r border-slate-200 pr-2 mr-1">
              <NavButton active={currentView === 'november'} onClick={() => setCurrentView('november')} icon={Calendar} label="Nov" />
              <NavButton active={currentView === 'december'} onClick={() => setCurrentView('december')} icon={Calendar} label="Dec" />
              <NavButton active={currentView === 'january'} onClick={() => setCurrentView('january')} icon={Calendar} label="Jan" />
            </div>
            <div className="flex gap-1">
              <NavButton active={currentView === 'tamil'} onClick={() => setCurrentView('tamil')} icon={BookOpen} label="Tamil" />
              <NavButton active={currentView === 'english'} onClick={() => setCurrentView('english')} icon={BookOpen} label="English" />
              <NavButton active={currentView === 'maths'} onClick={() => setCurrentView('maths')} icon={BookOpen} label="Maths" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <AnimatePresence mode="wait">
          {currentView === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                    District Performance Dashboard
                  </h1>
                  <p className="text-slate-500 mt-2 max-w-2xl">
                    Comprehensive analysis of student BLO attainment across all schools in Kadayampatti BRC for the academic period Nov 2025 - Jan 2026.
                  </p>
                </div>
                <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Overall Improvement</div>
                    <div className="text-2xl font-black text-emerald-600">+{stats.improvement}% <span className="text-sm font-medium text-slate-300">since Nov</span></div>
                  </div>
                </div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard isLoading={isLoading} title="Total Students" value={stats.totalStudents.toLocaleString()} icon={Users} color="blue" description="Assessed across all categories" />
                <KPICard isLoading={isLoading} title="BLO Attainment" value={`${stats.percentAttained}%`} icon={CheckCircle2} color="emerald" description={`${stats.attainedBLO} students achieved BLO`} />
                <KPICard isLoading={isLoading} title="Subject Focus" value="English" icon={BookOpen} color="amber" description="Highest non-attainment area" />
                <KPICard isLoading={isLoading} title="School Categories" value="3" icon={GraduationCap} color="indigo" description="HSS, High, and Middle Schools" />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                    Attainment Progress Trend
                  </h3>
                  <div className="h-[350px]">
                    {isLoading ? (
                      <Skeleton className="w-full h-full" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={OVERALL_TREND}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={[0, 100]} />
                          <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} formatter={(value: number) => [`${value}%`, 'Attainment']} />
                          <Line type="monotone" dataKey="percentage" stroke="#10b981" strokeWidth={5} dot={{ r: 8, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 10, strokeWidth: 0 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-500" />
                    Subject Gaps
                  </h3>
                  <div className="h-[350px]">
                    {isLoading ? (
                      <Skeleton className="w-full h-full" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={subjectData} layout="vertical" margin={{ left: 20 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 600}} />
                          <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={40}>
                            {subjectData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>

              {/* Category Table */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold mb-8">Category-wise Performance Growth</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-6 font-bold text-slate-400 text-xs uppercase tracking-widest">Category</th>
                        <th className="pb-6 font-bold text-slate-400 text-xs uppercase tracking-widest">Students</th>
                        <th className="pb-6 font-bold text-slate-400 text-xs uppercase tracking-widest">Nov %</th>
                        <th className="pb-6 font-bold text-slate-400 text-xs uppercase tracking-widest">Dec %</th>
                        <th className="pb-6 font-bold text-slate-400 text-xs uppercase tracking-widest">Jan %</th>
                        <th className="pb-6 font-bold text-slate-400 text-xs uppercase tracking-widest">Growth</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {COMPARISON_DATA.map((cat) => (
                        <tr key={cat.category} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-6 font-bold text-slate-700">{cat.category}</td>
                          <td className="py-6 text-slate-500 font-medium">{cat.total}</td>
                          <td className="py-6 text-slate-400">{cat.novPercent}%</td>
                          <td className="py-6 text-slate-400">{cat.decPercent}%</td>
                          <td className="py-6">
                            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-sm font-black">
                              {cat.janPercent}%
                            </span>
                          </td>
                          <td className="py-6">
                            <div className="flex items-center text-emerald-600 font-black">
                              <ArrowUpRight className="w-5 h-5 mr-1" />
                              {(cat.janPercent - cat.novPercent).toFixed(1)}%
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : isSubjectView ? (
            <motion.div
              key={currentView}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 capitalize font-display flex items-center gap-3">
                    <BookOpen className={`w-10 h-10 ${currentView === 'tamil' ? 'text-amber-500' : currentView === 'english' ? 'text-rose-500' : 'text-blue-500'}`} />
                    {currentView} Performance Analysis
                  </h1>
                  <p className="text-slate-500 mt-2">
                    Tracking student non-attainment gaps in {currentView} across all schools.
                  </p>
                </div>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search schools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl w-full md:w-[350px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                    Non-Attainment Trend (Lower is Better)
                  </h3>
                  <div className="h-[300px]">
                    {isLoading ? (
                      <Skeleton className="w-full h-full" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={subjectTrendData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                          <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                          <Line 
                            type="monotone" 
                            dataKey="count" 
                            stroke={currentView === 'tamil' ? '#f59e0b' : currentView === 'english' ? '#ef4444' : '#3b82f6'} 
                            strokeWidth={5} 
                            dot={{ r: 8, fill: currentView === 'tamil' ? '#f59e0b' : currentView === 'english' ? '#ef4444' : '#3b82f6', strokeWidth: 3, stroke: '#fff' }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center">
                  {isLoading ? (
                    <div className="flex flex-col items-center w-full">
                      <Skeleton className="w-20 h-20 mb-6" />
                      <Skeleton className="w-16 h-10 mb-2" />
                      <Skeleton className="w-32 h-4" />
                    </div>
                  ) : (
                    <>
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl ${currentView === 'tamil' ? 'bg-amber-100 text-amber-600' : currentView === 'english' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                        <Users className="w-10 h-10" />
                      </div>
                      <div className="text-4xl font-black text-slate-900 mb-2">
                        {subjectTrendData[2]?.count}
                      </div>
                      <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Total Non-Attainers</div>
                      <p className="text-slate-500 text-sm mt-4 px-4">
                        Current number of students needing additional support in {currentView} as of January.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                  <h3 className="font-bold text-lg">School Ranking by {currentView} Gaps</h3>
                  <p className="text-sm text-slate-400 mt-1">Schools sorted by highest number of students not attaining BLO in {currentView}.</p>
                </div>
                <div className="overflow-x-auto">
                  {isLoading ? (
                    <div className="p-8 space-y-4">
                      {[...Array(10)].map((_, i) => (
                        <Skeleton key={i} className="w-full h-12" />
                      ))}
                    </div>
                  ) : (
                    <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs uppercase tracking-widest">School Name</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs uppercase tracking-widest">Type</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs uppercase tracking-widest text-center">Total Students</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs uppercase tracking-widest text-center">Non-Attainers</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs uppercase tracking-widest text-right">Action Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredSchools.map((school) => {
                        const count = currentView === 'tamil' ? school.notAttainTamil : currentView === 'english' ? school.notAttainEnglish : school.notAttainMaths;
                        const priority = count > 20 ? 'Critical' : count > 10 ? 'High' : 'Moderate';
                        return (
                          <tr key={school.udise} className={`hover:bg-slate-50/80 transition-colors group ${top5Ids.has(school.udise) ? 'bg-emerald-50/30' : bottom5Ids.has(school.udise) ? 'bg-rose-50/30' : ''}`}>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                <div className="font-bold text-slate-800">{school.name}</div>
                                {top5Ids.has(school.udise) && <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded-md uppercase tracking-tighter">Top 5</span>}
                                {bottom5Ids.has(school.udise) && <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-md uppercase tracking-tighter">Bottom 5</span>}
                              </div>
                              <div className="text-xs font-mono text-slate-400 mt-1">{school.udise}</div>
                            </td>
                            <td className="px-8 py-6 text-sm text-slate-500 font-medium">{school.type}</td>
                            <td className="px-8 py-6 text-center text-sm font-bold text-slate-700">{school.totalStudents}</td>
                            <td className="px-8 py-6 text-center">
                              <span className={`text-lg font-black ${count > 20 ? 'text-rose-600' : count > 10 ? 'text-amber-600' : 'text-slate-400'}`}>
                                {count}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                                priority === 'Critical' ? 'bg-rose-100 text-rose-600' : 
                                priority === 'High' ? 'bg-amber-100 text-amber-600' : 
                                'bg-slate-100 text-slate-500'
                              }`}>
                                {priority}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Monthly Report Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 capitalize font-display">
                    {currentView} Assessment Report
                  </h1>
                  <p className="text-slate-500 mt-2">
                    Detailed school-wise performance metrics for the month of {currentView}.
                  </p>
                </div>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search schools or UDISE..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl w-full md:w-[350px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Monthly Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard isLoading={isLoading} title="Total Students" value={stats.totalStudents.toLocaleString()} icon={Users} color="blue" description="Participated in assessment" />
                <KPICard isLoading={isLoading} title="BLO Attainment" value={`${stats.percentAttained}%`} icon={CheckCircle2} color="emerald" description={`${stats.attainedBLO} students reached BLO`} />
                <KPICard isLoading={isLoading} title="Subject Focus" value="English" icon={BookOpen} color="amber" description={`Highest gap in ${currentView}`} />
              </div>

              {/* School Table */}
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                  <h3 className="font-bold text-lg">School Performance List</h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                    {filteredSchools.length} Schools Found
                  </span>
                </div>
                <div className="overflow-x-auto">
                  {isLoading ? (
                    <div className="p-8 space-y-4">
                      {[...Array(10)].map((_, i) => (
                        <Skeleton key={i} className="w-full h-12" />
                      ))}
                    </div>
                  ) : (
                    <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs uppercase tracking-widest">School Name / UDISE</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs uppercase tracking-widest">Category</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs uppercase tracking-widest">Total</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs uppercase tracking-widest text-center">Tamil</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs uppercase tracking-widest text-center">English</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs uppercase tracking-widest text-center">Maths</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs uppercase tracking-widest text-right">Attainment %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredSchools.map((school) => {
                        const percent = ((school.attainedBLO / school.totalStudents) * 100).toFixed(1);
                        return (
                          <tr key={school.udise} className={`hover:bg-slate-50/80 transition-colors group ${top5Ids.has(school.udise) ? 'bg-emerald-50/30' : bottom5Ids.has(school.udise) ? 'bg-rose-50/30' : ''}`}>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                <div className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{school.name}</div>
                                {top5Ids.has(school.udise) && <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded-md uppercase tracking-tighter">Top 5</span>}
                                {bottom5Ids.has(school.udise) && <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-md uppercase tracking-tighter">Bottom 5</span>}
                              </div>
                              <div className="text-xs font-mono text-slate-400 mt-1">{school.udise}</div>
                            </td>
                            <td className="px-8 py-6 text-sm text-slate-500 font-medium">{school.type}</td>
                            <td className="px-8 py-6 text-sm font-bold text-slate-700">{school.totalStudents}</td>
                            <td className="px-8 py-6 text-center">
                              <span className={`text-xs font-bold ${school.notAttainTamil > 10 ? 'text-rose-500' : 'text-slate-400'}`}>
                                {school.notAttainTamil}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-center">
                              <span className={`text-xs font-bold ${school.notAttainEnglish > 10 ? 'text-rose-500' : 'text-slate-400'}`}>
                                {school.notAttainEnglish}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-center">
                              <span className={`text-xs font-bold ${school.notAttainMaths > 10 ? 'text-rose-500' : 'text-slate-400'}`}>
                                {school.notAttainMaths}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex flex-col items-end">
                                <span className={`text-sm font-black ${parseFloat(percent) > 80 ? 'text-emerald-600' : parseFloat(percent) > 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                                  {percent}%
                                </span>
                                <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${parseFloat(percent) > 80 ? 'bg-emerald-500' : parseFloat(percent) > 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto mt-12 pt-12 border-t border-slate-200 text-center text-slate-400 text-sm pb-12">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <School className="w-4 h-4" />
          <span className="font-bold uppercase tracking-widest text-[10px]">Samagra Shiksha • BRC Kadayampatti</span>
        </div>
        <p>© 2026 District Education Office, Salem. All rights reserved.</p>
      </footer>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`
        flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300
        ${active 
          ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}
      `}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-emerald-500' : 'text-slate-400'}`} />
      {label}
    </button>
  );
}

function Skeleton({ className }: { className?: string; key?: any }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-2xl ${className}`} />
  );
}

function KPICard({ title, value, icon: Icon, color, description, isLoading }: { 
  title: string; 
  value: string; 
  icon: any; 
  color: 'blue' | 'emerald' | 'amber' | 'indigo';
  description: string;
  isLoading?: boolean;
}) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100/50',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/50',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/50',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-100/50',
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
        <Skeleton className="w-14 h-14 mb-6" />
        <Skeleton className="w-24 h-4 mb-2" />
        <Skeleton className="w-32 h-10 mb-3" />
        <Skeleton className="w-full h-4" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border shadow-lg ${colorMap[color]}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">{title}</div>
      <div className="text-4xl font-black text-slate-900 mb-3 tracking-tight">{value}</div>
      <div className="text-sm text-slate-500 font-medium leading-relaxed">{description}</div>
    </motion.div>
  );
}

interface SchoolRowProps {
  school: SchoolData;
  isTop?: boolean;
  key?: string | number;
}

function SchoolRow({ school, isTop }: SchoolRowProps) {
  const percent = ((school.attainedBLO / school.totalStudents) * 100).toFixed(1);
  
  return (
    <div className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-all group cursor-pointer border border-transparent hover:border-slate-200">
      <div className="flex items-center gap-5">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${isTop ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
          {percent}%
        </div>
        <div>
          <div className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{school.name}</div>
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{school.type} • {school.totalStudents} Students</div>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" />
    </div>
  );
}
