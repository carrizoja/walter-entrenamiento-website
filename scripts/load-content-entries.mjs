import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

function readRequired(name) {
  const value = process.env[name];
  if (!value || value === 'undefined') {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

async function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_FILE) {
    const raw = await fs.readFile(process.env.FIREBASE_SERVICE_ACCOUNT_FILE, 'utf8');
    return JSON.parse(raw);
  }

  return JSON.parse(readRequired('FIREBASE_SERVICE_ACCOUNT_KEY'));
}

const now = new Date();

const articles = [
  {
    id: 'empezar-a-entrenar-sin-frustracion',
    title: 'Como empezar a entrenar sin frustracion',
    excerpt: 'Una guia simple para retomar la actividad fisica con objetivos realistas, tecnica y constancia.',
    content: `<p>Volver a entrenar no requiere hacerlo perfecto desde el primer dia. Lo mas importante es construir una rutina posible, que se adapte a tu nivel actual y que puedas sostener en el tiempo.</p><p>El primer paso es definir una frecuencia realista. Para muchas personas, comenzar con dos o tres sesiones semanales alcanza para recuperar movilidad, fuerza y confianza. La clave no es hacer todo junto, sino sumar continuidad.</p><p>Tambien es fundamental respetar la tecnica, calentar antes de cada sesion y no comparar tu proceso con el de otra persona. Cada cuerpo responde de forma distinta, y entrenar bien siempre vale mas que entrenar de mas.</p><p>Si queres retomar, empezamos con una evaluacion simple y un plan progresivo. Asi cada avance se siente seguro, medible y motivador.</p>`,
    category: 'Entrenamiento',
    slug: 'empezar-a-entrenar-sin-frustracion',
    featured: true,
    read_time: '4 min',
    cover_url: null,
    accent_from: '#FF6B35',
    accent_to: '#C83B08',
    published: true,
    created_at: new Date(now.getTime() - 3 * 86400000).toISOString(),
    updated_at: new Date(now.getTime() - 3 * 86400000).toISOString(),
  },
  {
    id: 'movilidad-diaria-para-sentirte-mejor',
    title: 'Movilidad diaria para sentirte mejor',
    excerpt: 'Pequenos bloques de movilidad pueden ayudarte a bajar tensiones, mejorar tu postura y moverte con mas libertad.',
    content: `<p>Pasar muchas horas sentado, entrenar sin compensar o simplemente sostener mucho estres puede generar rigidez. Por eso, dedicar unos minutos al trabajo de movilidad hace una diferencia real en como te sentis durante el dia.</p><p>La movilidad no busca solo elongar. Tambien mejora la coordinacion, el rango de movimiento y la capacidad de controlar mejor cada gesto. Esto se traduce en entrenamientos mas eficientes y menos molestias.</p><p>Con ejercicios simples para columna, caderas, hombros y tobillos, es posible recuperar soltura sin necesidad de sesiones eternas. Lo importante es la regularidad: cinco o diez minutos bien hechos pueden cambiar mucho.</p><p>Si sentis el cuerpo pesado, duro o con poca energia, sumar movilidad guiada puede ser un gran punto de partida para volver a moverte mejor.</p>`,
    category: 'Consejos',
    slug: 'movilidad-diaria-para-sentirte-mejor',
    featured: true,
    read_time: '5 min',
    cover_url: null,
    accent_from: '#3A86FF',
    accent_to: '#1E40AF',
    published: true,
    created_at: new Date(now.getTime() - 2 * 86400000).toISOString(),
    updated_at: new Date(now.getTime() - 2 * 86400000).toISOString(),
  },
  {
    id: 'recuperacion-hidratacion-y-descanso',
    title: 'Recuperacion, hidratacion y descanso',
    excerpt: 'Entrenar mejor tambien implica saber cuando recuperar, hidratarse bien y darle al cuerpo el descanso que necesita.',
    content: `<p>Muchas veces pensamos que progresar depende solo del esfuerzo. Pero el cuerpo mejora cuando puede recuperarse de manera adecuada. Sin descanso, hidratacion y una carga bien administrada, el entrenamiento pierde calidad.</p><p>Recuperar no significa frenar por completo. Puede incluir movilidad suave, caminatas, respiracion, masajes o una planificacion que alterne intensidades. Cada recurso suma para llegar mejor a la siguiente sesion.</p><p>La hidratacion tambien influye en el rendimiento, la concentracion y la sensacion general de energia. Tomar agua durante el dia y despues de entrenar ayuda a sostener el trabajo fisico con mejores sensaciones.</p><p>Descansar bien no es un detalle: es parte del plan. Cuando el cuerpo duerme y recupera, la fuerza, el humor y la motivacion tambien mejoran.</p>`,
    category: 'Recuperación',
    slug: 'recuperacion-hidratacion-y-descanso',
    featured: false,
    read_time: '4 min',
    cover_url: null,
    accent_from: '#8B5CF6',
    accent_to: '#4C1D95',
    published: true,
    created_at: new Date(now.getTime() - 86400000).toISOString(),
    updated_at: new Date(now.getTime() - 86400000).toISOString(),
  },
];

const galleryDrafts = [
  {
    id: 'gallery-fuerza-personalizada',
    title: 'Sesion de fuerza personalizada',
    description: 'Trabajo de fuerza con seguimiento tecnico y progresiones adaptadas al objetivo del alumno.',
    category: 'Entrenamientos',
    media_type: 'photo',
    localFile: 'gallery-fuerza-personalizada.svg',
    thumbnailFile: null,
    duration: null,
    featured: false,
    sort_order: 10,
  },
  {
    id: 'gallery-circuito-funcional',
    title: 'Circuito funcional en accion',
    description: 'Bloques dinamicos para mejorar resistencia, coordinacion y control corporal.',
    category: 'Grupales',
    media_type: 'photo',
    localFile: 'gallery-circuito-funcional.svg',
    thumbnailFile: null,
    duration: null,
    featured: false,
    sort_order: 11,
  },
  {
    id: 'gallery-movilidad-postura',
    title: 'Trabajo de movilidad y postura',
    description: 'Ejercicios orientados a liberar tensiones y mejorar la calidad del movimiento.',
    category: 'Ejercicios',
    media_type: 'photo',
    localFile: 'gallery-movilidad-postura.svg',
    thumbnailFile: null,
    duration: null,
    featured: false,
    sort_order: 12,
  },
  {
    id: 'gallery-recuperacion-masajes',
    title: 'Recuperacion y masajes deportivos',
    description: 'Espacios de descarga y cuidado para complementar el entrenamiento semanal.',
    category: 'Masajes',
    media_type: 'photo',
    localFile: 'gallery-recuperacion-masajes.svg',
    thumbnailFile: null,
    duration: null,
    featured: false,
    sort_order: 13,
  },
  {
    id: 'gallery-tecnica-guiada-video',
    title: 'Video de tecnica guiada',
    description: 'Referencia visual para comprender mejor la ejecucion y el ritmo del ejercicio.',
    category: 'Ejercicios',
    media_type: 'video',
    localFile: 'gallery-tecnica-guiada-video.svg',
    thumbnailFile: 'gallery-tecnica-guiada-video.svg',
    duration: '1:18',
    featured: true,
    sort_order: 14,
  },
];

async function uploadAsset(bucket, sourceName, destinationName) {
  const sourcePath = path.resolve(process.cwd(), 'public/generated-content', sourceName);
  const content = await fs.readFile(sourcePath);
  const file = bucket.file(destinationName);
  await file.save(content, {
    metadata: { contentType: 'image/svg+xml' },
    public: true,
  });
  return `https://storage.googleapis.com/${bucket.name}/${destinationName}`;
}

async function main() {
  const serviceAccount = await loadServiceAccount();
  const bucketName = readRequired('PUBLIC_FIREBASE_STORAGE_BUCKET');

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket: bucketName,
    });
  }

  const db = getFirestore();
  const bucket = getStorage().bucket();

  for (const article of articles) {
    await db.collection('articles').doc(article.id).set(article, { merge: true });
  }

  for (const draft of galleryDrafts) {
    const storagePath = `gallery/generated/${draft.localFile}`;
    const publicUrl = await uploadAsset(bucket, draft.localFile, storagePath);

    let thumbnailUrl = null;
    if (draft.thumbnailFile) {
      const thumbPath = `gallery/generated/thumb-${draft.thumbnailFile}`;
      thumbnailUrl = await uploadAsset(bucket, draft.thumbnailFile, thumbPath);
    }

    await db.collection('gallery_items').doc(draft.id).set({
      title: draft.title,
      description: draft.description,
      category: draft.category,
      media_type: draft.media_type,
      storage_path: storagePath,
      public_url: publicUrl,
      thumbnail_url: thumbnailUrl,
      duration: draft.duration,
      featured: draft.featured,
      sort_order: draft.sort_order,
      created_at: new Date().toISOString(),
    }, { merge: true });
  }

  console.log(JSON.stringify({
    articlesCreated: articles.length,
    galleryCreated: galleryDrafts.length,
    bucket: bucket.name,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
