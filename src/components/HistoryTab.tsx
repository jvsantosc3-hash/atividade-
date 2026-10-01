import React, { useState } from 'react';
import { QueryHistoryItem } from '../types/cnpj';
import { History, Star, Trash2, Download, Search, ArrowRight, Building, CheckCircle2 } from 'lucide-react';
import { formatCNPJ } from '../utils/cnpjUtils';

interface HistoryTabProps {
  history: QueryHistoryItem[];
  onSelectCNPJ: (cnpj: string) => void;
  onToggleFavorite: (cnpj: string) => void;
  onClearHistory: () => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  history,
  onSelectCNPJ,
  onToggleFavorite,
  onClearHistory,
}) => {
  const [filterText, setFilterText] = useState('');

  const filtered = history.filter((item) => {
    const q = filterText.toLowerCase();
    return (
      item.razao_social.toLowerCase().includes(q) ||
      (item.nome_fantasia && item.nome_fantasia.toLowerCase().includes(q)) ||
      item.cnpj.includes(q) ||
      item.municipio.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = ['CNPJ', 'Razao Social', 'Nome Fantasia', 'UF', 'Municipio', 'Situacao', 'Data Consulta'];
    const rows = history.map((item) => [
      item.cnpj,
      `"${item.razao_social.replace(/"/g, '""')}"`,
      `"${(item.nome_fantasia || '').replace(/"/g, '""')}"`,
      item.uf,
      `"${item.municipio.replace(/"/g, '""')}"`,
      item.situacao_cadastral,
      item.consultado_em,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `historico_consultas_cnpj_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#1351B4]" />
            <h2 className="text-xl font-bold text-slate-900">
              Histórico de Consultas
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro das últimas empresas pesquisadas no seu navegador ({history.length} salvas)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Exportar CSV</span>
              </button>

              <button
                onClick={onClearHistory}
                className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar</span>
              </button>
            </>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="my-4">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filtrar por nome ou CNPJ..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="py-12 text-center text-slate-500 space-y-2">
          <Building className="w-10 h-10 mx-auto text-slate-300" />
          <p className="font-semibold text-slate-700 text-sm">Nenhuma consulta realizada ainda.</p>
          <p className="text-xs text-slate-500">
            Pesquise por qualquer CNPJ na aba inicial para salvar e gerenciar suas certidões aqui.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs">
          Nenhuma empresa encontrada para o filtro informado.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filtered.map((item) => (
            <div
              key={item.cnpj}
              className="py-3 sm:py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 px-2 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => onToggleFavorite(item.cnpj)}
                  className={`p-1 rounded transition-colors ${
                    item.favorito ? 'text-amber-500 hover:text-amber-600' : 'text-slate-300 hover:text-slate-500'
                  }`}
                  title={item.favorito ? 'Desmarcar favorito' : 'Marcar favorito'}
                >
                  <Star className={`w-4 h-4 ${item.favorito ? 'fill-current' : ''}`} />
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {item.razao_social}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 shrink-0">
                      {formatCNPJ(item.cnpj)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    {item.nome_fantasia && <span>Fantasia: {item.nome_fantasia}</span>}
                    {item.nome_fantasia && <span aria-hidden="true">·</span>}
                    <span>{item.municipio} - {item.uf}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-semibold">{item.situacao_cadastral}</span>
                    <span aria-hidden="true">·</span>
                    <span>Consultado em {item.consultado_em}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => onSelectCNPJ(item.cnpj)}
                  className="px-3 py-1.5 bg-[#071D41] hover:bg-[#1351B4] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1 shadow-xs"
                >
                  <span>Reabrir</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
