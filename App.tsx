import { cacheDirectory, EncodingType, writeAsStringAsync } from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

type SaveChunk = {
  type: "save-chunk";
  id: string;
  name: string;
  mime: string;
  index: number;
  total: number;
  data: string;
};

export function App() {
  return (
    <SafeAreaProvider>
      <Shell />
    </SafeAreaProvider>
  );
}

function Shell() {
  const insets = useSafeAreaInsets();
  const web = useRef<WebView>(null);
  const parts = useRef(new Map<string, string[]>());
  const pad = `document.documentElement.style.setProperty('--apk-top','${Math.max(insets.top, 28)}px');document.documentElement.style.setProperty('--apk-bottom','${insets.bottom}px');document.body.classList.add('apk');true;`;
  useEffect(() => {
    web.current?.injectJavaScript(pad);
  }, [pad]);
  return (
    <View style={styles.fill}>
      <StatusBar style="light" />
      <WebView
        ref={web}
        source={{ uri: "file:///android_asset/web/index.html" }}
        style={styles.fill}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowFileAccessFromFileURLs
        allowUniversalAccessFromFileURLs
        mixedContentMode="always"
        setSupportMultipleWindows={false}
        injectedJavaScriptBeforeContentLoaded={pad}
        onLoadEnd={() => web.current?.injectJavaScript(pad)}
        onMessage={(event) => {
          void saveChunk(event.nativeEvent.data, parts.current);
        }}
      />
    </View>
  );
}

async function saveChunk(raw: string, parts: Map<string, string[]>) {
  let message: SaveChunk;
  try {
    message = JSON.parse(raw) as SaveChunk;
  } catch {
    return;
  }
  if (message.type !== "save-chunk" || !cacheDirectory) return;
  const bucket = parts.get(message.id) ?? [];
  bucket[message.index] = message.data;
  parts.set(message.id, bucket);
  if (bucket.filter((part) => part != null).length < message.total) return;
  parts.delete(message.id);
  const name = message.name.replace(/[^\w.\-\u0900-\u097F ]+/g, "_").slice(0, 80) || "granth.pdf";
  const uri = `${cacheDirectory}${name}`;
  await writeAsStringAsync(uri, bucket.join(""), { encoding: EncodingType.Base64 });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType: message.mime || "application/pdf", dialogTitle: name });
  }
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: "#7B1F2E" },
});
