import { useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/contexts/ThemeContext'
import { nivelCor, tipoEmoji } from '@/constants/theme'
import { salvarAlerta } from '@/services/storage'
import type { FormAlerta, FormErrors, NivelAlerta, TipoAlerta } from '@/types'

const TIPOS: TipoAlerta[] = ['QUEIMADA', 'FLARE_SOLAR', 'DESMATAMENTO', 'OUTRO']
const NIVEIS: NivelAlerta[] = ['NORMAL', 'ALERTA', 'PERIGO']

const validar = (form: FormAlerta): FormErrors => {
  const e: FormErrors = {}
  if (!form.tipo) e.tipo = 'Selecione o tipo'
  if (!form.nivel) e.nivel = 'Selecione o nível'
  if (!form.descricao.trim()) e.descricao = 'Campo obrigatório'
  else if (form.descricao.trim().length < 10) e.descricao = 'Mínimo 10 caracteres'
  return e
}

export default function CadastrarScreen() {
  const router = useRouter()
  const { colors, sombra } = useTheme()
  const [form, setForm] = useState<FormAlerta>({ tipo: '', descricao: '', nivel: '' })
  const [erros, setErros] = useState<FormErrors>({})
  const [lat, setLat] = useState<number | null>(null)
  const [lon, setLon] = useState<number | null>(null)
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'ok' | 'erro' | 'negado'>('idle')
  const [enviando, setEnviando] = useState(false)

  const obterGPS = async () => {
    setGpsStatus('loading')
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') { setGpsStatus('negado'); return }
    try {
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
      setLat(pos.coords.latitude); setLon(pos.coords.longitude); setGpsStatus('ok')
    } catch { setGpsStatus('erro') }
  }

  const enviar = async () => {
    const novosErros = validar(form)
    if (Object.keys(novosErros).length > 0) { setErros(novosErros); return }
    setEnviando(true)
    try {
      const novo = await salvarAlerta({
        tipo: form.tipo as TipoAlerta,
        descricao: form.descricao.trim(),
        nivel: form.nivel as NivelAlerta,
        latitude: lat ?? 0,
        longitude: lon ?? 0,
      })
      router.replace({ pathname: '/confirmacao', params: { id: novo.id, tipo: novo.tipo, nivel: novo.nivel } })
    } catch {
      setErros({ descricao: 'Erro ao salvar. Tente novamente.' })
    } finally { setEnviando(false) }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.fundo }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ backgroundColor: colors.fundo }}
        contentContainerStyle={[styles.conteudo, { backgroundColor: colors.fundo }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.titulo, { color: colors.texto }]}>Registrar Alerta</Text>
        <Text style={[styles.subtitulo, { color: colors.textoSub }]}>Informe uma ocorrência ambiental</Text>

        {/* TIPO */}
        <Text style={[styles.label, { color: colors.textoSub }]}>Tipo de ocorrência</Text>
        <View style={styles.grid2}>
          {TIPOS.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.opcaoCard, { backgroundColor: colors.card }, sombra as any, form.tipo === t && { backgroundColor: colors.verdeEscuro }]}
              onPress={() => { setForm({ ...form, tipo: t }); setErros({ ...erros, tipo: undefined }) }}
              activeOpacity={0.7}
            >
              <Text style={styles.opcaoEmoji}>{tipoEmoji(t)}</Text>
              <Text style={[styles.opcaoTexto, { color: form.tipo === t ? '#fff' : colors.textoSub }]}>
                {t.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {erros.tipo && <Text style={[styles.erro, { color: colors.erro }]}>⚠ {erros.tipo}</Text>}

        {/* NÍVEL */}
        <Text style={[styles.label, { color: colors.textoSub }]}>Nível de risco</Text>
        <View style={styles.row}>
          {NIVEIS.map(n => {
            const cor = nivelCor(n, colors)
            const sel = form.nivel === n
            return (
              <TouchableOpacity
                key={n}
                style={[styles.nivelBtn, { backgroundColor: sel ? cor : colors.card }, sombra as any]}
                onPress={() => { setForm({ ...form, nivel: n }); setErros({ ...erros, nivel: undefined }) }}
                activeOpacity={0.7}
              >
                <View style={[styles.nivelDot, { backgroundColor: sel ? '#fff' : cor }]} />
                <Text style={[styles.nivelTexto, { color: sel ? '#fff' : cor }]}>{n}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        {erros.nivel && <Text style={[styles.erro, { color: colors.erro }]}>⚠ {erros.nivel}</Text>}

        {/* DESCRIÇÃO */}
        <Text style={[styles.label, { color: colors.textoSub }]}>Descrição</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.texto, borderColor: erros.descricao ? colors.erro : 'transparent' }, sombra as any]}
          placeholder="Descreva a ocorrência com detalhes..."
          placeholderTextColor={colors.textoSub}
          value={form.descricao}
          onChangeText={v => { setForm({ ...form, descricao: v }); setErros({ ...erros, descricao: undefined }) }}
          multiline numberOfLines={4} textAlignVertical="top" maxLength={500}
        />
        <View style={styles.inputFooter}>
          {erros.descricao
            ? <Text style={[styles.erro, { color: colors.erro }]}>⚠ {erros.descricao}</Text>
            : <View />}
          <Text style={[styles.contador, { color: colors.textoSub }]}>{form.descricao.length}/500</Text>
        </View>

        {/* GPS */}
        <Text style={[styles.label, { color: colors.textoSub }]}>Localização GPS</Text>
        <View style={[styles.gpsCard, { backgroundColor: colors.card }, sombra as any]}>
          {gpsStatus === 'ok' ? (
            <View style={styles.gpsOk}>
              <View style={[styles.gpsIconBox, { backgroundColor: colors.verde + '18' }]}>
                <Ionicons name="location" size={20} color={colors.verde} />
              </View>
              <View>
                <Text style={[styles.gpsOkLabel, { color: colors.textoSub }]}>Coordenadas capturadas</Text>
                <Text style={[styles.gpsOkValor, { color: colors.verde }]}>{lat?.toFixed(5)}, {lon?.toFixed(5)}</Text>
              </View>
            </View>
          ) : (
            <View style={{ gap: 8 }}>
              {gpsStatus === 'negado' && <Text style={[styles.gpsAviso, { color: colors.alerta }]}>Permissão negada — alerta salvo sem GPS</Text>}
              {gpsStatus === 'erro' && <Text style={[styles.gpsAviso, { color: colors.alerta }]}>Não foi possível obter localização</Text>}
              <TouchableOpacity style={styles.gpsBotao} onPress={obterGPS} disabled={gpsStatus === 'loading'} activeOpacity={0.7}>
                {gpsStatus === 'loading'
                  ? <ActivityIndicator color={colors.verdeEscuro} size="small" />
                  : <Ionicons name="locate-outline" size={18} color={colors.verdeEscuro} />
                }
                <Text style={[styles.gpsBotaoTexto, { color: colors.verdeEscuro }]}>
                  {gpsStatus === 'loading' ? 'Obtendo localização...' : 'Capturar coordenadas GPS'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* BOTÃO */}
        <TouchableOpacity
          style={[styles.botao, { backgroundColor: colors.verdeEscuro }, enviando && { opacity: 0.7 }]}
          onPress={enviar} disabled={enviando} activeOpacity={0.85}
        >
          {enviando
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={styles.botaoTexto}>Registrar Alerta</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  conteudo: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 48 },
  titulo: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  subtitulo: { fontSize: 14, marginTop: 4, marginBottom: 28 },
  label: { fontSize: 13, fontWeight: '700', marginBottom: 10, letterSpacing: 0.2 },
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  opcaoCard: { width: '47%', borderRadius: 14, padding: 14, alignItems: 'center', gap: 6 },
  opcaoEmoji: { fontSize: 24 },
  opcaoTexto: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
  row: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  nivelBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, borderRadius: 12,
  },
  nivelDot: { width: 8, height: 8, borderRadius: 4 },
  nivelTexto: { fontSize: 12, fontWeight: '700' },
  input: {
    borderRadius: 14, padding: 16,
    fontSize: 14, borderWidth: 1.5,
    minHeight: 110,
  },
  inputFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, marginBottom: 20 },
  contador: { fontSize: 11 },
  erro: { fontSize: 12, marginBottom: 16 },
  gpsCard: { borderRadius: 14, padding: 16, marginBottom: 28 },
  gpsOk: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  gpsIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  gpsOkLabel: { fontSize: 11, marginBottom: 2 },
  gpsOkValor: { fontSize: 13, fontWeight: '600', fontFamily: 'monospace' },
  gpsAviso: { fontSize: 12 },
  gpsBotao: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  gpsBotaoTexto: { fontSize: 14, fontWeight: '600' },
  botao: { borderRadius: 16, padding: 18, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
