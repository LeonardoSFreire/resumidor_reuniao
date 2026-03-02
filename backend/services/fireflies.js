const axios = require('axios');

async function fetchMeetingTranscript(firefliesId) {
    // Configurado com a chave que o dono do sistema SaaS vai colocar no .env GLOBAL.
    const apiKey = process.env.FIREFLIES_API_KEY;
    if (!apiKey) {
        throw new Error("FIREFLIES_API_KEY global não configurada no servidor.");
    }

    // GraphQL query padrão fornecida pelo Fireflies v2
    const query = `
    query getTranscript($id: String!) {
      transcript(id: $id) {
        id
        title
        duration
        date
        sentences {
          index
          speaker_id
          speaker_name
          text
          start_time
          end_time
        }
      }
    }
  `;

    try {
        const response = await axios.post(
            'https://api.fireflies.ai/graphql',
            {
                query,
                variables: { id: firefliesId }
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const transcriptData = response.data?.data?.transcript;
        if (!transcriptData) {
            throw new Error(`Transcrição não encontrada para ID: ${firefliesId}. Resposta Fireflies: ${JSON.stringify(response.data)}`);
        }

        // Retorna as sentences e também concatena o texto bruto para análise da OpenAI
        const sentences = transcriptData.sentences || [];
        const text = sentences.map(s => `${s.speaker_name}: ${s.text}`).join('\n');

        return { sentences, text };

    } catch (error) {
        console.error(`Erro ao buscar na API do Fireflies:`, error.response?.data || error.message);
        throw error;
    }
}

module.exports = {
    fetchMeetingTranscript
};
