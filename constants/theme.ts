export const COLORS = {
  fundo: '#0A1628',
  card: '#1A2640',
  cardBorda: '#243352',
  verde: '#4CAF50',
  verdeEscuro: '#2E7D32',
  verdeMedio: '#388E3C',
  texto: '#ECEFF1',
  textoSub: '#90A4AE',
  perigo: '#EF5350',
  alerta: '#FF9800',
  normal: '#4CAF50',
  branco: '#FFFFFF',
  input: '#243352',
  erro: '#EF5350',
}

export const nivelCor = (nivel: string) => {
  if (nivel === 'PERIGO') return COLORS.perigo
  if (nivel === 'ALERTA') return COLORS.alerta
  return COLORS.normal
}

export const nivelEmoji = (nivel: string) => {
  if (nivel === 'PERIGO') return '🔴'
  if (nivel === 'ALERTA') return '🟠'
  return '🟢'
}

export const tipoEmoji = (tipo: string) => {
  if (tipo === 'QUEIMADA') return '🔥'
  if (tipo === 'FLARE_SOLAR') return '☀️'
  if (tipo === 'DESMATAMENTO') return '🌳'
  return '⚠️'
}
