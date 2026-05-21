const EMAIL = 'clarrainlihn@gmail.com';

// In-memory cache for current build — avoids duplicate API calls
const cache = new Map<string, string>();

function isLikelySpanish(text: string): boolean {
  if (!text?.trim() || text.length < 3) return false;
  // Spanish-specific characters — immediate yes
  if (/[áéíóúüñ¿¡]/i.test(text)) return true;
  // Broad Spanish vocabulary (no accents needed here — accents covered above)
  const spanishWords =
    /\b(de|la|el|en|que|es|un|una|los|las|del|por|con|para|como|mas|muy|pero|tambien|este|esta|hay|tiene|cuando|donde|sobre|entre|desde|hasta|nuestro|nuestra|trabajo|proyecto|casa|calle|ciudad|espacio|forma|arte|obra|taller|estudio|sistema|proceso|estructura|material|escuela|edificio|interior|exterior|vivienda|sala|patio|parque|galeria|museo|centro|plaza|torre|puente|muro|suelo|techo|luz|color|linea|escala|movimiento|transformacion|innovacion|tecnologia|robotica|fabricacion|impresion|digital|parametrico|computacional|madera|piedra|metal|vidrio|hormigon|cemento|ladrillo|superficie|volumen|modulo|prototipo|instalacion|exposicion|concurso|tesis|investigacion|construccion|diseno|arquitectura|fotografia|fotografica|fotografico|escultura|escultórico|docencia|pintura|ceramica|grabado|urbanismo|paisaje|territorio|habitacion|dormitorio|cocina|bano|jardin|corredor|acceso|fachada|cubierta|cimentacion|columna|viga|losa|tabique|revestimiento|acabado|iluminacion|ventilacion|climatizacion|instalaciones|normativa|reglamento|proyecto|anteproyecto|prediseno|levantamiento|topografia|geologia|geotecnia|hidraulica|electricidad|mecanica|sanitaria|telecomunicaciones|presupuesto|medicion|especificacion|contrato|licitacion|adjudicacion|inspeccion|recepcion|liquidacion)\b/gi;
  const matches = text.match(spanishWords)?.length ?? 0;
  // Short texts (≤5 words) need only 1 Spanish word; longer texts need 2
  const wordCount = text.trim().split(/\s+/).length;
  return matches >= (wordCount <= 5 ? 1 : 2);
}

function splitIntoChunks(text: string, maxLen = 450): string[] {
  if (text.length <= maxLen) return [text];
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > maxLen) {
    let cut = -1;
    // Prefer sentence boundary
    for (let i = maxLen; i > maxLen / 2; i--) {
      if (/[.!?]/.test(remaining[i]) && remaining[i + 1] === ' ') {
        cut = i + 1;
        break;
      }
    }
    // Fall back to word boundary
    if (cut < 0) {
      for (let i = maxLen; i > maxLen / 2; i--) {
        if (remaining[i] === ' ') { cut = i; break; }
      }
    }
    if (cut < 0) cut = maxLen;
    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

async function translateChunk(text: string): Promise<string> {
  if (cache.has(text)) return cache.get(text)!;
  try {
    const url =
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|en&de=${encodeURIComponent(EMAIL)}`;
    const res = await fetch(url);
    if (!res.ok) return text;
    const data = await res.json() as { responseData?: { translatedText?: string } };
    const result = data.responseData?.translatedText || text;
    cache.set(text, result);
    return result;
  } catch {
    return text;
  }
}

export async function autoTranslate(text: string, force = false): Promise<string> {
  if (!text?.trim()) return text;
  if (!force && !isLikelySpanish(text)) return text;
  const chunks = splitIntoChunks(text);
  const parts = await Promise.all(chunks.map(translateChunk));
  return parts.join(' ');
}

export async function autoTranslateBlocks(blocks: unknown[]): Promise<unknown[]> {
  if (!Array.isArray(blocks)) return blocks;
  return Promise.all(
    blocks.map(async (block) => {
      const b = block as Record<string, unknown>;
      if (b?._type !== 'block' || !Array.isArray(b.children)) return block;
      const children = await Promise.all(
        (b.children as Record<string, unknown>[]).map(async (span) => {
          if (span?._type !== 'span' || typeof span.text !== 'string') return span;
          return { ...span, text: await autoTranslate(span.text) };
        })
      );
      return { ...b, children };
    })
  );
}
