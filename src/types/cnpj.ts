export interface CNAEItem {
  codigo: string;
  descricao: string;
}

export interface QSAPartner {
  nome_socio: string;
  qualificacao_socio: string;
  cnpj_cpf_do_socio?: string;
  faixa_etaria?: string;
  data_entrada_sociedade?: string;
  representante_legal?: string;
  qualificacao_representante_legal?: string;
}

export interface SimplesNacionalInfo {
  optante: boolean;
  data_opcao?: string;
  data_exclusao?: string;
  mei: boolean;
  data_opcao_mei?: string;
  data_exclusao_mei?: string;
}

export interface CNPJData {
  cnpj: string;
  cnpj_formatado: string;
  razao_social: string;
  nome_fantasia: string;
  tipo: 'MATRIZ' | 'FILIAL';
  data_inicio_atividade: string;
  situacao_cadastral: 'ATIVA' | 'BAIXADA' | 'SUSPENSA' | 'INAPTA' | 'NULA';
  data_situacao_cadastral: string;
  motivo_situacao_cadastral: string;
  situacao_especial: string;
  data_situacao_especial: string;
  porte: string;
  natureza_juridica: {
    codigo: string;
    descricao: string;
  };
  cnae_fiscal: CNAEItem;
  cnaes_secundarios: CNAEItem[];
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  municipio: string;
  uf: string;
  ddd_telefone_1: string;
  ddd_telefone_2?: string;
  email: string;
  ente_federativo_responsavel: string;
  capital_social: number;
  qsa: QSAPartner[];
  simples?: SimplesNacionalInfo;
  
  // Metadados do Comprovante emitido
  codigo_controle?: string;
  data_emissao?: string;
  hora_emissao?: string;

  // Metadados de Integração BrasilAPI
  api_source?: 'BrasilAPI' | 'Base Local' | 'Sintetizador Cadastral';
  api_response_time_ms?: number;
  raw_brasilapi?: any;
}

export interface QueryHistoryItem {
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  uf: string;
  municipio: string;
  situacao_cadastral: string;
  consultado_em: string;
  favorito: boolean;
}
