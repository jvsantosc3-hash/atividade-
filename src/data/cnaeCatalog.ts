export interface CNAEItemInfo {
  codigo: string;
  descricao: string;
  setor: string;
  keywords: string[];
}

export const CNAE_CATALOG: CNAEItemInfo[] = [
  // Tecnologia & TI
  {
    codigo: '62.01-5-01',
    descricao: 'Desenvolvimento de programas de computador sob encomenda',
    setor: 'Tecnologia da Informação',
    keywords: ['software', 'programas', 'computador', 'programação', 'dev', 'ti', 'app', 'aplicativo', 'sistema'],
  },
  {
    codigo: '62.02-3-00',
    descricao: 'Desenvolvimento e licenciamento de programas de computador customizáveis',
    setor: 'Tecnologia da Informação',
    keywords: ['software', 'licenciamento', 'saas', 'ti', 'sistema'],
  },
  {
    codigo: '62.03-1-00',
    descricao: 'Desenvolvimento e licenciamento de programas de computador não-customizáveis',
    setor: 'Tecnologia da Informação',
    keywords: ['software', 'pacote', 'antivirus', 'jogos', 'games'],
  },
  {
    codigo: '62.09-1-00',
    descricao: 'Suporte técnico, manutenção e outros serviços em tecnologia da informação',
    setor: 'Tecnologia da Informação',
    keywords: ['suporte', 'helpdesk', 'manutenção', 'rede', 'hardware', 'ti'],
  },
  {
    codigo: '63.11-9-00',
    descricao: 'Tratamento de dados, provedores de serviços de aplicação e serviços de hospedagem na internet',
    setor: 'Tecnologia da Informação',
    keywords: ['cloud', 'hospedagem', 'data center', 'banco de dados', 'servidores'],
  },
  {
    codigo: '63.19-4-00',
    descricao: 'Portais, provedores de conteúdo e outros serviços de informação na internet',
    setor: 'Tecnologia da Informação',
    keywords: ['portal', 'conteúdo', 'marketplace', 'plataforma', 'site', 'ecommerce'],
  },

  // Alimentação & Bebidas
  {
    codigo: '56.11-2-01',
    descricao: 'Restaurantes e similares',
    setor: 'Alimentação',
    keywords: ['restaurante', 'comida', 'refeição', 'gastronomia', 'almoço', 'jantar', 'pizzaria'],
  },
  {
    codigo: '56.11-2-03',
    descricao: 'Lanchonetes, casas de chá, de sucos e similares',
    setor: 'Alimentação',
    keywords: ['lanchonete', 'hamburgueria', 'café', 'pastelaria', 'sucos'],
  },
  {
    codigo: '56.20-1-04',
    descricao: 'Fornecimento de alimentos preparados preponderantemente para consumo domiciliar',
    setor: 'Alimentação',
    keywords: ['delivery', 'marmita', 'alimentos', 'comida caseira'],
  },
  {
    codigo: '10.91-1-02',
    descricao: 'Fabricação de produtos de padaria e confeitaria com predominância de produção própria',
    setor: 'Alimentação',
    keywords: ['padaria', 'pão', 'confeitaria', 'bolos', 'doces'],
  },

  // Comércio Varejista
  {
    codigo: '47.11-3-02',
    descricao: 'Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - supermercados',
    setor: 'Comércio',
    keywords: ['supermercado', 'mercado', 'mercearia', 'varejo', 'compras'],
  },
  {
    codigo: '47.71-7-01',
    descricao: 'Comércio varejista de produtos farmacêuticos, sem manipulação de fórmulas',
    setor: 'Comércio',
    keywords: ['farmácia', 'drogaria', 'remédios', 'medicamentos'],
  },
  {
    codigo: '47.53-9-00',
    descricao: 'Comércio varejista especializado de eletrodomésticos e equipamentos de áudio e vídeo',
    setor: 'Comércio',
    keywords: ['eletrodomésticos', 'eletrônicos', 'tv', 'geladeira', 'som'],
  },
  {
    codigo: '47.81-0-00',
    descricao: 'Comércio varejista de artigos do vestuário e acessórios',
    setor: 'Comércio',
    keywords: ['roupas', 'moda', 'vestuário', 'loja', 'acessórios', 'calçados'],
  },
  {
    codigo: '47.51-2-01',
    descricao: 'Comércio varejista especializado de equipamentos e suprimentos de informática',
    setor: 'Comércio',
    keywords: ['informática', 'computador', 'notebook', 'periféricos', 'mouse'],
  },

  // Saúde & Medicina
  {
    codigo: '86.10-1-01',
    descricao: 'Atividades de atendimento hospitalar, exceto pronto-socorro e unidades para atendimento de urgências',
    setor: 'Saúde',
    keywords: ['hospital', 'internação', 'médico', 'cirurgia', 'saúde'],
  },
  {
    codigo: '86.30-5-03',
    descricao: 'Atividade médica ambulatorial restrita a consultas',
    setor: 'Saúde',
    keywords: ['clínica', 'consultório', 'médico', 'consultas', 'doutor'],
  },
  {
    codigo: '86.40-2-02',
    descricao: 'Laboratórios de análises clínicas',
    setor: 'Saúde',
    keywords: ['laboratório', 'exames', 'sangue', 'análises clínicas'],
  },
  {
    codigo: '86.50-0-04',
    descricao: 'Atividades de fisioterapia',
    setor: 'Saúde',
    keywords: ['fisioterapia', 'reabilitação', 'fisioterapeuta'],
  },
  {
    codigo: '86.30-5-04',
    descricao: 'Atividade odontológica',
    setor: 'Saúde',
    keywords: ['dentista', 'odontologia', 'dentes', 'implante'],
  },

  // Serviços Profissionais & Financeiros
  {
    codigo: '69.20-6-01',
    descricao: 'Atividades de contabilidade',
    setor: 'Serviços Profissionais',
    keywords: ['contabilidade', 'contador', 'fiscal', 'tributário', 'balanço'],
  },
  {
    codigo: '69.11-7-01',
    descricao: 'Serviços advocatícios',
    setor: 'Serviços Profissionais',
    keywords: ['advogado', 'advocacia', 'jurídico', 'direito', 'lei'],
  },
  {
    codigo: '71.12-0-00',
    descricao: 'Serviços de engenharia',
    setor: 'Serviços Profissionais',
    keywords: ['engenharia', 'engenheiro', 'projetos', 'obras', 'plantas'],
  },
  {
    codigo: '73.11-4-00',
    descricao: 'Agências de publicidade',
    setor: 'Serviços Profissionais',
    keywords: ['publicidade', 'propaganda', 'marketing', 'agência', 'anúncios'],
  },
  {
    codigo: '64.22-1-00',
    descricao: 'Bancos múltiplos, com carteira comercial',
    setor: 'Serviços Financeiros',
    keywords: ['banco', 'financeiro', 'crédito', 'conta', 'investimentos'],
  },
  {
    codigo: '66.13-4-00',
    descricao: 'Administração de cartões de crédito',
    setor: 'Serviços Financeiros',
    keywords: ['cartão', 'crédito', 'fintech', 'pagamentos'],
  },

  // Logística & Transporte
  {
    codigo: '49.30-2-02',
    descricao: 'Transporte rodoviário de carga, exceto produtos perigosos e mudanças, intermunicipal, interestadual e internacional',
    setor: 'Transporte & Logística',
    keywords: ['transporte', 'carga', 'caminhão', 'logística', 'frete', 'entrega'],
  },
  {
    codigo: '52.29-0-99',
    descricao: 'Outras atividades auxiliares dos transportes terrestres não especificadas anteriormente',
    setor: 'Transporte & Logística',
    keywords: ['logística', 'armazém', 'entreposto', 'distribuição'],
  },

  // Construção & Indústria
  {
    codigo: '41.20-4-00',
    descricao: 'Construção de edifícios',
    setor: 'Construção Civil',
    keywords: ['construção', 'edifícios', 'construtora', 'prédios', 'obras'],
  },
  {
    codigo: '19.21-7-00',
    descricao: 'Fabricação de produtos do refino de petróleo',
    setor: 'Indústria & Energia',
    keywords: ['petróleo', 'refino', 'combustíveis', 'gasolina', 'óleo'],
  },
];

export const CNAE_SECTORS = [
  'Todos os Setores',
  'Tecnologia da Informação',
  'Comércio',
  'Alimentação',
  'Saúde',
  'Serviços Profissionais',
  'Serviços Financeiros',
  'Transporte & Logística',
  'Construção Civil',
  'Indústria & Energia',
];
