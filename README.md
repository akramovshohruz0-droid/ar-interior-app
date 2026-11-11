# AR Interyer Dizayni Ilovasi

A-Frame 1.5.0 va WebXR asosida mebelni real xonada virtual joylashtirish ilovasi (VR/AR texnologiyalari fani, 2-mustaqil ta’lim topshirig‘i).

## Imkoniyatlari
- WebXR hit-test orqali pol/stol tekisligini aniqlash va reticle ko‘rsatish
- 3 ta mebel modeli (Stol, Kreslo, Shkaf), tanlash menyusi
- Bir barmoq bilan burish, ikki barmoq bilan o‘lchamini o‘zgartirish (0.4x–2.5x)
- Tanlangan obyektni o‘chirish, keyingisini tanlash, sahnani tozalash
- Yoritish: light-estimation, qo‘llab-quvvatlanmasa ambient + directional a-light

## Ishga tushirish
1. Android telefonda **Chrome** da HTTPS havolani oching (GitHub Pages).
2. **AR ni boshlash** tugmasini bosing va kamera ruxsatini bering.
3. Polga qarating, halqa chiqqach ekranga teging.

## Modellar va litsenziyalari
Hozircha modellar oddiy shakllardan yig‘iladi. GLB fayllarni `assets/models/` ichiga `stol.glb`, `kreslo.glb`, `shkaf.glb` nomlari bilan qo‘ysangiz (har biri 5 MB gacha), ilova avtomatik ularni ishlatadi.

| Model | Manba | Litsenziya |
| --- | --- | --- |
| Stol | ____ | ____ |
| Kreslo | ____ | ____ |
| Shkaf | ____ | ____ |

## Talablar va cheklovlar
- Android, Chrome, Google Play Services for AR (ARCore). iOS Safari WebXR AR ni to‘liq qo‘llamaydi.
- Obyektlar soni 12 tagacha cheklangan.
- Light-estimation barcha qurilmalarda mavjud emas.
