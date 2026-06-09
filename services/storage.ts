import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Alerta } from '@/types'

const ALERTAS_KEY = '@orbitaverde:alertas'

const alertasIniciais: Alerta[] = [
  {
    id: '1',
    tipo: 'QUEIMADA',
    descricao: 'Foco de incêndio detectado por satélite TERRA na região amazônica. Área estimada de 120 hectares afetados.',
    nivel: 'PERIGO',
    latitude: -3.4653,
    longitude: -62.2159,
    criadoEm: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    resolvido: false,
  },
  {
    id: '2',
    tipo: 'FLARE_SOLAR',
    descricao: 'Erupção solar classe M detectada pelo GOES-16. Potencial interferência em sistemas de comunicação e navegação.',
    nivel: 'ALERTA',
    latitude: 0,
    longitude: 0,
    criadoEm: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    resolvido: false,
  },
  {
    id: '3',
    tipo: 'DESMATAMENTO',
    descricao: 'Redução de cobertura vegetal identificada pelo satélite CBERS-4A no bioma Cerrado.',
    nivel: 'ALERTA',
    latitude: -15.827,
    longitude: -47.9218,
    criadoEm: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    resolvido: false,
  },
  {
    id: '4',
    tipo: 'QUEIMADA',
    descricao: 'Queimada controlada monitorada. Sem risco de expansão identificado.',
    nivel: 'NORMAL',
    latitude: -10.3333,
    longitude: -53.2,
    criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    resolvido: true,
  },
]

export const inicializarDados = async (): Promise<void> => {
  const existentes = await AsyncStorage.getItem(ALERTAS_KEY)
  if (!existentes) {
    await AsyncStorage.setItem(ALERTAS_KEY, JSON.stringify(alertasIniciais))
  }
}

export const listarAlertas = async (): Promise<Alerta[]> => {
  try {
    const dados = await AsyncStorage.getItem(ALERTAS_KEY)
    if (!dados) return alertasIniciais
    const alertas: Alerta[] = JSON.parse(dados)
    return alertas.sort(
      (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
    )
  } catch {
    return alertasIniciais
  }
}

export const buscarAlerta = async (id: string): Promise<Alerta | null> => {
  const alertas = await listarAlertas()
  return alertas.find((a) => a.id === id) ?? null
}

export const salvarAlerta = async (alerta: Omit<Alerta, 'id' | 'criadoEm' | 'resolvido'>): Promise<Alerta> => {
  const alertas = await listarAlertas()
  const novo: Alerta = {
    ...alerta,
    id: Date.now().toString(),
    criadoEm: new Date().toISOString(),
    resolvido: false,
  }
  await AsyncStorage.setItem(ALERTAS_KEY, JSON.stringify([novo, ...alertas]))
  return novo
}

export const resolverAlerta = async (id: string): Promise<void> => {
  const alertas = await listarAlertas()
  const atualizados = alertas.map((a) =>
    a.id === id ? { ...a, resolvido: true } : a
  )
  await AsyncStorage.setItem(ALERTAS_KEY, JSON.stringify(atualizados))
}
