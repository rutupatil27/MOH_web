# Frontend Architecture

Recommended structure:
```text
client/
├── public/
├── src/
│   ├── assets/
│   ├── components/{ui,layout,forms,media}/
│   ├── sections/
│   ├── pages/
│   ├── admin/{pages,components}/
│   ├── hooks/
│   ├── services/
│   ├── api/
│   ├── context/
│   ├── utils/
│   ├── constants/
│   ├── styles/
│   └── router/
```

Pages compose sections/components. Keep components focused. 3D and heavy media should be isolated and lazy-loaded. Global design tokens live in one place.
