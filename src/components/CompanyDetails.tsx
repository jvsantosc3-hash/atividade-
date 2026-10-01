import React, { useState } from 'react';
import { CNPJData } from '../types/cnpj';
import { calculateActivityTime, formatCurrency, formatDateBR } from '../utils/cnpjUtils';
import {
  Building2,
  Calendar,
  DollarSign,
  FileText,
  MapPin,
  Mail,
  Phone,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Briefcase,
  Share2,
  Code2,
  Radio,
} from 'lucide-react';

interface CompanyDetailsProps {
  data: CNPJData;
  onOpenCertificate: () => void;
}

export const CompanyDetails: React.FC<CompanyDetailsProps> = ({ data, onOpenCertificate }) => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedCNPJ, setCopiedCNPJ] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  const activityDuration = calculateActivityTime(data.data_inicio_atividade);

  const handleCopyAddress = () => {
    const full = `${data.logradouro}, ${data.numero}${data.complemento ? ' - ' + data.complemento : ''}, ${data.bairro}, ${data.municipio} - ${data.uf}, CEP ${data.cep}`;
    navigator.clipboard.writeText(full);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyCNPJ = () => {
    navigator.clipboard.writeText(data.cnpj_formatado);
    setCopiedCNPJ(true);
    setTimeout(() => setCopiedCNPJ(false), 2000);
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${data.logradouro}, ${data.numero}, ${data.bairro}, ${data.municipio} - ${data.uf}`
  )}`;

  const brasilApiUrl = `https://brasilapi.com.br/api/cnpj/v1/${data.cnpj}`;

  return (
    <div className="space-y-6">
      {/* Top Banner do Estabelecimento */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">{data.tipo}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono font-medium">{data.cnpj_formatado}</span>
              <button
                onClick={handleCopyCNPJ}
                className="text-blue-600 hover:text-blue-800 transition-colors p-0.5"
                title="Copiar CNPJ"
              >
                {copiedCNPJ ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </button>
              <span aria-hidden="true">·</span>
              <span>{data.porte}</span>

              {/* Tag de Integração BrasilAPI */}
              <span aria-hidden="true">·</span>
              <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Radio className="w-3 h-3 text-emerald-500" />
                <span>Fonte: <strong>{data.api_source || 'BrasilAPI'}</strong></span>
                {data.api_response_time_ms !== undefined && (
                  <span className="font-mono text-[10px] text-emerald-600">({data.api_response_time_ms}ms)</span>
                )}
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-tight">
              {data.razao_social}
            </h2>

            {data.nome_fantasia && (
              <p className="text-sm font-medium text-slate-600">
                Nome Fantasia: <span className="text-slate-900 font-semibold">{data.nome_fantasia}</span>
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                {data.situacao_cadastral === 'ATIVA' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span className="font-semibold text-slate-900">
                  Situação: {data.situacao_cadastral}
                </span>
                <span className="text-slate-500">desde {formatDateBR(data.data_situacao_cadastral)}</span>
              </div>

              {activityDuration && (
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Ativa há {activityDuration}</span>
                </div>
              )}
            </div>
          </div>

          {/* Ação Primária: Emitir Comprovante & Ferramentas de API */}
          <div className="shrink-0 flex flex-col sm:items-end gap-2 pt-2 sm:pt-0">
            <button
              onClick={onOpenCertificate}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#071D41] hover:bg-[#1351B4] rounded-lg transition-colors shadow-xs w-full sm:w-auto"
            >
              <FileText className="w-4 h-4" />
              <span>Emitir Comprovante Oficial</span>
            </button>

            <div className="flex items-center gap-2">
              <a
                href={brasilApiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
                title="Acessar endpoint direto na BrasilAPI"
              >
                <span>Ver na BrasilAPI</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => setShowRawJson(!showRawJson)}
                className="text-[11px] text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
              >
                <Code2 className="w-3 h-3 text-slate-500" />
                <span>{showRawJson ? 'Ocultar JSON' : 'Ver JSON da BrasilAPI'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Visualizador do Payload JSON bruto retornado pela BrasilAPI */}
        {showRawJson && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 font-mono">
                Payload JSON retornado pela BrasilAPI ({brasilApiUrl}):
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(data.raw_brasilapi || data, null, 2));
                  alert('JSON copiado para a área de transferência!');
                }}
                className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar JSON</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-72">
              {JSON.stringify(data.raw_brasilapi || data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Grid de 3 Cards de Informações Chave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Informações Financeiras & Porte */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Capital Social
              </span>
              <DollarSign className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {formatCurrency(data.capital_social)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Porte Declarado: <strong className="text-slate-700">{data.porte}</strong>
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <span className="block font-medium text-slate-700 mb-0.5">Natureza Jurídica:</span>
            <span className="font-mono text-slate-500">{data.natureza_juridica.codigo}</span> - {data.natureza_juridica.descricao}
          </div>
        </div>

        {/* Card 2: Regime Tributário */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Regime Tributário
              </span>
              <Briefcase className="w-4 h-4 text-slate-400" />
            </div>

            <div className="mt-3 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Simples Nacional:</span>
                <span className={`font-semibold ${data.simples?.optante ? 'text-emerald-700' : 'text-slate-700'}`}>
                  {data.simples?.optante ? 'Optante' : 'Não Optante'}
                </span>
              </div>
              {data.simples?.data_opcao && (
                <div className="text-[11px] text-slate-500">
                  Data de Opção: {formatDateBR(data.simples.data_opcao)}
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-600">Microempreendedor (MEI):</span>
                <span className={`font-semibold ${data.simples?.mei ? 'text-emerald-700' : 'text-slate-700'}`}>
                  {data.simples?.mei ? 'Enquadrado no SIMEI' : 'Não Enquadrado'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Ente Federativo: {data.ente_federativo_responsavel || 'Não aplicável'}
          </div>
        </div>

        {/* Card 3: Contato & Atendimento */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Contatos Cadastrais
              </span>
              <Mail className="w-4 h-4 text-slate-400" />
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-700 truncate" title={data.email}>
                  {data.email || 'E-mail não informado'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-700">
                  {data.ddd_telefone_1 || 'Telefone não informado'}
                </span>
              </div>

              {data.ddd_telefone_2 && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-700">{data.ddd_telefone_2}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Data de Fundação: <strong className="text-slate-700">{formatDateBR(data.data_inicio_atividade)}</strong>
          </div>
        </div>
      </div>

      {/* Seção 2 Colunas: Atividades Econômicas & Localização */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividades Econômicas (CNAEs) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Atividades Econômicas (CNAE)
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {1 + (data.cnaes_secundarios?.length || 0)} atividades
            </span>
          </div>

          {/* Atividade Principal */}
          <div className="mb-4 bg-slate-50 border border-slate-200/80 rounded-lg p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block mb-1">
              Atividade Principal
            </span>
            <div className="font-mono text-xs font-bold text-slate-900">
              {data.cnae_fiscal.codigo}
            </div>
            <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
              {data.cnae_fiscal.descricao}
            </p>
          </div>

          {/* Atividades Secundárias */}
          {data.cnaes_secundarios && data.cnaes_secundarios.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Atividades Secundárias ({data.cnaes_secundarios.length})
              </span>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {data.cnaes_secundarios.map((sec, idx) => (
                  <div key={idx} className="border-b border-slate-100 pb-2 last:border-none text-xs">
                    <span className="font-mono font-semibold text-slate-800 mr-2">{sec.codigo}</span>
                    <span className="text-slate-600">{sec.descricao}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Localização do Estabelecimento */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Endereço & Localização
                </h3>
              </div>
              <button
                onClick={handleCopyAddress}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAddress ? 'Copiado!' : 'Copiar Endereço'}</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Logradouro & Número</span>
                <span className="font-semibold text-slate-900 text-sm">
                  {data.logradouro}, {data.numero}
                </span>
                {data.complemento && <span className="text-slate-500 ml-1">({data.complemento})</span>}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Bairro</span>
                  <span className="font-medium text-slate-800">{data.bairro}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">CEP</span>
                  <span className="font-mono font-medium text-slate-800">{data.cep}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Município</span>
                  <span className="font-medium text-slate-800">{data.municipio}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Estado (UF)</span>
                  <span className="font-medium text-slate-800">{data.uf}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              <span>Ver localização no Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Quadro de Sócios e Administradores (QSA) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Quadro de Sócios e Administradores (QSA)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {data.qsa?.length || 0} sócios listados
          </span>
        </div>

        {data.qsa && data.qsa.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.qsa.map((socio, idx) => (
              <div
                key={idx}
                className="border border-slate-200/80 rounded-lg p-3.5 bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 uppercase">
                    {socio.nome_socio}
                  </div>
                  <div className="text-xs font-medium text-blue-800 mt-0.5">
                    {socio.qualificacao_socio}
                  </div>
                  {socio.cnpj_cpf_do_socio && (
                    <div className="font-mono text-[11px] text-slate-500 mt-1">
                      Doc: {socio.cnpj_cpf_do_socio}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  {socio.data_entrada_sociedade && (
                    <span>Entrada: {formatDateBR(socio.data_entrada_sociedade)}</span>
                  )}
                  {socio.faixa_etaria && <span>Faixa: {socio.faixa_etaria}</span>}
                  {socio.representante_legal && (
                    <span>Rep: {socio.representante_legal}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-3 text-center">
            Não há dados de sócios ou administradores registrados para esta entidade.
          </p>
        )}
      </div>
    </div>
  );
};
