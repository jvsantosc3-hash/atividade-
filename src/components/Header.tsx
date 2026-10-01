import React from 'react';
import { Search, FileText, CheckCircle2, History, RefreshCw, MapPin } from 'lucide-react';

interface HeaderProps {
  activeTab: 'search' | 'certificate' | 'validator' | 'history' | 'map';
  setActiveTab: (tab: 'search' | 'certificate' | 'validator' | 'history' | 'map') => void;
  onGenerateTestCNPJ: () => void;
  hasLoadedCompany: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onGenerateTestCNPJ,
  hasLoadedCompany,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark with official emblem hint */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#071D41] flex items-center justify-center text-white font-bold text-base shadow-xs">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-amber-400" aria-hidden="true">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 2.2l7 3.89v4.91c0 4.54-3.14 8.78-7 9.9-3.86-1.12-7-5.36-7-9.9V8.09l7-3.89zM11 7h2v6h-2zm0 8h2v2h-2z" />
            </svg>
          </div>
          <div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('search');
              }}
              className="text-base sm:text-lg font-bold tracking-tight text-slate-900 block leading-tight"
            >
              Consulta CNPJ
            </a>
            <span className="text-[11px] text-slate-500 font-medium tracking-normal block">
              Portal de Situação Cadastral & Certidões
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Text with active underlines) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 py-1 transition-colors ${
              activeTab === 'search'
                ? 'text-[#1351B4] font-semibold border-b-2 border-[#1351B4]'
                : 'hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Consultar</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 py-1 transition-colors ${
              activeTab === 'map'
                ? 'text-[#1351B4] font-semibold border-b-2 border-[#1351B4]'
                : 'hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Raio & CNAE no Mapa</span>
          </button>

          <button
            onClick={() => setActiveTab('certificate')}
            className={`flex items-center gap-1.5 py-1 transition-colors ${
              activeTab === 'certificate'
                ? 'text-[#1351B4] font-semibold border-b-2 border-[#1351B4]'
                : 'hover:text-slate-900'
            } ${!hasLoadedCompany ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!hasLoadedCompany}
            title={!hasLoadedCompany ? 'Consulte um CNPJ primeiro' : 'Ver Comprovante Oficial'}
          >
            <FileText className="w-4 h-4" />
            <span>Comprovante Oficial</span>
          </button>

          <button
            onClick={() => setActiveTab('validator')}
            className={`flex items-center gap-1.5 py-1 transition-colors ${
              activeTab === 'validator'
                ? 'text-[#1351B4] font-semibold border-b-2 border-[#1351B4]'
                : 'hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Autenticidade</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 py-1 transition-colors ${
              activeTab === 'history'
                ? 'text-[#1351B4] font-semibold border-b-2 border-[#1351B4]'
                : 'hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Histórico</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={onGenerateTestCNPJ}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors whitespace-nowrap"
            title="Gera um CNPJ com dígitos verificadores válidos para testes"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Gerar CNPJ Teste</span>
            <span className="sm:hidden">Gerar CNPJ</span>
          </button>

          {hasLoadedCompany && (
            <button
              onClick={() => setActiveTab('certificate')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1351B4] hover:bg-[#0c3c88] rounded transition-colors whitespace-nowrap shadow-xs"
            >
              Ver Comprovante
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
