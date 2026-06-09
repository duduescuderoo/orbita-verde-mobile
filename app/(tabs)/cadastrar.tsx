import { useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, nivelCor, tipoEmoji } from '@/constants/theme'
import { salvarAlerta } from '@/services/storage'
import type { FormAlerta, FormErrors, NivelAlerta, TipoAlerta } from '@/types'

const TIPOS: TipoAlerta[] = ['QUEIMADA', 'FLARE_SOLAR', 'DESMATAMENTO', 'OUTRO']
const NIVEIS: NivelAlerta[] = ['NORMAL', 'ALERTA', 'PERIGO']

const validar = (form: FormAlerta): FormErrors => {
  const erros: FormErrors = {}
  if (!form.tipo) erros.tipo = 'Selecione o tipo de alerta'
  if (!form.nivel) erros.nivel = 'Selecione o nível de risco'
  if (!form.descricao.trim()) erros.descricao = 'A descrição é obrigatória'
  else if (form.descricao.trim().length < 10) erros.descricao = 'Descrição muito curta (mínimo 10 caracteres)'
  return erros
}

export default function CadastrarScreen() {
  const router = useRouter()
  const [form, setForm] = useState<FormAlerta>({ tipo: '', descricao: '', nivel: '' })
  const [erros, setErros] = useState<FormErrors>({})
  const [lat, setLat] = useState<number | null>(null)
  const [lon, setLon] = useState<number | null>(null)
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'ok' | 'erro' | 'negado'>('idle')
  const [enviando, setEnviando] = useState(false)

  const obterGPS = async () => {
    setGpsStatus('loading')
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      setGpsStatus('negado')
      return
    }
    try {
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
      setLat(pos.coords.latitude)
      setLon(pos.coords.longitude)
      setGpsStatus('ok')
    } catch {
      setGpsStatus('erro')
    }
  }

  const enviar = async () => {
    const novosErros = validar(form)
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }
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
      setErros({ descricao: 'Erro ao salvar alerta. Tente novamente.' })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Registrar Alerta</Text>
      <Text style={styles.subtitulo}>Informe uma ocorrência ambiental detectada</Text>

      <Text style={styles.label}>Tipo de Alerta *</Text>
      <View style={styles.opcoes}>
        {TIPOS.map((t) => (
          <Pressable
            key={t}
            style={[styles.opcao, form.tipo === t && styles.opcaoSelecionada]}
            onPress={() => { setForm({ ...form, tipo: t }); setErros({ ...erros, tipo: undefined }) }}
          >
            <Text style={[styles.opcaoTexto, form.tipo === t && styles.opcaoTextoSelecionado]}>
              {tipoEmoji(t)} {t.replace('_', ' ')}
            </Text>
          </Pressable>
        ))}
      </View>
      {erros.tipo && <Text style={styles.erro}>⚠️ {erros.tipo}</Text>}

      <Text style={styles.label}>Nível de Risco *</Text>
      <View style={styles.opcoes}>
        {NIVEIS.map((n) => (
          <Pressable
            key={n}
            style={[
              styles.opcao,
              form.nivel === n && { backgroundColor: nivelCor(n) + '22', borderColor: nivelCor(n) },
            ]}
            onPress={() => { setForm({ ...form, nivel: n }); setErros({ ...erros, nivel: undefined }) }}
          >
            <Text style={[styles.opcaoTexto, form.nivel === n && { color: nivelCor(n) }]}>
              {n}
            </Text>
          </Pressable>
        ))}
      </View>
      {erros.nivel && <Text style={styles.erro}>⚠️ {erros.nivel}</Text>}

      <Text style={styles.label}>Descrição *</Text>
      <TextInput
        style={[styles.input, erros.descricao && styles.inputErro]}
        placeholder="Descreva a ocorrência com detalhes..."
        placeholderTextColor={COLORS.textoSub}
        value={form.descricao}
        onChangeText={(v) => { setForm({ ...form, descricao: v }); setErros({ ...erros, descricao: undefined }) }}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        maxLength={500}
      />
      <Text style={styles.contador}>{form.descricao.length}/500</Text>
      {erros.descricao && <Text style={styles.erro}>⚠️ {erros.descricao}</Text>}

      <Text style={styles.label}>Localização GPS</Text>
      <View style={styles.gpsBox}>
        {gpsStatus === 'ok' ? (
          <View style={styles.gpsSucesso}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.verde} />
            <Text style={styles.gpsCoordenadas}>
              {lat?.toFixed(5)}, {lon?.toFixed(5)}
            </Text>
          </View>
        ) : (
          <View>
            {gpsStatus === 'negado' && (
              <Text style={styles.gpsErro}>⚠️ Permissão negada. Alerta será salvo sem coordenadas.</Text>
            )}
            {gpsStatus === 'erro' && (
              <Text style={styles.gpsErro}>⚠️ Não foi possível obter localização.</Text>
            )}
            <Pressable
              style={styles.gpsBotao}
              onPress={obterGPS}
              disabled={gpsStatus === 'loading'}
            >
              {gpsStatus === 'loading' ? (
                <ActivityIndicator color={COLORS.verde} size="small" />
              ) : (
                <Ionicons name="location-outline" size={16} color={COLORS.verde} />
              )}
              <Text style={styles.gpsBotaoTexto}>
                {gpsStatus === 'loading' ? 'Obtendo localização...' : 'Capturar coordenadas GPS'}
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      <Pressable
        style={({ pressed }) => [styles.botao, pressed && { opacity: 0.8 }, enviando && styles.botaoDesabilitado]}
        onPress={enviar}
        disabled={enviando}
      >
        {enviando ? (
          <ActivityIndicator color={COLORS.branco} size="small" />
        ) : (
          <Text style={styles.botaoTexto}>Registrar Alerta</Text>
        )}
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.fundo },
  conteudo: { padding: 16, paddingBottom: 48 },
  titulo: { fontSize: 22, fontWeight: '800', color: COLORS.texto, marginBottom: 4 },
  subtitulo: { fontSize: 13, color: COLORS.textoSub, marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.textoSub, marginBottom: 8, letterSpacing: 0.3 },
  opcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  opcao: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorda,
  },
  opcaoSelecionada: { backgroundColor: COLORS.verde + '22', borderColor: COLORS.verde },
  opcaoTexto: { color: COLORS.textoSub, fontSize: 13, fontWeight: '600' },
  opcaoTextoSelecionado: { color: COLORS.verde },
  input: {
    backgroundColor: COLORS.input,
    borderRadius: 12,
    padding: 14,
    color: COLORS.texto,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorda,
    minHeight: 100,
    marginBottom: 4,
  },
  inputErro: { borderColor: COLORS.erro },
  contador: { fontSize: 11, color: COLORS.textoSub, textAlign: 'right', marginBottom: 4 },
  erro: { color: COLORS.erro, fontSize: 12, marginBottom: 12 },
  gpsBox: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorda,
    marginBottom: 24,
  },
  gpsSucesso: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  gpsCoordenadas: { color: COLORS.verde, fontSize: 13, fontWeight: '600', fontFamily: 'monospace' },
  gpsErro: { color: COLORS.alerta, fontSize: 12, marginBottom: 8 },
  gpsBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  gpsBotaoTexto: { color: COLORS.verde, fontSize: 13, fontWeight: '600' },
  botao: {
    backgroundColor: COLORS.verdeMedio,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  botaoDesabilitado: { opacity: 0.6 },
  botaoTexto: { color: COLORS.branco, fontSize: 16, fontWeight: '700' },
})
