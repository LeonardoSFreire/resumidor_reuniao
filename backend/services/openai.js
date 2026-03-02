const OpenAI = require('openai');

async function analyzeTranscript(transcriptText, openAiKey) {
    // Inicializa o SDK com a chave do usuário final (Multi-tenant seguro)
    const openai = new OpenAI({
        apiKey: openAiKey,
    });

    const systemPrompt = `
  Você é um assistente sênior especialista em análise de reuniões executivas e técnicas.
  Sua única tarefa é ler a transcrição de uma reunião e extrair as seguintes informações cruciais.
  Você SEMPRE deve retornar um JSON perfeitamente válido contendo as exatas chaves abaixo.

  Retorne APENAS o JSON, sem markdown ou texto em volta:
  {
    "tipo_reuniao": "string", // Ex: Vendas, Equipe, Start de Projeto, Feedback
    "objetivo": "string", // O objetivo principal desta reunião
    "resumo_executivo": "string", // Um resumo conciso da reunião (2 a 3 parágrafos)
    "decisoes": "string", // Tópicos e decisões importantes tomadas (formato Markdown bullet points)
    "itens_acao": ["string"] // Array de strings. Cada item é uma tarefa definida para alguém fazer.
  }
  `;

    // Limite de prompt. Se usar o gpt-4o-mini, aguenta 128k tokens, o que é ótimo para reuniões grandes.
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.2, // Baixa temperatura para fatos precisos
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Aqui está a transcrição completa:\n\n${transcriptText}` }
            ],
            response_format: { type: "json_object" }
        });

        const completion = response.choices[0].message.content;
        const parsedData = JSON.parse(completion);
        return parsedData;

    } catch (error) {
        console.error("Erro na integração com OpenAI:", error);
        throw error;
    }
}

module.exports = {
    analyzeTranscript
};
