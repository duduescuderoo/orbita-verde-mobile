export const lightColors = {
  fundo: '#F2F2F7',
  card: '#FFFFFF',
  cardBorda: '#E5E5EA',
  verde: '#34C759',
  verdeEscuro: '#248A3D',
  verdeMedio: '#30B558',
  texto: '#1C1C1E',
  textoSub: '#8E8E93',
  perigo: '#FF3B30',
  alerta: '#FF9500',
  normal: '#34C759',
  branco: '#FFFFFF',
  input: '#F2F2F7',
  erro: '#FF3B30',
  separador: '#E5E5EA',
  azul: '#007AFF',
  mapa: '#E4EDE4',
  mapaGrid: '#C5D9C5',
  mapaRua: '#F5F0E8',
  mapaParque: '#D4EAD4',
  overlay: 'rgba(0,0,0,0.04)',
}

export const darkColors = {
  fundo: '#0A0A0F',
  card: '#1C1C1E',
  cardBorda: '#2C2C2E',
  verde: '#30D158',
  verdeEscuro: '#34C759',
  verdeMedio: '#2DBE52',
  texto: '#FFFFFF',
  textoSub: '#8E8E93',
  perigo: '#FF453A',
  alerta: '#FF9F0A',
  normal: '#30D158',
  branco: '#FFFFFF',
  input: '#2C2C2E',
  erro: '#FF453A',
  separador: '#2C2C2E',
  azul: '#0A84FF',
  mapa: '#1A2420',
  mapaGrid: '#243028',
  mapaRua: '#2A2820',
  mapaParque: '#1E2E1E',
  overlay: 'rgba(0,0,0,0.3)',
}

export type AppColors = typeof lightColors

export const COLORS = lightColors

export const nivelCor = (nivel: string, colors: AppColors = lightColors) => {
  if (nivel === 'PERIGO') return colors.perigo
  if (nivel === 'ALERTA') return colors.alerta
  return colors.normal
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

export const sombra = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 3,
}

export const sombraEscura = {}

export const getSombra = (isDark: boolean) => isDark ? sombraEscura : sombra
