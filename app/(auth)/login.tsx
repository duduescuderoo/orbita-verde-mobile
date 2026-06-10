import { useState } from 'react'
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/contexts/ThemeContext'
import { loginUsuario } from '@/services/auth'

export default function LoginScreen() {
  const router = useRouter()
  const { colors, isDark, sombra } = useTheme()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const entrar = async () => {
    setErro('')
    if (!email.trim() || !senha) { setErro('Preencha todos os campos'); return }
    setCarregando(true)
    const res = await loginUsuario(email.trim(), senha)
    setCarregando(false)
    if (res.ok) {
      router.replace('/(tabs)')
    } else {
      setErro(res.erro ?? 'Erro ao entrar')
    }
  }

  const s = makeStyles(colors, isDark, sombra as any)

  return (
    <KeyboardAvoidingView style={[s.flex, { backgroundColor: colors.fundo }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <View style={s.topo}>
          <View style={s.logoCircle}>
            <Text style={s.logoEmoji}>🛰️</Text>
          </View>
          <Text style={s.titulo}>OrbitaVerde</Text>
          <Text style={s.subtitulo}>Monitoramento Ambiental Satelital</Text>
        </View>

        <View style={[s.card, sombra as any]}>
          <Text style={s.cardTitulo}>Entrar na conta</Text>

          <View style={s.campo}>
            <Text style={s.label}>E-mail</Text>
            <View style={[s.inputBox, { borderColor: erro && !email ? colors.erro : colors.cardBorda }]}>
              <Ionicons name="mail-outline" size={18} color={colors.textoSub} />
              <TextInput
                style={[s.input, { color: colors.texto }]}
                placeholder="seu@email.com"
                placeholderTextColor={colors.textoSub}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={s.campo}>
            <Text style={s.label}>Senha</Text>
            <View style={[s.inputBox, { borderColor: erro && !senha ? colors.erro : colors.cardBorda }]}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textoSub} />
              <TextInput
                style={[s.input, { color: colors.texto }]}
                placeholder="••••••••"
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

          {!!erro && (
            <View style={s.erroBox}>
              <Ionicons name="alert-circle-outline" size={15} color={colors.erro} />
              <Text style={[s.erroTexto, { color: colors.erro }]}>{erro}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[s.botao, { backgroundColor: colors.verdeEscuro }, carregando && { opacity: 0.7 }]}
            onPress={entrar} disabled={carregando} activeOpacity={0.85}
          >
            {carregando
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={s.botaoTexto}>Entrar</Text>
            }
          </TouchableOpacity>

          <View style={s.divider}>
            <View style={[s.linha, { backgroundColor: colors.separador }]} />
            <Text style={[s.dividerTexto, { color: colors.textoSub }]}>ou</Text>
            <View style={[s.linha, { backgroundColor: colors.separador }]} />
          </View>

          <TouchableOpacity
            style={[s.btnSecundario, { borderColor: colors.cardBorda }]}
            onPress={() => router.push('/(auth)/registro')} activeOpacity={0.8}
          >
            <Text style={[s.btnSecundarioTexto, { color: colors.verdeEscuro }]}>Criar nova conta</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={s.pular}>
          <Text style={[s.pularTexto, { color: colors.textoSub }]}>Explorar sem conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const makeStyles = (colors: any, isDark: boolean, sombra: any) => StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 24, paddingTop: 80, paddingBottom: 48 },
  topo: { alignItems: 'center', marginBottom: 36 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.verde + '20',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  logoEmoji: { fontSize: 36 },
  titulo: { fontSize: 28, fontWeight: '800', color: colors.texto, letterSpacing: -0.5 },
  subtitulo: { fontSize: 13, color: colors.textoSub, marginTop: 4 },
  card: {
    backgroundColor: colors.card, borderRadius: 20,
    padding: 24, marginBottom: 16,
  },
  cardTitulo: { fontSize: 20, fontWeight: '700', color: colors.texto, marginBottom: 20 },
  campo: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: colors.textoSub, marginBottom: 8, letterSpacing: 0.3 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.input, borderRadius: 12, padding: 14,
    borderWidth: 1.5,
  },
  input: { flex: 1, fontSize: 15 },
  erroBox: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  erroTexto: { fontSize: 13 },
  botao: { borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 4 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 16 },
  linha: { flex: 1, height: 1 },
  dividerTexto: { fontSize: 13 },
  btnSecundario: { borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1.5 },
  btnSecundarioTexto: { fontSize: 15, fontWeight: '700' },
  pular: { alignItems: 'center', padding: 12 },
  pularTexto: { fontSize: 14 },
})
