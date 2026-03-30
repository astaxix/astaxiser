
import React, { useState, useEffect, useMemo } from 'react';
import { db, collection, onSnapshot, query, orderBy } from '@/firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Loader2, TrendingUp, DollarSign, Calendar, ArrowRight, Eye, Users } from 'lucide-react';

interface Booking {
  id: string;
  date: string;
  price: number;
  status: string;
}

interface Visit {
  id: string;
  path: string;
  timestamp: string;
}

const AdminAnalytics: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    const qBookings = query(collection(db, 'bookings'), orderBy('date', 'desc'));
    const unsubscribeBookings = onSnapshot(qBookings, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(data);
    });

    const qVisits = query(collection(db, 'visits'), orderBy('timestamp', 'desc'));
    const unsubscribeVisits = onSnapshot(qVisits, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Visit));
      setVisits(data);
      setLoading(false);
    }, (error) => {
      console.error('Visits onSnapshot error:', error);
      setLoading(false);
    });

    return () => {
      unsubscribeBookings();
      unsubscribeVisits();
    };
  }, []);

  const filteredBookings = useMemo(() => {
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return bookings.filter(b => new Date(b.date) >= pastDate && b.status !== 'cancelled');
  }, [bookings, timeRange]);

  const filteredVisits = useMemo(() => {
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return visits.filter(v => new Date(v.timestamp) >= pastDate);
  }, [visits, timeRange]);

  const stats = useMemo(() => {
    const totalBookings = filteredBookings.length;
    const totalRevenue = filteredBookings.reduce((sum, b) => sum + (b.price || 0), 0);
    const totalVisits = filteredVisits.length;
    return { totalBookings, totalRevenue, totalVisits };
  }, [filteredBookings, filteredVisits]);

  const chartData = useMemo(() => {
    const data: Record<string, { bookings: number, revenue: number, visits: number }> = {};
    
    filteredBookings.forEach(b => {
      if (!data[b.date]) data[b.date] = { bookings: 0, revenue: 0, visits: 0 };
      data[b.date].bookings += 1;
      data[b.date].revenue += (b.price || 0);
    });

    filteredVisits.forEach(v => {
      const date = v.timestamp.split('T')[0];
      if (!data[date]) data[date] = { bookings: 0, revenue: 0, visits: 0 };
      data[date].visits += 1;
    });

    return Object.entries(data).map(([date, values]) => ({ date, ...values })).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredBookings, filteredVisits]);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-secondary" size={32} /></div>;

  return (
    <div className="p-4 md:p-10 space-y-6 md:space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl md:text-2xl font-black tracking-tighter">Buchungs-Analyse</h3>
        <select 
          className="w-full sm:w-auto bg-gray-50 rounded-xl p-3 font-bold text-xs md:text-sm outline-none border border-gray-100"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
        >
          <option value="7d">Letzte 7 Tage</option>
          <option value="30d">Letzte 30 Tage</option>
          <option value="90d">Letzte 90 Tage</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-gray-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100">
          <div className="flex items-center gap-3 md:gap-4 mb-2">
            <div className="p-2 md:p-3 bg-white rounded-xl shadow-sm"><TrendingUp className="text-secondary" size={20} /></div>
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Buchungen</span>
          </div>
          <p className="text-2xl md:text-4xl font-black">{stats.totalBookings}</p>
        </div>
        <div className="bg-gray-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100">
          <div className="flex items-center gap-3 md:gap-4 mb-2">
            <div className="p-2 md:p-3 bg-white rounded-xl shadow-sm"><DollarSign className="text-secondary" size={20} /></div>
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Umsatz</span>
          </div>
          <p className="text-2xl md:text-4xl font-black">{stats.totalRevenue.toFixed(2)} €</p>
        </div>
        <div className="bg-gray-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100">
          <div className="flex items-center gap-3 md:gap-4 mb-2">
            <div className="p-2 md:p-3 bg-white rounded-xl shadow-sm"><Users className="text-secondary" size={20} /></div>
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Besucher (Intern)</span>
          </div>
          <p className="text-2xl md:text-4xl font-black">{stats.totalVisits}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm">
          <h4 className="text-base md:text-lg font-black mb-4 md:mb-6">Umsatzverlauf</h4>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{fontSize: 8}} />
                <YAxis tick={{fontSize: 8}} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#000" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm">
          <h4 className="text-base md:text-lg font-black mb-4 md:mb-6">Besucher & Buchungen</h4>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{fontSize: 8}} />
                <YAxis tick={{fontSize: 8}} />
                <Tooltip />
                <Bar dataKey="visits" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Besucher" />
                <Bar dataKey="bookings" fill="#f27d26" radius={[4, 4, 0, 0]} name="Buchungen" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
