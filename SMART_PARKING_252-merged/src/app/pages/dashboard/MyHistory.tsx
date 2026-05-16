import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getHistory } from '../../../mocks/mockData';
import { getStoredRole, getStoredUserId } from '../../api/client';
import { studentApi } from '../../api/studentApi';

interface HistoryEntry {
  date: string;
  timeIn: string;
  timeOut: string;
  slot: string;
  duration: string;
  fee: string;
  cardType: string; 
  status: 'active' | 'paid';
}

export function MyHistory() {
  const accountRole = getStoredRole('student');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // filtered results computed client-side
  const [filteredData, setFilteredData] = useState<HistoryEntry[]>([]);

  // fetch paginated history from mock layer
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = accountRole === 'student'
          ? await studentApi.getParkingHistory(getStoredUserId(), currentPage, itemsPerPage)
          : await getHistory(currentPage, itemsPerPage);
        if (!mounted) return;
        const mapped = res.data.map((entry: any) => ({
          ...entry,
          fee: typeof entry.fee === 'number' ? `${entry.fee.toLocaleString()} VND` : entry.fee,
          cardType: entry.cardType || 'Thẻ tháng',
          status: 'active',
        })) as HistoryEntry[];
        setHistoryData(mapped);
        setTotal(res.total);
      } catch (err) {
        if (!mounted) return;
        try {
          const res = await getHistory(currentPage, itemsPerPage);
          if (!mounted) return;
          setHistoryData(res.data as HistoryEntry[]);
          setTotal(res.total);
        } catch {
          setHistoryData([]);
          setTotal(0);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [accountRole, currentPage]);

  // When searchQuery changes, fetch more data (all) and filter client-side for simplicity
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!searchQuery) {
        setFilteredData(historyData);
        return;
      }

      try {
        setLoading(true);
        // attempt to get all history - using mock getHistory with large limit
        const res = await getHistory(1, 1000);
        if (!mounted) return;
        const mapped = res.data as HistoryEntry[];
        const q = searchQuery.toLowerCase();
        const filtered = mapped.filter((entry) =>
          `${entry.date} ${entry.timeIn} ${entry.timeOut} ${entry.slot} ${entry.duration} ${entry.cardType} ${entry.fee}`
            .toLowerCase()
            .includes(q)
        );
        setFilteredData(filtered);
        setTotal(filtered.length);
        setCurrentPage(1);
      } catch {
        // fallback: filter current page
        const q = searchQuery.toLowerCase();
        setFilteredData(historyData.filter((entry) =>
          `${entry.date} ${entry.timeIn} ${entry.timeOut} ${entry.slot} ${entry.duration} ${entry.cardType} ${entry.fee}`
            .toLowerCase()
            .includes(q)
        ));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [searchQuery, historyData]);

  const totalPages = Math.ceil(total / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const source = searchQuery ? filteredData : historyData;
  const currentData = source.slice(startIndex, Math.min(endIndex, source.length));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Lịch sử của tôi</h1>
          <p className="text-gray-600">Kiểm tra toàn bộ lịch sử đậu xe và giao dịch của bạn.</p>
        </div>
        
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tìm theo ngày, chỗ, phí..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => { setSearchQuery(''); setFilteredData(historyData); }}
              className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ngày</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Giờ vào</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Giờ ra</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Chỗ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Thời gian</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Loại thẻ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phí</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{entry.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{entry.timeIn}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{entry.timeOut}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{entry.slot}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{entry.duration}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{entry.cardType}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{entry.fee}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {entry.status === 'active' && 'Đang hoạt động'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Hiển thị {startIndex + 1} đến {Math.min(endIndex, source.length)} trong {source.length} mục
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
