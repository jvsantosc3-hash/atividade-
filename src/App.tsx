/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CNPJData, QueryHistoryItem } from './types/cnpj';
import { fetchCNPJData, POPULAR_COMPANIES } from './data/mockCompanies';
import { generateValidCNPJ } from './utils/cnpjUtils';
import { Header } from './components/Header';
import { SearchSection } from './components/SearchSection';
import { CompanyDetails } from './components/CompanyDetails';
import { OfficialCertificate } from './components/OfficialCertificate';
import { ValidatorTab } from './components/ValidatorTab';
import { HistoryTab } from './components/HistoryTab';
import { CnaeRadiusMap } from './components/CnaeRadiusMap';
import { Footer } from './components/Footer';
import { FileText, LayoutDashboard, AlertCircle, Building2 } from 'lucide-react';

const STORAGE_KEY_HISTORY = 'cnpj_portal_query_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'certificate' | 'validator' | 'history' | 'map'>('search');
  const [companyViewMode, setCompanyViewMode] = useState<'details' | 'certificate'>('details');
  const [currentCompany, setCurrentCompany] = useState<CNPJData | null>(POPULAR_COMPANIES[0]); // Começa com Nubank para visualização rica imediata
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<QueryHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Erro ao ler histórico de localStorage:', e);
    }
    // Histórico inicial com as empresas de destaque
    return [
      {
        cnpj: '30680829000143',
        razao_social: 'NU PAGAMENTOS S.A. - INSTITUICAO DE PAGAMENTO',
        nome_fantasia: 'NUBANK',
        uf: 'SP',
        municipio: 'SAO PAULO',
        situacao_cadastral: 'ATIVA',
        consultado_em: new Date().toLocaleDateString('pt-BR'),
        favorito: true,
      },
      {
        cnpj: '33000167000101',
        razao_social: 'PETROLEO BRASILEIRO S.A. PETROBRAS',
        nome_fantasia: 'PETROBRAS',
        uf: 'RJ',
        municipio: 'RIO DE JANEIRO',
        situacao_cadastral: 'ATIVA',
        consultado_em: new Date().toLocaleDateString('pt-BR'),
        favorito: false,
      },
    ];
  });

  // Salva histórico no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.warn('Erro ao salvar histórico:', e);
    }
  }, [history]);

  // Suporte a URL query params: `?cnpj=...`
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cnpjParam = params.get('cnpj');
    if (cnpjParam) {
      handleSearch(cnpjParam);
    }
  }, []);

  const handleSearch = async (cnpjInput: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await fetchCNPJData(cnpjInput);
      setCurrentCompany(data);

      // Adiciona ao histórico sem duplicatas
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.cnpj !== data.cnpj);
        const newItem: QueryHistoryItem = {
          cnpj: data.cnpj,
          razao_social: data.razao_social,
          nome_fantasia: data.nome_fantasia,
          uf: data.uf,
          municipio: data.municipio,
          situacao_cadastral: data.situacao_cadastral,
          consultado_em: new Date().toLocaleDateString('pt-BR'),
          favorito: prev.find((i) => i.cnpj === data.cnpj)?.favorito || false,
        };
        return [newItem, ...filtered].slice(0, 30);
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Não foi possível consultar os dados deste CNPJ.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTestCNPJ = () => {
    const randomValid = generateValidCNPJ();
    handleSearch(randomValid);
    setActiveTab('search');
    setCompanyViewMode('details');
  };

  const handleToggleFavorite = (cnpj: string) => {
    setHistory((prev) =>
      prev.map((item) => (item.cnpj === cnpj ? { ...item, favorito: !item.favorito } : item))
    );
  };

  const handleClearHistory = () => {
    if (window.confirm('Tem certeza que deseja limpar o histórico de consultas?')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGenerateTestCNPJ={handleGenerateTestCNPJ}
        hasLoadedCompany={Boolean(currentCompany)}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Visualização de Certificado Dedicado */}
        {activeTab === 'certificate' && currentCompany && (
          <OfficialCertificate
            data={currentCompany}
            onRefreshEmission={(newData) => setCurrentCompany(newData)}
            onBackToSearch={() => setActiveTab('search')}
          />
        )}

        {/* Visualização da Aba de Mapa & Raio CNAE */}
        {activeTab === 'map' && (
          <CnaeRadiusMap
            onConsultCNPJ={(cnpj) => {
              handleSearch(cnpj);
              setActiveTab('search');
              setCompanyViewMode('details');
            }}
          />
        )}

        {/* Visualização da Aba de Autenticidade & Validador */}
        {activeTab === 'validator' && (
          <ValidatorTab
            onConsultCNPJ={(cnpj) => {
              handleSearch(cnpj);
              setActiveTab('search');
            }}
          />
        )}

        {/* Visualização da Aba de Histórico */}
        {activeTab === 'history' && (
          <HistoryTab
            history={history}
            onSelectCNPJ={(cnpj) => {
              handleSearch(cnpj);
              setActiveTab('search');
            }}
            onToggleFavorite={handleToggleFavorite}
            onClearHistory={handleClearHistory}
          />
        )}

        {/* Visualização da Aba de Busca (Padrão) */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <SearchSection
              onSearch={handleSearch}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onNavigateToMap={() => setActiveTab('map')}
            />

            {/* Alternador de Modo de Visualização do Registro Encontrado */}
            {currentCompany && (
              <div className="space-y-4">
                <div className="no-print flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-slate-700" />
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Resultado da Consulta Cadastral
                    </h2>
                  </div>

                  {/* Segmented Control de visualização */}
                  <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
                    <button
                      onClick={() => setCompanyViewMode('details')}
                      className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                        companyViewMode === 'details'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Ficha Cadastral</span>
                    </button>

                    <button
                      onClick={() => setCompanyViewMode('certificate')}
                      className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                        companyViewMode === 'certificate'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Comprovante Oficial (Certidão)</span>
                    </button>
                  </div>
                </div>

                {companyViewMode === 'details' ? (
                  <CompanyDetails
                    data={currentCompany}
                    onOpenCertificate={() => setCompanyViewMode('certificate')}
                  />
                ) : (
                  <OfficialCertificate
                    data={currentCompany}
                    onRefreshEmission={(newData) => setCurrentCompany(newData)}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Rodapé Institucional */}
      <Footer />
    </div>
  );
}
