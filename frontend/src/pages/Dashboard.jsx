import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Calendar as CalendarIcon, ChevronDown, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

export default function Dashboard() {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMeetings();
    }, []);

    async function fetchMeetings() {
        // Pegar ID e carregar
        const { data, error } = await supabase
            .from('meetings')
            .select('*')
            .order('date', { ascending: false });

        if (!error && data) {
            setMeetings(data);
        }
        setLoading(false);
    }

    const getBadgeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'sales meeting':
            case 'vendas':
                return 'bg-blue-500 text-white';
            case 'team sync':
            case 'equipe':
                return 'bg-teal-500 text-white';
            case 'project kickoff':
            case 'projeto':
                return 'bg-purple-500 text-white';
            case 'one-on-one':
            case '1on1':
                return 'bg-orange-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    return (
        <div className="p-10 max-w-5xl">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4 md:mb-0">Meetings Dashboard</h1>

                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                            placeholder="Search meetings..."
                        />
                    </div>

                    <button className="flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <CalendarIcon className="mr-2 h-4 w-4" /> Date
                    </button>

                    <button className="flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Meeting Type <ChevronDown className="ml-2 h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Loading state */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                /* Meeting List */
                <div className="space-y-4">
                    {meetings.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                            Nenhuma reunião encontrada. Configure seu Webhook no app Fireflies.
                        </div>
                    ) : (
                        meetings.map((m) => (
                            <div
                                key={m.id}
                                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow transition-shadow cursor-pointer"
                                onClick={() => navigate(`/reuniao/${m.id}`)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">{m.title}</h3>
                                </div>

                                <div className="flex items-center text-sm text-gray-500 mb-3 space-x-2">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                        {m.date ? format(parseISO(m.date), 'MMM d, yyyy') : 'Sem data'} • {m.duration ? `${m.duration}m` : '0m'}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getBadgeColor(m.meeting_type)}`}>
                                        {m.meeting_type || 'Geral'}
                                    </span>
                                </div>

                                <p className="text-gray-700 text-sm truncate">
                                    <span className="font-semibold text-gray-900">AI Summary: </span>
                                    {m.executive_summary || 'Sem resumo disponível.'}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
