import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, nivelCor, tipoEmoji } from '@/constants/theme'

export default function ConfirmacaoScreen() {
  const router = useRouter()
  const { id, tipo, nivel } = useLocalSearchParams<{ id: string; tipo: string; nivel: string }>()

  const cor = nivelCor(nivel ?? 'NORMAL')

  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Ionicons name="checkmark-circle" size={72} color={COLORS.verde} />
      </View>

      <Text style={styles.titulo}>Alerta Registrado!</Text>
      <Text style={styles.subtitulo}>
        A ocorrência foi salva com sucesso no sistema OrbitaVerde.
      </Text>

      <View style={styles.card}>
        <View style={styles.linha}>
          <Text style={styles.cardLabel}>Tipo</Text>
          <Text style={styles.cardValor}>
            {tipoEmoji(tipo ?? '')} {(tipo ?? '').replace('_', ' ')}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.linha}>
          <Text style={styles.cardLabel}>Nível</Text>
          <Text style={[styles.cardValor, { color: cor }]}>{nivel}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.linha}>
          <Text style={styles.cardLabel}>ID</Text>
          <Text style={styles.cardValorMono}>#{id}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.linha}>
          <Text style={styles.cardLabel}>Status</Text>
          <View style={styles.statusBadge}>
            <View style={styles.dot} />
            <Text style={styles.statusTexto}>ATIVO</Text>
          </View>
        </View>
      </View>

      <View style={styles.mensagem}>
        <Ionicons name="information-circle-outline" size={16} color={COLORS.textoSub} />
        <Text style={styles.mensagemTexto}>
          Equipes de monitoramento foram notificadas. Acompanhe o status na aba Alertas.
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.botaoPrimario, pressed && { opacity: 0.8 }]}
        onPress={() => router.replace('/alertas')}
      >
        <Ionicons name="list-outline" size={18} color={COLORS.branco} />
        <Text style={styles.botaoPrimarioTexto}>Ver todos os alertas</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.botaoSecundario, pressed && { opacity: 0.8 }]}
        onPress={() => router.replace('/')}
      >
        <Text style={styles.botaoSecundarioTexto}>Ir para o Dashboard</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.fundo,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    backgroundColor: COLORS.verde + '22',
    borderRadius: 50,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  titulo: { fontSize: 26, fontWeight: '800', color: COLORS.texto, marginBottom: 8 },
  subtitulo: { fontSize: 14, color: COLORS.textoSub, textAlign: 'center', marginBottom: 28, lineHeight: 20 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.cardBorda,
    marginBottom: 16,
  },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  cardLabel: { fontSize: 13, color: COLORS.textoSub },
  cardValor: { fontSize: 14, fontWeight: '700', color: COLORS.texto },
  cardValorMono: { fontSize: 14, fontWeight: '700', color: COLORS.verde, fontFamily: 'monospace' },
  divider: { height: 1, backgroundColor: COLORS.cardBorda },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.verde },
  statusTexto: { color: COLORS.verde, fontWeight: '700', fontSize: 13 },
  mensagem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.cardBorda,
  },
  mensagemTexto: { flex: 1, fontSize: 12, color: COLORS.textoSub, lineHeight: 18 },
  botaoPrimario: {
    backgroundColor: COLORS.verdeMedio,
    borderRadius: 14,
    padding: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  botaoPrimarioTexto: { color: COLORS.branco, fontSize: 16, fontWeight: '700' },
  botaoSecundario: { padding: 12 },
  botaoSecundarioTexto: { color: COLORS.textoSub, fontSize: 14 },
})
