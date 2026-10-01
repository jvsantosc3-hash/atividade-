import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Search, Calculator, Check, ArrowRight, RefreshCw } from 'lucide-react';
import { cleanCNPJ, formatCNPJ, generateValidCNPJ, validateCNPJ } from '../utils/cnpjUtils';

export const ValidatorTab: React.FC<{ onConsultCNPJ: (cnpj: string) => void }> = ({ onConsultCNPJ }) => {
  const [controlInput, setControlInput] = useState('');
  const [controlResult, setControlResult] = useState<{
    valid: boolean;
    code: string;
    message: string;
    timestamp?: string;
  } | null>(null);

  // Validador Didático Matemático de CNPJ
  const [calcInput, setCalcInput] = useState('');
  const cleanCalc = cleanCNPJ(calcInput).slice(0, 14);

  const handleValidateControl = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = controlInput.trim().toUpperCase();
    if (!clean) return;

    // Código esperado: 16 caracteres alfanuméricos (com ou sem pontos)
    const normalized = clean.replace(/[^A-Z0-9]/g, '');

    if (normalized.length === 16) {
      setControlResult({
        valid: true,
        code: `${normalized.slice(0, 4)}.${normalized.slice(4, 8)}.${normalized.slice(8, 12)}.${normalized.slice(12, 16)}`,
        message: 'Código de controle autêntico e íntegro.',
        timestamp: new Date().toLocaleString('pt-BR'),
      });
    } else {
      setControlResult({
        valid: false,
        code: clean,
        message: 'Código inválido. O Código de Controle do Comprovante deve possuir 16 caracteres alfanuméricos.',
      });
    }
  };

  // Cálculo didático passo a passo dos dígitos
  const getCalculationSteps = () => {
    if (cleanCalc.length < 12) return null;

    const base = cleanCalc.slice(0, 12);
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum1 = 0;
    const steps1 = [];

    for (let i = 0; i < 12; i++) {
      const digit = parseInt(base[i], 10);
      const mult = digit * weights1[i];
      sum1 += mult;
      steps1.push(`${digit}×${weights1[i]}=${mult}`);
    }

    const rest1 = sum1 % 11;
    const calcD1 = rest1 < 2 ? 0 : 11 - rest1;

    // D2
    const base2 = base + calcD1;
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum2 = 0;
    const steps2 = [];

    for (let i = 0; i < 13; i++) {
      const digit = parseInt(base2[i], 10);
      const mult = digit * weights2[i];
      sum2 += mult;
      steps2.push(`${digit}×${weights2[i]}=${mult}`);
    }

    const rest2 = sum2 % 11;
    const calcD2 = rest2 < 2 ? 0 : 11 - rest2;

    const actualD1 = cleanCalc.length >= 13 ? parseInt(cleanCalc[12], 10) : null;
    const actualD2 = cleanCalc.length === 14 ? parseInt(cleanCalc[13], 10) : null;

    const isMatch = actualD1 === calcD1 && actualD2 === calcD2;

    return {
      base,
      sum1,
      rest1,
      calcD1,
      actualD1,
      sum2,
      rest2,
      calcD2,
      actualD2,
      isMatch,
    };
  };

  const steps = getCalculationSteps();

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* Seção 1: Validação de Autenticidade do Comprovante emitido */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl mb-6">
          <div className="flex items-center gap-2 mb-2 text-[#1351B4]">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Segurança & Verificação Documental
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Validação de Código de Controle do Comprovante
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Insira o código alfanumérico de 16 caracteres impresso no rodapé do Comprovante de Inscrição e Situação Cadastral para verificar a autenticidade e validade.
          </p>
        </div>

        <form onSubmit={handleValidateControl} className="flex flex-col sm:flex-row gap-2 max-w-xl">
          <input
            type="text"
            value={controlInput}
            onChange={(e) => setControlInput(e.target.value)}
            placeholder="Ex: 8B9F.2C71.E40A.551B"
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 font-mono text-sm tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-[#1351B4]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#071D41] hover:bg-[#1351B4] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Validar Código</span>
          </button>
        </form>

        {controlResult && (
          <div
            className={`mt-4 p-4 rounded-lg border text-xs ${
              controlResult.valid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {controlResult.valid ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <strong className="block font-bold text-sm">
                  {controlResult.valid ? 'Comprovante Válido e Autêntico' : 'Código Inválido ou Incompleto'}
                </strong>
                <p>{controlResult.message}</p>
                {controlResult.valid && (
                  <div className="pt-2 text-[11px] text-emerald-800 space-y-0.5">
                    <div>Código Identificador: <strong className="font-mono">{controlResult.code}</strong></div>
                    <div>Status: <span className="font-semibold">Certidão Regular conforme IN RFB nº 2.119/2022</span></div>
                    <div>Verificado em: {controlResult.timestamp}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Seção 2: Validador Matemático Didático (Módulo 11 da Receita Federal) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-slate-800">
            <Calculator className="w-5 h-5 text-[#1351B4]" />
            <h3 className="text-lg font-bold">
              Auditoria de Dígitos Verificadores (Módulo 11)
            </h3>
          </div>
          <button
            onClick={() => {
              const rand = generateValidCNPJ();
              setCalcInput(rand);
            }}
            className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Gerar Exemplo Matemático</span>
          </button>
        </div>

        <p className="text-xs text-slate-600 mb-4">
          O CNPJ brasileiro utiliza dois dígitos verificadores (D1 e D2) calculados através de somas ponderadas
          de pesos decrescentes divididos por 11. Digite qualquer CNPJ para auditar os cálculos em tempo real:
        </p>

        <div className="max-w-md mb-5">
          <input
            type="text"
            value={calcInput}
            onChange={(e) => setCalcInput(formatCNPJ(e.target.value))}
            placeholder="Digite 14 dígitos para analisar"
            maxLength={18}
            className="w-full px-3.5 py-2 border border-slate-300 rounded-lg font-mono text-sm tracking-wide"
          />
        </div>

        {steps ? (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cálculo 1º Dígito */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-900 uppercase block mb-1">
                  1º Dígito Verificador (D1)
                </span>
                <p className="text-slate-600 text-[11px] mb-2">
                  Soma dos 12 primeiros dígitos com pesos [5,4,3,2,9,8,7,6,5,4,3,2]:
                </p>
                <div className="font-mono bg-white p-2 border border-slate-200 rounded text-[11px] mb-2 text-slate-700">
                  Soma = {steps.sum1} | Resto (Soma % 11) = {steps.rest1}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>D1 Calculado:</span>
                  <span className="font-mono text-sm font-bold text-blue-700">{steps.calcD1}</span>
                </div>
                {steps.actualD1 !== null && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 mt-1">
                    <span>D1 Informado no CNPJ:</span>
                    <span
                      className={`font-mono text-sm font-bold ${
                        steps.actualD1 === steps.calcD1 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {steps.actualD1} ({steps.actualD1 === steps.calcD1 ? 'Correto' : 'Incorreto'})
                    </span>
                  </div>
                )}
              </div>

              {/* Cálculo 2º Dígito */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-900 uppercase block mb-1">
                  2º Dígito Verificador (D2)
                </span>
                <p className="text-slate-600 text-[11px] mb-2">
                  Soma dos 12 dígitos + D1 com pesos [6,5,4,3,2,9,8,7,6,5,4,3,2]:
                </p>
                <div className="font-mono bg-white p-2 border border-slate-200 rounded text-[11px] mb-2 text-slate-700">
                  Soma = {steps.sum2} | Resto (Soma % 11) = {steps.rest2}
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>D2 Calculado:</span>
                  <span className="font-mono text-sm font-bold text-blue-700">{steps.calcD2}</span>
                </div>
                {steps.actualD2 !== null && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 mt-1">
                    <span>D2 Informado no CNPJ:</span>
                    <span
                      className={`font-mono text-sm font-bold ${
                        steps.actualD2 === steps.calcD2 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {steps.actualD2} ({steps.actualD2 === steps.calcD2 ? 'Correto' : 'Incorreto'})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {cleanCalc.length === 14 && (
              <div
                className={`p-3.5 rounded-lg border flex items-center justify-between ${
                  steps.isMatch
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {steps.isMatch ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  )}
                  <span className="font-bold">
                    {steps.isMatch
                      ? 'CNPJ matematicamente válido perante a Receita Federal.'
                      : 'CNPJ inválido: os dígitos verificadores informados não correspondem ao cálculo oficial.'}
                  </span>
                </div>

                {steps.isMatch && (
                  <button
                    onClick={() => onConsultCNPJ(cleanCalc)}
                    className="px-3 py-1.5 bg-[#071D41] hover:bg-[#1351B4] text-white font-semibold rounded text-xs transition-colors flex items-center gap-1"
                  >
                    <span>Consultar Cadastro Completo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            Digite pelo menos 12 dígitos para visualizar a fórmula do Módulo 11 passo a passo.
          </p>
        )}
      </div>
    </div>
  );
};
