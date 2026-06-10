import { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/contexts/ThemeContext'
import { listarAlertas } from '@/services/storage'
import AlertaCard from '@/components/AlertaCard'
import MapaIlustrativo from '@/components/MapaIlustrativo'
import type { Alerta } from '@/types'

const agora = () => {
  const d = new Date()
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function HomeScreen() {
  const router = useRouter()
  const { colors, sombra } = useTheme()
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [carregando, setCarregando] = useState(true)
  const [atualizando, setAtualizando] = useState(false)
  const [lat, setLat] = useState<number | null>(null)
  const [lon, setLon] = useState<number | null>(null)
  const [gpsOk, setGpsOk] = useState(false)

  const obterGPS = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') return
    try {
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
      setLat(pos.coords.latitude)
      setLon(pos.coords.longitude)
      setGpsOk(true)
    } catch {}
  }

  const carregarAlertas = async () => {
    const dados = await listarAlertas()
    setAlertas(dados)
    setCarregando(false)
    setAtualizando(false)
  }

  useEffect(() => { obterGPS() }, [])
  useFocusEffect(useCallback(() => { carregarAlertas() }, []))

  const ativos = alertas.filter((a) => !a.resolvido)
  const perigo = ativos.filter((a) => a.nivel === 'PERIGO').length
  const alerta = ativos.filter((a) => a.nivel === 'ALERTA').length

  if (carregando) {
    return <View style={[styles.centro, { backgroundColor: colors.fundo }]}><ActivityIndicator color={colors.verdeEscuro} size="large" /></View>
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.fundo }]}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={atualizando}
          onRefresh={() => { setAtualizando(true); carregarAlertas() }}
          tintColor={colors.verdeEscuro}
        />
      }
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.saudacao, { color: colors.texto }]}>🛰️ OrbitaVerde</Text>
          <Text style={[styles.data, { color: colors.textoSub }]}>{agora()}</Text>
        </View>
        <TouchableOpacity style={[styles.notifBtn, { backgroundColor: colors.card }, sombra as any]} onPress={() => router.push('/alertas')}>
          <Ionicons name="notifications" size={20} color={colors.verdeEscuro} />
          {ativos.length > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.perigo }]}>
              <Text style={styles.badgeTexto}>{ativos.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* GPS CARD COM MAPA */}
      <View style={[styles.card, { backgroundColor: colors.card }, sombra as any, { marginBottom: 24, padding: 16 }]}>
        <View style={styles.gpsHeader}>
          <View style={[styles.gpsIconBox, { backgroundColor: gpsOk ? colors.verde + '18' : colors.input }]}>
            <Ionicons name={gpsOk ? 'location' : 'location-outline'} size={22} color={gpsOk ? colors.verdeEscuro : colors.textoSub} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.gpsLabel, { color: colors.textoSub }]}>Localização atual</Text>
            <Text style={[styles.gpsValor, { color: gpsOk ? colors.texto : colors.textoSub }]}>
              {gpsOk && lat !== null ? `${lat.toFixed(4)}°, ${lon?.toFixed(4)}°` : 'GPS indisponível no emulador'}
            </Text>
          </View>
          <View style={[styles.statusDot, { backgroundColor: gpsOk ? colors.verde : colors.textoSub }]} />
        </View>
        <View style={{ marginTop: 12 }}>
          <MapaIlustrativo latitude={lat} longitude={lon} />
        </View>
      </View>

      {/* SEÇÃO HOJE */}
      <View style={styles.secaoHeader}>
        <Text style={[styles.secaoTitulo, { color: colors.texto }]}>Hoje</Text>
        <Text style={[styles.secaoSub, { color: colors.textoSub }]}>{new Date().toLocaleDateString('pt-BR')}</Text>
      </View>

      {/* STATS 2x2 */}
      <View style={styles.statsGrid}>
        <StatCard label="Ativos" valor={ativos.length} cor={colors.verdeEscuro} icone="pulse" colors={colors} sombra={sombra} />
        <StatCard label="Perigo" valor={perigo} cor={colors.perigo} icone="flame" colors={colors} sombra={sombra} />
        <StatCard label="Alerta" valor={alerta} cor={colors.alerta} icone="warning" colors={colors} sombra={sombra} />
        <StatCard label="Resolvidos" valor={alertas.filter(a => a.resolvido).length} cor={colors.textoSub} icone="checkmark-circle" colors={colors} sombra={sombra} />
      </View>

      {/* ALERTAS RECENTES */}
      <View style={styles.secaoHeader}>
        <Text style={[styles.secaoTitulo, { color: colors.texto }]}>Alertas recentes</Text>
        <TouchableOpacity onPress={() => router.push('/alertas')}>
          <Text style={[styles.verTodos, { color: colors.verdeEscuro }]}>Ver todos →</Text>
        </TouchableOpacity>
      </View>

      {ativos.length === 0 ? (
        <View style={[styles.card, { backgroundColor: colors.card, padding: 32, alignItems: 'center', gap: 6 }, sombra as any]}>
          <Text style={{ fontSize: 36, marginBottom: 4 }}>✅</Text>
          <Text style={[styles.vazioTexto, { color: colors.texto }]}>Nenhum alerta ativo</Text>
          <Text style={[styles.vazioSub, { color: colors.textoSub }]}>O sistema está operando normalmente</Text>
        </View>
      ) : (
        ativos.slice(0, 3).map((a) => (
          <AlertaCard key={a.id} alerta={a} onPress={() => router.push(`/alerta/${a.id}`)} />
        ))
      )}
    </ScrollView>
  )
}

function StatCard({ label, valor, cor, icone, colors, sombra }: {
  label: string; valor: number; cor: string; icone: string; colors: any; sombra: any
}) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card, width: '47%', padding: 16, gap: 6 }, sombra]}>
      <View style={[styles.statIconBox, { backgroundColor: cor + '15' }]}>
        <Ionicons name={icone as any} size={18} color={cor} />
      </View>
      <Text style={[styles.statValor, { color: cor }]}>{valor}</Text>
      <Text style={[styles.statLabel, { color: colors.textoSub }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  conteudo: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  saudacao: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  data: { fontSize: 13, marginTop: 2, textTransform: 'capitalize' },
  notifBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -2, right: -2, borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  badgeTexto: { color: '#fff', fontSize: 9, fontWeight: '700' },
  card: { borderRadius: 16 },
  gpsHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  gpsIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  gpsLabel: { fontSize: 11, marginBottom: 2, fontWeight: '500' },
  gpsValor: { fontSize: 13, fontWeight: '600', fontFamily: 'monospace' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  secaoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  secaoTitulo: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  secaoSub: { fontSize: 13 },
  verTodos: { fontSize: 14, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  statIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  statValor: { fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  statLabel: { fontSize: 13, fontWeight: '500' },
  vazioTexto: { fontSize: 16, fontWeight: '700' },
  vazioSub: { fontSize: 13 },
})
