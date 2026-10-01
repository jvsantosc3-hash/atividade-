import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { CNPJData } from '../types/cnpj';
import { formatDateBR, generateCertificateControlCode } from '../utils/cnpjUtils';
import { RepublicEmblem } from './RepublicEmblem';
import { Printer, Copy, Check, Download, RefreshCw, Share2, ShieldCheck, ArrowLeft } from 'lucide-react';

interface OfficialCertificateProps {
  data: CNPJData;
  onRefreshEmission?: (newData: CNPJData) => void;
  onBackToSearch?: () => void;
}

export const OfficialCertificate: React.FC<OfficialCertificateProps> = ({
  data,
  onRefreshEmission,
  onBackToSearch,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedBilling, setCopiedBilling] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);

  // Garante data e hora de emissão
  const emissionDate = data.data_emissao || new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const emissionTime = data.hora_emissao || new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const controlCode = data.codigo_controle || generateCertificateControlCode(data.cnpj);

  // Gera o QR Code com a URL ou texto de validação
  useEffect(() => {
    const validationUrl = `${window.location.origin}/?cnpj=${data.cnpj}&auth=${controlCode.replace(/\./g, '')}`;
    QRCode.toDataURL(validationUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('Erro ao gerar QRCode:', err));
  }, [data.cnpj, controlCode]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(controlCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const handleCopyBillingData = () => {
    const text = `DADOS CADASTRAIS PARA FATURAMENTO:
Razão Social: ${data.razao_social}
Nome Fantasia: ${data.nome_fantasia || 'Não informado'}
CNPJ: ${data.cnpj_formatado}
Inscrição Estadual: Isento / Não informada
Endereço: ${data.logradouro}, ${data.numero}${data.complemento ? ' - ' + data.complemento : ''}
Bairro: ${data.bairro} - CEP: ${data.cep}
Cidade/UF: ${data.municipio}/${data.uf}
E-mail: ${data.email || 'Não informado'}
Telefone: ${data.ddd_telefone_1 || 'Não informado'}
Situação Cadastral: ${data.situacao_cadastral}`;

    navigator.clipboard.writeText(text);
    setCopiedBilling(true);
    setTimeout(() => setCopiedBilling(false), 2200);
  };

  const handleReEmit = () => {
    const now = new Date();
    const newEmissionDate = now.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const newEmissionTime = now.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const newControlCode = generateCertificateControlCode(data.cnpj, now);

    if (onRefreshEmission) {
      onRefreshEmission({
        ...data,
        data_emissao: newEmissionDate,
        hora_emissao: newEmissionTime,
        codigo_controle: newControlCode,
      });
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/?cnpj=${data.cnpj}`;
    if (navigator.share) {
      navigator.share({
        title: `Comprovante CNPJ - ${data.razao_social}`,
        text: `Consulte a situação cadastral de ${data.razao_social} (${data.cnpj_formatado})`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 2200);
    }
  };

  return (
    <div className="py-6 max-w-5xl mx-auto px-3 sm:px-6">
      {/* Barra de Ações - Oculta na Impressão */}
      <div className="no-print mb-6 bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBackToSearch && (
            <button
              onClick={onBackToSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar à Consulta</span>
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-slate-900">
              Certidão Atualizada em {emissionDate} às {emissionTime}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleReEmit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors"
            title="Atualiza o carimbo de data, hora e código de validação"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Atualizar Horário</span>
          </button>

          <button
            onClick={handleCopyBillingData}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors"
          >
            {copiedBilling ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedBilling ? 'Copiado!' : 'Copiar Dados Fiscais'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{sharedToast ? 'Link Copiado!' : 'Compartilhar'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-[#071D41] hover:bg-[#1351B4] rounded transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>

      {/* DOCUMENTO OFICIAL - IMPRESSÃO / FOLHA A4 */}
      <div className="bg-white border-2 border-black p-4 sm:p-7 shadow-md print:shadow-none print:border-black print:p-0 print:m-0 text-black">
        {/* Cabeçalho do Governo / Receita Federal */}
        <div className="border-b-2 border-black pb-3 mb-2 flex items-center justify-between">
          <div className="w-20 flex justify-center">
            <RepublicEmblem className="w-16 h-16" />
          </div>
          <div className="flex-1 text-center px-2">
            <h1 className="text-[12px] sm:text-[13px] font-bold tracking-tight uppercase leading-snug">
              REPÚBLICA FEDERATIVA DO BRASIL
            </h1>
            <h2 className="text-[11px] sm:text-[12px] font-bold tracking-tight uppercase leading-snug text-slate-800 print:text-black">
              CADASTRO NACIONAL DA PESSOA JURÍDICA
            </h2>
            <div className="mt-1 inline-block border-2 border-black px-3 py-0.5 bg-slate-50 print:bg-transparent">
              <span className="text-[11px] sm:text-[12px] font-extrabold uppercase tracking-wide">
                COMPROVANTE DE INSCRIÇÃO E DE SITUAÇÃO CADASTRAL
              </span>
            </div>
          </div>
          <div className="w-20 text-right text-[10px] text-slate-600 print:text-black font-mono">
            RFB / CNPJ
          </div>
        </div>

        {/* Linha 1: Número de Inscrição + Matriz/Filial + Data de Abertura */}
        <div className="grid grid-cols-12 border-b border-black text-[11px]">
          <div className="col-span-8 sm:col-span-9 p-1.5 border-r border-black">
            <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
              NÚMERO DE INSCRIÇÃO
            </div>
            <div className="flex items-baseline gap-2 font-mono font-bold text-[13px]">
              <span>{data.cnpj_formatado}</span>
              <span className="text-[11px] font-sans font-extrabold text-blue-900 print:text-black">
                {data.tipo}
              </span>
            </div>
          </div>
          <div className="col-span-4 sm:col-span-3 p-1.5">
            <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
              DATA DE ABERTURA
            </div>
            <div className="font-mono font-bold text-[12px]">
              {formatDateBR(data.data_inicio_atividade)}
            </div>
          </div>
        </div>

        {/* Linha 2: Nome Empresarial (Razão Social) */}
        <div className="border-b border-black p-1.5 text-[11px]">
          <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
            NOME EMPRESARIAL
          </div>
          <div className="font-bold text-[12px] uppercase">
            {data.razao_social}
          </div>
        </div>

        {/* Linha 3: Nome Fantasia e Porte */}
        <div className="grid grid-cols-12 border-b border-black text-[11px]">
          <div className="col-span-8 sm:col-span-9 p-1.5 border-r border-black">
            <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
              TÍTULO DO ESTABELECIMENTO (NOME FANTASIA)
            </div>
            <div className="font-bold text-[12px] uppercase">
              {data.nome_fantasia || '*****'}
            </div>
          </div>
          <div className="col-span-4 sm:col-span-3 p-1.5">
            <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
              PORTE
            </div>
            <div className="font-bold text-[11px] uppercase">
              {data.porte}
            </div>
          </div>
        </div>

        {/* Linha 4: CNAE Principal */}
        <div className="border-b border-black p-1.5 text-[11px]">
          <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
            CÓDIGO E DESCRIÇÃO DA ATIVIDADE ECONÔMICA PRINCIPAL
          </div>
          <div className="font-bold text-[11px]">
            <span className="font-mono">{data.cnae_fiscal.codigo}</span> - {data.cnae_fiscal.descricao}
          </div>
        </div>

        {/* Linha 5: CNAEs Secundários */}
        <div className="border-b border-black p-1.5 text-[11px]">
          <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
            CÓDIGO E DESCRIÇÃO DAS ATIVIDADES ECONÔMICAS SECUNDÁRIAS
          </div>
          {data.cnaes_secundarios && data.cnaes_secundarios.length > 0 ? (
            <div className="font-medium text-[10.5px] space-y-0.5 mt-0.5">
              {data.cnaes_secundarios.map((cnae, idx) => (
                <div key={idx} className="leading-tight">
                  <span className="font-mono font-semibold">{cnae.codigo}</span> - {cnae.descricao}
                </div>
              ))}
            </div>
          ) : (
            <div className="font-bold text-[11px] text-slate-700 print:text-black">
              Não informada
            </div>
          )}
        </div>

        {/* Linha 6: Natureza Jurídica */}
        <div className="border-b border-black p-1.5 text-[11px]">
          <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
            CÓDIGO E DESCRIÇÃO DA NATUREZA JURÍDICA
          </div>
          <div className="font-bold text-[11px]">
            <span className="font-mono">{data.natureza_juridica.codigo}</span> - {data.natureza_juridica.descricao}
          </div>
        </div>

        {/* Linha 7: Endereço (Logradouro, Número, Complemento) */}
        <div className="grid grid-cols-12 border-b border-black text-[11px]">
          <div className="col-span-7 p-1.5 border-r border-black">
            <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
              LOGRADOURO
            </div>
            <div className="font-bold text-[11px] uppercase">
              {data.logradouro}
            </div>
          </div>
          <div className="col-span-2 p-1.5 border-r border-black">
            <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
              NÚMERO
            </div>
            <div className="font-bold text-[11px] uppercase">
              {data.numero}
            </div>
          </div>
          <div className="col-span-3 p-1.5">
            <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
              COMPLEMENTO
            </div>
            <div className="font-bold text-[11px] uppercase truncate">
              {data.complemento || '*****'}
            </div>
          </div>
        </div>

        {/* Linha 8: CEP, Bairro, Município, UF */}
        <div className="grid grid-cols-12 border-b border-black text-[11px]">
          <div className="col-span-3 p-1.5 border-r border-black">
            <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
              CEP
            </div>
            <div className="font-mono font-bold text-[11px]">
              {data.cep}
            </div>
          </div>
          <div className="col-span-4 p-1.5 border-r border-black">
            <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
              BAIRRO/DISTRITO
            </div>
            <div className="font-bold text-[11px] uppercase truncate">
              {data.bairro}
            </div>
          </div>
          <div className="col-span-4 p-1.5 border-r border-black">
            <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
              MUNICÍPIO
            </div>
            <div className="font-bold text-[11px] uppercase truncate">
              {data.municipio}
            </div>
          </div>
          <div className="col-span-1 p-1.5 text-center">
            <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
              UF
            </div>
            <div className="font-bold text-[11px] uppercase">
              {data.uf}
            </div>
          </div>
        </div>

        {/* Linha 9: Contatos */}
        <div className="grid grid-cols-12 border-b border-black text-[11px]">
          <div className="col-span-7 p-1.5 border-r border-black">
            <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
              ENDEREÇO ELETRÔNICO
            </div>
            <div className="font-bold text-[11px] truncate">
              {data.email || 'Não informado'}
            </div>
          </div>
          <div className="col-span-5 p-1.5">
            <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
              TELEFONE
            </div>
            <div className="font-bold text-[11px]">
              {data.ddd_telefone_1 || 'Não informado'} {data.ddd_telefone_2 ? ` / ${data.ddd_telefone_2}` : ''}
            </div>
          </div>
        </div>

        {/* Linha 10: Ente Federativo Responsável (EFR) */}
        <div className="border-b border-black p-1.5 text-[11px]">
          <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
            ENTE FEDERATIVO RESPONSÁVEL (EFR)
          </div>
          <div className="font-bold text-[11px]">
            {data.ente_federativo_responsavel || '*****'}
          </div>
        </div>

        {/* Linha 11: Situação Cadastral e Data */}
        <div className="grid grid-cols-12 border-b border-black text-[11px]">
          <div className="col-span-8 p-1.5 border-r border-black">
            <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
              SITUAÇÃO CADASTRAL
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`font-extrabold text-[13px] tracking-wide ${
                  data.situacao_cadastral === 'ATIVA'
                    ? 'text-emerald-700 print:text-black'
                    : 'text-rose-700 print:text-black'
                }`}
              >
                {data.situacao_cadastral}
              </span>
              {data.situacao_cadastral === 'ATIVA' && (
                <span className="text-[10px] text-slate-600 print:text-black font-semibold">
                  (EMPRESA REGULAR PERANTE A RECEITA FEDERAL)
                </span>
              )}
            </div>
          </div>
          <div className="col-span-4 p-1.5">
            <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
              DATA DA SITUAÇÃO CADASTRAL
            </div>
            <div className="font-mono font-bold text-[12px]">
              {formatDateBR(data.data_situacao_cadastral)}
            </div>
          </div>
        </div>

        {/* Linha 12: Motivo de Situação Cadastral */}
        <div className="border-b border-black p-1.5 text-[11px]">
          <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
            MOTIVO DE SITUAÇÃO CADASTRAL
          </div>
          <div className="font-bold text-[11px] uppercase">
            {data.motivo_situacao_cadastral || 'SEM MOTIVO'}
          </div>
        </div>

        {/* Linha 13: Situação Especial e Data */}
        <div className="grid grid-cols-12 border-b-2 border-black text-[11px]">
          <div className="col-span-8 p-1.5 border-r border-black">
            <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
              SITUAÇÃO ESPECIAL
            </div>
            <div className="font-bold text-[11px]">
              {data.situacao_especial || '*****'}
            </div>
          </div>
          <div className="col-span-4 p-1.5">
            <div className="text-[9px] font-bold text-slate-700 print:text-black uppercase">
              DATA DA SITUAÇÃO ESPECIAL
            </div>
            <div className="font-bold text-[11px]">
              {data.data_situacao_especial ? formatDateBR(data.data_situacao_especial) : '*****'}
            </div>
          </div>
        </div>

        {/* Autenticação & Validação de Segurança (Rodapé Oficial) */}
        <div className="mt-3 pt-2 grid grid-cols-12 gap-3 items-center">
          <div className="col-span-12 sm:col-span-9 text-[10px] space-y-1 text-slate-800 print:text-black">
            <p className="font-semibold leading-relaxed">
              Aprovado pela Instrução Normativa RFB nº 2.119, de 06 de dezembro de 2022.
            </p>
            <p className="leading-relaxed text-slate-600 print:text-black">
              Emitido no dia <strong className="font-mono text-black">{emissionDate}</strong> às{' '}
              <strong className="font-mono text-black">{emissionTime}</strong> (horário de Brasília) via integração oficial BrasilAPI.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="font-bold uppercase text-[9px] text-slate-600 print:text-black">
                CÓDIGO DE CONTROLE DO COMPROVANTE:
              </span>
              <span className="font-mono font-bold text-[12px] bg-slate-100 print:bg-transparent px-1.5 py-0.5 border border-slate-300 print:border-black tracking-wider">
                {controlCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="no-print text-blue-700 hover:text-blue-900 text-[10px] font-semibold underline flex items-center gap-1"
                title="Copiar código de autenticação"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <p className="text-[9px] text-slate-500 print:text-black pt-1">
              A autenticidade deste documento pode ser confirmada apontando a câmera do celular para o QR Code ao lado ou acessando a aba Autenticidade do portal.
            </p>
          </div>

          <div className="col-span-12 sm:col-span-3 flex flex-col items-center justify-center">
            {qrCodeUrl ? (
              <div className="p-1 border border-black bg-white inline-block text-center">
                <img src={qrCodeUrl} alt="QR Code de Autenticidade" className="w-24 h-24 sm:w-28 sm:h-28" />
                <span className="text-[8px] font-mono font-bold tracking-tight block uppercase text-slate-700 print:text-black">
                  Validação Oficial
                </span>
              </div>
            ) : (
              <div className="w-24 h-24 border border-dashed border-black flex items-center justify-center text-[10px] text-slate-400">
                QR Code
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
