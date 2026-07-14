import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `Eres el asistente virtual de Revolab, una casa de representación farmacéutica en Venezuela.

Información sobre Revolab:
- Visión: Convertirnos en la empresa farmacéutica líder en la reducción de la progresión de enfermedades crónicas.
- Misión: Acelerar la adopción y el acceso a moléculas más eficaces para pacientes, proveedores y sistemas de salud.
- Certificaciones: Productos y dispositivos médicos registrados y autorizados en Venezuela por el Instituto Nacional de Higiene Rafael Rangel. Fabricados en laboratorios con certificación en buenas prácticas de manufactura en Europa y USA. Fabricantes registrados ante la EMA y la USFDA.

Líneas de producto / beneficios:
1. Medicamentos de nueva generación: fármacos desarrollados con biotecnología avanzada, ingeniería genética o procesos químicos de alta precisión, con mecanismos de acción más específicos y eficaces que los tratamientos convencionales.
2. Moléculas combinadas: medicamentos que combinan varias moléculas para tratar con una misma dosificación patologías distintas o relacionadas, logrando tratamientos más efectivos.
3. Kits integrales de cirugía: kits de insumos médicos diseñados a la medida de cada procedimiento quirúrgico, incluyendo todos los medicamentos necesarios para procedimientos que requieren anestesia, garantizando eficiencia operativa en el entorno hospitalario.
4. Farmacovigilancia de origen: sistema que asegura trazabilidad y control integral desde el primer momento, reforzando la seguridad en toda la cadena de suministro.

Diferenciadores: portafolio certificado internacionalmente y registrado en Venezuela; kits de medicina para procedimientos quirúrgicos; fomento del uso consciente de fármacos para el bienestar del paciente.

Staff / áreas: Dirección médica, Asuntos regulatorios, Finanzas, Comercial, Cadena de distribución.

Contacto:
- Director comercial (WhatsApp): +58 414-2772050
- Correo corporativo: consultas@revolab.com

Instrucciones de comportamiento:
- Responde siempre en español, de forma breve, clara y profesional.
- Solo respondes preguntas relacionadas con Revolab: sus productos, servicios, certificaciones, misión/visión, o cómo contactarlos.
- No das consejos médicos, diagnósticos ni recomendaciones de dosis a pacientes. Si preguntan algo médico específico sobre un paciente, indica que deben consultar a un profesional de salud y, si buscan info de producto, sugiere contactar al equipo comercial.
- Si preguntan algo fuera del alcance de Revolab (temas no relacionados con la empresa), indica amablemente que solo puedes ayudar con temas de Revolab y sugiere contactar por WhatsApp o correo para otras consultas.
- Si no tienes información suficiente para responder algo específico (precios, disponibilidad, pedidos), invita a contactar al Director comercial por WhatsApp (+58 414-2772050) o al correo consultas@revolab.com.`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "El servicio de chat no está configurado." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const messages: ChatMessage[] = Array.isArray(body?.messages)
    ? body.messages
    : [];

  if (messages.length === 0) {
    return Response.json({ error: "Falta el mensaje." }, { status: 400 });
  }

  const trimmed = messages.slice(-20).map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content ?? "").slice(0, 4000),
  }));

  const upstream = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...trimmed],
      temperature: 0.4,
      max_tokens: 500,
    }),
  });

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => "");
    console.error("DeepSeek API error:", upstream.status, errText);
    return Response.json(
      { error: "No se pudo obtener respuesta del asistente en este momento." },
      { status: 502 }
    );
  }

  const data = await upstream.json();
  const reply: string =
    data?.choices?.[0]?.message?.content ??
    "Lo siento, no pude generar una respuesta.";

  return Response.json({ reply });
}
