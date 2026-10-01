/**
 * Utilitários para validação, formatação e emissão de CNPJ
 */

/**
 * Remove pontuações e caracteres não numéricos
 */
export function cleanCNPJ(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Aplica máscara de CNPJ (00.000.000/0000-00)
 */
export function formatCNPJ(value: string): string {
  const digits = cleanCNPJ(value).slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

/**
 * Validação algorítmica de CNPJ brasileiro (Módulo 11 com pesos oficiais)
 */
export function validateCNPJ(cnpjInput: string): boolean {
  const cnpj = cleanCNPJ(cnpjInput);

  if (cnpj.length !== 14) return false;

  // Elimina sequências conhecidas de dígitos repetidos
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  // Validação do 1º dígito verificador
  let tamanho = 12;
  let numeros = cnpj.substring(0, tamanho);
  let soma = 0;
  let pos = 5;

  for (let i = 0; i < tamanho; i++) {
    soma += parseInt(numeros.charAt(i), 10) * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(cnpj.charAt(12), 10)) {
    return false;
  }

  // Validação do 2º dígito verificador
  tamanho = 13;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = 6;

  for (let i = 0; i < tamanho; i++) {
    soma += parseInt(numeros.charAt(i), 10) * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(cnpj.charAt(13), 10)) {
    return false;
  }

  return true;
}

/**
 * Gera um CNPJ válido aleatório com dígitos verificadores matematicamente corretos
 */
export function generateValidCNPJ(): string {
  const n: number[] = [];
  for (let i = 0; i < 8; i++) {
    n.push(Math.floor(Math.random() * 10));
  }
  // 0001 para matriz
  n.push(0, 0, 0, 1);

  // Calcula D1
  let soma = 0;
  let pos = 5;
  for (let i = 0; i < 12; i++) {
    soma += n[i] * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }
  const d1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  n.push(d1);

  // Calcula D2
  soma = 0;
  pos = 6;
  for (let i = 0; i < 13; i++) {
    soma += n[i] * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }
  const d2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  n.push(d2);

  return formatCNPJ(n.join(''));
}

/**
 * Gera um Código de Controle do Comprovante (16 caracteres alfanuméricos agrupados em blocos de 4)
 * Exemplo: 8B9F.2C71.E40A.551B
 */
export function generateCertificateControlCode(cnpj: string, date: Date = new Date()): string {
  const clean = cleanCNPJ(cnpj);
  const seed = `${clean}_${date.getTime()}_RFB`;
  
  // Hash simples e determinístico para formar 16 caracteres hex
  let hash1 = 0;
  let hash2 = 5381;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash1 = ((hash1 << 5) - hash1) + char;
    hash1 = hash1 & hash1;
    hash2 = ((hash2 << 5) + hash2) + char;
    hash2 = hash2 & hash2;
  }

  const h1 = Math.abs(hash1).toString(16).padStart(8, '0').toUpperCase().slice(0, 8);
  const h2 = Math.abs(hash2).toString(16).padStart(8, '0').toUpperCase().slice(0, 8);
  const combined = (h1 + h2).padEnd(16, 'A').slice(0, 16);

  return `${combined.slice(0, 4)}.${combined.slice(4, 8)}.${combined.slice(8, 12)}.${combined.slice(12, 16)}`;
}

/**
 * Formata moeda em Real (BRL)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata data no padrão brasileiro (DD/MM/AAAA)
 */
export function formatDateBR(dateStr?: string): string {
  if (!dateStr) return 'Não informada';
  
  // Trata formato YYYY-MM-DD
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1];
      const day = parts[2].slice(0, 2);
      return `${day}/${month}/${year}`;
    }
  }

  // Trata formato DD/MM/AAAA
  if (dateStr.includes('/')) {
    return dateStr;
  }

  // Trata timestamp numérico
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  }

  return dateStr;
}

/**
 * Retorna o tempo decorrido desde a data de abertura (ex: "18 anos e 5 meses")
 */
export function calculateActivityTime(dateStr?: string): string {
  if (!dateStr) return '';
  let date: Date;

  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-').map(Number);
    date = new Date(y, m - 1, d);
  } else if (dateStr.includes('/')) {
    const [d, m, y] = dateStr.split('/').map(Number);
    date = new Date(y, m - 1, d);
  } else {
    date = new Date(dateStr);
  }

  if (isNaN(date.getTime())) return '';

  const now = new Date();
  let years = now.getFullYear() - date.getFullYear();
  let months = now.getMonth() - date.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years === 0 && months === 0) {
    return 'Menos de 1 mês';
  }

  const parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`);

  return parts.join(' e ');
}
