// app/(tabs)/index.tsx
// ==================== Box Breathing — Zelta Standarts (LV/EN) ====================

import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
    resume: "Sākt",
    pause: "Pauze",
    reset: "Restartēt",
    // Onboarding teksti
    ob1_t: "Kas tas ir?",
    ob1_b: "Box Breathing — 4 fāzes: ieelpa, aizture, izelpa, aizture.",
    ob2_t: "Kā lietot",
    ob2_b: "Seko līnijai gar kvadrāta malu un elpo tās ritmā.",
    ob3_t: "Sāc droši",
    ob3_b: "Izvēlies 4–4–4–4 vai 5–5–5–5 un nospied “Sākt”.",
    next: "Tālāk",
    back: "Atpakaļ",
    start: "Sākt",
    info: "Par metodi",
  },
  en: {
    appTitle: "Box Breathing",
    preset: "Preset",
    p4444: "4–4–4–4",
    p5555: "5–5–5–5",
    s: "s",
    running: "Running",
    paused: "Paused",
    resume: "Start",
    pause: "Pause",
    reset: "Reset",
    ob1_t: "What is it?",
    ob1_b: "Box Breathing — 4 phases: inhale, hold, exhale, hold.",
    ob2_t: "How to use",
    ob2_b: "Follow the line along the square edge and breathe with it.",
    ob3_t: "Get started",
    ob3_b: "Choose 4–4–4–4 or 5–5–5–5 and press “Start”.",
    next: "Next",
    back: "Back",
    start: "Start",
    info: "About",
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

/* ===================== MARŠRUTS ===================== */

type Route = "home" | "onboarding" | "main";

export default function Root() {
  const [lang, setLang] = useState<Lang>("lv");
  const [route, setRoute] = useState<Route>("home");

  return (
    <I18nCtx.Provider value={{ lang, setLang }}>
      <SafeAreaView style={styles.safer}>
        {route === "home" && (
          <HomeScreen onStart={() => setRoute("main")} onInfo={() => setRoute("onboarding")} />
        )}
        {route === "onboarding" && <Onboarding onDone={() => setRoute("main")} />}
        {route === "main" && <MainScreen />}
      </SafeAreaView>
    </I18nCtx.Provider>
  );
}

/* ===================== SĀKUMA EKRĀNS ===================== */

const HomeScreen: React.FC<{ onStart: () => void; onInfo: () => void }> = ({
  onStart,
  onInfo,
}) => {
  const { lang } = useI18n();
  const t = TXT[lang];

  return (
    <View style={styles.screenWrap}>
      <View style={styles.langLevelSpacer} />
      <LangBar />
      <Text style={styles.headerHome}>{t.appTitle}</Text>

      <View style={styles.homeCenter}>
        <Pressable onPress={onStart} style={styles.primaryBtn}>
          <Text style={styles.primaryText}>{t.start}</Text>
        </Pressable>
        <Pressable onPress={onInfo} style={styles.ghostBtn}>
          <Text style={styles.ghostText}>{t.info}</Text>
        </Pressable>
      </View>
    </View>
  );
};

/* ===================== ONBOARDING ===================== */

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

/* ===================== GALVENĀ LAPA — ZELTA STANDARTS ===================== */

const MainScreen: React.FC = () => {
  const { lang } = useI18n();
  const t = TXT[lang];

  const [preset, setPreset] = useState(4);
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0); // 0: TOP
  const [leftSec, setLeftSec] = useState(4);

  // Fāzes (TOP → RIGHT → BOTTOM → LEFT)
  const phases = useMemo(
    () => [
      { key: "inhale", label: lang === "lv" ? "Ieelpa" : "Inhale", secs: preset }, // 0: TOP
      { key: "hold1", label: lang === "lv" ? "Aizture" : "Hold", secs: preset },  // 1: RIGHT
      { key: "exhale", label: lang === "lv" ? "Izelpa" : "Exhale", secs: preset },// 2: BOTTOM
      { key: "hold2", label: lang === "lv" ? "Aizture" : "Hold", secs: preset },  // 3: LEFT
    ],
    [preset, lang]
  );

  // === Анимация/таймер через дедлайн, без дрейфа ===
  const edgeAnim = useRef(new Animated.Value(0)).current;
  const animHandle = useRef<Animated.CompositeAnimation | null>(null);

  const isRunningRef = useRef(isRunning);
  const phaseIdxRef = useRef(phaseIndex);
  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);
  useEffect(() => { phaseIdxRef.current = phaseIndex; }, [phaseIndex]);

  const phaseEndTsRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Точный “визуальный” тикающий счётчик (без setInterval)
  const tick = () => {
    const now = Date.now();
    const msLeft = Math.max(0, phaseEndTsRef.current - now);
    // округляем вверх, чтобы на старте фазы был «4», а не «3»
    const secsLeft = Math.min(phases[phaseIdxRef.current].secs, Math.ceil(msLeft / 1000));
    setLeftSec(secsLeft);
    if (msLeft <= 0) return; // завершение обработает .start callback
    rafRef.current = requestAnimationFrame(tick);
  };

  const stopTick = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  // Запуск конкретной фазы (index)
  const startPhase = (idx: number, remainingMs?: number) => {
    const secs = phases[idx].secs;

    setPhaseIndex(idx);
    // если передали точные миллисекунды — используем их; иначе полная длительность
    const durationMs = remainingMs ?? secs * 1000;

    // сброс перед стартом
    stopTick();
    edgeAnim.stopAnimation();
    edgeAnim.setValue(0);

    // дедлайн и тикер
    phaseEndTsRef.current = Date.now() + durationMs;
    rafRef.current = requestAnimationFrame(tick);

    // анимация
    animHandle.current?.stop();
    animHandle.current = Animated.timing(edgeAnim, {
      toValue: 1,
      duration: durationMs,
      easing: Easing.linear,
      useNativeDriver: false, // width/height — только JS
    });

    animHandle.current.start(({ finished }) => {
      if (!finished || !isRunningRef.current) return;
      const next = (idx + 1) % phases.length;
      startPhase(next); // бесшовный переход к следующей стороне
    });
  };

  // Старт/пауза
  const toggleRun = () => {
    if (!isRunning) {
      // RESUME / START
      const now = Date.now();
      let remain = phaseEndTsRef.current - now;
      // если запуск с нуля или после reset/preset — берём полную фазу
      if (remain <= 0 || remain > phases[phaseIdxRef.current].secs * 1000) {
        remain = phases[phaseIdxRef.current].secs * 1000;
      }
      setIsRunning(true);
      startPhase(phaseIdxRef.current, remain);
    } else {
      // PAUSE
      setIsRunning(false);
      animHandle.current?.stop();
      stopTick();
      const now = Date.now();
      const msLeft = Math.max(0, phaseEndTsRef.current - now);
      // фиксируем оставшиеся секунды, чтобы при паузе цифра не прыгала
      setLeftSec(Math.min(phases[phaseIdxRef.current].secs, Math.ceil(msLeft / 1000)));
    }
  };

  // Reset
  const doReset = () => {
    setIsRunning(false);
    setPhaseIndex(0);
    setLeftSec(preset);
    stopTick();
    edgeAnim.stopAnimation();
    edgeAnim.setValue(0);
    phaseEndTsRef.current = 0;
  };

  // Смена пресета — мягкий reset
  const setPresetAndReset = (n: number) => {
    setPreset(n);
    // после изменения preset сразу в исходное
    setIsRunning(false);
    setPhaseIndex(0);
    setLeftSec(n);
    stopTick();
    edgeAnim.stopAnimation();
    edgeAnim.setValue(0);
    phaseEndTsRef.current = 0;
  };

  // Геометрия квадрата
  const BOX = 220, BORDER = 10, FULL = BOX + BORDER * 2;
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

      {/* Valoda — starp presetu blokiem un kvadrātu */}
      <LangBar />

      {/* Kvadrāts ar perimetra animāciju */}
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
        <Pressable onPress={toggleRun} style={styles.ghostBtn}>
          <Text style={styles.ghostText}>{isRunning ? t.pause : t.resume}</Text>
        </Pressable>
        <Pressable onPress={doReset} style={styles.ghostBtn}>
          <Text style={styles.ghostText}>{t.reset}</Text>
        </Pressable>
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

/* ===================== STILI ===================== */

const styles = StyleSheet.create({
  safer: { flex: 1, backgroundColor: "#0f1115" },

  screenWrap: { flex: 1, padding: 20 },

  // virsraksts (Onboarding/Main)
  header: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 6,
  },

  // virsraksts tikai Home
  headerHome: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 100,
    marginBottom: 16,
  },

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

  // Valodas slēdzis — centrā
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

  // lai valodas josla būtu tajā pašā augstumā
  langLevelSpacer: { height: 6 },

  // HOME ekrāna pogu bloks
  homeCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },

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

  // Aktīvo malu enkuri (aug no pretējās puses tur, kur vajag)
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

  // Pogas (vienā stilā visā app)
  primaryBtn: {
    backgroundColor: "#4f46e5",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    ...(Platform.OS === "android" ? { fontFamily: "sans-serif-medium" } : { fontWeight: "700" }),
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
    justifyContent: "center",
  },
  ghostText: {
    color: "#e2e8f0",
    ...(Platform.OS === "android" ? { fontFamily: "sans-serif-medium" } : { fontWeight: "600" }),
  },
});

