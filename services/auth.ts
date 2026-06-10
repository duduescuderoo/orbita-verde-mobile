import AsyncStorage from '@react-native-async-storage/async-storage'

const KEY_USER = '@usuario_logado'
const KEY_USUARIOS = '@usuarios'

export interface Usuario {
  id: string
  nome: string
  email: string
  senha: string
}

export const registrarUsuario = async (nome: string, email: string, senha: string): Promise<{ ok: boolean; erro?: string }> => {
  const raw = await AsyncStorage.getItem(KEY_USUARIOS)
  const lista: Usuario[] = raw ? JSON.parse(raw) : []
  if (lista.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, erro: 'E-mail já cadastrado' }
  }
  const novo: Usuario = { id: Date.now().toString(), nome, email, senha }
  await AsyncStorage.setItem(KEY_USUARIOS, JSON.stringify([...lista, novo]))
  await AsyncStorage.setItem(KEY_USER, JSON.stringify(novo))
  return { ok: true }
}

export const loginUsuario = async (email: string, senha: string): Promise<{ ok: boolean; erro?: string }> => {
  const raw = await AsyncStorage.getItem(KEY_USUARIOS)
  const lista: Usuario[] = raw ? JSON.parse(raw) : []
  const usuario = lista.find(u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha)
  if (!usuario) return { ok: false, erro: 'E-mail ou senha incorretos' }
  await AsyncStorage.setItem(KEY_USER, JSON.stringify(usuario))
  return { ok: true }
}

export const getUsuarioLogado = async (): Promise<Usuario | null> => {
  const raw = await AsyncStorage.getItem(KEY_USER)
  return raw ? JSON.parse(raw) : null
}

export const logout = async () => {
  await AsyncStorage.removeItem(KEY_USER)
}
