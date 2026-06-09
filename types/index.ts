export type NivelAlerta = 'NORMAL' | 'ALERTA' | 'PERIGO'
export type TipoAlerta = 'QUEIMADA' | 'FLARE_SOLAR' | 'DESMATAMENTO' | 'OUTRO'

export interface Alerta {
  id: string
  tipo: TipoAlerta
  descricao: string
  nivel: NivelAlerta
  latitude: number
  longitude: number
  criadoEm: string
  resolvido: boolean
}

export interface FormAlerta {
  tipo: TipoAlerta | ''
  descricao: string
  nivel: NivelAlerta | ''
}

export interface FormErrors {
  tipo?: string
  descricao?: string
  nivel?: string
}
