/**
 * Função para chamar a API da Mistral AI
 * @param {string} prompt - Texto de entrada do usuário
 * @param {string} [model="mistral-tiny"] - Modelo a ser usado (opcional)
 * @returns {Promise<string>} - Resposta da API
 */
async function callMistralAPI(prompt, model = "mistral-tiny") {
    // Substitua pela sua chave de API real da Mistral AI
    const API_KEY = "NFuAj8PYUPcaf6tA1BjbyXuIeSjSA4sW";
    const API_URL = "https://api.mistral.ai/v1/chat/completions";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer $('NFuAj8PYUPcaf6tA1BjbyXuIeSjSA4sW'}`,
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                `Erro na API da Mistral: ${response.status} - ${errorData.error?.message || "Sem detalhes"}`,
            );
        }

        const data = await response.json();

        // Retorna a resposta do assistente
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error("Erro ao chamar a API da Mistral:", error);
        throw error;
    }
}

/**
 * Função para chamar a API do Yume (wrapper para Mistral AI)
 * @param {string} prompt - Texto de entrada do usuário
 * @returns {Promise<string>} - Resposta do Yume (Mistral AI)
 */
async function callYumeAPI(prompt) {
    try {
        // Adicione lógica personalizada aqui, se necessário
        const response = await callMistralAPI(prompt);
        return response;
    } catch (error) {
        console.error("Erro ao chamar a API do Yume:", error);
        throw new Error("Desculpe, não foi possível processar sua solicitação. Tente novamente mais tarde.");
    }
}

// Exporta a função para uso no app.js
window.callYumeAPI = callYumeAPI;