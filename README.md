# ग्रंथ प्रबंधन — Play Store AAB

GitHub पर पुश होते ही **signed AAB** बनती है (APK नहीं). Play Console में यही फ़ाइल डालो.

## कदम

1. `main` पर पुश हो चुका है. **Actions** में `Android AAB` वर्कफ़्लो खुलता है.
2. खत्म होने पर **Artifacts** से `granth-prabandhan-aab` डाउनलोड करो. अंदर वाली `.aab` Play Console में अपलोड करो.
3. साइन `android/keystore/` की keystore से होता है. Alias और password `satlok` हैं. `targetSdk` / `compileSdk` **36** हैं — अगस्त 2026 के बाद Play Store यही माँगता है.
4. versionCode **11**, versionName **1.5.2**.

पहली बिल्ड 15–25 मिनट ले सकती है. वर्जन Expo SDK 57: React Native 0.86.3, React 19.2.3.

## बाकी

ऐप WebView नहीं है। पहली ऑनलाइन ओपनिंग पर विषय, ग्रंथ और प्रमाण SQLite में बचते हैं, चित्र एक बार डाउनलोड होते हैं, फिर ऑफ़लाइन चलता है। खोज `mans` से मांस और `per` / `pair` से पैर मिलती है। ग्रंथ के अंदर प्रमाण अध्याय, श्लोक और पेज के क्रम में हैं। ग्रिड: ग्रंथ 1×1 / 2×2 / 3×3, प्रमाण और गैलरी 1×1 / 2×2।

विस्तार [ARCHITECTURE.md](ARCHITECTURE.md) में है।
