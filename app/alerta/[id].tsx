import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, nivelCor, tipoEmoji } from '@/constants/theme'
import { buscarAlerta, resolverAlerta } from '@/services/storage'
import NivelBadge from '@/components/NivelBadge'
import type { Alerta } from '@/types'

const formatarData = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function DetalheAlertaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [alerta, setAlerta] = useState<Alerta | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [naoEncontrado, setNaoEncontrado] = useState(false)
  const [resolvendo, setResolvendo] = useState(false)

  useEffect(() => {
    const carregar = async () => {
      if (!id) { setNaoEncontrado(true); setCarregando(false); return }
      const dados = await buscarAlerta(id)
      if (!dados) setNaoEncontrado(true)
      else setAlerta(dados)
      setCarregando(false)
    }
    carregar()
  }, [id])

  const confirmarResolver = () => {
    Alert.alert(
      'Resolver alerta',
      'Confirma que esta ocorrência foi resolvida?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', style: 'destructive', onPress: resolver },
      ]
    )
  }

  const resolver = async () => {
    if (!alerta) return
    setResolvendo(true)
    await resolverAlerta(alerta.id)
    setAlerta({ ...alerta, resolvido: true })
    setResolvendo(false)
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={COLORS.verde} size="large" />
      </View>
    )
  }

  if (naoEncontrado || !alerta) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erroEmoji}>🔍</Text>
        <Text style={styles.erroTexto}>Alerta não encontrado</Text>
        <Text style={styles.erroSub}>ID: {id}</Text>
        <Pressable style={styles.voltarBotao} onPress={() => router.back()}>
          <Text style={styles.voltarTexto}>← Voltar</Text>
        </Pressable>
      </View>
    )
  }

  const cor = nivelCor(alerta.nivel)
  const temCoordenadas = alerta.latitude !== 0 || alerta.longitude !== 0

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <View style={[styles.headerCard, { borderColor: cor }]}>
        <Text style={styles.tipo}>
          {tipoEmoji(alerta.tipo)} {alerta.tipo.replace('_', ' ')}
        </Text>
        <NivelBadge nivel={alerta.nivel} />
        {alerta.resolvido && (
          <View style={styles.resolvidoBanner}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.verde} />
            <Text style={styles.resolvidoTexto}>Alerta resolvido</Text>
          </View>
        )}
      </View>

      <InfoRow label="ID do Alerta" valor={`#${alerta.id}`} icone="finger-print-outline" />
      <InfoRow label="Registrado em" valor={formatarData(alerta.criadoEm)} icone="time-outline" />

      <View style={styles.secao}>
        <Text style={styles.secaoLabel}>📝 Descrição</Text>
        <Text style={styles.descricao}>{alerta.descricao}</Text>
      </View>

      <View style={styles.secao}>
        <Text style={styles.secaoLabel}>📍 Localização GPS</Text>
        {temCoordenadas ? (
          <View style={styles.coordenadasBox}>
            <View style={styles.coordRow}>
              <Text style={styles.coordLabel}>Latitude</Text>
              <Text style={styles.coordValor}>{alerta.latitude.toFixed(6)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.coordRow}>
              <Text style={styles.coordLabel}>Longitude</Text>
              <Text style={styles.coordValor}>{alerta.longitude.toFixed(6)}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.semCoordenadas}>
            ⚠️ Coordenadas não disponíveis para este alerta
          </Text>
        )}
      </View>

      {!alerta.resolvido && (
        <Pressable
          style={({ pressed }) => [styles.botaoResolver, pressed && { opacity: 0.8 }, resolvendo && { opacity: 0.6 }]}
          onPress={confirmarResolver}
          disabled={resolvendo}
        >
          {resolvendo ? (
            <ActivityIndicator color={COLORS.branco} size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.branco} />
              <Text style={styles.botaoResolverTexto}>Marcar como Resolvido</Text>
            </>
          )}
        </Pressable>
      )}

      <Pressable style={styles.botaoVoltar} onPress={() => router.back()}>
        <Text style={styles.botaoVoltarTexto}>← Voltar para lista</Text>
      </Pressable>
    </ScrollView>
  )
}

function InfoRow({ label, valor, icone }: { label: string; valor: string; icone: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icone as any} size={16} color={COLORS.textoSub} />
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValor}>{valor}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.fundo },
  conteudo: { padding: 16, paddingBottom: 48 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.fundo, gap: 8 },
  erroEmoji: { fontSize: 48, marginBottom: 8 },
  erroTexto: { fontSize: 18, fontWeight: '700', color: COLORS.texto },
  erroSub: { fontSize: 13, color: COLORS.textoSub },
  voltarBotao: { marginTop: 16, padding: 12 },
  voltarTexto: { color: COLORS.verde, fontSize: 15, fontWeight: '600' },
  headerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 12,
    gap: 10,
  },
  tipo: { fontSize: 20, fontWeight: '800', color: COLORS.texto },
  resolvidoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.verde + '22',
    borderRadius: 8,
    padding: 8,
  },
  resolvidoTexto: { color: COLORS.verde, fontWeight: '700', fontSize: 13 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorda,
  },
  infoLabel: { fontSize: 11, color: COLORS.textoSub, marginBottom: 2 },
  infoValor: { fontSize: 14, color: COLORS.texto, fontWeight: '600' },
  secao: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorda,
    gap: 10,
  },
  secaoLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textoSub },
  descricao: { fontSize: 14, color: COLORS.texto, lineHeight: 22 },
  coordenadasBox: { gap: 0 },
  coordRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  coordLabel: { fontSize: 13, color: COLORS.textoSub },
  coordValor: { fontSize: 13, color: COLORS.verde, fontWeight: '600', fontFamily: 'monospace' },
  divider: { height: 1, backgroundColor: COLORS.cardBorda },
  semCoordenadas: { fontSize: 13, color: COLORS.alerta },
  botaoResolver: {
    backgroundColor: COLORS.verdeMedio,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  botaoResolverTexto: { color: COLORS.branco, fontSize: 16, fontWeight: '700' },
  botaoVoltar: {
    padding: 12,
    alignItems: 'center',
  },
  botaoVoltarTexto: { color: COLORS.textoSub, fontSize: 14 },
})
