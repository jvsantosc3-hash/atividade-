import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white text-slate-500 text-xs py-8 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#071D41] flex items-center justify-center text-white text-[10px] font-bold">
              ✓
            </div>
            <span className="font-semibold text-slate-800">
              Sistema de Consulta Cadastral & Emissão de Certidões de CNPJ
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 inline-flex items-center gap-1 transition-colors"
            >
              <span>Portal Oficial Receita Federal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://www.gov.br/empresas-e-negocios/pt-br/redesim"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 inline-flex items-center gap-1 transition-colors"
            >
              <span>Redesim</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-100 pt-4">
          <p>
            Informações públicas disponibilizadas em conformidade com a Lei de Acesso à Informação (Lei nº 12.527/2011) e Instrução Normativa RFB nº 2.119/2022. Os dados cadastrais são atualizados e consolidados a partir das bases públicas oficiais.
          </p>
          <p className="mt-1 text-slate-500">
            Documento de Comprovante de Inscrição e Situação Cadastral emitido para simples conferência e comprovação cadastral perante instituições bancárias, fornecedores e órgãos públicos.
          </p>
        </div>
      </div>
    </footer>
  );
};
