// app/(tabs)/index.tsx
// Expo + React Native + TypeScript
// VISI KOMENTĀRI LATVIEŠU VALODĀ
// Uzdevums: Onboarding (3 atsevišķas lapas bez skrolla) rādas KATRU startu.
// Galvenais ekrāns = “zelta standarts” (TOP → RIGHT → BOTTOM → LEFT) — NETIEK MAINĪTS.
// Valodas slēdzis LV/EN — centrā starp presetu pogām un kvadrātu (tajā pašā līmenī arī Onboarding).

import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";


/* ===================== I18N / KONTEKSTS ===================== */

type Lang = "lv" | "en";
type I18nCtxType = { lang: Lang; setLang: Dispatch<SetStateAction<Lang>> };
const I18nCtx = React.createContext<I18nCtxType>({
  lang: "lv",
  setLang: (() => {}) as Dispatch<SetStateAction<Lang>>,
});
const useI18n = () => useContext(I18nCtx);

const TXT = {
  lv: {
    appTitle: "Box Breathing",
    preset: "Režīms",
    p4444: "4–4–4–4",
    p5555: "5–5–5–5",
    s: "s",
    running: "Darbojas",
    paused: "Pauze",
    resume: "Start",
    pause: "Pauze",
    reset: "Restartēt",
    // Onboarding teksti (īsi, skaidri)
    ob1_t: "Kas tas ir?",
    ob1_b: "Box Breathing — 4 fāzes: ieelpa, aizture, izelpa, aizture.",
    ob2_t: "Kā lietot",
    ob2_b: "Seko līnijai gar kvadrāta malu un elpo tās ritmā.",
    ob3_t: "Sāc droši",
    ob3_b: "Izvēlies 4–4–4–4 vai 5–5–5–5 un nospied Start.",
    next: "Tālāk",
    back: "Atpakaļ",
    start: "Start",
  },
  en: {
    appTitle: "Box Breathing",
    preset: "Preset",
    p4444: "4–4–4–4",
    p5555: "5–5–5–5",
    s: "s",
    running: "Running",
    paused: "Paused",
    resume: "Resume",
    pause: "Pause",
    reset: "Reset",
    // Onboarding texts
    ob1_t: "What is it?",
    ob1_b: "Box Breathing — 4 phases: inhale, hold, exhale, hold.",
    ob2_t: "How to use",
    ob2_b: "Follow the line along the square edge and breathe with it.",
    ob3_t: "Get started",
    ob3_b: "Pick 4–4–4–4 or 5–5–5–5 and press Start.",
    next: "Next",
    back: "Back",
    start: "Start",
  },
} as const;

/* ===================== VALODAS SLĒDZIS ===================== */

const LangBar: React.FC = () => {
  const { lang, setLang } = useI18n();
  return (
    <View style={styles.langBar}>
      <Pressable
        onPress={() => setLang("lv")}
        style={[styles.langChip, lang === "lv" && styles.langChipActive]}
      >
        <Text style={[styles.langChipText, lang === "lv" && styles.langChipTextActive]}>LV</Text>
      </Pressable>
      <Pressable
        onPress={() => setLang("en")}
        style={[styles.langChip, lang === "en" && styles.langChipActive]}
      >
        <Text style={[styles.langChipText, lang === "en" && styles.langChipTextActive]}>EN</Text>
      </Pressable>
    </View>
  );
};

/* ===================== SAKNES MARŠRUTS ===================== */

type Route = "onboarding" | "main";

export default function Root() {
  const [lang, setLang] = useState<Lang>("lv"); // pēc noklusējuma LV
  const [route, setRoute] = useState<Route>("onboarding"); // vienmēr sākam ar onboarding

  return (
    <I18nCtx.Provider value={{ lang, setLang }}>
      <SafeAreaView style={styles.safer}>
        {route === "onboarding" ? (
          <Onboarding onDone={() => setRoute("main")} />
        ) : (
          <MainScreen />
        )}
      </SafeAreaView>
    </I18nCtx.Provider>
  );
}

/* ===================== ONBOARDING (3 lapas bez skrolla) ===================== */

const Onboarding: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { lang } = useI18n();
  const t = TXT[lang];
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const steps = [
    { title: t.ob1_t, body: t.ob1_b },
    { title: t.ob2_t, body: t.ob2_b },
    { title: t.ob3_t, body: t.ob3_b },
  ] as const;

  const goNext = () => (step < 2 ? setStep((s) => (s + 1) as 0 | 1 | 2) : onDone());
  const goBack = () => (step > 0 ? setStep((s) => (s - 1) as 0 | 1 | 2) : undefined);

  return (
    <View style={styles.screenWrap}>
      <Text style={styles.header}>{t.appTitle}</Text>

      {/* Valodas slēdzis — tieši tajā pašā vertikālajā līmenī kā galvenajā */}
      <View style={styles.langLevelSpacer} />
      <LangBar />

      <View style={styles.onbCard}>
        <Text style={styles.onbTitle}>{steps[step].title}</Text>
        <Text style={styles.onbBody}>{steps[step].body}</Text>
      </View>

      <View style={styles.onbControls}>
        <Pressable
          disabled={step === 0}
          onPress={goBack}
          style={[styles.ghostBtn, step === 0 && { opacity: 0.35 }]}
        >
          <Text style={styles.ghostText}>{t.back}</Text>
        </Pressable>

        <Pressable onPress={step === 2 ? onDone : goNext} style={styles.primaryBtn}>
          <Text style={styles.primaryText}>{step === 2 ? t.start : t.next}</Text>
        </Pressable>
      </View>
    </View>
  );
};

/* ===================== GALVENĀ LAPA (ZELTA STANDARTS — NEMAINĀM) ===================== */

const MainScreen: React.FC = () => {
  const { lang } = useI18n();
  const t = TXT[lang];

  const [preset, setPreset] = useState<number>(4);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [phaseIndex, setPhaseIndex] = useState<number>(0); // 0=TOP (start no kreisā augšējā)
  const [leftSec, setLeftSec] = useState<number>(4);

  // TOP → RIGHT → BOTTOM → LEFT (saglabājam “zelta standartu”)
  const phases = useMemo(
    () => [
      { key: "inhale", label: lang === "lv" ? "Ieelpa" : "Inhale", secs: preset }, // 0: TOP
      { key: "hold1", label: lang === "lv" ? "Aizture" : "Hold", secs: preset },   // 1: RIGHT
      { key: "exhale", label: lang === "lv" ? "Izelpa" : "Exhale", secs: preset }, // 2: BOTTOM
      { key: "hold2", label: lang === "lv" ? "Aizture" : "Hold", secs: preset },   // 3: LEFT
    ],
    [preset, lang]
  );

  // Viena 0..1 skala aktīvās malas pieaugumam
  const edgeAnim = useRef(new Animated.Value(0)).current;
  const startEdge = (secs: number) => {
    edgeAnim.stopAnimation();
    edgeAnim.setValue(0);
    Animated.timing(edgeAnim, { toValue: 1, duration: secs * 1000, useNativeDriver: false }).start();
  };

  // Presetu maiņa → korekts reset
  const setPresetAndReset = (n: number) => {
    setIsRunning(false);
    setPreset(n);
    setPhaseIndex(0);
    setLeftSec(n);
    edgeAnim.stopAnimation();
    edgeAnim.setValue(0);
  };

  // Fāzes maiņa → sekundes + animācija
  useEffect(() => {
    const secs = phases[phaseIndex].secs;
    setLeftSec(secs);
    if (isRunning) startEdge(secs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseIndex, phases, isRunning]);

  // Sekunžu taimeris
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setLeftSec((s) => {
        if (s <= 1) {
          const next = (phaseIndex + 1) % phases.length;
          setPhaseIndex(next);
          return phases[next].secs;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, phaseIndex, phases]);

  // Kvadrāta ģeometrija
  const BOX = 220, BORDER = 6, FULL = BOX + BORDER * 2;
  const len = edgeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, FULL] });

  return (
    <View style={styles.screenWrap}>
      <Text style={styles.header}>{t.appTitle}</Text>

      {/* Preseti */}
      <View style={styles.rowBetween}>
        <Text style={styles.label}>{t.preset}:</Text>
        <View style={styles.row}>
          <Pill selected={preset === 4} label={t.p4444} onPress={() => setPresetAndReset(4)} />
          <Pill selected={preset === 5} label={t.p5555} onPress={() => setPresetAndReset(5)} />
        </View>
      </View>

      {/* Valoda — tieši šeit starp presetu blokiem un kvadrātu */}
      <LangBar />

      {/* Kvadrāts ar perimetra animāciju (zelta standarts) */}
      <View style={styles.centeredGrow}>
        <View style={[styles.boxWrap, { width: FULL, height: FULL }]}>
          <View style={[styles.boxCore, { width: BOX, height: BOX }]} />

          {/* pamatlīnijas */}
          <View style={[styles.edgeTop,    { width: FULL, height: BORDER, opacity: 0.25 }]} />
          <View style={[styles.edgeRight,  { height: FULL, width: BORDER, opacity: 0.25 }]} />
          <View style={[styles.edgeBottom, { width: FULL, height: BORDER, opacity: 0.25 }]} />
          <View style={[styles.edgeLeft,   { height: FULL, width: BORDER, opacity: 0.25 }]} />

          {/* aktīvās malas */}
          {phaseIndex === 0 && (
            // TOP: left→right
            <Animated.View style={[styles.edgeTop, { width: len, height: BORDER }]} />
          )}
          {phaseIndex === 1 && (
            // RIGHT: top→bottom
            <Animated.View style={[styles.edgeRight, { height: len, width: BORDER }]} />
          )}
          {phaseIndex === 2 && (
            // BOTTOM: right→left
            <Animated.View style={[styles.edgeBottomActive, { width: len, height: BORDER }]} />
          )}
          {phaseIndex === 3 && (
            // LEFT: bottom→top
            <Animated.View style={[styles.edgeLeftActive, { height: len, width: BORDER }]} />
          )}
        </View>

        <Text style={styles.phaseText}>{phases[phaseIndex].label}</Text>
        <Text style={styles.countText}>{leftSec}{t.s}</Text>
        <Text style={styles.status}>{isRunning ? t.running : t.paused}</Text>
      </View>

      {/* Vadība */}
      <View style={styles.rowBetween}>
        <GhostButton
          label={isRunning ? t.pause : t.resume}
          onPress={() => {
            const next = !isRunning;
            setIsRunning(next);
            if (next) startEdge(phases[phaseIndex].secs);
            else edgeAnim.stopAnimation();
          }}
        />
        <GhostButton
          label={t.reset}
          onPress={() => {
            setIsRunning(false);
            setPhaseIndex(0);
            setLeftSec(preset);
            edgeAnim.stopAnimation();
            edgeAnim.setValue(0);
          }}
        />
      </View>
    </View>
  );
};

/* ===================== UI MAZI KOMPONENTI ===================== */

const Pill: React.FC<{ label: string; selected: boolean; onPress: () => void }> = ({
  label,
  selected,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.pill, selected && { backgroundColor: "#4f46e5", borderColor: "#4f46e5" }]}
  >
    <Text style={[styles.pillText, selected && { color: "#fff" }]}>{label}</Text>
  </Pressable>
);

const GhostButton: React.FC<{ label: string; onPress: () => void }> = ({ label, onPress }) => (
  <Pressable onPress={onPress} style={styles.ghostBtn}>
    <Text style={styles.ghostText}>{label}</Text>
  </Pressable>
);

/* ===================== STILI ===================== */

const styles = StyleSheet.create({
  safer: { flex: 1, backgroundColor: "#0f1115" },

  screenWrap: { flex: 1, padding: 20 },

  header: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 6,
  },

  /* --- Preseti un valodas līmenis --- */
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  row: { flexDirection: "row", gap: 8, alignItems: "center" },
  label: { color: "#aab3c2", fontSize: 14 },

  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#0f141c",
    borderWidth: 1,
    borderColor: "#2b3140",
    marginLeft: 8,
  },
  pillText: { color: "#cbd5e1", fontWeight: "600" },

  // Valodas slēdzis — horizontāli centrā (vienā līmenī arī Onboarding)
  langBar: {
    alignSelf: "center",
    flexDirection: "row",
    gap: 12,
    marginVertical: 8,
  },
  langChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#0f141c",
    borderWidth: 1,
    borderColor: "#2b3140",
  },
  langChipActive: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" },
  langChipText: { color: "#cbd5e1", fontWeight: "700" },
  langChipTextActive: { color: "#fff" },

  // Onboarding: lai valodas josla būtu TIEŠI tajā pašā augstumā
  langLevelSpacer: { height: 6 },

  // Onboarding kartīte
  onbCard: {
    backgroundColor: "#141822",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2b3140",
    padding: 18,
    marginTop: 10,
  },
  onbTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 8, textAlign: "center" },
  onbBody: { color: "#c7d0dd", fontSize: 16, lineHeight: 22, textAlign: "center" },

  onbControls: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },

  centeredGrow: { flex: 1, alignItems: "center", justifyContent: "center" },

  // Kvadrāts + pamatlīnijas
  boxWrap: { alignItems: "center", justifyContent: "center" },
  boxCore: { borderRadius: 14, backgroundColor: "rgba(255,255,255,0.04)" },

  edgeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#22d3ee",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  edgeRight: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#22d3ee",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  edgeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "#22d3ee",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  edgeLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#22d3ee",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },

  // Aktīvo malu enkuri
  edgeBottomActive: {
    position: "absolute",
    bottom: 0,
    right: 0, // aug no labās uz kreiso
    backgroundColor: "#22d3ee",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  edgeLeftActive: {
    position: "absolute",
    bottom: 0, // aug no apakšas uz augšu
    left: 0,
    backgroundColor: "#22d3ee",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },

  phaseText: { color: "#e2e8f0", fontSize: 22, fontWeight: "700", marginTop: 20, textAlign: "center" },
  countText: { color: "#94a3b8", fontSize: 20, marginTop: 6, textAlign: "center" },
  status: { color: "#64748b", fontSize: 14, marginTop: 4, textAlign: "center" },

  primaryBtn: {
    backgroundColor: "#4f46e5",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 14,
  },
primaryText: {
  color: "#fff",
  fontSize: 16,
  ...(Platform.OS === "android"
    ? { fontFamily: "sans-serif-medium" } 
    : { fontWeight: "700" }),             
},

ghostText: {
  color: "#e2e8f0",
  ...(Platform.OS === "android"
    ? { fontFamily: "sans-serif-medium" } 
    : { fontWeight: "600" }),
},



  ghostBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#1f2430",
    borderWidth: 1,
    borderColor: "#2b3140",
    minWidth: 120,
    alignItems: "center",
  },

});
