import { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useApp } from "../state/AppProvider";

const API = "https://granth.wnmsolutions.com/api/index.php?request=adminLogin";

export function AdminGateScreen() {
  const { colors } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("सात टैप सिर्फ़ प्रवेश है। असली अनुमति सर्वर जाँच के बाद है।");
  const [busy, setBusy] = useState(false);

  const submit = () => {
    setBusy(true);
    setMessage("");
    void fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(async (response) => {
        const body = (await response.json().catch(() => null)) as { success?: boolean; data?: { token?: string } } | null;
        if (!body?.success || !body.data?.token) {
          setPassword("");
          setMessage("एडमिन सर्वर ने लॉगिन स्वीकार नहीं किया। अलग एडमिन ऐप खोलें, या सर्वर पर एडमिन API लगाएँ। इस यूज़र ऐप में एडमिन पैनल नहीं है।");
          return;
        }
        setPassword("");
        const opened = await Linking.canOpenURL("granthadmin://open");
        if (opened) {
          await Linking.openURL("granthadmin://open");
          setMessage("एडमिन ऐप खुल रहा है। वहीं फिर से लॉग इन करें।");
          return;
        }
        setMessage("लॉगिन सही है, पर एडमिन ऐप इस फ़ोन पर इंस्टॉल नहीं है। उसे इंस्टॉल करें। यहाँ से सामग्री नहीं बदलेगी।");
      })
      .catch(() => {
        setPassword("");
        setMessage("सर्वर नहीं मिला। नेट देखें। एडमिन काम इस ऐप के अंदर नहीं खुलता।");
      })
      .finally(() => setBusy(false));
  };

  return (
    <View style={[styles.wrap, { backgroundColor: colors.cream }]}>
      <Text style={[styles.title, { color: colors.maroon }]}>एडमिन लॉगिन</Text>
      <Text style={{ color: colors.muted, lineHeight: 22 }}>{message}</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholder="ईमेल"
        placeholderTextColor={colors.muted}
        style={[styles.input, { color: colors.text, borderColor: colors.line, backgroundColor: colors.paper }]}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="पासवर्ड"
        placeholderTextColor={colors.muted}
        style={[styles.input, { color: colors.text, borderColor: colors.line, backgroundColor: colors.paper }]}
      />
      <Pressable onPress={submit} disabled={busy} style={[styles.btn, { backgroundColor: colors.maroon }]}>
        <Text style={{ color: colors.cream, fontWeight: "800" }}>{busy ? "जाँच…" : "लॉग इन"}</Text>
      </Pressable>
      <Pressable onPress={() => void Linking.openURL("granthadmin://open").catch(() => setMessage("एडमिन ऐप इंस्टॉल नहीं है।"))}>
        <Text style={{ color: colors.maroon, fontWeight: "700" }}>एडमिन ऐप खोलें</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, gap: 12 },
  title: { fontSize: 28, fontFamily: "NotoSansDevanagari" },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16 },
  btn: { minHeight: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
});
