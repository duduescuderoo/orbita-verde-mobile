import { useState } from 'react'
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/contexts/ThemeContext'
import { registrarUsuario } from '@/services/auth'

export default function RegistroScreen() {
  const router = useRouter()
  const { colors, sombra } = useTheme()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const validar = () => {
    if (!nome.trim()) return 'Informe seu nome'
    if (!email.trim() || !email.includes('@')) return 'E-mail inválido'
    if (senha.length < 6) return 'Senha deve ter pelo menos 6 caracteres'
    if (senha !== confirmar) return 'Senhas não conferem'
    return ''
  }

  const registrar = async () => {
    const v = validar()
    if (v) { setErro(v); return }
    setErro('')
    setCarregando(true)
    const res = await registrarUsuario(nome.trim(), email.trim(), senha)
    setCarregando(false)
    if (res.ok) {
      router.replace('/(tabs)')
    } else {
      setErro(res.erro ?? 'Erro ao cadastrar')
    }
  }

  const s = makeStyles(colors, sombra as any)

  return (
    <KeyboardAvoidingView style={[s.flex, { backgroundColor: colors.fundo }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <TouchableOpacity style={s.voltar} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.texto} />
        </TouchableOpacity>

        <View style={s.topo}>
          <Text style={[s.titulo, { color: colors.texto }]}>Criar conta</Text>
          <Text style={[s.subtitulo, { color: colors.textoSub }]}>Junte-se ao monitoramento ambiental</Text>
        </View>

        <View style={[s.card, { backgroundColor: colors.card }, sombra as any]}>
          {[
            { label: 'Nome completo', valor: nome, set: setNome, icone: 'person-outline', placeholder: 'Seu nome', tipo: 'default' },
            { label: 'E-mail', valor: email, set: setEmail, icone: 'mail-outline', placeholder: 'seu@email.com', tipo: 'email-address' },
          ].map(({ label, valor, set, icone, placeholder, tipo }) => (
            <View style={s.campo} key={label}>
              <Text style={[s.label, { color: colors.textoSub }]}>{label}</Text>
              <View style={[s.inputBox, { backgroundColor: colors.input, borderColor: colors.cardBorda }]}>
                <Ionicons name={icone as any} size={18} color={colors.textoSub} />
                <TextInput
                  style={[s.input, { color: colors.texto }]}
                  placeholder={placeholder}
                  placeholderTextColor={colors.textoSub}
                  value={valor}
                  onChangeText={set}
                  keyboardType={tipo as any}
                  autoCapitalize={tipo === 'default' ? 'words' : 'none'}
                />
              </View>
            </View>
          ))}

          <View style={s.campo}>
            <Text style={[s.label, { color: colors.textoSub }]}>Senha</Text>
            <View style={[s.inputBox, { backgroundColor: colors.input, borderColor: colors.cardBorda }]}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textoSub} />
              <TextInput
                style={[s.input, { color: colors.texto }]}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={colors.textoSub}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!verSenha}
              />
              <TouchableOpacity onPress={() => setVerSenha(!verSenha)}>
                <Ionicons name={verSenha ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textoSub} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={s.campo}>
            <Text style={[s.label, { color: colors.textoSub }]}>Confirmar senha</Text>
            <View style={[s.inputBox, {
              backgroundColor: colors.input,
              borderColor: confirmar && confirmar !== senha ? colors.erro : colors.cardBorda
            }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.textoSub} />
              <TextInput
                style={[s.input, { color: colors.texto }]}
                placeholder="Repita a senha"
                placeholderTextColor={colors.textoSub}
                value={confirmar}
                onChangeText={setConfirmar}
                secureTextEntry={!verSenha}
              />
              {confirmar.length > 0 && (
                <Ionicons
                  name={confirmar === senha ? 'checkmark-circle' : 'close-circle'}
                  size={18}
                  color={confirmar === senha ? colors.verde : colors.erro}
                />
              )}
            </View>
          </View>

          {!!erro && (
            <View style={s.erroBox}>
              <Ionicons name="alert-circle-outline" size={15} color={colors.erro} />
              <Text style={[s.erroTexto, { color: colors.erro }]}>{erro}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[s.botao, { backgroundColor: colors.verdeEscuro }, carregando && { opacity: 0.7 }]}
            onPress={registrar} disabled={carregando} activeOpacity={0.85}
          >
            {carregando
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={s.botaoTexto}>Criar conta</Text>
            }
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.back()} style={s.link}>
          <Text style={[s.linkTexto, { color: colors.textoSub }]}>Já tem conta? <Text style={{ color: colors.verdeEscuro, fontWeight: '700' }}>Entrar</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const makeStyles = (colors: any, sombra: any) => StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 24, paddingTop: 60, paddingBottom: 48 },
  voltar: { width: 40, height: 40, justifyContent: 'center', marginBottom: 8 },
  topo: { marginBottom: 28 },
  titulo: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subtitulo: { fontSize: 14, marginTop: 4 },
  card: { borderRadius: 20, padding: 24, marginBottom: 16 },
  campo: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 8, letterSpacing: 0.3 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 12, padding: 14, borderWidth: 1.5,
  },
  input: { flex: 1, fontSize: 15 },
  erroBox: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  erroTexto: { fontSize: 13 },
  botao: { borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 4 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { alignItems: 'center', padding: 12 },
  linkTexto: { fontSize: 14 },
})
