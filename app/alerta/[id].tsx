import { useEffect, useState } from 'react'
import {
  ActivityIndicator, Alert, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/contexts/ThemeContext'
import { nivelCor, tipoEmoji } from '@/constants/theme'
import { buscarAlerta, resolverAlerta } from '@/services/storage'
import NivelBadge from '@/components/NivelBadge'
import type { Alerta } from '@/types'

const formatarData = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export default function DetalheAlertaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { colors, sombra } = useTheme()
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

  const confirmarResolver = () => Alert.alert(
    'Marcar como resolvido',
    'Confirma que esta ocorrência foi solucionada?',
    [{ text: 'Cancelar', style: 'cancel' }, { text: 'Confirmar', onPress: resolver }]
  )

  const resolver = async () => {
    if (!alerta) return
    setResolvendo(true)
    await resolverAlerta(alerta.id)
    setAlerta({ ...alerta, resolvido: true })
    setResolvendo(false)
  }

  if (carregando) return (
    <View style={[styles.centro, { backgroundColor: colors.fundo }]}>
      <ActivityIndicator color={colors.verdeEscuro} size="large" />
    </View>
  )

  if (naoEncontrado || !alerta) {
    return (
      <View style={[styles.centro, { backgroundColor: colors.fundo }]}>
        <Text style={{ fontSize: 48, marginBottom: 12 }}>🔍</Text>
        <Text style={[styles.erroTexto, { color: colors.texto }]}>Alerta não encontrado</Text>
        <TouchableOpacity style={[styles.voltarBtn, { backgroundColor: colors.verdeEscuro }]} onPress={() => router.back()}>
          <Text style={styles.voltarTexto}>Voltar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const cor = nivelCor(alerta.nivel, colors)
  const temGPS = alerta.latitude !== 0 || alerta.longitude !== 0

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.fundo }]} contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>

      {/* HERO */}
      <View style={[styles.hero, { backgroundColor: cor + '12' }]}>
        <Text style={styles.heroEmoji}>{tipoEmoji(alerta.tipo)}</Text>
        <Text style={[styles.heroTipo, { color: colors.texto }]}>{alerta.tipo.replace('_', ' ')}</Text>
        <NivelBadge nivel={alerta.nivel} />
        {alerta.resolvido && (
          <View style={[styles.resolvidoBanner, { backgroundColor: colors.verde + '18' }]}>
            <Ionicons name="checkmark-circle" size={16} color={colors.verde} />
            <Text style={[styles.resolvidoTexto, { color: colors.verde }]}>Alerta resolvido</Text>
          </View>
        )}
      </View>

      {/* INFOS */}
      <View style={[styles.card, { backgroundColor: colors.card, gap: 0 }, sombra as any]}>
        <InfoRow icone="time-outline" label="Registrado em" valor={formatarData(alerta.criadoEm)} colors={colors} />
        <View style={[styles.div, { backgroundColor: colors.separador }]} />
        <InfoRow icone="finger-print-outline" label="ID do alerta" valor={`#${alerta.id}`} mono colors={colors} />
      </View>

      {/* DESCRIÇÃO */}
      <View style={[styles.card, { backgroundColor: colors.card }, sombra as any]}>
        <Text style={[styles.cardTitulo, { color: colors.textoSub }]}>Descrição</Text>
        <Text style={[styles.descricao, { color: colors.texto }]}>{alerta.descricao}</Text>
      </View>

      {/* GPS */}
      <View style={[styles.card, { backgroundColor: colors.card }, sombra as any]}>
        <Text style={[styles.cardTitulo, { color: colors.textoSub }]}>Localização GPS</Text>
        {temGPS ? (
          <>
            <InfoRow icone="navigate-outline" label="Latitude" valor={alerta.latitude.toFixed(6)} mono colors={colors} />
            <View style={[styles.div, { backgroundColor: colors.separador }]} />
            <InfoRow icone="navigate-outline" label="Longitude" valor={alerta.longitude.toFixed(6)} mono colors={colors} />
          </>
        ) : (
          <View style={styles.semGPS}>
            <Ionicons name="location-off-outline" size={20} color={colors.textoSub} />
            <Text style={[styles.semGPSTexto, { color: colors.textoSub }]}>Coordenadas não disponíveis</Text>
          </View>
        )}
      </View>

      {/* AÇÕES */}
      {!alerta.resolvido && (
        <TouchableOpacity
          style={[styles.btnResolver, { backgroundColor: colors.verdeEscuro }, resolvendo && { opacity: 0.7 }]}
          onPress={confirmarResolver} disabled={resolvendo} activeOpacity={0.85}
        >
          {resolvendo
            ? <ActivityIndicator color="#fff" size="small" />
            : <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.btnResolverTexto}>Marcar como Resolvido</Text>
              </>
          }
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}>
        <Text style={[styles.btnVoltarTexto, { color: colors.textoSub }]}>← Voltar para lista</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

function InfoRow({ icone, label, valor, mono, colors }: { icone: string; label: string; valor: string; mono?: boolean; colors: any }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icone as any} size={16} color={colors.textoSub} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.infoLabel, { color: colors.textoSub }]}>{label}</Text>
        <Text style={[styles.infoValor, { color: colors.texto }, mono && { fontFamily: 'monospace', color: colors.verdeEscuro }]}>{valor}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  conteudo: { padding: 20, paddingBottom: 48, gap: 12 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  erroTexto: { fontSize: 18, fontWeight: '700' },
  voltarBtn: { marginTop: 16, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  voltarTexto: { color: '#fff', fontWeight: '700' },
  hero: { borderRadius: 20, padding: 24, alignItems: 'center', gap: 10 },
  heroEmoji: { fontSize: 48, marginBottom: 4 },
  heroTipo: { fontSize: 22, fontWeight: '800' },
  resolvidoBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginTop: 4 },
  resolvidoTexto: { fontWeight: '700', fontSize: 13 },
  card: { borderRadius: 16, padding: 16 },
  cardTitulo: { fontSize: 13, fontWeight: '700', marginBottom: 10 },
  div: { height: 1, marginVertical: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8 },
  infoLabel: { fontSize: 11, marginBottom: 2 },
  infoValor: { fontSize: 14, fontWeight: '600' },
  descricao: { fontSize: 15, lineHeight: 24 },
  semGPS: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  semGPSTexto: { fontSize: 14 },
  btnResolver: {
    borderRadius: 16, padding: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnResolverTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnVoltar: { padding: 12, alignItems: 'center' },
  btnVoltarTexto: { fontSize: 14 },
})
