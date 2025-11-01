# 🎨 Guide des Couleurs TeamFlow

## 🚀 Changement Rapide du Thème

Pour changer **toutes les couleurs du site**, modifiez ces 2 lignes dans `src/app/globals.css` :

```css
:root {
  --color-primary: #6366f1;    /* 👈 CHANGEZ ICI (Indigo par défaut) */
  --color-secondary: #8b5cf6;  /* 👈 CHANGEZ ICI (Violet par défaut) */
}
```

**Exemples de thèmes** :

```css
/* Thème Midnight Purple (défaut) */
--color-primary: #6366f1;
--color-secondary: #8b5cf6;

/* Thème Ocean Pro (Bleu/Cyan) */
--color-primary: #0ea5e9;
--color-secondary: #06b6d4;

/* Thème Emerald Fresh (Vert/Teal) */
--color-primary: #10b981;
--color-secondary: #14b8a6;

/* Thème Sunset Pro (Orange/Rose) */
--color-primary: #f59e0b;
--color-secondary: #ec4899;

/* Thème Royal Blue (Bleu/Indigo) */
--color-primary: #2563eb;
--color-secondary: #4f46e5;
```

## 🎯 Classes Utilitaires

### Couleurs Principales

```tsx
// Texte
<h1 className="text-primary">Titre principal</h1>
<p className="text-secondary">Texte secondaire</p>

// Fond
<div className="bg-primary">Fond principal</div>
<div className="bg-secondary">Fond secondaire</div>

// Hover
<a className="hover-primary">Lien</a>
```

### Gradient Automatique

Le gradient utilise **automatiquement** vos couleurs principales :

```tsx
// Gradient en fond
<button className="gradient-brand text-white px-6 py-3 rounded-lg">
  Bouton gradient
</button>

// Gradient sur texte
<h1 className="gradient-brand-text text-6xl font-bold">
  TeamFlow
</h1>
```

### Couleurs de Statut

Ces couleurs sont **fixes** (ne changent pas avec le thème) :

```tsx
// Texte
<p className="text-success">Succès ✓</p>
<p className="text-warning">Attention ⚠</p>
<p className="text-danger">Erreur ✗</p>

// Fond
<div className="bg-success text-white p-4 rounded">
  Opération réussie
</div>
```

## 🪟 Glassmorphisme

```tsx
// Effet verre simple
<div className="glass p-6 rounded-xl">
  Contenu avec effet verre
</div>

// Carte avec effet verre + hover
<div className="glass-card p-6 rounded-xl">
  Carte interactive
</div>
```

## 📦 Exemples Complets

### Bouton Principal
```tsx
<button className="bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90">
  Action principale
</button>
```

### Card avec Gradient
```tsx
<div className="gradient-brand glass-card p-8 rounded-2xl text-white">
  <h2 className="text-2xl font-bold mb-4">Titre</h2>
  <p>Contenu de la carte</p>
</div>
```

### Titre avec Gradient
```tsx
<h1 className="text-6xl font-bold gradient-brand-text">
  TeamFlow
</h1>
```

### Page avec Fond Dégradé
```tsx
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
  {/* Orbes animés */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -left-40 -top-40 h-96 w-96 animate-pulse rounded-full bg-blue-400/20 blur-3xl" />
  </div>

  {/* Contenu */}
  <div className="relative z-10">
    Votre contenu ici
  </div>
</div>
```

## 🎨 Variables CSS Disponibles

### À modifier (pour changer le thème)
```css
--color-primary       /* Couleur principale */
--color-secondary     /* Couleur secondaire */
```

### Automatiques (ne pas modifier)
```css
--gradient-primary    /* Gradient auto (primary → secondary) */
--success             /* Vert #34c759 */
--warning             /* Orange #ff9500 */
--danger              /* Rouge #ff3b30 */
```

## 💡 Bonnes Pratiques

1. **Modifiez uniquement** `--color-primary` et `--color-secondary`
2. **Utilisez les classes** `.text-primary`, `.bg-primary`, `.gradient-brand`
3. **Le gradient s'adapte** automatiquement à vos couleurs
4. **Pour Tailwind**, utilisez toujours les classes personnalisées pour la cohérence
5. **Testez en dark mode** après avoir changé les couleurs

## 🔥 Changement Ultra-Rapide

**1 minute pour changer tout le thème du site** :

1. Ouvrez `src/app/globals.css`
2. Ligne 12-13, changez les 2 couleurs
3. Sauvegardez
4. ✨ Tout le site est mis à jour !

## 🎯 Résumé

- **2 couleurs** à changer pour tout le site
- **Classes simples** : `text-primary`, `bg-primary`, `gradient-brand`
- **Gradient automatique** qui s'adapte aux couleurs
- **Statuts fixes** : success (vert), warning (orange), danger (rouge)
- **Ultra simple** : changez 2 lignes, tout le reste suit !
