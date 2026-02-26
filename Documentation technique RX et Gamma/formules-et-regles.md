# Formules et règles techniques RX / Gamma

## 1) Flou géométrique

Formule utilisée :

`Fg = (d * e) / (DSF - e)`

- `d` : dimension de source
- `e` : épaisseur traversée (une paroi)
- `DSF` : distance source-film
- condition de validité: `DSF > e`

---

## 2) Interpolation des abaques

Pour RX et Ir-192, la lecture entre deux points se fait par interpolation linéaire :

`y = y1 + ((x - x1) / (x2 - x1)) * (y2 - y1)`

En dehors de la plage disponible, la valeur est bornée aux extrémités.

---

## 3) RX – facteur Q et temps de pose

### 3.1 Choix de la courbe

La courbe kV utilisée est la **courbe la plus proche** de la valeur kV saisie.

### 3.2 Lecture du facteur Q

`Q_RX = interpolation(courbe_kV, epaisseur_equivalente_acier)`

### 3.3 Temps de pose RX

`temps_RX_s = (Q_RX * (DSF_mm / 700)^2) / mA`

- référence abaque DSF: `700 mm`
- unité de sortie : secondes

---

## 4) Gamma Ir-192 – facteur Q et temps de pose

### 4.1 Conversion épaisseur équivalente acier

`e_eq_acier = e_materiau * rho_materiau / 7.85`

### 4.2 Facteur Q Ir-192

`Q_Ir192 = interpolation(abaque_Ir192, e_eq_acier)`

### 4.3 Temps de pose Ir-192

`temps_Ir_h = (Q_Ir192 * D^2 * K * N) / A`

- `D = DSF_mm / 1000` (mètres)
- `K` : coefficient film (AGFA)
- `N` : coefficient correcteur de densité
- `A` : activité (Ci)

---

## 5) Source Gamma par épaisseur (règle auto)

- si `e >= 45 mm` -> `Co-60`
- si `e <= 12 mm` -> `Se-75`
- sinon -> `Ir-192`

---

## 6) Sources et types

### Sources par technique
- RX: `Tube RX microfoyer`, `Tube RX standard`, `Générateur numérique`
- Gamma: `Ir-192`, `Se-75`, `Co-60`

### Options films Gamma
- `AGFA D3`, `AGFA D4`, `AGFA D5`, `AGFA D7`

Ces règles et valeurs sont synchronisées avec les données numérisées de ce dossier.