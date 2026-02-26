# Documentation technique RX et Gamma

Ce dossier centralise **toutes les données numérisées** utilisées dans l’application pour les calculs et abaques RX/Gamma.

## Structure

- `RX/abaque-rx-eresco-42mf4.json`
  - Courbes Q par kV (80 à 200 kV)
  - Référence DSF: 700 mm
  - Formule de temps RX
- `Gamma/abaque-ir192.json`
  - Abaque Ir-192 (épaisseur équivalente acier -> facteur Q)
- `Gamma/densites-materiaux.json`
  - Densités matériaux gamma (g/cm³)
  - Alias et normalisation matériaux
  - Conversion épaisseur équivalente acier
- `Gamma/coefficients-film-et-densite.json`
  - Coefficients film AGFA (K)
  - Tables de correction de densité (N)
- `formules-et-regles.md`
  - Formules utilisées (`Fg`, RX, Ir-192)
  - Interpolation
  - Règles de sélection source gamma

## Origine des données

Données reprises et remises au propre depuis le code applicatif (`src/App.jsx`) pour constituer un dossier documentaire unique et exploitable.