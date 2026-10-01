import React, { useState } from 'react';
import { Search, Sparkles, AlertCircle, CheckCircle2, X, ClipboardPaste, ArrowRight, ShieldCheck, MapPin, Compass } from 'lucide-react';
import { cleanCNPJ, formatCNPJ, validateCNPJ, generateValidCNPJ } from '../utils/cnpjUtils';
import { POPULAR_COMPANIES } from '../data/mockCompanies';

interface SearchSectionProps {
  onSearch: (cnpj: string) => void;
  isLoading: boolean;
  errorMessage?: string | null;
  onNavigateToMap?: () => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  onSearch,
  isLoading,
  errorMessage,
  onNavigateToMap,
}) => {
  const [inputValue, setInputValue] = useState('');
  const cleaned = cleanCNPJ(inputValue);
  const isValidLength = cleaned.length === 14;
  const isAlgorithmicValid = isValidLength ? validateCNPJ(cleaned) : null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatCNPJ(raw);
    setInputValue(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleaned) return;
    onSearch(cleaned);
  };

  const handleSelectPreset = (cnpj: string) => {
    const formatted = formatCNPJ(cnpj);
    setInputValue(formatted);
    onSearch(cnpj);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const formatted = formatCNPJ(text);
      setInputValue(formatted);
    } catch {
      // Fallback normal se permissão negada
    }
  };

  const handleGenerateAndSearch = () => {
    const valid = generateValidCNPJ();
    setInputValue(valid);
    onSearch(valid);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
      <div className="max-w-3xl mx-auto text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-xs text-emerald-800 font-medium mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Conectado à BrasilAPI Oficial (v1)</span>
          <span className="text-emerald-500 font-mono text-[10px]">brasilapi.com.br</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Consulta de CNPJ e Emissão de Comprovante
        </h1>
        <p className="text-sm text-slate-600">
          Consulte dados cadastrais em tempo real via <strong>BrasilAPI</strong> diretamente da base pública da
          Receita Federal do Brasil: QSA (Quadro de Sócios), CNAEs, endereço completo e emissão de certidão cadastral.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="relative flex flex-col sm:flex-row items-stretch gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Digite o CNPJ (ex: 00.000.000/0001-91)"
              maxLength={18}
              className={`w-full pl-10 pr-20 py-3 text-base sm:text-lg font-mono tracking-wide rounded-lg border transition-colors outline-none focus:ring-2 ${
                isAlgorithmicValid === false
                  ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                  : isAlgorithmicValid === true
                  ? 'border-emerald-400 focus:ring-emerald-200 bg-emerald-50/20'
                  : 'border-slate-300 focus:border-[#1351B4] focus:ring-blue-100 bg-white'
              }`}
            />

            {/* Ações dentro do input: Colar e Limpar */}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
              {inputValue ? (
                <button
                  type="button"
                  onClick={() => setInputValue('')}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                  title="Limpar campo"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePaste}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50"
                  title="Colar da área de transferência"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Colar</span>
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || cleaned.length < 14}
            className={`px-6 py-3 font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-xs ${
              isLoading || cleaned.length < 14
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#071D41] hover:bg-[#1351B4] text-white'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Consultando...</span>
              </>
            ) : (
              <>
                <span>Consultar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Indicador de Validação do Dígito Verificador */}
        <div className="mt-2 min-h-5 flex items-center justify-between text-xs px-1">
          {isValidLength && isAlgorithmicValid === true && (
            <span className="text-emerald-700 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Dígitos verificadores válidos segundo algoritmo Módulo 11 (RFB)
            </span>
          )}
          {isValidLength && isAlgorithmicValid === false && (
            <span className="text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              Dígitos verificadores inválidos! Verifique se digitou corretamente.
            </span>
          )}
          {!isValidLength && inputValue.length > 0 && (
            <span className="text-slate-500">
              Digite os 14 dígitos do CNPJ ({cleaned.length}/14)
            </span>
          )}
        </div>

        {/* Mensagem de Erro de Busca */}
        {errorMessage && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Falha na consulta</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}
      </form>

      {/* Empresas em Destaque para Teste Rápido */}
      <div className="mt-6 pt-5 border-t border-slate-100 max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Exemplos para consulta imediata:
          </span>
          <button
            type="button"
            onClick={handleGenerateAndSearch}
            className="text-xs text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1 text-left"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Gerar e testar CNPJ aleatório válido</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {POPULAR_COMPANIES.map((company) => (
            <button
              key={company.cnpj}
              onClick={() => handleSelectPreset(company.cnpj)}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span className="font-semibold">{company.nome_fantasia || company.razao_social.split(' ')[0]}</span>
              <span className="text-slate-400 font-mono text-[11px]">({company.cnpj_formatado.slice(0, 10)}...)</span>
            </button>
          ))}
        </div>

        {onNavigateToMap && (
          <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-blue-900">
              <Compass className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                Quer buscar empresas pelo <strong>ramo de atuação (CNAE)</strong> ou <strong>raio geográfico em km</strong>?
              </span>
            </div>
            <button
              type="button"
              onClick={onNavigateToMap}
              className="px-3 py-1.5 bg-[#071D41] hover:bg-[#1351B4] text-white font-semibold rounded text-xs transition-colors flex items-center justify-center gap-1 shrink-0"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Abrir Radar no Mapa</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
