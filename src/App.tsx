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
  Search,
  Download,
  X,
  Info
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
  FEBRUARY_SCHOOL_DATA,
  COMPARISON_DATA, 
  OVERALL_TREND, 
  SchoolData 
} from './constants';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

type ViewType = 'overview' | 'november' | 'december' | 'january' | 'february' | 'tamil' | 'english' | 'maths';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);

  // Dynamic theme color based on view
  const themeColor = useMemo(() => {
    if (currentView === 'tamil') return 'amber';
    if (currentView === 'english') return 'rose';
    if (currentView === 'maths') return 'blue';
    if (currentView === 'overview') return 'emerald';
    return 'slate';
  }, [currentView]);

  const themeHex = useMemo(() => {
    const map = {
      amber: '#f59e0b',
      rose: '#f43f5e',
      blue: '#3b82f6',
      emerald: '#10b981',
      slate: '#64748b'
    };
    return map[themeColor as keyof typeof map] || '#10b981';
  }, [themeColor]);

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
    const data = (currentView === 'overview' || currentView === 'february' || isSubjectView)
      ? FEBRUARY_SCHOOL_DATA 
      : currentView === 'january'
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
      improvement: currentView === 'overview' ? (88.3 - 79.1).toFixed(1) : null
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
      { month: 'Feb', count: getCount(FEBRUARY_SCHOOL_DATA) },
    ];
  }, [currentView, isSubjectView]);

  const subjectData = [
    { name: 'Tamil', value: stats.notAttainTamil, color: '#f59e0b' },
    { name: 'English', value: stats.notAttainEnglish, color: '#ef4444' },
    { name: 'Maths', value: stats.notAttainMaths, color: '#3b82f6' },
  ];

  const currentMonthData = useMemo(() => {
    if (isSubjectView) return FEBRUARY_SCHOOL_DATA;
    switch(currentView) {
      case 'november': return NOVEMBER_SCHOOL_DATA;
      case 'december': return DECEMBER_SCHOOL_DATA;
      case 'january': return JANUARY_SCHOOL_DATA;
      case 'february': return FEBRUARY_SCHOOL_DATA;
      default: return FEBRUARY_SCHOOL_DATA;
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

  const handleExportCSV = () => {
    const headers = ["School Name", "UDISE", "Category", "Total Students", "Attained BLO", "Tamil Gap", "English Gap", "Maths Gap", "Attainment %"];
    const rows = filteredSchools.map(s => [
      s.name,
      s.udise,
      s.type,
      s.totalStudents,
      s.attainedBLO,
      s.notAttainTamil,
      s.notAttainEnglish,
      s.notAttainMaths,
      ((s.attainedBLO / s.totalStudents) * 100).toFixed(1)
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `thiran_report_${currentView}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const schoolsNeedingAttention = [...currentMonthData]
    .sort((a, b) => (a.attainedBLO / a.totalStudents) - (b.attainedBLO / b.totalStudents))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-100/30 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-blue-100/30 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] rounded-full bg-amber-100/20 blur-[110px]" />
      </div>

      {/* Sidebar / Top Nav */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <School className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 leading-tight text-xl">Samagra Shiksha</h2>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">BRC Kadayampatti</p>
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
              <NavButton active={currentView === 'february'} onClick={() => setCurrentView('february')} icon={Calendar} label="Feb" />
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
                  <h1 className="text-5xl font-black tracking-tight text-slate-900 font-display">
                    THIRAN Performance Dashboard
                  </h1>
                  <p className="text-slate-500 mt-2 max-w-2xl">
                    Comprehensive analysis of student BLO attainment across all schools in Kadayampatti BRC for the academic period Nov 2025 - Feb 2026.
                  </p>
                </div>
                <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4 group hover:shadow-xl hover:shadow-emerald-100 transition-all duration-500 cursor-default">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-black tracking-widest">Overall Improvement</div>
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
                          <defs>
                            <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} 
                            formatter={(value: number) => [`${value}%`, 'Attainment']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="percentage" 
                            stroke="#10b981" 
                            strokeWidth={6} 
                            dot={{ r: 8, fill: '#10b981', strokeWidth: 4, stroke: '#fff' }} 
                            activeDot={{ r: 12, strokeWidth: 0, fill: '#059669' }} 
                            animationDuration={2000}
                          />
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
                        <th className="pb-6 font-bold text-slate-400 text-xs uppercase tracking-widest">Feb %</th>
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
                          <td className="py-6 text-slate-400">{cat.janPercent}%</td>
                          <td className="py-6">
                            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-sm font-black">
                              {cat.febPercent}%
                            </span>
                          </td>
                          <td className="py-6">
                            <div className="flex items-center text-emerald-600 font-black">
                              <ArrowUpRight className="w-5 h-5 mr-1" />
                              {(cat.febPercent - cat.novPercent).toFixed(1)}%
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top and Bottom Schools */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    Top Performing Schools
                  </h3>
                  <div className="space-y-4">
                    {topSchools.map((school) => (
                      <SchoolRow 
                        key={school.udise} 
                        school={school} 
                        isTop={true} 
                        onClick={() => setSelectedSchool(school)}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-rose-500" />
                    Schools Needing Attention
                  </h3>
                  <div className="space-y-4">
                    {schoolsNeedingAttention.map((school) => (
                      <SchoolRow 
                        key={school.udise} 
                        school={school} 
                        isTop={false} 
                        onClick={() => setSelectedSchool(school)}
                      />
                    ))}
                  </div>
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
                <div className="flex items-center gap-4">
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
                  <button 
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                  >
                    <Download className="w-5 h-5" />
                    Export CSV
                  </button>
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
                            stroke={themeHex} 
                            strokeWidth={6} 
                            dot={{ r: 8, fill: themeHex, strokeWidth: 4, stroke: '#fff' }} 
                            activeDot={{ r: 12, strokeWidth: 0, fill: themeHex }}
                            animationDuration={1500}
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
                          <tr 
                            key={school.udise} 
                            onClick={() => setSelectedSchool(school)}
                            className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${top5Ids.has(school.udise) ? 'bg-emerald-50/30' : bottom5Ids.has(school.udise) ? 'bg-rose-50/30' : ''}`}
                          >
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
                <div className="flex items-center gap-4">
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
                  <button 
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                  >
                    <Download className="w-5 h-5" />
                    Export CSV
                  </button>
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
                          <tr 
                            key={school.udise} 
                            onClick={() => setSelectedSchool(school)}
                            className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${top5Ids.has(school.udise) ? 'bg-emerald-50/30' : bottom5Ids.has(school.udise) ? 'bg-rose-50/30' : ''}`}
                          >
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

      <AnimatePresence>
        {selectedSchool && (
          <SchoolDetailModal 
            school={selectedSchool} 
            onClose={() => setSelectedSchool(null)} 
          />
        )}
      </AnimatePresence>

      <footer className="max-w-7xl mx-auto mt-12 pt-12 border-t border-slate-200 text-center text-slate-400 text-sm pb-12">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <School className="w-4 h-4" />
          <span className="font-bold uppercase tracking-widest text-[10px]">Samagra Shiksha • BRC Kadayampatti</span>
        </div>
        <p>© 2026 K.IYYAPPAN BRTE. All rights reserved.</p>
      </footer>
    </div>
  );
}

function SchoolDetailModal({ school, onClose }: { school: SchoolData; onClose: () => void }) {
  const historicalData = useMemo(() => {
    const months = [
      { name: 'Nov', data: NOVEMBER_SCHOOL_DATA },
      { name: 'Dec', data: DECEMBER_SCHOOL_DATA },
      { name: 'Jan', data: JANUARY_SCHOOL_DATA },
      { name: 'Feb', data: FEBRUARY_SCHOOL_DATA },
    ];

    return months.map(m => {
      const schoolData = m.data.find(s => s.udise === school.udise);
      return {
        month: m.name,
        attainment: schoolData ? ((schoolData.attainedBLO / schoolData.totalStudents) * 100).toFixed(1) : 0
      };
    });
  }, [school.udise]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className={`relative h-48 p-8 flex items-end transition-colors duration-500 ${
          school.attainedBLO / school.totalStudents > 0.9 ? 'bg-emerald-600' : 
          school.attainedBLO / school.totalStudents > 0.8 ? 'bg-blue-600' : 'bg-rose-600'
        }`}>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-6">
            <motion.div 
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-slate-900"
            >
              <School className="w-12 h-12" />
            </motion.div>
            <div className="text-white">
              <h2 className="text-3xl font-black tracking-tight drop-shadow-md">{school.name}</h2>
              <div className="flex items-center gap-4 mt-2 opacity-90 font-bold">
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs backdrop-blur-sm"><MapPin className="w-3 h-3" /> {school.udise}</span>
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs backdrop-blur-sm"><GraduationCap className="w-3 h-3" /> {school.type}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Historical Attainment Trend
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="attainment" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Management</div>
                <div className="text-slate-700 font-bold">{school.management}</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Category</div>
                <div className="text-slate-700 font-bold">{school.category}</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              Current Status
            </h3>
            <div className="space-y-4">
              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                <div className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-1">Attainment</div>
                <div className="text-3xl font-black text-emerald-700">{((school.attainedBLO / school.totalStudents) * 100).toFixed(1)}%</div>
                <div className="text-emerald-600/60 text-xs mt-1 font-medium">{school.attainedBLO} of {school.totalStudents} students</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500">Tamil Gap</span>
                  <span className="text-sm font-black text-amber-600">{school.notAttainTamil}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500">English Gap</span>
                  <span className="text-sm font-black text-rose-600">{school.notAttainEnglish}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500">Maths Gap</span>
                  <span className="text-sm font-black text-blue-600">{school.notAttainMaths}</span>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function NavButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`
        flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300
        ${active 
          ? 'bg-white text-emerald-600 shadow-md shadow-emerald-100 scale-105 ring-1 ring-slate-200/50' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'}
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
  const iconColorMap = {
    blue: 'bg-blue-100 text-blue-600 border-blue-200',
    emerald: 'bg-emerald-100 text-emerald-600 border-emerald-200',
    amber: 'bg-amber-100 text-amber-600 border-amber-200',
    indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
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
      whileHover={{ y: -8, scale: 1.02 }}
      className="group bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 cursor-default"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border shadow-lg transition-all duration-500 ${iconColorMap[color]} group-hover:scale-110 group-hover:rotate-3`}>
        <Icon className="w-8 h-8" />
      </div>
      <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2 group-hover:text-slate-500 transition-colors">{title}</div>
      <div className="text-4xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-emerald-600 transition-colors">{value}</div>
      <div className="text-sm text-slate-500 font-medium leading-relaxed group-hover:text-slate-600 transition-colors">{description}</div>
    </motion.div>
  );
}

interface SchoolRowProps {
  school: SchoolData;
  isTop?: boolean;
  key?: string | number;
}

function SchoolRow({ school, isTop, onClick }: SchoolRowProps & { onClick?: () => void }) {
  const percent = ((school.attainedBLO / school.totalStudents) * 100).toFixed(1);
  
  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group cursor-pointer border border-transparent hover:border-slate-200"
    >
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner transition-all duration-500 ${
          isTop 
            ? 'bg-emerald-500 text-white shadow-emerald-200 group-hover:rotate-6' 
            : 'bg-rose-500 text-white shadow-rose-200 group-hover:-rotate-6'
        }`}>
          {percent}%
        </div>
        <div>
          <div className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors text-lg">{school.name}</div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">{school.type} • {school.totalStudents} Students</div>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-white transition-all group-hover:translate-x-1" />
      </div>
    </motion.div>
  );
}
